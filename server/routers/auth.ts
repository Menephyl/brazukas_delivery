/**
 * Brazukas Delivery - Auth Router
 * Autenticação simples com JWT local
 */

import { publicProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { sign } from "../auth";
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { ENV } from "../_core/env";
import * as db from "../db";
import { getSessionCookieOptions } from "../_core/cookies";

export const authRouter = router({
  /**
   * Login com email e senha (simples)
   */
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Mock: admin para desenvolvimento
      if (
        input.email === "admin@brazukas.app" &&
        input.password === "brazukas2025"
      ) {
        // Criar ou atualizar usuário no DB
        const openId = "admin-dev";
        await db.upsertUser({
          openId,
          name: "Admin User",
          email: input.email,
          loginMethod: "local",
          role: "admin",
        });

        // Gerar token
        const token = await sign({
          openId,
          role: "admin",
          email: input.email,
          name: "Admin User",
        });

        // Set cookie HTTP-only
        try {
          const maxAge = 7 * 24 * 3600 * 1000; // 7 days
          const cookieOptions = getSessionCookieOptions(ctx.req);
          ctx.res?.cookie(COOKIE_NAME, token, {
            ...cookieOptions,
            maxAge,
          });
        } catch (e) {
          // ignore cookie set errors
        }

        return { token, success: true };
      }

      throw new Error("Credenciais inválidas");
    }),

  /**
   * Obter usuário autenticado
   */
  me: publicProcedure.query(async ({ ctx }) => {
    if ((ctx as any).user) {
      return (ctx as any).user;
    }
    return null;
  }),

  /**
   * Logout
   */
  logout: publicProcedure.mutation(({ ctx }) => {
    try {
      ctx.res?.clearCookie(COOKIE_NAME);
    } catch (e) {
      // ignore
    }
    return { success: true };
  }),
});
