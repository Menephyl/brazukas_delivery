/**
 * Brazukas Delivery - Metrics Core
 * Núcleo de cálculo reutilizável para KPIs, SLA e ranking
 */

import { listOrders, Order, TimelineEvent } from "../orders";

/** Converte ms → minutos inteiros */
const toMin = (ms: number | null): number | null =>
  ms == null ? null : Math.max(0, Math.round(ms / 60000));

const getTs = (o: Order, type: string): string | null =>
  o.timeline?.find((t: TimelineEvent) => t.type === type)?.ts || null;

const diff = (a: string | null, b: string | null): number | null =>
  a && b ? new Date(b).getTime() - new Date(a).getTime() : null;

function between(
  ts: string,
  start: string | undefined,
  end: string | undefined
): boolean {
  const t = new Date(ts).getTime();
  return (
    (!start || t >= new Date(start).getTime()) &&
    (!end || t <= new Date(end).getTime())
  );
}

/** Calcula tempos de etapa em ms (ou null se faltar ponto) */
function stageDurations(order: Order) {
  const paid = getTs(order, "PAID");
  const confirmed = getTs(order, "CONFIRMED");
  const assigned = getTs(order, "ASSIGNED");
  const picked = getTs(order, "PICKED_UP");
  const delivered = getTs(order, "DELIVERED");

  return {
    paid_to_confirmed: diff(paid, confirmed),
    confirmed_to_assigned: diff(confirmed, assigned),
    assigned_to_picked: diff(assigned, picked),
    picked_to_delivered: diff(picked, delivered),
    total_paid_to_delivered: diff(paid, delivered),
  };
}

function avg(nums: number[]): number | null {
  const v = nums.filter((x) => Number.isFinite(x));
  if (!v.length) return null;
  return Math.round(v.reduce((s, x) => s + x, 0) / v.length);
}

interface StoreMetrics {
  merchantId: string;
  name: string | null;
  count: number;
  delivered: number;
  sla: {
    paid_to_confirmed: number | null;
    confirmed_to_assigned: number | null;
    assigned_to_picked: number | null;
    picked_to_delivered: number | null;
    total_paid_to_delivered: number | null;
  };
}

interface DriverMetrics {
  driverId: string;
  name: string;
  vehicle: string;
  count: number;
  delivered: number;
  sla: {
    paid_to_confirmed: number | null;
    confirmed_to_assigned: number | null;
    assigned_to_picked: number | null;
    picked_to_delivered: number | null;
    total_paid_to_delivered: number | null;
  };
}

interface KPI {
  total: number;
  delivered: number;
  completionRate: number;
}

export interface MetricsResult {
  kpi: KPI;
  stores: StoreMetrics[];
  drivers: DriverMetrics[];
  raw: Order[];
}

/** Filtro principal + agregações */
export function computeMetrics({
  start,
  end,
  merchantId,
}: {
  start?: string;
  end?: string;
  merchantId?: string;
} = {}): MetricsResult {
  const all = listOrders().filter(
    (o) =>
      between(o.createdAt, start, end) &&
      (!merchantId || String(o.merchantId) === String(merchantId))
  );

  // KPIs globais
  const delivered = all.filter((o) => o.status === "DELIVERED");
  const kpi: KPI = {
    total: all.length,
    delivered: delivered.length,
    completionRate: all.length
      ? Math.round((delivered.length / all.length) * 100)
      : 0,
  };

  // Agregações por loja e por entregador
  const byStore = new Map<
    string,
    StoreMetrics & {
      paid_to_confirmed: number[];
      confirmed_to_assigned: number[];
      assigned_to_picked: number[];
      picked_to_delivered: number[];
      total_paid_to_delivered: number[];
    }
  >();
  const byDriver = new Map<
    string,
    DriverMetrics & {
      paid_to_confirmed: number[];
      confirmed_to_assigned: number[];
      assigned_to_picked: number[];
      picked_to_delivered: number[];
      total_paid_to_delivered: number[];
    }
  >();

  for (const o of all) {
    const durs = stageDurations(o);

    // Agregação por loja
    const storeKey = String(o.merchantId || "0");
    if (!byStore.has(storeKey)) {
      byStore.set(storeKey, {
        merchantId: storeKey,
        name: null,
        count: 0,
        delivered: 0,
        sla: {
          paid_to_confirmed: null,
          confirmed_to_assigned: null,
          assigned_to_picked: null,
          picked_to_delivered: null,
          total_paid_to_delivered: null,
        },
        paid_to_confirmed: [],
        confirmed_to_assigned: [],
        assigned_to_picked: [],
        picked_to_delivered: [],
        total_paid_to_delivered: [],
      });
    }
    const S = byStore.get(storeKey)!;
    S.count += 1;
    if (o.status === "DELIVERED") S.delivered += 1;
    Object.entries(durs).forEach(([k, v]) => {
      if (v != null) {
        (S as any)[k].push(v);
      }
    });

    // Agregação por entregador
    if (o.driver?.id) {
      const drvKey = String(o.driver.id);
      if (!byDriver.has(drvKey)) {
        byDriver.set(drvKey, {
          driverId: drvKey,
          name: o.driver.nome || `#${drvKey}`,
          vehicle: o.driver.veiculo || "",
          count: 0,
          delivered: 0,
          sla: {
            paid_to_confirmed: null,
            confirmed_to_assigned: null,
            assigned_to_picked: null,
            picked_to_delivered: null,
            total_paid_to_delivered: null,
          },
          paid_to_confirmed: [],
          confirmed_to_assigned: [],
          assigned_to_picked: [],
          picked_to_delivered: [],
          total_paid_to_delivered: [],
        });
      }
      const D = byDriver.get(drvKey)!;
      D.count += 1;
      if (o.status === "DELIVERED") D.delivered += 1;
      Object.entries(durs).forEach(([k, v]) => {
        if (v != null) {
          (D as any)[k].push(v);
        }
      });
    }
  }

  // Finaliza médias (em minutos)
  const finish = (row: any): any => ({
    merchantId: row.merchantId,
    name: row.name,
    driverId: row.driverId,
    vehicle: row.vehicle,
    count: row.count,
    delivered: row.delivered,
    sla: {
      paid_to_confirmed: toMin(avg(row.paid_to_confirmed)),
      confirmed_to_assigned: toMin(avg(row.confirmed_to_assigned)),
      assigned_to_picked: toMin(avg(row.assigned_to_picked)),
      picked_to_delivered: toMin(avg(row.picked_to_delivered)),
      total_paid_to_delivered: toMin(avg(row.total_paid_to_delivered)),
    },
  });

  const stores = Array.from(byStore.values()).map(finish);
  const drivers = Array.from(byDriver.values()).map(finish);

  return { kpi, stores: stores as StoreMetrics[], drivers: drivers as DriverMetrics[], raw: all };
}
