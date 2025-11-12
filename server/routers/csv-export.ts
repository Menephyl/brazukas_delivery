/**
 * Brazukas Delivery - CSV Export Router
 * Exportação de métricas em formato CSV
 */

import { publicProcedure, router } from "../_core/trpc";
import { computeMetrics } from "../lib/metrics";
import { listOrders } from "../orders";

function csvEscape(v: any): string {
  if (v == null) return "";
  const s = String(v);
  if (/[",\n;]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function toCSV(rows: any[][]): string {
  return rows.map((r) => r.map(csvEscape).join(";")).join("\n");
}

/**
 * Tenta obter nomes das lojas do mock
 */
async function getMerchantNameMap(): Promise<Map<string, string>> {
  const merchants = listOrders()
    .map((o) => o.merchantId)
    .filter((id): id is string | number => id != null);

  const uniqueMerchants = Array.from(new Set(merchants));

  // Mock: nomes das lojas
  const nameMap = new Map<string, string>();
  const merchantNames: Record<string | number, string> = {
    "1": "Brasil Burgers",
    "2": "Sushi da Fronteira",
    "3": "Açaí do Leste",
    "4": "Pizzaria Brasil",
    "5": "Tacos Fronterizos",
    "6": "Café do Comércio",
  };

  uniqueMerchants.forEach((id) => {
    nameMap.set(String(id), merchantNames[id] || `Loja ${id}`);
  });

  return nameMap;
}

export const csvExportRouter = router({
  /**
   * Exporta métricas de lojas em CSV
   */
  stores: publicProcedure
    .input((val: any) => ({
      start: val?.start as string | undefined,
      end: val?.end as string | undefined,
      merchantId: val?.merchantId as string | undefined,
    }))
    .query(async ({ input }) => {
      const data = computeMetrics({
        start: input.start,
        end: input.end,
        merchantId: input.merchantId,
      });

      // Preencher nomes das lojas
      const nameMap = await getMerchantNameMap();
      data.stores.forEach((s) => {
        s.name = s.name || nameMap.get(String(s.merchantId)) || `Loja ${s.merchantId}`;
      });

      const header = [
        "merchantId",
        "name",
        "count",
        "delivered",
        "completionRate(%)",
        "PAID→CONFIRMED(min)",
        "CONFIRMED→ASSIGNED(min)",
        "ASSIGNED→PICKED(min)",
        "PICKED→DELIVERED(min)",
        "TOTAL(min)",
      ];

      const rows = data.stores.map((s) => [
        s.merchantId,
        s.name || `Loja ${s.merchantId}`,
        s.count,
        s.delivered,
        s.count ? Math.round((s.delivered / s.count) * 100) : 0,
        s.sla.paid_to_confirmed ?? "",
        s.sla.confirmed_to_assigned ?? "",
        s.sla.assigned_to_picked ?? "",
        s.sla.picked_to_delivered ?? "",
        s.sla.total_paid_to_delivered ?? "",
      ]);

      const csv = toCSV([header, ...rows]);

      return {
        csv,
        filename: `metrics-stores-${new Date().toISOString().slice(0, 10)}.csv`,
        contentType: "text/csv; charset=utf-8",
      };
    }),

  /**
   * Exporta métricas de entregadores em CSV
   */
  drivers: publicProcedure
    .input((val: any) => ({
      start: val?.start as string | undefined,
      end: val?.end as string | undefined,
      merchantId: val?.merchantId as string | undefined,
    }))
    .query(({ input }) => {
      const data = computeMetrics({
        start: input.start,
        end: input.end,
        merchantId: input.merchantId,
      });

      const header = [
        "driverId",
        "name",
        "vehicle",
        "count",
        "delivered",
        "completionRate(%)",
        "PAID→CONFIRMED(min)",
        "CONFIRMED→ASSIGNED(min)",
        "ASSIGNED→PICKED(min)",
        "PICKED→DELIVERED(min)",
        "TOTAL(min)",
      ];

      const rows = data.drivers.map((d) => [
        d.driverId,
        d.name,
        d.vehicle,
        d.count,
        d.delivered,
        d.count ? Math.round((d.delivered / d.count) * 100) : 0,
        d.sla.paid_to_confirmed ?? "",
        d.sla.confirmed_to_assigned ?? "",
        d.sla.assigned_to_picked ?? "",
        d.sla.picked_to_delivered ?? "",
        d.sla.total_paid_to_delivered ?? "",
      ]);

      const csv = toCSV([header, ...rows]);

      return {
        csv,
        filename: `metrics-drivers-${new Date().toISOString().slice(0, 10)}.csv`,
        contentType: "text/csv; charset=utf-8",
      };
    }),
});
