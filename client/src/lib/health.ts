/**
 * Brazukas Delivery - Health Check
 * Verifica disponibilidade do backend Manus
 */

import { API_BASE_URL } from "./config";

/**
 * Verifica se o backend está online
 */
export async function checkBackend(): Promise<boolean> {
  try {
    const url = `${API_BASE_URL}/health`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Faz ping em uma URL e retorna status + latência
 */
export async function ping(url: string): Promise<{
  ok: boolean;
  ms: number;
}> {
  const started = performance.now();
  try {
    const res = await fetch(url, { cache: "no-store" });
    const ms = Math.round(performance.now() - started);
    return { ok: res.ok, ms };
  } catch {
    const ms = Math.round(performance.now() - started);
    return { ok: false, ms };
  }
}
