/**
 * Brazukas Delivery - Health Router
 * Endpoints para health check e logs
 */

import { publicProcedure, router } from "../_core/trpc";
import { loadLogs, appendLog, clearLogs, filterLogs } from "../logs";

export const healthRouter = router({
  /**
   * Health check simples
   */
  check: publicProcedure.query(async () => {
    const started = Date.now();
    return {
      ok: true,
      service: "brazukas-api",
      uptime: process.uptime(),
      now: new Date().toISOString(),
      latencyMs: Date.now() - started,
    };
  }),

  /**
   * Healthcheck completo com informações de ambiente
   */
  full: publicProcedure.query(async () => {
    const timestamp = new Date().toISOString();
    const environment = process.env.NODE_ENV || "development";

    return {
      ok: true,
      timestamp,
      environment,
      uptime: process.uptime(),
      version: process.env.APP_VERSION || "unknown",
      nodeVersion: process.version,
      service: "brazukas-api",
    };
  }),

  /**
   * Readiness check - verifica se pronto para requisições
   */
  ready: publicProcedure.query(async () => {
    return {
      ready: true,
      timestamp: new Date().toISOString(),
    };
  }),

  /**
   * Liveness check - verifica se vivo
   */
  live: publicProcedure.query(() => {
    return {
      alive: true,
      timestamp: new Date().toISOString(),
    };
  }),

  /**
   * Lista logs (com filtro opcional)
   */
  logs: publicProcedure
    .input((val: any) => ({
      level: val?.level || undefined,
    }))
    .query(({ input }) => {
      const items = input.level
        ? filterLogs(input.level)
        : loadLogs();
      // Retorna últimos 500 (mais recentes primeiro)
      return items.slice(-500).reverse();
    }),

  /**
   * Adiciona um log
   */
  addLog: publicProcedure
    .input((val: any) => val || {})
    .mutation(({ input }) => {
      return appendLog(input);
    }),

  /**
   * Limpa todos os logs
   */
  clearLogs: publicProcedure.mutation(() => {
    clearLogs();
    return { success: true };
  }),
});
