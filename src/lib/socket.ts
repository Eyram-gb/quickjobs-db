import { Server } from "http";
import { corsOptions } from "./constants";
import logger from "./logger";
import { Server as SocketIOServer } from "socket.io";
import { db } from "./db";
import { messages } from "../models/schema/messages";
import { and, eq, or, sql } from "drizzle-orm";

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
        const [newMessage] = await db.insert(messages).values({
          sender_id: senderId,
          recipient_id: recipientId,
          message_text: message,
        }).returning();

        logger.info(`New message saved: ${JSON.stringify(newMessage)}`);

        // Emit the new message to both sender and recipient
        io.to(senderId).to(recipientId).emit("receiveMessage", newMessage);
        logger.info(`Emitted receiveMessage event to ${senderId} and ${recipientId}`);

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
      async (data: { userId1: string; userId2: string }, callback) => {
        const { userId1, userId2 } = data;

        try {
        const chatHistory = await db
          .select()
          .from(messages)
          .where(
            or(
              and(
                eq(messages.sender_id, userId1),
                eq(messages.recipient_id, userId2)
              ),
              and(
                eq(messages.sender_id, userId2),
                eq(messages.recipient_id, userId1)
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
    socket.on("getUserChats", async (userId: string, callback) => {
      const userChats = await db
        .select({
          chatUser: sql`DISTINCT CASE 
                WHEN ${messages.sender_id} = ${userId} THEN ${messages.recipient_id} 
                ELSE ${messages.sender_id} 
              END`,
        })
        .from(messages)
        .where(
          or(eq(messages.sender_id, userId), eq(messages.recipient_id, userId))
        );
      socket.emit("userChats", userChats);
      return callback({
        status: "OK",
        data: {
          userChats,
        },
      });
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
