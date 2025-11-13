/**
 * Brazukas Delivery - Auth Router
 * Autenticação com JWT local, bcrypt e Drizzle ORM.
 */

import { publicProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { sign } from "../auth";
import { COOKIE_NAME } from "@shared/const"; 
import * as db from "../db";
import { getSessionCookieOptions } from "../_core/cookies";
import bcrypt from "bcrypt";
import { TRPCError } from "@trpc/server";

export const authRouter = router({
  /**
   * Login com email e senha (simples)
   */
  login: publicProcedure // publicProcedure porque o usuário ainda não está autenticado
    .input( // Define o schema de entrada para a procedure
      z.object({
        email: z.string().email(),
        password: z.string().min(8),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = await db.getUserByEmail(input.email);
      // Verifica se o usuário existe e se possui um hash de senha
      if (!user || !user.passwordHash) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Credenciais inválidas' });
      }
      // Compara a senha fornecida com o hash armazenado
      const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);
      // Se a senha não for válida, lança erro de não autorizado
      if (!isPasswordValid) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Credenciais inválidas' });
      }

      // Atualizar lastSignedIn
      // Usamos upsertUser aqui para atualizar o campo lastSignedIn
      // e garantir que o usuário ainda exista no DB (embora já tenhamos verificado)
      // O openId é a chave primária lógica para o upsert.
      await db.upsertUser({
        openId: user.openId,
        lastSignedIn: new Date(),
      });

      // Gerar token
      const token = await sign({
        // Payload do JWT com informações essenciais do usuário
        openId: user.openId,
        role: user.role,
        email: user.email,
        name: user.name,
      });

      // Set cookie HTTP-only
      try {
        // Configurações do cookie de sessão
        const maxAge = 7 * 24 * 3600 * 1000; // 7 days
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res?.cookie(COOKIE_NAME, token, {
          ...cookieOptions,
          maxAge,
        });
      } catch (e) {
        // ignore cookie set errors
        console.error("Failed to set cookie:", e); // Log para depuração, mas não impede o login
      }

      return { token, success: true };
    }),

  /**
   * Cadastro de novo usuário
   */
  signup: publicProcedure // publicProcedure porque o usuário ainda não está autenticado
    .input( // Define o schema de entrada para a procedure
      z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(8),
      })
    )
    .mutation(async ({ input }) => {
      // Verifica se já existe um usuário com o email fornecido
      const existingUser = await db.getUserByEmail(input.email);
      if (existingUser) {
        throw new TRPCError({ code: 'CONFLICT', message: 'Email já cadastrado.' });
      }

      // Gera o hash da senha usando bcrypt
      // O custo de 10 é um bom equilíbrio entre segurança e performance
      const passwordHash = await bcrypt.hash(input.password, 10);
      // Gera um openId único para o novo usuário.
      // Em um sistema real, isso poderia ser um UUID ou um ID de um provedor OAuth.
      const openId = `local-user-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

      // Cria o novo usuário no banco de dados
      // O role padrão é 'client', mas pode ser ajustado conforme a lógica de negócio
      await db.upsertUser({
        openId,
        name: input.name,
        email: input.email,
        passwordHash,
        loginMethod: "local",
        role: "client",
      });

      return { success: true, message: 'Usuário criado com sucesso. Você já pode fazer login.' };
    }),

  /**
   * Obter usuário autenticado
   */
  me: publicProcedure.query(async ({ ctx }) => {
    return ctx.user;
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
