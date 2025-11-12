/**
 * Brazukas Delivery - Loyalty Router
 * Rotas tRPC para programa de fidelidade com pontos e cashback
 */

import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";

interface LoyaltyData {
  points: number;
  cashback: number;
  tier: "bronze" | "silver" | "gold" | "platinum";
  totalSpent: number;
}

// Mock storage para fidelidade
const mockLoyalty: Map<string, LoyaltyData> = new Map();

// Tier benefits
const tierBenefits = {
  bronze: { pointsMultiplier: 1, cashbackPercent: 0.5 },
  silver: { pointsMultiplier: 1.5, cashbackPercent: 1 },
  gold: { pointsMultiplier: 2, cashbackPercent: 1.5 },
  platinum: { pointsMultiplier: 3, cashbackPercent: 2 },
};

export const loyaltyRouter = router({
  /**
   * Get user's loyalty status
   */
  getStatus: publicProcedure
    .input(z.object({ userId: z.string().or(z.number()) }))
    .query(async ({ input }) => {
      const userId = String(input.userId);
      const loyalty = mockLoyalty.get(userId) || {
        points: 0,
        cashback: 0,
        tier: "bronze",
        totalSpent: 0,
      };

      const nextTierThreshold = {
        bronze: 500,
        silver: 1500,
        gold: 3000,
        platinum: 5000,
      };

      const currentThreshold = nextTierThreshold[loyalty.tier];
      const nextTier = loyalty.tier === "platinum" ? "platinum" : 
                       loyalty.tier === "gold" ? "platinum" :
                       loyalty.tier === "silver" ? "gold" : "silver";
      const nextThresholdValue = nextTierThreshold[nextTier];
      const progressToNextTier = Math.min(
        100,
        (loyalty.totalSpent / nextThresholdValue) * 100
      );

      return {
        ...loyalty,
        nextTier,
        progressToNextTier: Math.round(progressToNextTier),
        pointsPerDollar: tierBenefits[loyalty.tier].pointsMultiplier,
        cashbackPercent: tierBenefits[loyalty.tier].cashbackPercent,
      };
    }),

  /**
   * Earn points from order
   */
  earnPoints: publicProcedure
    .input(
      z.object({
        userId: z.string().or(z.number()),
        orderTotal: z.number(),
        orderId: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const userId = String(input.userId);
      const loyalty = mockLoyalty.get(userId) || {
        points: 0,
        cashback: 0,
        tier: "bronze",
        totalSpent: 0,
      };

      const multiplier = tierBenefits[loyalty.tier].pointsMultiplier;
      const pointsEarned = Math.floor(input.orderTotal * multiplier);
      const cashbackEarned = (input.orderTotal * tierBenefits[loyalty.tier].cashbackPercent) / 100;

      loyalty.points += pointsEarned;
      loyalty.cashback += cashbackEarned;
      loyalty.totalSpent += input.orderTotal;

      // Update tier
      if (loyalty.totalSpent >= 5000) {
        loyalty.tier = "platinum";
      } else if (loyalty.totalSpent >= 3000) {
        loyalty.tier = "gold";
      } else if (loyalty.totalSpent >= 1500) {
        loyalty.tier = "silver";
      }

      mockLoyalty.set(userId, loyalty);

      return {
        success: true,
        pointsEarned,
        cashbackEarned,
        loyalty,
      };
    }),

  /**
   * Redeem points for discount
   */
  redeemPoints: publicProcedure
    .input(
      z.object({
        userId: z.string().or(z.number()),
        points: z.number().min(100),
      })
    )
    .mutation(async ({ input }) => {
      const userId = String(input.userId);
      const loyalty = mockLoyalty.get(userId);

      if (!loyalty) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Usuário não encontrado no programa de fidelidade",
        });
      }

      if (loyalty.points < input.points) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Pontos insuficientes",
        });
      }

      const discountValue = input.points / 100; // 100 points = R$ 1
      loyalty.points -= input.points;

      mockLoyalty.set(userId, loyalty);

      return {
        success: true,
        pointsRedeemed: input.points,
        discountValue,
        remainingPoints: loyalty.points,
      };
    }),

  /**
   * Get loyalty history/transactions
   */
  getHistory: publicProcedure
    .input(
      z.object({
        userId: z.string().or(z.number()),
        limit: z.number().default(10),
      })
    )
    .query(async () => {
      // Mock history
      const history = [
        {
          id: "1",
          type: "earn",
          points: 150,
          cashback: 7.5,
          description: "Pedido #1234",
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "2",
          type: "redeem",
          points: -100,
          cashback: 0,
          description: "Resgate de desconto",
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "3",
          type: "bonus",
          points: 50,
          cashback: 0,
          description: "Bônus de aniversário",
          date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];

      return {
        transactions: history.slice(0, 10),
        total: history.length,
      };
    }),

  /**
   * Get tier benefits
   */
  getTierBenefits: publicProcedure.query(async () => {
    return {
      bronze: {
        name: "Bronze",
        pointsMultiplier: 1,
        cashbackPercent: 0.5,
        benefits: ["Acumule pontos em cada compra", "Cashback de 0.5%"],
      },
      silver: {
        name: "Prata",
        pointsMultiplier: 1.5,
        cashbackPercent: 1,
        benefits: ["1.5x pontos em cada compra", "Cashback de 1%", "Frete grátis acima de R$ 50"],
      },
      gold: {
        name: "Ouro",
        pointsMultiplier: 2,
        cashbackPercent: 1.5,
        benefits: ["2x pontos em cada compra", "Cashback de 1.5%", "Frete grátis em todos os pedidos", "Atendimento prioritário"],
      },
      platinum: {
        name: "Platina",
        pointsMultiplier: 3,
        cashbackPercent: 2,
        benefits: ["3x pontos em cada compra", "Cashback de 2%", "Frete grátis em todos os pedidos", "Atendimento VIP", "Cupons exclusivos"],
      },
    };
  }),

  /**
   * Get cashback balance
   */
  getCashbackBalance: publicProcedure
    .input(z.object({ userId: z.string().or(z.number()) }))
    .query(async ({ input }) => {
      const userId = String(input.userId);
      const loyalty = mockLoyalty.get(userId);

      if (!loyalty) {
        return {
          cashback: 0,
          canUse: false,
        };
      }

      return {
        cashback: loyalty.cashback,
        canUse: loyalty.cashback >= 1, // Mínimo R$ 1
      };
    }),

  /**
   * Apply cashback to order
   */
  applyCashback: publicProcedure
    .input(
      z.object({
        userId: z.string().or(z.number()),
        amount: z.number().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const userId = String(input.userId);
      const loyalty = mockLoyalty.get(userId);

      if (!loyalty) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Usuário não encontrado",
        });
      }

      if (loyalty.cashback < input.amount) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cashback insuficiente",
        });
      }

      loyalty.cashback -= input.amount;
      mockLoyalty.set(userId, loyalty);

      return {
        success: true,
        discountApplied: input.amount,
        remainingCashback: loyalty.cashback,
      };
    }),
});
