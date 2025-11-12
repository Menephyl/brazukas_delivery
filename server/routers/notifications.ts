/**
 * Brazukas Delivery - Notifications Router
 * Rotas tRPC para notificações push em tempo real
 */

import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";

interface Notification {
  id: string;
  userId: string;
  type: "order_confirmed" | "driver_assigned" | "order_picked_up" | "order_delivered" | "payment_received";
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: string;
}

// Mock storage para notificações
const mockNotifications: Map<string, Notification[]> = new Map();

export const notificationsRouter = router({
  /**
   * Subscribe to push notifications
   */
  subscribe: publicProcedure
    .input(
      z.object({
        userId: z.string().or(z.number()),
        endpoint: z.string(),
        auth: z.string(),
        p256dh: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      // Simular subscrição a notificações push
      await new Promise((resolve) => setTimeout(resolve, 300));

      return {
        success: true,
        subscriptionId: `sub_${Date.now()}`,
        message: "Notificações push ativadas",
      };
    }),

  /**
   * Send notification
   */
  sendNotification: publicProcedure
    .input(
      z.object({
        userId: z.string().or(z.number()),
        type: z.enum([
          "order_confirmed",
          "driver_assigned",
          "order_picked_up",
          "order_delivered",
          "payment_received",
        ]),
        title: z.string(),
        message: z.string(),
        data: z.record(z.string(), z.any()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const userId = String(input.userId);

      // Simular envio de notificação
      await new Promise((resolve) => setTimeout(resolve, 500));

      const notification: Notification = {
        id: `notif_${Date.now()}`,
        userId,
        type: input.type,
        title: input.title,
        message: input.message,
        data: input.data,
        read: false,
        createdAt: new Date().toISOString(),
      };

      const userNotifications = mockNotifications.get(userId) || [];
      userNotifications.unshift(notification);
      mockNotifications.set(userId, userNotifications.slice(0, 100) as Notification[]); // Keep last 100

      return {
        success: true,
        notificationId: notification.id,
      };
    }),

  /**
   * Get user notifications
   */
  getNotifications: publicProcedure
    .input(
      z.object({
        userId: z.string().or(z.number()),
        limit: z.number().default(20),
        unreadOnly: z.boolean().default(false),
      })
    )
    .query(async ({ input }) => {
      const userId = String(input.userId);
      let notifications = mockNotifications.get(userId) || [];

      if (input.unreadOnly) {
        notifications = notifications.filter((n) => !n.read);
      }

      return {
        notifications: notifications.slice(0, input.limit),
        total: notifications.length,
        unreadCount: notifications.filter((n) => !n.read).length,
      };
    }),

  /**
   * Mark notification as read
   */
  markAsRead: publicProcedure
    .input(
      z.object({
        notificationId: z.string(),
        userId: z.string().or(z.number()),
      })
    )
    .mutation(async ({ input }) => {
      const userId = String(input.userId);
      const notifications = mockNotifications.get(userId) || [];

      const notification = notifications.find((n) => n.id === input.notificationId);
      if (notification) {
        notification.read = true;
        mockNotifications.set(userId, notifications);
      }

      return {
        success: true,
      };
    }),

  /**
   * Mark all notifications as read
   */
  markAllAsRead: publicProcedure
    .input(z.object({ userId: z.string().or(z.number()) }))
    .mutation(async ({ input }) => {
      const userId = String(input.userId);
      const notifications = mockNotifications.get(userId) || [];

      notifications.forEach((n) => {
        n.read = true;
      });
      mockNotifications.set(userId, notifications);

      return {
        success: true,
        count: notifications.length,
      };
    }),

  /**
   * Delete notification
   */
  deleteNotification: publicProcedure
    .input(
      z.object({
        notificationId: z.string(),
        userId: z.string().or(z.number()),
      })
    )
    .mutation(async ({ input }) => {
      const userId = String(input.userId);
      let notifications = mockNotifications.get(userId) || [];

      notifications = notifications.filter((n) => n.id !== input.notificationId);
      mockNotifications.set(userId, notifications);

      return {
        success: true,
      };
    }),

  /**
   * Clear all notifications
   */
  clearAll: publicProcedure
    .input(z.object({ userId: z.string().or(z.number()) }))
    .mutation(async ({ input }) => {
      const userId = String(input.userId);
      mockNotifications.set(userId, []);

      return {
        success: true,
      };
    }),

  /**
   * Get notification preferences
   */
  getPreferences: publicProcedure
    .input(z.object({ userId: z.string().or(z.number()) }))
    .query(async () => {
      return {
        preferences: {
          orderConfirmed: true,
          driverAssigned: true,
          orderPickedUp: true,
          orderDelivered: true,
          paymentReceived: true,
          promotions: true,
          sound: true,
          vibration: true,
        },
      };
    }),

  /**
   * Update notification preferences
   */
  updatePreferences: publicProcedure
    .input(
      z.object({
        userId: z.string().or(z.number()),
        preferences: z.record(z.string(), z.boolean()),
      })
    )
    .mutation(async ({ input }) => {
      // Simular atualização de preferências
      await new Promise((resolve) => setTimeout(resolve, 300));

      return {
        success: true,
        preferences: input.preferences,
      };
    }),

  /**
   * Get notification stats
   */
  getStats: publicProcedure
    .input(z.object({ userId: z.string().or(z.number()) }))
    .query(async ({ input }) => {
      const userId = String(input.userId);
      const notifications = mockNotifications.get(userId) || [];

      const stats = {
        total: notifications.length,
        unread: notifications.filter((n) => !n.read).length,
        byType: {
          order_confirmed: notifications.filter((n) => n.type === "order_confirmed").length,
          driver_assigned: notifications.filter((n) => n.type === "driver_assigned").length,
          order_picked_up: notifications.filter((n) => n.type === "order_picked_up").length,
          order_delivered: notifications.filter((n) => n.type === "order_delivered").length,
          payment_received: notifications.filter((n) => n.type === "payment_received").length,
        },
      };

      return stats;
    }),
});
