/**
 * Brazukas Delivery - Merchants Router
 * Gerencia dados de lojas e produtos
 */

import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { merchants, merchantProducts, Merchant, MerchantProduct } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";

export const merchantsRouter = router({
  /**
   * Criar nova loja (signup)
   */
  signup: publicProcedure
    .input(
      z.object({
        name: z.string().min(3).max(255),
        email: z.string().email(),
        phone: z.string().min(10).max(20),
        address: z.string().min(5),
        cnpj: z.string().regex(/^\d{14}$/),
        description: z.string().optional(),
        category: z.string().optional(),
        logo: z.string().url().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        // Verificar se email já existe
        const existing = await db
          .select()
          .from(merchants)
          .where(eq(merchants.email, input.email))
          .limit(1);

        if (existing.length > 0) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Email já cadastrado",
          });
        }

        // Criar merchant
        const result = await db.insert(merchants).values({
          userId: ctx.user?.id || 0,
          name: input.name,
          email: input.email,
          phone: input.phone,
          address: input.address,
          cnpj: input.cnpj,
          description: input.description,
          category: input.category,
          logo: input.logo,
          isActive: true,
        });

        return {
          success: true,
          merchantId: result[0]?.insertId || 0,
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao criar loja",
        });
      }
    }),

  /**
   * Obter perfil da loja
   */
  getProfile: protectedProcedure
    .input(z.object({ merchantId: z.number() }))
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const merchant = await db
          .select()
          .from(merchants)
          .where(eq(merchants.id, input.merchantId))
          .limit(1);

        if (!merchant.length) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Loja não encontrada",
          });
        }

        return merchant[0];
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao obter perfil",
        });
      }
    }),

  /**
   * Atualizar perfil da loja
   */
  updateProfile: protectedProcedure
    .input(
      z.object({
        merchantId: z.number(),
        name: z.string().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
        description: z.string().optional(),
        logo: z.string().url().optional(),
        deliveryRadius: z.number().optional(),
        deliveryFee: z.number().optional(),
        minOrderValue: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const { merchantId, ...updates } = input;

        await db
          .update(merchants)
          .set({
            ...updates,
            updatedAt: new Date(),
          })
          .where(eq(merchants.id, merchantId));

        return { success: true };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao atualizar perfil",
        });
      }
    }),

  /**
   * Listar produtos da loja
   */
  listProducts: publicProcedure
    .input(
      z.object({
        merchantId: z.number(),
        category: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const whereConditions = input.category
          ? and(
              eq(merchantProducts.merchantId, input.merchantId),
              eq(merchantProducts.category, input.category)
            )
          : eq(merchantProducts.merchantId, input.merchantId);

        const products = await db
          .select()
          .from(merchantProducts)
          .where(whereConditions);

        return products;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao listar produtos",
        });
      }
    }),

  /**
   * Criar novo produto
   */
  createProduct: protectedProcedure
    .input(
      z.object({
        merchantId: z.number(),
        name: z.string().min(3).max(255),
        price: z.number().positive(),
        description: z.string().optional(),
        image: z.string().url().optional(),
        category: z.string().optional(),
        preparationTime: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const result = await db.insert(merchantProducts).values({
          merchantId: input.merchantId,
          name: input.name,
          price: Math.round(input.price * 100), // Convert to cents
          description: input.description,
          image: input.image,
          category: input.category,
          preparationTime: input.preparationTime,
          isAvailable: true,
        });

        return {
          success: true,
          productId: result[0]?.insertId || 0,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao criar produto",
        });
      }
    }),

  /**
   * Atualizar produto
   */
  updateProduct: protectedProcedure
    .input(
      z.object({
        productId: z.number(),
        name: z.string().optional(),
        price: z.number().optional(),
        description: z.string().optional(),
        image: z.string().url().optional(),
        category: z.string().optional(),
        preparationTime: z.number().optional(),
        isAvailable: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const { productId, ...updates } = input;

        const updateData: any = {
          ...updates,
          updatedAt: new Date(),
        };

        if (updates.price) {
          updateData.price = Math.round(updates.price * 100);
        }

        await db
          .update(merchantProducts)
          .set(updateData)
          .where(eq(merchantProducts.id, productId));

        return { success: true };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao atualizar produto",
        });
      }
    }),

  /**
   * Deletar produto
   */
  deleteProduct: protectedProcedure
    .input(z.object({ productId: z.number() }))
    .mutation(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        await db
          .delete(merchantProducts)
          .where(eq(merchantProducts.id, input.productId));

        return { success: true };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao deletar produto",
        });
      }
    }),
});
