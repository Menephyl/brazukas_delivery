import { publicProcedure, router } from "../_core/trpc";
import { z } from "zod";
import * as ordersLib from "../orders";
import { toCSV, toGPX, trackStats } from "../lib/track.metrics";

export const ordersRouter = router({
  list: publicProcedure.query(async () => {
    return ordersLib.listOrders();
  }),

  get: publicProcedure.input(z.string()).query(async ({ input }) => {
    const order = ordersLib.getOrder(input);
    if (!order) {
      throw new Error("Order not found");
    }
    return order;
  }),

  create: publicProcedure
    .input(
      z.object({
        items: z.array(
          z.object({
            id: z.string(),
            nome: z.string(),
            preco: z.number(),
            qty: z.number(),
            merchantId: z.union([z.string(), z.number()]).optional(),
          })
        ),
        total: z.number(),
        merchantId: z.union([z.string(), z.number(), z.null()]).optional(),
        client: z.object({ name: z.string() }).optional(),
      })
    )
    .mutation(async ({ input }) => {
      return ordersLib.createOrder(input);
    }),

  updateStatus: publicProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum([
          "PENDING_PAYMENT",
          "PAID",
          "CONFIRMED",
          "ASSIGNED",
          "PICKED_UP",
          "DELIVERED",
        ]),
        pod: z
          .object({
            type: z.enum(["photo", "pin"]),
            url: z.string().optional(),
            code: z.string().optional(),
          })
          .optional(),
      })
    )
    .mutation(async ({ input }) => {
      const order = ordersLib.updateOrderStatus(input.id, input.status, input.pod);
      if (!order) {
        throw new Error("Invalid status transition");
      }
      return order;
    }),

  assignDriver: publicProcedure
    .input(
      z.object({
        id: z.string(),
        driver: z.object({
          id: z.string(),
          nome: z.string(),
          veiculo: z.string(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      const order = ordersLib.assignDriver(input.id, input.driver);
      if (!order) {
        throw new Error("Order not found");
      }
      return order;
    }),

  confirm: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const order = ordersLib.confirmOrder(input.id);
      if (!order) {
        throw new Error("Order not found");
      }
      return order;
    }),

  validatePOD: publicProcedure
    .input(
      z.object({
        id: z.string(),
        pod: z.object({
          type: z.enum(["photo", "pin"]),
          url: z.string().optional(),
          code: z.string().optional(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      const order = ordersLib.getOrder(input.id);
      if (!order) {
        throw new Error("Order not found");
      }

      if (input.pod.type === "pin") {
        if (input.pod.code !== order.pinDelivery) {
          throw new Error("PIN incorreto");
        }
      }

      const updated = ordersLib.updateOrderStatus(input.id, "DELIVERED", input.pod);
      if (!updated) {
        throw new Error("Erro ao finalizar entrega");
      }

      return updated;
    }),

  /**
   * Exportar rastreamento em CSV
   */
  exportTrackingCSV: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const order = ordersLib.getOrder(input.id);
      if (!order) {
        throw new Error("Order not found");
      }

      const trackingPoints = order.tracking || [];
      const csv = toCSV(trackingPoints);

      return {
        success: true,
        content: csv,
        fileName: `pedido_${input.id}.csv`,
        mimeType: "text/csv; charset=utf-8",
      };
    }),

  /**
   * Exportar rastreamento em GPX
   */
  exportTrackingGPX: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const order = ordersLib.getOrder(input.id);
      if (!order) {
        throw new Error("Order not found");
      }

      const trackingPoints = order.tracking || [];
      const gpx = toGPX(trackingPoints, { name: `Pedido ${input.id}` });

      return {
        success: true,
        content: gpx,
        fileName: `pedido_${input.id}.gpx`,
        mimeType: "application/gpx+xml; charset=utf-8",
      };
    }),

  /**
   * Obter estatísticas de rastreamento
   */
  getTrackingStats: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const order = ordersLib.getOrder(input.id);
      if (!order) {
        throw new Error("Order not found");
      }

      const trackingPoints = order.tracking || [];
      const stats = trackStats(trackingPoints);

      return stats;
    }),
});
