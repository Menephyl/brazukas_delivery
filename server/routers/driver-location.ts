import { publicProcedure, router } from "../_core/trpc";
import { z } from "zod";
import {
  recordDriverLocation,
  getDriverLocation,
  getDriverHistory,
  getETA,
} from "../lib/track";

export const driverLocationRouter = router({
  record: publicProcedure
    .input(
      z.object({
        orderId: z.string(),
        lat: z.number(),
        lng: z.number(),
        speed: z.number().optional().default(0),
        heading: z.number().optional().default(0),
        ts: z.string().optional(),
        driverId: z.string().optional(),
        dropoff: z
          .object({ lat: z.number(), lng: z.number() })
          .optional(),
        orderMeta: z.any().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return await recordDriverLocation(input);
    }),

  getLocation: publicProcedure
    .input(z.object({ orderId: z.string() }))
    .query(({ input }) => {
      return getDriverLocation(input.orderId);
    }),

  getHistory: publicProcedure
    .input(z.object({ orderId: z.string() }))
    .query(({ input }) => {
      return getDriverHistory(input.orderId);
    }),

  getETA: publicProcedure
    .input(z.object({ orderId: z.string() }))
    .query(({ input }) => {
      return getETA(input.orderId);
    }),
});
