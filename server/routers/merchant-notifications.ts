/**
 * Brazukas Delivery - Merchant Notifications Router
 * Rotas tRPC para notificações em tempo real do comerciante
 */

import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";

// Simulação de WebSocket connections por merchant
const merchantConnections = new Map<number, Set<any>>();

export const merchantNotificationsRouter = router({
  /**
   * Subscrever a notificações de um comerciante
   */
  subscribe: protectedProcedure
    .input(z.object({ merchantId: z.number() }))
    .query(async ({ input }: any) => {
      // Registrar conexão
      if (!merchantConnections.has(input.merchantId)) {
        merchantConnections.set(input.merchantId, new Set());
      }

      const connections = merchantConnections.get(input.merchantId)!;
      const connection = { id: Math.random() };
      connections.add(connection);

      return {
        success: true,
        merchantId: input.merchantId,
        connectedAt: new Date(),
      };
    }),

  /**
   * Enviar notificação para um comerciante
   */
  sendNotification: protectedProcedure
    .input(
      z.object({
        merchantId: z.number(),
        type: z.enum(["new_order", "order_update", "payment_received", "review", "system"]),
        title: z.string(),
        message: z.string(),
        orderId: z.number().optional(),
        data: z.record(z.string(), z.any()).optional(),
      })
    )
    .mutation(async ({ input }: any) => {
      const notification = {
        id: Math.random().toString(36).substr(2, 9),
        merchantId: input.merchantId,
        type: input.type,
        title: input.title,
        message: input.message,
        orderId: input.orderId,
        data: input.data,
        createdAt: new Date(),
        read: false,
      };

      // Simular envio de notificação
      console.log(`[Notification] Enviando para merchant ${input.merchantId}:`, notification);

      return {
        success: true,
        notificationId: notification.id,
        sentAt: notification.createdAt,
      };
    }),

  /**
   * Listar notificações do comerciante
   */
  listNotifications: protectedProcedure
    .input(
      z.object({
        merchantId: z.number(),
        limit: z.number().default(20),
        unreadOnly: z.boolean().default(false),
      })
    )
    .query(async ({ input }: any) => {
      // Mock data
      const mockNotifications = [
        {
          id: "notif_001",
          merchantId: input.merchantId,
          type: "new_order",
          title: "Novo Pedido Recebido",
          message: "Pedido #1001 de João Silva - R$ 36,40",
          orderId: 1001,
          createdAt: new Date(Date.now() - 2 * 60000),
          read: false,
        },
        {
          id: "notif_002",
          merchantId: input.merchantId,
          type: "payment_received",
          title: "Pagamento Confirmado",
          message: "Pedido #1002 - Pagamento PIX recebido",
          orderId: 1002,
          createdAt: new Date(Date.now() - 5 * 60000),
          read: false,
        },
        {
          id: "notif_003",
          merchantId: input.merchantId,
          type: "order_update",
          title: "Status Atualizado",
          message: "Pedido #1000 marcado como entregue",
          orderId: 1000,
          createdAt: new Date(Date.now() - 30 * 60000),
          read: true,
        },
      ];

      let filtered = mockNotifications;
      if (input.unreadOnly) {
        filtered = filtered.filter((n) => !n.read);
      }

      return filtered.slice(0, input.limit);
    }),

  /**
   * Marcar notificação como lida
   */
  markAsRead: protectedProcedure
    .input(z.object({ notificationId: z.string() }))
    .mutation(async ({ input }: any) => {
      return {
        success: true,
        notificationId: input.notificationId,
        readAt: new Date(),
      };
    }),

  /**
   * Marcar todas as notificações como lidas
   */
  markAllAsRead: protectedProcedure
    .input(z.object({ merchantId: z.number() }))
    .mutation(async ({ input }: any) => {
      return {
        success: true,
        merchantId: input.merchantId,
        markedAt: new Date(),
      };
    }),

  /**
   * Deletar notificação
   */
  deleteNotification: protectedProcedure
    .input(z.object({ notificationId: z.string() }))
    .mutation(async ({ input }: any) => {
      return {
        success: true,
        notificationId: input.notificationId,
        deletedAt: new Date(),
      };
    }),

  /**
   * Obter contagem de notificações não lidas
   */
  getUnreadCount: protectedProcedure
    .input(z.object({ merchantId: z.number() }))
    .query(async ({ input }: any) => {
      // Mock: retornar 2 não lidas
      return {
        merchantId: input.merchantId,
        unreadCount: 2,
      };
    }),

  /**
   * Configurar preferências de notificação
   */
  setPreferences: protectedProcedure
    .input(
      z.object({
        merchantId: z.number(),
        enablePush: z.boolean().optional(),
        enableSound: z.boolean().optional(),
        enableEmail: z.boolean().optional(),
        notifyNewOrder: z.boolean().optional(),
        notifyPayment: z.boolean().optional(),
        notifyReview: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }: any) => {
      return {
        success: true,
        merchantId: input.merchantId,
        preferences: {
          enablePush: input.enablePush ?? true,
          enableSound: input.enableSound ?? true,
          enableEmail: input.enableEmail ?? false,
          notifyNewOrder: input.notifyNewOrder ?? true,
          notifyPayment: input.notifyPayment ?? true,
          notifyReview: input.notifyReview ?? true,
        },
      };
    }),
});
