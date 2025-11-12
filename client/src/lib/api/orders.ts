/**
 * Brazukas Delivery - Orders API Adapter
 * Abstrai chamadas para mock ou Manus
 */

import { USE_MOCK } from "../config";
import { apiFetch } from "../http";

export interface ListOrdersParams {
  merchantId?: string;
  status?: string;
  limit?: number;
  cursor?: string;
}

export interface CreateOrderPayload {
  items: any[];
  total: number;
  merchantId: string;
  client?: any;
}

/**
 * Lista pedidos
 */
export async function list(params: ListOrdersParams = {}) {
  if (USE_MOCK) {
    return apiFetch("/orders", { method: "GET" });
  }

  const search = new URLSearchParams();
  if (params.merchantId) search.set("merchantId", params.merchantId);
  if (params.status) search.set("status", params.status);
  if (params.limit) search.set("limit", String(params.limit));
  if (params.cursor) search.set("cursor", params.cursor);

  const qs = search.toString() ? `?${search.toString()}` : "";
  const res = await apiFetch(`/orders${qs}`, { method: "GET" });

  return res.items || res;
}

/**
 * Obtém um pedido por ID
 */
export async function get(id: string) {
  return apiFetch(`/orders/${id}`, { method: "GET" });
}

/**
 * Cria um pedido a partir do carrinho
 */
export async function createMockFromCart(payload: CreateOrderPayload) {
  if (USE_MOCK) {
    return apiFetch("/orders", {
      method: "POST",
      body: {
        items: payload.items,
        total: payload.total,
        merchantId: payload.merchantId,
        client: payload.client,
      },
    });
  }

  // Converte para o payload da Manus
  const manuPayload = {
    merchant_id: String(payload.merchantId),
    items: payload.items.map((i: any) => ({
      product_id: i.id,
      name: i.nome,
      price: i.preco,
      qty: i.qty,
    })),
    address: {
      street: payload.client?.street || "",
      ref: payload.client?.ref || "",
    },
    payment_method: "pix",
  };

  return apiFetch("/orders", {
    method: "POST",
    body: manuPayload,
  });
}

/**
 * Avança o status de um pedido
 */
export async function advanceStatus(id: string, status: string) {
  return apiFetch(`/orders/${id}`, {
    method: "PATCH",
    body: { status },
  });
}

/**
 * Atribui um entregador a um pedido
 */
export async function assignDriver(id: string, driver: any) {
  if (USE_MOCK) {
    return apiFetch(`/orders/${id}`, {
      method: "PATCH",
      body: { action: "assign_driver", driver },
    });
  }

  // Normaliza nomes de campos (mock usa camelCase, Manus usa snake_case)
  return apiFetch(`/orders/${id}`, {
    method: "PATCH",
    body: {
      action: "assign_driver",
      driver: {
        id: driver.id,
        name: driver.nome || driver.name,
        vehicle: driver.veiculo || driver.vehicle,
      },
    },
  });
}

/**
 * Define o ETA de um pedido
 */
export async function setETA(id: string, eta: number) {
  if (USE_MOCK) {
    return apiFetch(`/orders/${id}`, {
      method: "PATCH",
      body: { action: "set_eta", etaMin: eta },
    });
  }

  return apiFetch(`/orders/${id}`, {
    method: "PATCH",
    body: { action: "set_eta", eta_min: eta },
  });
}
