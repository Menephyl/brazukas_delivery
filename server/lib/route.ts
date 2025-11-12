/**
 * Brazukas Delivery - Route Calculation
 * Integração com OSRM (Open Source Routing Machine) para ETA dinâmico
 */

const OSRM_URL = process.env.OSRM_URL || "https://router.project-osrm.org";

export interface Location {
  lat: number;
  lng: number;
}

export interface RouteResult {
  durationSec: number;
  distanceM: number;
  geometry?: any;
}

export async function getRouteETA(
  from: Location,
  to: Location
): Promise<RouteResult | null> {
  if (!from?.lat || !from?.lng || !to?.lat || !to?.lng) {
    return null;
  }

  try {
    const url = `${OSRM_URL}/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson`;
    const response = await fetch(url);

    if (!response.ok) {
      console.warn("OSRM request failed:", response.status);
      return null;
    }

    const data = await response.json();
    const route = data?.routes?.[0];

    if (!route) {
      return null;
    }

    return {
      durationSec: Math.round(route.duration || 0),
      distanceM: Math.round(route.distance || 0),
      geometry: route.geometry || null,
    };
  } catch (err) {
    console.error("Route calculation error:", err);
    return null;
  }
}

export function formatETA(minutes: number | null): string {
  if (minutes == null) return "—";

  const m = Math.max(0, Math.round(minutes));

  if (m < 60) {
    return `${m} min`;
  }

  const h = Math.floor(m / 60);
  const mm = m % 60;

  return `${h}h ${mm}min`;
}
