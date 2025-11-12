/**
 * Brazukas Delivery - Order Types (Client-side)
 */

export type OrderStatus =
  | "PENDING_PAYMENT"
  | "PAID"
  | "CONFIRMED"
  | "ASSIGNED"
  | "PICKED_UP"
  | "DELIVERED";

export interface TimelineEvent {
  ts: string;
  type: OrderStatus;
}

export interface Driver {
  id: string;
  nome: string;
  veiculo: string;
}

export interface OrderItem {
  id: string;
  nome: string;
  preco: number;
  qty: number;
  merchantId?: string | number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  client: { name: string };
  merchantId?: string | number | null;
  status: OrderStatus;
  timeline: TimelineEvent[];
  driver: Driver | null;
  etaMin: number | null;
  createdAt: string;
  pinDelivery?: string;
  pod?: { type: "photo" | "pin"; url?: string; code?: string; at?: string } | null;
}

export const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING_PAYMENT: "Aguardando pagamento",
  PAID: "Pago",
  CONFIRMED: "Confirmado pelo restaurante",
  ASSIGNED: "Entregador a caminho",
  PICKED_UP: "Pedido retirado",
  DELIVERED: "Entregue",
};

export const STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING_PAYMENT: "bg-yellow-100 text-yellow-800",
  PAID: "bg-blue-100 text-blue-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  ASSIGNED: "bg-purple-100 text-purple-800",
  PICKED_UP: "bg-orange-100 text-orange-800",
  DELIVERED: "bg-green-100 text-green-800",
};
