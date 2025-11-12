/**
 * Brazukas Delivery - Cart Router
 * Rotas tRPC para gerenciamento de carrinho persistente
 */

import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";

interface CartItem {
  id: string;
  nome: string;
  preco: number;
  qty: number;
  merchantId?: string | number;
  foto?: string;
}

interface CartData {
  items: CartItem[];
  couponCode?: string;
  totalAmount: number;
}

// Mock storage para carrinhos (em produção seria banco de dados)
const mockCarts: Map<string, CartData> = new Map();

export const cartRouter = router({
  /**
   * Get user's cart
   */
  get: publicProcedure
    .input(z.object({ userId: z.string().or(z.number()) }))
    .query(async ({ input }) => {
      const userId = String(input.userId);
      const cart = mockCarts.get(userId);

      return (
        cart || {
          items: [],
          couponCode: undefined,
          totalAmount: 0,
        }
      );
    }),

  /**
   * Add item to cart
   */
  addItem: publicProcedure
    .input(
      z.object({
        userId: z.string().or(z.number()),
        item: z.object({
          id: z.string(),
          nome: z.string(),
          preco: z.number(),
          qty: z.number().min(1),
          merchantId: z.string().or(z.number()).optional(),
          foto: z.string().optional(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      const userId = String(input.userId);
      const cart = mockCarts.get(userId) || {
        items: [],
        totalAmount: 0,
      };

      const existingItem = cart.items.find((i) => i.id === input.item.id);

      if (existingItem) {
        existingItem.qty += input.item.qty;
      } else {
        cart.items.push(input.item);
      }

      // Recalculate total
      cart.totalAmount = cart.items.reduce((sum, item) => sum + item.preco * item.qty, 0);

      mockCarts.set(userId, cart);

      return {
        success: true,
        cart,
      };
    }),

  /**
   * Remove item from cart
   */
  removeItem: publicProcedure
    .input(
      z.object({
        userId: z.string().or(z.number()),
        itemId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const userId = String(input.userId);
      const cart = mockCarts.get(userId);

      if (!cart) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Carrinho não encontrado",
        });
      }

      cart.items = cart.items.filter((i) => i.id !== input.itemId);

      // Recalculate total
      cart.totalAmount = cart.items.reduce((sum, item) => sum + item.preco * item.qty, 0);

      mockCarts.set(userId, cart);

      return {
        success: true,
        cart,
      };
    }),

  /**
   * Update item quantity
   */
  updateQuantity: publicProcedure
    .input(
      z.object({
        userId: z.string().or(z.number()),
        itemId: z.string(),
        qty: z.number().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const userId = String(input.userId);
      const cart = mockCarts.get(userId);

      if (!cart) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Carrinho não encontrado",
        });
      }

      const item = cart.items.find((i) => i.id === input.itemId);

      if (!item) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Item não encontrado no carrinho",
        });
      }

      item.qty = input.qty;

      // Recalculate total
      cart.totalAmount = cart.items.reduce((sum, item) => sum + item.preco * item.qty, 0);

      mockCarts.set(userId, cart);

      return {
        success: true,
        cart,
      };
    }),

  /**
   * Clear cart
   */
  clear: publicProcedure
    .input(z.object({ userId: z.string().or(z.number()) }))
    .mutation(async ({ input }) => {
      const userId = String(input.userId);
      mockCarts.delete(userId);

      return {
        success: true,
        cart: {
          items: [],
          totalAmount: 0,
        },
      };
    }),

  /**
   * Apply coupon to cart
   */
  applyCoupon: publicProcedure
    .input(
      z.object({
        userId: z.string().or(z.number()),
        couponCode: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const userId = String(input.userId);
      const cart = mockCarts.get(userId);

      if (!cart) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Carrinho não encontrado",
        });
      }

      // Validate coupon (mock validation)
      const validCoupons = ["PROMO20", "DESCONTO10", "FRETE5", "PRIMEIRA15"];

      if (!validCoupons.includes(input.couponCode.toUpperCase())) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cupom inválido",
        });
      }

      cart.couponCode = input.couponCode.toUpperCase();
      mockCarts.set(userId, cart);

      return {
        success: true,
        cart,
      };
    }),

  /**
   * Remove coupon from cart
   */
  removeCoupon: publicProcedure
    .input(z.object({ userId: z.string().or(z.number()) }))
    .mutation(async ({ input }) => {
      const userId = String(input.userId);
      const cart = mockCarts.get(userId);

      if (!cart) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Carrinho não encontrado",
        });
      }

      cart.couponCode = undefined;
      mockCarts.set(userId, cart);

      return {
        success: true,
        cart,
      };
    }),

  /**
   * Get cart statistics
   */
  getStats: publicProcedure
    .input(z.object({ userId: z.string().or(z.number()) }))
    .query(async ({ input }) => {
      const userId = String(input.userId);
      const cart = mockCarts.get(userId);

      if (!cart) {
        return {
          itemCount: 0,
          totalAmount: 0,
          hasCoupon: false,
        };
      }

      const itemCount = cart.items.reduce((sum, item) => sum + item.qty, 0);

      return {
        itemCount,
        totalAmount: cart.totalAmount,
        hasCoupon: !!cart.couponCode,
        couponCode: cart.couponCode,
      };
    }),
});
