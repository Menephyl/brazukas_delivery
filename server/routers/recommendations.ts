/**
 * Brazukas Delivery - Recommendations Router
 * Rotas tRPC para sistema de recomendações inteligentes
 */

import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";

interface Store {
  id: string;
  name: string;
  category: string;
  rating: number;
  image: string;
  deliveryTime: number;
  description: string;
}

// Mock data de lojas
const mockStores: Store[] = [
  {
    id: "1",
    name: "Brasil Burgers",
    category: "Lanches",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500",
    deliveryTime: 30,
    description: "Os melhores hambúrgueres da fronteira",
  },
  {
    id: "2",
    name: "Sushi da Fronteira",
    category: "Japonesa",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500",
    deliveryTime: 40,
    description: "Sushi fresco todos os dias",
  },
  {
    id: "3",
    name: "Açaí do Leste",
    category: "Saudável",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1590080876-c9f0f3f1b3b5?w=500",
    deliveryTime: 20,
    description: "Açaí natural e saudável",
  },
  {
    id: "4",
    name: "Pizzaria Brasil",
    category: "Italiana",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=500",
    deliveryTime: 35,
    description: "Pizza autêntica ao forno de lenha",
  },
  {
    id: "5",
    name: "Tacos Fronterizos",
    category: "Mexicana",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500",
    deliveryTime: 25,
    description: "Tacos e burritos autênticos",
  },
  {
    id: "6",
    name: "Café do Comércio",
    category: "Café & Doces",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500",
    deliveryTime: 15,
    description: "Café premium e bolos caseiros",
  },
];

export const recommendationsRouter = router({
  /**
   * Get personalized recommendations based on user history
   */
  getPersonalized: publicProcedure
    .input(
      z.object({
        userId: z.string().or(z.number()),
        limit: z.number().default(6),
      })
    )
    .query(async ({ input }) => {
      // Simular análise de histórico do usuário
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Mock: retornar lojas com melhor rating
      const recommendations = mockStores
        .sort((a, b) => b.rating - a.rating)
        .slice(0, input.limit);

      return {
        recommendations,
        reason: "Baseado em lojas bem avaliadas",
      };
    }),

  /**
   * Get trending stores
   */
  getTrending: publicProcedure
    .input(z.object({ limit: z.number().default(6) }))
    .query(async () => {
      // Simular busca de lojas em alta
      await new Promise((resolve) => setTimeout(resolve, 300));

      const trending = mockStores
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 6);

      return {
        stores: trending,
        reason: "Lojas em alta no momento",
      };
    }),

  /**
   * Get recommendations by category
   */
  byCategory: publicProcedure
    .input(
      z.object({
        category: z.string(),
        limit: z.number().default(6),
      })
    )
    .query(async ({ input }) => {
      // Simular busca por categoria
      await new Promise((resolve) => setTimeout(resolve, 300));

      const recommendations = mockStores
        .filter((store) => store.category.toLowerCase() === input.category.toLowerCase())
        .sort((a, b) => b.rating - a.rating)
        .slice(0, input.limit);

      return {
        recommendations,
        category: input.category,
        count: recommendations.length,
      };
    }),

  /**
   * Get similar stores based on a store
   */
  getSimilar: publicProcedure
    .input(
      z.object({
        storeId: z.string(),
        limit: z.number().default(6),
      })
    )
    .query(async ({ input }) => {
      // Simular busca de lojas similares
      await new Promise((resolve) => setTimeout(resolve, 300));

      const baseStore = mockStores.find((s) => s.id === input.storeId);

      if (!baseStore) {
        return {
          recommendations: [],
          message: "Loja não encontrada",
        };
      }

      const similar = mockStores
        .filter((s) => s.id !== input.storeId && s.category === baseStore.category)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, input.limit);

      return {
        recommendations: similar,
        baseStore,
        reason: `Lojas similares a ${baseStore.name}`,
      };
    }),

  /**
   * Get quick delivery stores
   */
  getQuickDelivery: publicProcedure
    .input(z.object({ limit: z.number().default(6), maxTime: z.number().default(30) }))
    .query(async () => {
      // Simular busca de lojas com entrega rápida
      await new Promise((resolve) => setTimeout(resolve, 300));

      const quick = mockStores
        .filter((s) => s.deliveryTime <= 30)
        .sort((a, b) => a.deliveryTime - b.deliveryTime)
        .slice(0, 6);

      return {
        stores: quick,
        reason: "Lojas com entrega rápida",
      };
    }),

  /**
   * Get all available categories
   */
  getCategories: publicProcedure.query(async () => {
    // Simular busca de categorias
    await new Promise((resolve) => setTimeout(resolve, 200));

    const categories = Array.from(new Set(mockStores.map((s) => s.category))).sort();

    return {
      categories,
      count: categories.length,
    };
  }),

  /**
   * Get recommendation statistics
   */
  getStats: publicProcedure
    .input(z.object({ userId: z.string().or(z.number()) }))
    .query(async () => {
      // Simular cálculo de estatísticas
      await new Promise((resolve) => setTimeout(resolve, 300));

      return {
        totalStores: mockStores.length,
        categories: Array.from(new Set(mockStores.map((s) => s.category))).length,
        averageRating: (
          mockStores.reduce((sum, s) => sum + s.rating, 0) / mockStores.length
        ).toFixed(2),
        fastestDelivery: Math.min(...mockStores.map((s) => s.deliveryTime)),
        slowestDelivery: Math.max(...mockStores.map((s) => s.deliveryTime)),
      };
    }),
});
