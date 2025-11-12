/**
 * Brazukas Delivery - Coupons Mock Data
 */

export interface Coupon {
  code: string;
  type: "percent" | "fixed" | "free_shipping";
  value: number;
  min?: number;
  maxOff?: number;
}

export const COUPONS: Coupon[] = [
  {
    code: "BRZ10",
    type: "percent",
    value: 10,
    min: 50000,
    maxOff: 20000,
  },
  {
    code: "MENOS5000",
    type: "fixed",
    value: 5000,
  },
  {
    code: "FRETEGRATIS",
    type: "free_shipping",
    value: 1,
  },
];

/**
 * Busca todos os cupons
 */
export function getAllCoupons(): Coupon[] {
  return COUPONS;
}

/**
 * Busca um cupom por código
 */
export function getCouponByCode(code: string): Coupon | undefined {
  return COUPONS.find((c) => c.code.toUpperCase() === code.toUpperCase());
}
