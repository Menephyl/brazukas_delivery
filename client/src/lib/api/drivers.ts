/**
 * Brazukas Delivery - Drivers API Adapter
 * Abstrai chamadas para mock ou Manus
 */

import { USE_MOCK } from "../config";
import { apiFetch } from "../http";

/**
 * Lista entregadores
 */
export async function list() {
  if (USE_MOCK) {
    return apiFetch("/drivers", { auth: false });
  }

  const res = await apiFetch("/drivers", { auth: true });
  return res.items || res;
}
