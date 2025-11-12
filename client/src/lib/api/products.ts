/**
 * Brazukas Delivery - Products API Adapter
 * Abstrai chamadas para mock ou Manus
 */

import { USE_MOCK } from "../config";
import { apiFetch } from "../http";

/**
 * Lista produtos de uma loja
 */
export async function listByMerchant(merchantId: string) {
  if (USE_MOCK) {
    return apiFetch(`/products/${merchantId}`, { auth: false });
  }

  const res = await apiFetch(
    `/merchants/${merchantId}/products`,
    { auth: false }
  );

  // Normaliza resposta (Manus usa snake_case)
  const items = res.items || res;
  return items.map((p: any) => ({
    id: p.id,
    nome: p.name,
    preco: p.price,
    foto: p.photo_url || "",
  }));
}
