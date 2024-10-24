import { notifications } from './../models/schema/notifications';
import { Server } from "http";
import { corsOptions } from "./constants";
import logger from "./logger";
import { Server as SocketIOServer } from "socket.io";
import { db } from "./db";
import { messages } from "../models/schema/messages";
import { and, eq, or, sql } from "drizzle-orm";
import { applicant_profile, employer_profile } from "../models/schema";
export function socketServer(server: Server) {
  const io = new SocketIOServer(server, {
    cors: corsOptions,
  });

  io.on("connection", (socket) => {
    logger.info(`User connected to socket: ${socket.id}`);

    // Join a chat room
    socket.on("join", (userId: string) => {
      socket.join(userId);
      logger.info(`Socket: User ${userId} joined their chat room.`);
    });

    // Handle messages
    socket.on("sendMessage", async (payload, callback) => {
      const { senderId, recipientId, message } = payload;
      logger.info(`Received message: ${JSON.stringify(payload)}`);

      try {
        const [newMessage] = await db
          .insert(messages)
          .values({
            sender_id: senderId,
            recipient_id: recipientId,
            message_text: message,
          })
          .returning();

        logger.info(`New message saved: ${JSON.stringify(newMessage)}`);

        // Emit the new message to both sender and recipient
        io.to(senderId).to(recipientId).emit("receiveMessage", newMessage);
        logger.info(
          `Emitted receiveMessage event to ${senderId} and ${recipientId}`
        );

        callback({
          status: "OK",
          data: {
            message: newMessage,
          },
        });
      } catch (error) {
        logger.error(`Failed to add message to database: ${error}`);
        callback({
          status: "ERROR",
          error: error as unknown as Error,
        });
      }
    });

    // Emit message to both sender and recipient
    // io.to(senderId)
    //   .to(recipientId)
    //   .emit("message", { senderId, recipientId, message });

    // logger.info(`Socket: Message sent from ${senderId} to ${recipientId}`);
    socket.on(
      "getChatHistory",
      async (data: { senderId: string; recipientId: string }, callback) => {
        const { senderId, recipientId } = data;

        try {
          const chatHistory = await db
            .select()
            .from(messages)
            .where(
              or(
                and(
                  eq(messages.sender_id, senderId),
                  eq(messages.recipient_id, recipientId)
                ),
                and(
                  eq(messages.sender_id, recipientId),
                  eq(messages.recipient_id, senderId)
                )
              )
            )
            .orderBy(messages.created_at);
          // socket.emit("chatHistory", chatHistory);
          return callback({
            status: "OK",
            data: {
              chatHistory,
            },
          });
        } catch (error) {
          logger.error("Socket: Failed to get chat history");
          console.error(error);
          callback({
            status: "ERROR",
            error: "Failed to retrieve chat history",
          });
        }
      }
    );



    // Get list of users the user is interacting with
    socket.on(
      "getUserChats",
      async (
        { userId, user_type }: { userId: string; user_type: string },
        callback
      ) => {
        try {
          let userChats;

          if (user_type === "client") {
            userChats = await db
              .selectDistinct({
                chatUser: employer_profile.name,
                userId: employer_profile.user_id,
              })
              .from(employer_profile)
              .innerJoin(
                messages,
                eq(messages.recipient_id, employer_profile.user_id)
              )
              .where(eq(messages.sender_id, userId));
          } else if (user_type === "company") {
            userChats = await db
              .selectDistinct({
                chatUser: sql`${applicant_profile.first_name} || ' ' || ${applicant_profile.last_name}`,
                userId: applicant_profile.user_id,
              })
              .from(applicant_profile)
              .innerJoin(
                messages,
                eq(messages.sender_id, applicant_profile.user_id)
              )
              .where(eq(messages.recipient_id, userId));
          }

          socket.emit("userChats", userChats);
          return callback({
            status: "OK",
            data: {
              userChats,
            },
          });
        } catch (error) {
          logger.error("Socket: Failed to get user chats");
          console.error(error);
          return callback({
            status: "ERROR",
            error: "Failed to retrieve user chats",
          });
        }
      }
    );

    socket.on('getNotifications', async(payload: {userId:string},callback)=>{

      try {
        const notifications_data = await db.select().from(notifications).where(and(eq(notifications.user_id, payload.userId), eq(notifications.read, false)))
        return callback({
          status: "OK",
          data: {
            notifications_data,
          },
        });
      } catch (error) {
        logger.error("Socket: Failed to unread notifications");
        console.error(error);
        callback({
          status: "ERROR",
          error: "Failed to retrieve unread notifications",
        });
      }
    })

    socket.on("notifications", async (payload, callback) => {
      const { type, user_id, message } = payload;
      console.log(payload)
      logger.info(
        `received notification: ${JSON.stringify(payload, type)}`
      );

      try {
        const [newNotification] = await db
          .insert(notifications)
          .values({
            user_id,
            message,
            type,
          })
          .returning();

          // Emit new notficaation
        io.to(user_id).emit("receivedNotification", newNotification);

        callback({
          status: "OK",
          data: {
            data: newNotification,
          },
        });
      } catch (error) {
        logger.error(
          `An error occurred while trying to add notifications: ${error}`
        );
        callback({
          status: "ERROR",
          error: error as unknown as Error,
        });
      }
    });

    // Disconnect connection
    socket.on("disconnect", () => {
      try {
        return logger.info("Socket: connection terminated.");
      } catch (error) {
        logger.error("Socket: Failed to disconnect");
        console.error(error);
      }
    });

    // Enter the comment room for a campaign.
  });

  return io;
}
