/**
 * Brazukas Delivery - Reviews Router
 * Rotas tRPC para gerenciamento de avaliações
 */

import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";

// Mock data de avaliações
const mockReviews = [
  {
    id: "1",
    userId: "user1",
    merchantId: "1",
    rating: 5,
    comment: "Excelente comida! Entrega rápida e quente.",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    userName: "João Silva",
  },
  {
    id: "2",
    userId: "user2",
    merchantId: "1",
    rating: 4,
    comment: "Muito bom, mas demorou um pouco.",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    userName: "Maria Santos",
  },
  {
    id: "3",
    userId: "user3",
    merchantId: "2",
    rating: 5,
    comment: "Sushi fresco e delicioso!",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    userName: "Pedro Costa",
  },
  {
    id: "4",
    userId: "user4",
    merchantId: "2",
    rating: 4,
    comment: "Ótima qualidade, preço justo.",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    userName: "Ana Oliveira",
  },
  {
    id: "5",
    userId: "user5",
    merchantId: "3",
    rating: 5,
    comment: "Açaí perfeito! Voltarei com certeza.",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    userName: "Carlos Mendes",
  },
];

export const reviewsRouter = router({
  /**
   * List reviews for a merchant
   */
  listByMerchant: publicProcedure
    .input(
      z.object({
        merchantId: z.string().or(z.number()),
        limit: z.number().default(10),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      const merchantReviews = mockReviews
        .filter((r) => r.merchantId === input.merchantId || r.merchantId === String(input.merchantId))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(input.offset, input.offset + input.limit);

      const total = mockReviews.filter(
        (r) => r.merchantId === input.merchantId || r.merchantId === String(input.merchantId)
      ).length;

      return {
        reviews: merchantReviews,
        total,
        hasMore: input.offset + input.limit < total,
      };
    }),

  /**
   * Get average rating for a merchant
   */
  getAverageRating: publicProcedure
    .input(z.object({ merchantId: z.string().or(z.number()) }))
    .query(async ({ input }) => {
      const merchantReviews = mockReviews.filter(
        (r) => r.merchantId === input.merchantId || r.merchantId === String(input.merchantId)
      );

      if (merchantReviews.length === 0) {
        return {
          average: 0,
          count: 0,
          distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        };
      }

      const sum = merchantReviews.reduce((acc, r) => acc + r.rating, 0);
      const average = sum / merchantReviews.length;

      const distribution = {
        5: merchantReviews.filter((r) => r.rating === 5).length,
        4: merchantReviews.filter((r) => r.rating === 4).length,
        3: merchantReviews.filter((r) => r.rating === 3).length,
        2: merchantReviews.filter((r) => r.rating === 2).length,
        1: merchantReviews.filter((r) => r.rating === 1).length,
      };

      return {
        average: Math.round(average * 10) / 10,
        count: merchantReviews.length,
        distribution,
      };
    }),

  /**
   * Submit a review
   */
  submit: publicProcedure
    .input(
      z.object({
        merchantId: z.string().or(z.number()),
        rating: z.number().min(1).max(5),
        comment: z.string().max(500).optional(),
        userName: z.string().min(1).max(100),
      })
    )
    .mutation(async ({ input }) => {
      if (!input.rating || input.rating < 1 || input.rating > 5) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Rating deve ser entre 1 e 5",
        });
      }

      const newReview = {
        id: String(mockReviews.length + 1),
        userId: `user${mockReviews.length + 1}`,
        merchantId: String(input.merchantId),
        rating: input.rating,
        comment: input.comment || "",
        createdAt: new Date().toISOString(),
        userName: input.userName,
      };

      mockReviews.push(newReview);

      return {
        success: true,
        review: newReview,
      };
    }),

  /**
   * Get review statistics
   */
  getStats: publicProcedure
    .input(z.object({ merchantId: z.string().or(z.number()) }))
    .query(async ({ input }) => {
      const merchantReviews = mockReviews.filter(
        (r) => r.merchantId === input.merchantId || r.merchantId === String(input.merchantId)
      );

      if (merchantReviews.length === 0) {
        return {
          totalReviews: 0,
          averageRating: 0,
          recentReviews: [],
          topReviews: [],
        };
      }

      const sum = merchantReviews.reduce((acc, r) => acc + r.rating, 0);
      const average = sum / merchantReviews.length;

      const sorted = [...merchantReviews].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      return {
        totalReviews: merchantReviews.length,
        averageRating: Math.round(average * 10) / 10,
        recentReviews: sorted.slice(0, 5),
        topReviews: [...merchantReviews].sort((a, b) => b.rating - a.rating).slice(0, 3),
      };
    }),
});
