/**
 * Brazukas Delivery - WhatsApp Integration
 * Cloud API ou webhook HTTP para notificações
 */

const TOKEN = import.meta.env.VITE_WHATSAPP_TOKEN || "";
const PHONE_ID = import.meta.env.VITE_WHATSAPP_PHONE_ID || "";
const API = PHONE_ID ? `https://graph.facebook.com/v20.0/${PHONE_ID}/messages` : "";

export async function sendWhatsAppText({
  to,
  text,
}: {
  to: string;
  text: string;
}): Promise<boolean> {
  if (!API || !TOKEN || !to) return false;
  try {
    const r = await fetch(API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: text },
      }),
    });
    return r.ok;
  } catch {
    return false;
  }
}

/** helpers de mensagem */
export function msgOrderCreated({ orderId, url }: { orderId: string; url: string }): string {
  return `✅ Pedido #${orderId} criado!\nAcompanhe: ${url}`;
}

export function msgStatus({ orderId, status }: { orderId: string; status: string }): string {
  return `📦 Pedido #${orderId} atualizado: ${status}`;
}

export function msgDeliveryPin({ orderId, pin, url }: { orderId: string; pin: string; url: string }): string {
  return `🔐 Seu pedido #${orderId} chegará em breve!\n\nPIN de entrega: ${pin}\n\nAcompanhe em tempo real: ${url}`;
}
