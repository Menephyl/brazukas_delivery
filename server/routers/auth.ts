/**
 * Brazukas Delivery - Auth Router
 * Autenticação JWT mock para desenvolvimento
 */

import { publicProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { sign, verify, extractToken } from "../auth";

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
    .mutation(({ input }) => {
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
  logout: publicProcedure.mutation(() => {
    return { success: true };
  }),
});
