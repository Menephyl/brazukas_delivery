/**
 * Brazukas Delivery - Metrics Detailed Router
 * API com filtros e agregações por loja e entregador
 */

import { publicProcedure, router } from "../_core/trpc";
import { computeMetrics } from "../lib/metrics";
import { listOrders } from "../orders";

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

export const metricsDetailedRouter = router({
  /**
   * Retorna métricas detalhadas com agregações por loja e entregador
   */
  summary: publicProcedure
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

      return data;
    }),

  /**
   * Ranking de lojas por SLA total (menor é melhor)
   */
  storeRanking: publicProcedure
    .input((val: any) => ({
      start: val?.start as string | undefined,
      end: val?.end as string | undefined,
      limit: Number(val?.limit) || 50,
    }))
    .query(async ({ input }) => {
      const data = computeMetrics({
        start: input.start,
        end: input.end,
      });

      // Preencher nomes das lojas
      const nameMap = await getMerchantNameMap();
      data.stores.forEach((s) => {
        s.name = s.name || nameMap.get(String(s.merchantId)) || `Loja ${s.merchantId}`;
      });

      // Ranking por SLA total (menor é melhor); empate: mais entregues
      const ranked = data.stores
        .slice()
        .sort((a, b) => {
          const slaA = a.sla.total_paid_to_delivered ?? Infinity;
          const slaB = b.sla.total_paid_to_delivered ?? Infinity;
          if (slaA !== slaB) return slaA - slaB;
          return (b.delivered || 0) - (a.delivered || 0);
        })
        .slice(0, input.limit);

      return ranked;
    }),

  /**
   * Ranking de entregadores por SLA total (menor é melhor)
   */
  driverRanking: publicProcedure
    .input((val: any) => ({
      start: val?.start as string | undefined,
      end: val?.end as string | undefined,
      limit: Number(val?.limit) || 50,
    }))
    .query(({ input }) => {
      const data = computeMetrics({
        start: input.start,
        end: input.end,
      });

      // Ranking por SLA total (menor é melhor); empate: mais entregues
      const ranked = data.drivers
        .slice()
        .sort((a, b) => {
          const slaA = a.sla.total_paid_to_delivered ?? Infinity;
          const slaB = b.sla.total_paid_to_delivered ?? Infinity;
          if (slaA !== slaB) return slaA - slaB;
          return (b.delivered || 0) - (a.delivered || 0);
        })
        .slice(0, input.limit);

      return ranked;
    }),
});
