/**
 * Brazukas Delivery - Coupons API Adapter
 * Abstrai chamadas para mock ou Manus
 */

import { USE_MOCK } from "../config";
import { apiFetch } from "../http";

export interface ValidateCouponParams {
  code?: string;
  subtotal?: number;
}

/**
 * Valida um cupom
 */
export async function validate(params: ValidateCouponParams = {}) {
  if (USE_MOCK) {
    // No mock, lista todos os cupons
    return apiFetch("/coupons", { auth: false });
  }

  if (!params.code) {
    return [];
  }

  const res = await apiFetch("/coupons/validate", {
    method: "POST",
    body: {
      code: params.code,
      subtotal: Math.max(0, Number(params.subtotal) || 0),
    },
    auth: false,
  });

  return res;
}
