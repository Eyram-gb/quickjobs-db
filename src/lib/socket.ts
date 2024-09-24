import { Server } from "http";
import { corsOptions } from "./constants";
import logger from "./logger";
import { Server as SocketIOServer } from "socket.io";
import { db } from "./db";
import { messages } from "../models/schema/messages";
import { eq, or, sql } from "drizzle-orm";

export function socketServer(server: Server) {
  const io = new SocketIOServer(server, {
    cors: corsOptions,
  });

  io.on("connection", (socket) => {
    logger.info(`User just connected to socket:${socket.id}`);

    // Join a chat room
    socket.on("join", (userId: string) => {
      socket.join(userId);
      logger.info(`Socket: User ${userId} joined their chat room.`);
    });

    // Handle messages
    socket.on("message", async (payload, callback) => {
      const { senderId, recipientId, message } = payload;
      logger.info(`Socket: Received message: ${payload}`);
      console.log(payload);

      try {
        
        const newMessage = await db.insert(messages).values({
          sender_id: senderId,
          recipient_id: recipientId,
          message_text: message,
        }).returning();
        return callback({
          status: "OK",
          data: {
            message: newMessage,
          },
        });
      } catch (error) {
        logger.error("Socket: Failed to add a message to the database");
        console.error(error);
        callback({
          status: "ERROR",
          error: error as unknown as Error,
        });
      }

     // Save message to database      
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
              eq(messages.sender_id, userId1),
              eq(messages.sender_id, userId2),
              eq(messages.recipient_id, userId1),
              eq(messages.recipient_id, userId2)
            )
          )
          .orderBy(messages.created_at);
        socket.emit("chatHistory", chatHistory);
        return callback({
          status: "OK",
          data: {
            chatHistory,
          },
        });
      } catch (error) {
        logger.error("Socket: Failed to get chat history");
        console.error(error);
        }
      }
    );

    // Get list of users the user is interacting with
    socket.on("getUserChats", async (userId: string) => {
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
    });

    // Disconnect connection
    socket.on("disconnect", () => {
      logger.info("Socket: connection terminated.");
    });

    // Enter the comment room for a campaign.
  });

  return io;
}
