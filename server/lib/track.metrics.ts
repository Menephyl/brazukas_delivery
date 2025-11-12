/**
 * Brazukas Delivery - Track Metrics
 * Utilitários para cálculo de distância, duração e métricas de rastreamento
 */

interface TrackPoint {
  ts?: string | number | Date;
  lat: number;
  lng: number;
  speedKmh?: number;
  heading?: number;
}

/**
 * Calcula a distância entre dois pontos usando a fórmula de Haversine
 * @param a - Ponto inicial
 * @param b - Ponto final
 * @returns Distância em metros
 */
function distanceM(a: TrackPoint, b: TrackPoint): number {
  const R = 6371000; // Raio da Terra em metros
  const toRad = (x: number) => (x * Math.PI) / 180;

  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);

  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;

  return 2 * R * Math.asin(Math.sqrt(s));
}

/**
 * Calcula a distância total percorrida em quilômetros
 * @param points - Array de pontos de rastreamento
 * @returns Distância total em quilômetros
 */
export function totalKm(points: TrackPoint[]): number {
  if (!points || points.length < 2) return 0;

  let distance = 0;
  for (let i = 1; i < points.length; i++) {
    distance += distanceM(points[i - 1], points[i]);
  }

  return distance / 1000;
}

/**
 * Calcula a duração total em segundos
 * @param points - Array de pontos de rastreamento
 * @returns Duração em segundos
 */
export function totalDuration(points: TrackPoint[]): number {
  if (!points || points.length === 0) return 0;

  const t0 = new Date(points[0].ts || 0).getTime();
  const t1 = new Date(points[points.length - 1].ts || 0).getTime();

  return Math.max(0, (t1 - t0) / 1000);
}

/**
 * Formata a duração em minutos
 * @param seconds - Duração em segundos
 * @returns Duração em minutos (arredondado)
 */
export function formatDurationMinutes(seconds: number): number {
  return Math.round(seconds / 60);
}

/**
 * Calcula a velocidade média em km/h
 * @param points - Array de pontos de rastreamento
 * @returns Velocidade média em km/h
 */
export function averageSpeed(points: TrackPoint[]): number {
  const km = totalKm(points);
  const seconds = totalDuration(points);

  if (seconds === 0) return 0;

  const hours = seconds / 3600;
  return km / hours;
}

/**
 * Calcula estatísticas completas de rastreamento
 * @param points - Array de pontos de rastreamento
 * @returns Objeto com estatísticas
 */
export function trackStats(points: TrackPoint[]) {
  const km = totalKm(points);
  const seconds = totalDuration(points);
  const minutes = formatDurationMinutes(seconds);
  const avgSpeed = averageSpeed(points);

  return {
    totalDistance: {
      km: parseFloat(km.toFixed(2)),
      m: Math.round(km * 1000),
    },
    totalDuration: {
      seconds: Math.round(seconds),
      minutes,
      hours: (seconds / 3600).toFixed(2),
    },
    averageSpeed: parseFloat(avgSpeed.toFixed(2)),
    pointCount: points.length,
  };
}

/**
 * Converte pontos de rastreamento para CSV
 * @param points - Array de pontos de rastreamento
 * @returns String CSV
 */
export function toCSV(points: TrackPoint[]): string {
  const header = "ts,lat,lng,speedKmh,heading";
  const rows = points.map((p) => [
    p.ts || "",
    p.lat?.toFixed(6) || "",
    p.lng?.toFixed(6) || "",
    p.speedKmh ?? "",
    p.heading ?? "",
  ].join(","));

  return [header, ...rows].join("\n");
}

/**
 * Escapa caracteres especiais para XML
 * @param s - String a ser escapada
 * @returns String escapada
 */
function xmlEscape(s: string): string {
  const escapeMap: Record<string, string> = {
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    "'": "&apos;",
    '"': "&quot;",
  };

  return String(s).replace(/[<>&'"]/g, (c) => escapeMap[c] || c);
}

/**
 * Converte pontos de rastreamento para GPX 1.1
 * @param points - Array de pontos de rastreamento
 * @param options - Opções (creator, name)
 * @returns String GPX
 */
export function toGPX(
  points: TrackPoint[],
  options: { creator?: string; name?: string } = {}
): string {
  const { creator = "Brazukas Delivery", name = "Rota do Entregador" } = options;

  const trkpts = points
    .map((p) => {
      const time = p.ts
        ? `<time>${xmlEscape(new Date(p.ts).toISOString())}</time>`
        : "";

      const ext =
        p.speedKmh != null || p.heading != null
          ? `<extensions>${
              p.speedKmh != null
                ? `<speed>${xmlEscape(String(p.speedKmh))}</speed>`
                : ""
            }${
              p.heading != null
                ? `<course>${xmlEscape(String(p.heading))}</course>`
                : ""
            }</extensions>`
          : "";

      return `<trkpt lat="${p.lat}" lon="${p.lng}">${time}${ext}</trkpt>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="${xmlEscape(creator)}" xmlns="http://www.topografix.com/GPX/1/1">
  <trk>
    <name>${xmlEscape(name)}</name>
    <trkseg>
      ${trkpts}
    </trkseg>
  </trk>
</gpx>`;
}
