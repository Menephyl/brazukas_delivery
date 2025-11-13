/**
 * Brazukas Delivery - Auth Router
 * Autenticação JWT mock para desenvolvimento
 */

import { publicProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { sign, verify, extractToken } from "../auth";
import { COOKIE_NAME } from "@shared/const";
import { ENV } from "../_core/env";

export const authRouter = router({
  /**
   * Login com email e senha (mock)
   */
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
      })
    )
  .mutation(({ input, ctx }) => {
      // Mock: admin único para desenvolvimento
      if (
        input.email === "admin@brazukas.app" &&
        input.password === "brazukas2025"
      ) {
        const token = sign({
          sub: "admin",
          role: "admin",
          email: input.email,
        });

        // set cookie HTTP-only so client requests (credentials: 'include') will send it
        try {
          const maxAge = 7 * 24 * 3600 * 1000; // 7 days
          const secure = !!ENV.isProduction;
          ctx.res?.cookie(COOKIE_NAME, token, {
            httpOnly: true,
            maxAge,
            sameSite: "lax",
            secure,
          });
        } catch (e) {
          // ignore cookie set errors; token is still returned
        }

        return { token, success: true };
      }

      throw new Error("Credenciais inválidas");
    }),

  /**
   * Verifica o token atual
   */
  me: publicProcedure
    .input(z.object({ token: z.string().optional() }))
    .query(({ input, ctx }) => {
      // Prefer context user (set by server/_core/context.ts via sdk.authenticateRequest)
      // This covers the cookie-based session flow.
      if (ctx && (ctx as any).user) {
        return (ctx as any).user;
      }

      let token: string | null = input.token || null;

      // Se não fornecido no input, tenta extrair do header
      if (!token && ctx.req) {
        const auth = ctx.req.headers.authorization;
        token = auth ? extractToken(auth) : null;
      }

      if (!token) {
        return null;
      }

      const claims = verify(token);
      return claims || null;
    }),

  /**
   * Logout (apenas remove token no cliente)
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
