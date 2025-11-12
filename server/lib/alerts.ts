/**
 * Brazukas Delivery - Alert System
 * Detecção de violações de SLA e entregador parado
 */

import bus from "./bus";

interface LocationEntry {
  lat: number;
  lng: number;
  ts: string;
}

interface AlertState {
  stoppedAt?: string;
  slaAt?: string;
}

const G: {
  lastByOrder: Map<string, LocationEntry>;
  lastAlert: Map<string, AlertState>;
} = {
  lastByOrder: new Map(),
  lastAlert: new Map(),
};

const STOP_THRESHOLD_MIN = Number(process.env.ALERT_STOP_MIN || 8); // parado > 8 min
const SLA_THRESHOLD_MIN = Number(process.env.ALERT_SLA_MIN || 45); // total > 45 min

/**
 * Calcula distância em km entre dois pontos (Haversine)
 */
function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // raio da Terra em km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export interface OrderMeta {
  confirmedAt?: string;
  createdAt?: string;
  id: string;
}

export function feedLocationForAlerts(
  orderId: string,
  location: LocationEntry,
  orderMeta: OrderMeta
): void {
  const prev = G.lastByOrder.get(orderId);
  G.lastByOrder.set(orderId, location);

  const startedAt = new Date(
    orderMeta?.confirmedAt || orderMeta?.createdAt || location.ts
  );
  const minutesSinceStart = (Date.now() - startedAt.getTime()) / 60000;

  // Alerta de SLA
  if (minutesSinceStart > SLA_THRESHOLD_MIN) {
    const k = G.lastAlert.get(orderId) || {};
    if (!k.slaAt) {
      k.slaAt = new Date().toISOString();
      G.lastAlert.set(orderId, k);

      bus.emit("admin:alert", {
        type: "sla:breach",
        orderId,
        minutes: Math.round(minutesSinceStart),
      });

      bus.emit(`order:${orderId}`, {
        type: "notice",
        data: {
          code: "SLA_BREACH",
          minutes: Math.round(minutesSinceStart),
        },
      });
    }
  }

  // Alerta de parado
  if (prev) {
    const dtMin = (new Date(location.ts).getTime() - new Date(prev.ts).getTime()) / 60000;
    const movedKm = haversine(prev.lat, prev.lng, location.lat, location.lng);

    if (dtMin >= STOP_THRESHOLD_MIN && movedKm < 0.05) {
      // < 50 m em N minutos
      const k = G.lastAlert.get(orderId) || {};
      if (!k.stoppedAt) {
        k.stoppedAt = new Date().toISOString();
        G.lastAlert.set(orderId, k);

        bus.emit("admin:alert", {
          type: "driver:stopped",
          orderId,
          minutes: Math.round(dtMin),
        });

        bus.emit(`order:${orderId}`, {
          type: "notice",
          data: {
            code: "DRIVER_STOPPED",
            minutes: Math.round(dtMin),
          },
        });
      }
    }
  }
}

export function getAlertState(orderId: string): AlertState | null {
  return G.lastAlert.get(orderId) || null;
}

export function clearAlert(orderId: string): void {
  G.lastAlert.delete(orderId);
}
