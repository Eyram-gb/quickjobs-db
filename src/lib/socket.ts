/* eslint-disable @typescript-eslint/no-explicit-any */
import { notifications } from "./../models/schema/notifications";
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

    // Example: Always check callback and return structured errors
    function safeCallback(callback: any, data: any) {
      if (typeof callback === "function") {
        callback(data);
      }
    }

    // Handle messages
    socket.on("sendMessage", async (payload, callback) => {
      const { senderId, recipientId, message } = payload;
      logger.info(`Received message: ${JSON.stringify(payload)}`);

      // Validate input
      if (!senderId || !recipientId || !message) {
        logger.error(
          `Missing fields: senderId=${senderId}, recipientId=${recipientId}, message=${message}`
        );
        safeCallback(callback, {
          status: "ERROR",
          error: {
            message: "Missing required fields",
          },
        });
        return;
      }

      try {
        logger.info(
          `Inserting message: senderId=${senderId}, /n recipientId=${recipientId}, /n message=${message}`
        );
        const [newMessage] = await db
          .insert(messages)
          .values({
            sender_id: senderId,
            recipient_id: recipientId,
            message_text: message,
          })
          .returning();

        logger.info(`New message saved: ${JSON.stringify(newMessage)}`);

        io.to(senderId).to(recipientId).emit("receiveMessage", newMessage);
        logger.info(
          `Emitted receiveMessage event to ${senderId} and ${recipientId}`
        );

        safeCallback(callback, {
          status: "OK",
          data: { message: newMessage },
        });
      } catch (error) {
        logger.error(`Failed to add message to database: ${error}`);
        safeCallback(callback, {
          status: "ERROR",
          error: {
            message: "Failed to add message to database",
            details: error instanceof Error ? error.message : error,
          },
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
            
          safeCallback(callback, {
            status: "OK",
            data: {
              chatHistory,
            },
          });
        } catch (error) {
          logger.error("Socket: Failed to get chat history");
          console.error(error);
          safeCallback(callback, {
            status: "ERROR",
            error: {
              message: "Failed to retrieve chat history",
              details: error instanceof Error ? error.message : error,
            },
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
          let userChats: any[] = [];

          if (user_type === "client") {
            // Get all employers the client has chatted with (as sender or recipient)
            const sentChats = await db
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

            const receivedChats = await db
              .selectDistinct({
                chatUser: employer_profile.name,
                userId: employer_profile.user_id,
              })
              .from(employer_profile)
              .innerJoin(
                messages,
                eq(messages.sender_id, employer_profile.user_id)
              )
              .where(eq(messages.recipient_id, userId));

            // Merge and deduplicate
            userChats = [
              ...sentChats,
              ...receivedChats.filter(
                (rc) => !sentChats.some((sc) => sc.userId === rc.userId)
              ),
            ];
          } else if (user_type === "company") {
            // Get all applicants the company has chatted with (as sender or recipient)
            const sentChats = await db
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

            const receivedChats = await db
              .selectDistinct({
                chatUser: sql`${applicant_profile.first_name} || ' ' || ${applicant_profile.last_name}`,
                userId: applicant_profile.user_id,
              })
              .from(applicant_profile)
              .innerJoin(
                messages,
                eq(messages.recipient_id, applicant_profile.user_id)
              )
              .where(eq(messages.sender_id, userId));

            // Merge and deduplicate
            userChats = [
              ...sentChats,
              ...receivedChats.filter(
                (rc) => !sentChats.some((sc) => sc.userId === rc.userId)
              ),
            ];
          }

          safeCallback(callback, {
            status: "OK",
            data: {
              userChats,
            },
          });
        } catch (error) {
          logger.error("Socket: Failed to get user chats");
          console.error(error);
          safeCallback(callback, {
            status: "ERROR",
            error: {
              message: "Failed to retrieve user chats",
              details: error instanceof Error ? error.message : error,
            },
          });
        }
      }
    );

    socket.on(
      "getNotifications",
      async (payload: { userId: string }, callback) => {
        try {
          const notifications_data = await db
            .select()
            .from(notifications)
            .where(
              and(
                eq(notifications.user_id, payload.userId),
                eq(notifications.read, false)
              )
            );
          safeCallback(callback, {
            status: "OK",
            data: {
              notifications_data,
            },
          });
        } catch (error) {
          logger.error("Socket: Failed to unread notifications");
          console.error(error);
          safeCallback(callback, {
            status: "ERROR",
            error: {
              message: "Failed to retrieve unread notifications",
              details: error instanceof Error ? error.message : error,
            },
          });
        }
      }
    );

    socket.on("notifications", async (payload, callback) => {
      const { type, user_id, message } = payload;
      logger.info(
        `+++++++++++++received notification+++++++: ${JSON.stringify(payload, type)}`
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

        // Emit new notification only if user is connected
        const room = io.sockets.adapter.rooms.get(user_id);
        if (room && room.size > 0) {
          io.to(user_id).emit("receivedNotification", newNotification);
          logger.info(`Emitted receivedNotification event to ${user_id}`);
        } else {
          logger.info(
            `User ${user_id} not connected, notification not emitted`
          );
        }

        safeCallback(callback, {
          status: "OK",
          data: {
            data: newNotification,
          },
        });
      } catch (error) {
        logger.error(
          `An error occurred while trying to add notifications: ${error}`
        );
        safeCallback(callback, {
          status: "ERROR",
          error: {
            message: "Failed to add notification",
            details: error instanceof Error ? error.message : error,
          },
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

// Add a comment/reminder for DB indexes
// TODO: Ensure DB indexes exist on messages.sender_id, messages.recipient_id, messages.created_at for performance
