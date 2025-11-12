/**
 * Brazukas Delivery - Healthwatch Router
 * Monitora saúde do sistema e envia alertas
 */

import { publicProcedure, router } from "../_core/trpc";
import { loadLogs, LogEntry } from "../logs";
import { notify, formatBackendOfflineAlert, formatErrorSpikeAlert } from "../notify";
import { checkBackend } from "../health";

/**
 * Verifica se há erros recentes
 */
function getRecentErrors(sinceMinutes: number): LogEntry[] {
  const now = Date.now();
  const logs = loadLogs();

  return logs.filter((log) => {
    if (!log.ts) return false;
    const age = now - new Date(log.ts).getTime();
    const isRecent = age <= sinceMinutes * 60 * 1000;
    const isError =
      log.level === "error" || (log.status && log.status >= 500);

    return isRecent && isError;
  });
}

export const healthwatchRouter = router({
  /**
   * Executa health check e envia alertas se necessário
   */
  check: publicProcedure
    .input((val: any) => ({
      sinceMin: Number(val?.sinceMin) || 5,
    }))
    .mutation(async ({ input }) => {
      const appName = process.env.ALERT_NAME || "Brazukas Delivery";
      const apiBaseUrl = process.env.VITE_API_BASE_URL || "https://api.brazukas.app";

      let alerted = false;
      const alerts: string[] = [];

      // Verifica se Manus está offline
      const manusOnline = await checkBackend();
      if (!manusOnline) {
        const message = formatBackendOfflineAlert(appName, apiBaseUrl);
        const sent = await notify(message);
        if (sent) {
          alerted = true;
          alerts.push("Backend Manus offline");
        }
      }

      // Verifica pico de erros
      const recentErrors = getRecentErrors(input.sinceMin);
      if (recentErrors.length >= 5) {
        const message = formatErrorSpikeAlert(
          appName,
          recentErrors.length,
          input.sinceMin
        );
        const sent = await notify(message);
        if (sent) {
          alerted = true;
          alerts.push(`Pico de ${recentErrors.length} erros`);
        }
      }

      return {
        manusOnline,
        recentErrors: recentErrors.length,
        alerted,
        alerts,
        timestamp: new Date().toISOString(),
      };
    }),

  /**
   * Apenas verifica status sem enviar alertas
   */
  status: publicProcedure
    .input((val: any) => ({
      sinceMin: Number(val?.sinceMin) || 5,
    }))
    .query(async ({ input }) => {
      const manusOnline = await checkBackend();
      const recentErrors = getRecentErrors(input.sinceMin);

      return {
        manusOnline,
        recentErrors: recentErrors.length,
        timestamp: new Date().toISOString(),
      };
    }),
});
