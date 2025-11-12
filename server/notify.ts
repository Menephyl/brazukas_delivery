/**
 * Brazukas Delivery - Notifications Module
 * Envia alertas via webhook (Telegram, Discord, Slack, etc)
 */

/**
 * Envia notificação via webhook
 */
export async function notify(message: string): Promise<boolean> {
  const webhookUrl = process.env.NOTIFY_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn("[Notify] NOTIFY_WEBHOOK_URL não configurado");
    return false;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: message }),
    });

    if (!response.ok) {
      console.warn(
        `[Notify] Webhook retornou ${response.status}: ${response.statusText}`
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error("[Notify] Erro ao enviar notificação:", error);
    return false;
  }
}

/**
 * Formata mensagem de alerta de backend offline
 */
export function formatBackendOfflineAlert(
  appName: string,
  apiUrl: string
): string {
  return `⚠️ *${appName}*: Backend Manus OFFLINE\n🔗 URL: ${apiUrl}`;
}

/**
 * Formata mensagem de alerta de pico de erros
 */
export function formatErrorSpikeAlert(
  appName: string,
  errorCount: number,
  minutes: number
): string {
  return `🚨 *${appName}*: Pico de erros (${errorCount}) nos últimos ${minutes} min.`;
}
