/**
 * Brazukas Delivery - Coupons Router
 * Rotas tRPC para gerenciamento de cupons
 */

import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";

// Mock data de cupons
const mockCoupons = [
  {
    id: "1",
    code: "PROMO20",
    description: "20% de desconto em qualquer pedido",
    discountType: "percentage" as const,
    discountValue: 20,
    minOrderValue: 0,
    maxUses: 100,
    usedCount: 45,
    isActive: true,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    code: "DESCONTO10",
    description: "R$ 10 de desconto em pedidos acima de R$ 50",
    discountType: "fixed" as const,
    discountValue: 10,
    minOrderValue: 50,
    maxUses: 200,
    usedCount: 120,
    isActive: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    code: "FRETE5",
    description: "R$ 5 de desconto no frete",
    discountType: "fixed" as const,
    discountValue: 5,
    minOrderValue: 30,
    maxUses: 500,
    usedCount: 250,
    isActive: true,
    expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    code: "PRIMEIRA15",
    description: "15% de desconto no primeiro pedido",
    discountType: "percentage" as const,
    discountValue: 15,
    minOrderValue: 25,
    maxUses: 1000,
    usedCount: 750,
    isActive: true,
    expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

function calculateDiscount(orderTotal: number, coupon: (typeof mockCoupons)[0]): number {
  if (coupon.discountType === "percentage") {
    return (orderTotal * coupon.discountValue) / 100;
  } else {
    return Math.min(coupon.discountValue, orderTotal);
  }
}

export const couponsRouter = router({
  /**
   * List all available coupons
   */
  list: publicProcedure.query(async () => {
    const now = new Date();
    return mockCoupons.filter((coupon) => {
      const isNotExpired = !coupon.expiresAt || new Date(coupon.expiresAt) > now;
      const isActive = coupon.isActive;
      const hasUses = !coupon.maxUses || coupon.usedCount < coupon.maxUses;
      return isNotExpired && isActive && hasUses;
    });
  }),

  /**
   * Validate and apply a coupon
   */
  validate: publicProcedure
    .input(
      z.object({
        code: z.string().min(1, "Código do cupom é obrigatório"),
        orderTotal: z.number().min(0, "Total do pedido deve ser maior que 0"),
      })
    )
    .mutation(async ({ input }) => {
      const { code, orderTotal } = input;

      const coupon = mockCoupons.find(
        (c) => c.code.toUpperCase() === code.toUpperCase()
      );

      if (!coupon) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Cupom não encontrado",
        });
      }

      if (!coupon.isActive) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cupom inativo",
        });
      }

      if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cupom expirado",
        });
      }

      if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Limite de usos do cupom atingido",
        });
      }

      if (orderTotal < coupon.minOrderValue) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Valor mínimo do pedido é R$ ${coupon.minOrderValue.toFixed(2)}`,
        });
      }

      const discount = calculateDiscount(orderTotal, coupon);

      return {
        valid: true,
        coupon,
        discount,
        finalTotal: orderTotal - discount,
      };
    }),

  /**
   * Get coupon details by code
   */
  getByCode: publicProcedure
    .input(z.object({ code: z.string().min(1) }))
    .query(async ({ input }) => {
      const coupon = mockCoupons.find(
        (c) => c.code.toUpperCase() === input.code.toUpperCase()
      );

      if (!coupon) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Cupom não encontrado",
        });
      }

      return coupon;
    }),
});
