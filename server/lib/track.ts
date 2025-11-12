/**
 * Brazukas Delivery - Driver Location Tracking
 * Persistência de localização com histórico e ETA dinâmico
 */

import { getRouteETA } from "./route";
import bus from "./bus";
import { feedLocationForAlerts } from "./alerts";

export interface LocationEntry {
  lat: number;
  lng: number;
  speed: number;
  heading: number;
  ts: string;
  driverId?: string;
}

export interface OrderTrack {
  last: LocationEntry | null;
  history: LocationEntry[];
}

export interface ETAData {
  etaMin: number;
  distanceM: number;
  updatedAt: string;
  geometry?: any;
}

const G: {
  byOrder: Map<string, OrderTrack>;
  eta: Map<string, ETAData>;
  all: Map<string, LocationEntry>;
} = {
  byOrder: new Map(),
  eta: new Map(),
  all: new Map(),
};

export async function recordDriverLocation(
  {
    orderId,
    lat,
    lng,
    speed = 0,
    heading = 0,
    ts = null,
    driverId = null,
    dropoff = null,
    orderMeta = null,
  }: {
    orderId: string;
    lat: number;
    lng: number;
    speed?: number;
    heading?: number;
    ts?: string | null;
    driverId?: string | null;
    dropoff?: { lat: number; lng: number } | null;
    orderMeta?: any;
  }
): Promise<LocationEntry | null> {
  if (!orderId || lat == null || lng == null) return null;

  const now = ts || new Date().toISOString();
  const entry: LocationEntry = {
    lat: Number(lat),
    lng: Number(lng),
    speed: Number(speed),
    heading: Number(heading),
    ts: now,
    driverId: driverId || undefined,
  };

  const cur = G.byOrder.get(orderId) || { last: null, history: [] };
  cur.last = entry;
  cur.history.push(entry);

  // Limita histórico a 200 entradas
  if (cur.history.length > 200) {
    cur.history.shift();
  }

  G.byOrder.set(orderId, cur);

  // Guardar última localização por driver
  if (driverId) {
    G.all.set(driverId, entry);
  }

  // Emitir evento de localização
  bus.emit(`order:${orderId}`, { type: "location:update", data: entry });
  bus.emit("all", { type: "location:update", data: entry });

  // Calcular ETA dinâmico se tiver destino
  if (dropoff?.lat && dropoff?.lng) {
    const route = await getRouteETA(
      { lat, lng },
      { lat: dropoff.lat, lng: dropoff.lng }
    );

    if (route) {
      const etaMin = Math.round(route.durationSec / 60);
      const payload: ETAData = {
        etaMin,
        distanceM: route.distanceM,
        updatedAt: new Date().toISOString(),
        geometry: route.geometry,
      };

      G.eta.set(String(orderId), payload);

      bus.emit(`order:${orderId}`, { type: "eta:update", data: payload });
      bus.emit("all", {
        type: "eta:update",
        data: { orderId, ...payload },
      });
    }
  }

  // Verificar alertas
  if (orderMeta) {
    feedLocationForAlerts(orderId, entry, orderMeta);
  }

  return cur.last;
}

export function getETA(orderId: string): ETAData | null {
  return G.eta.get(String(orderId)) || null;
}

export function getDriverLocation(orderId: string): LocationEntry | null {
  const cur = G.byOrder.get(orderId);
  return cur?.last || null;
}

export function getDriverHistory(orderId: string): LocationEntry[] {
  const cur = G.byOrder.get(orderId);
  return cur?.history || [];
}

export function listAllLatest(): LocationEntry[] {
  return Array.from(G.all.values());
}
