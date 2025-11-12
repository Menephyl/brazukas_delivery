/**
 * Brazukas Delivery - Merchants API Adapter
 * Abstrai chamadas para mock ou Manus
 */

import { USE_MOCK } from "../config";
import { apiFetch } from "../http";

export interface ListMerchantsParams {
  q?: string;
  category?: string;
  limit?: number;
  cursor?: string;
}

/**
 * Lista lojas
 */
export async function list(params: ListMerchantsParams = {}) {
  if (USE_MOCK) {
    return apiFetch("/merchants", { auth: false });
  }

  const searchParams = new URLSearchParams();
  if (params.q) searchParams.set("q", params.q);
  if (params.category) searchParams.set("category", params.category);
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.cursor) searchParams.set("cursor", params.cursor);

  const qs = searchParams.toString() ? `?${searchParams.toString()}` : "";
  const res = await apiFetch(`/merchants${qs}`, { auth: false });

  // Normaliza resposta (Manus retorna { items, nextCursor })
  return res.items || res;
}

/**
 * Obtém uma loja por ID
 */
export async function getById(id: string) {
  const merchants = await list();
  return merchants.find((m: any) => String(m.id) === String(id)) || null;
}
