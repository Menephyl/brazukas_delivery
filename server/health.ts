/**
 * Brazukas Delivery - Health Check (Server)
 * Verifica disponibilidade do backend Manus
 */

/**
 * Verifica se o backend Manus está online
 */
export async function checkBackend(): Promise<boolean> {
  try {
    const apiUrl = process.env.VITE_API_BASE_URL || "https://api.brazukas.app";
    const url = `${apiUrl}/health`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    return res.ok;
  } catch {
    return false;
  }
}
