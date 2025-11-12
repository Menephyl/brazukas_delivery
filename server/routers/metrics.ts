/**
 * Brazukas Delivery - Metrics Router
 * Calcula KPIs e métricas de pedidos
 */

import { publicProcedure, router } from "../_core/trpc";
import { listOrders } from "../orders";

function milliseconds(dateA: string, dateB: string): number {
  return new Date(dateB).getTime() - new Date(dateA).getTime();
}

function stageTime(
  order: any,
  fromStatus: string,
  toStatus: string
): number | null {
  const timelineFrom = order.timeline?.find(
    (t: any) => t.type === fromStatus
  );
  const timelineTo = order.timeline?.find((t: any) => t.type === toStatus);

  if (!timelineFrom || !timelineTo) return null;

  return milliseconds(timelineFrom.ts, timelineTo.ts);
}

function withinHours(timestamp: string, hours: number): boolean {
  return (
    Date.now() - new Date(timestamp).getTime() <= hours * 3600 * 1000
  );
}

export const metricsRouter = router({
  /**
   * Calcula KPIs e métricas de pedidos
   */
  summary: publicProcedure
    .input((val: any) => ({
      hours: Number(val?.hours) || 24,
    }))
    .query(({ input }) => {
      const orders = listOrders();
      const windowOrders = orders.filter((o: any) =>
        withinHours(o.createdAt, input.hours)
      );

      const total = windowOrders.length;

      // Contagem por status
      const byStatus: Record<string, number> = {
        PENDING_PAYMENT: 0,
        PAID: 0,
        CONFIRMED: 0,
        ASSIGNED: 0,
        PICKED_UP: 0,
        DELIVERED: 0,
      };

      windowOrders.forEach((o: any) => {
        byStatus[o.status] = (byStatus[o.status] ?? 0) + 1;
      });

      // Tempos de transição (em minutos)
      const tConfirm = windowOrders
        .map((o: any) => stageTime(o, "PAID", "CONFIRMED"))
        .filter((t: any): t is number => t !== null);

      const tAssign = windowOrders
        .map((o: any) => stageTime(o, "CONFIRMED", "ASSIGNED"))
        .filter((t: any): t is number => t !== null);

      const tPickup = windowOrders
        .map((o: any) => stageTime(o, "ASSIGNED", "PICKED_UP"))
        .filter((t: any): t is number => t !== null);

      const tDeliver = windowOrders
        .map((o: any) => stageTime(o, "PICKED_UP", "DELIVERED"))
        .filter((t: any): t is number => t !== null);

      const avg = (arr: number[]): number | null => {
        if (!arr.length) return null;
        const sum = arr.reduce((s, x) => s + x, 0);
        return Math.round(sum / arr.length / 60000); // converter para minutos
      };

      // KPIs
      const kpis = {
        total,
        delivered: byStatus.DELIVERED,
        completionRate: total
          ? Math.round((byStatus.DELIVERED / total) * 100)
          : 0,
        avgConfirmMin: avg(tConfirm),
        avgAssignMin: avg(tAssign),
        avgPickupMin: avg(tPickup),
        avgDeliverMin: avg(tDeliver),
      };

      // Série temporal por hora
      const buckets: Record<
        string,
        { time: string; created: number; delivered: number }
      > = {};

      windowOrders.forEach((o: any) => {
        const d = new Date(o.createdAt);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        const hour = String(d.getHours()).padStart(2, "0");
        const key = `${year}-${month}-${day} ${hour}:00`;

        if (!buckets[key]) {
          buckets[key] = { time: key, created: 0, delivered: 0 };
        }
        buckets[key].created += 1;
        if (o.status === "DELIVERED") {
          buckets[key].delivered += 1;
        }
      });

      const series = Object.values(buckets).sort((a, b) =>
        a.time.localeCompare(b.time)
      );

      return {
        kpis,
        byStatus,
        series,
        hours: input.hours,
      };
    }),
});
