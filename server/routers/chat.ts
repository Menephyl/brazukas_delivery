/**
 * Brazukas Delivery - Chat Router
 * Rotas tRPC para sistema de chat com suporte em tempo real
 */

import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";

interface ChatMessage {
  id: string;
  userId: string;
  orderId?: string;
  message: string;
  timestamp: string;
  read: boolean;
  sender: "user" | "support";
}

interface ChatConversation {
  id: string;
  userId: string;
  orderId?: string;
  subject: string;
  messages: ChatMessage[];
  status: "open" | "closed";
  createdAt: string;
  updatedAt: string;
}

// Mock storage para chats
const mockChats: Map<string, ChatConversation> = new Map();

export const chatRouter = router({
  /**
   * Create new chat conversation
   */
  createConversation: publicProcedure
    .input(
      z.object({
        userId: z.string().or(z.number()),
        subject: z.string(),
        message: z.string(),
        orderId: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const conversationId = `chat_${Date.now()}`;
      const userId = String(input.userId);

      const conversation: ChatConversation = {
        id: conversationId,
        userId,
        orderId: input.orderId,
        subject: input.subject,
        messages: [
          {
            id: `msg_${Date.now()}`,
            userId,
            message: input.message,
            timestamp: new Date().toISOString(),
            read: false,
            sender: "user",
          },
        ],
        status: "open",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockChats.set(conversationId, conversation);

      return {
        success: true,
        conversationId,
        conversation,
      };
    }),

  /**
   * Get user conversations
   */
  getConversations: publicProcedure
    .input(
      z.object({
        userId: z.string().or(z.number()),
        status: z.enum(["open", "closed", "all"]).default("all"),
      })
    )
    .query(async ({ input }) => {
      const userId = String(input.userId);
      const conversations = Array.from(mockChats.values()).filter(
        (c) => c.userId === userId && (input.status === "all" || c.status === input.status)
      );

      return {
        conversations: conversations.sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        ),
        total: conversations.length,
      };
    }),

  /**
   * Get conversation details
   */
  getConversation: publicProcedure
    .input(z.object({ conversationId: z.string() }))
    .query(async ({ input }) => {
      const conversation = mockChats.get(input.conversationId);

      if (!conversation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Conversa não encontrada",
        });
      }

      return conversation;
    }),

  /**
   * Send message to conversation
   */
  sendMessage: publicProcedure
    .input(
      z.object({
        conversationId: z.string(),
        userId: z.string().or(z.number()),
        message: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const conversation = mockChats.get(input.conversationId);

      if (!conversation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Conversa não encontrada",
        });
      }

      const newMessage: ChatMessage = {
        id: `msg_${Date.now()}`,
        userId: String(input.userId),
        message: input.message,
        timestamp: new Date().toISOString(),
        read: false,
        sender: "user",
      };

      conversation.messages.push(newMessage);
      conversation.updatedAt = new Date().toISOString();
      mockChats.set(input.conversationId, conversation);

      // Simular resposta automática do suporte
      setTimeout(() => {
        const supportMessage: ChatMessage = {
          id: `msg_${Date.now() + 1}`,
          userId: String(input.userId),
          message: "Obrigado pela sua mensagem! Um agente de suporte responderá em breve.",
          timestamp: new Date(Date.now() + 1000).toISOString(),
          read: false,
          sender: "support",
        };
        conversation.messages.push(supportMessage);
        mockChats.set(input.conversationId, conversation);
      }, 2000);

      return {
        success: true,
        message: newMessage,
      };
    }),

  /**
   * Close conversation
   */
  closeConversation: publicProcedure
    .input(z.object({ conversationId: z.string() }))
    .mutation(async ({ input }) => {
      const conversation = mockChats.get(input.conversationId);

      if (!conversation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Conversa não encontrada",
        });
      }

      conversation.status = "closed";
      conversation.updatedAt = new Date().toISOString();
      mockChats.set(input.conversationId, conversation);

      return {
        success: true,
      };
    }),

  /**
   * Mark messages as read
   */
  markAsRead: publicProcedure
    .input(
      z.object({
        conversationId: z.string(),
        messageIds: z.array(z.string()),
      })
    )
    .mutation(async ({ input }) => {
      const conversation = mockChats.get(input.conversationId);

      if (!conversation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Conversa não encontrada",
        });
      }

      conversation.messages.forEach((msg) => {
        if (input.messageIds.includes(msg.id)) {
          msg.read = true;
        }
      });

      mockChats.set(input.conversationId, conversation);

      return {
        success: true,
      };
    }),

  /**
   * Get unread count
   */
  getUnreadCount: publicProcedure
    .input(z.object({ userId: z.string().or(z.number()) }))
    .query(async ({ input }) => {
      const userId = String(input.userId);
      const conversations = Array.from(mockChats.values()).filter((c) => c.userId === userId);

      let unreadCount = 0;
      conversations.forEach((conv) => {
        unreadCount += conv.messages.filter((msg) => !msg.read && msg.sender === "support").length;
      });

      return {
        unreadCount,
        conversationCount: conversations.length,
      };
    }),
});
