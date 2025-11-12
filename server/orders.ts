/**
 * Brazukas Delivery - Order Management (In-Memory Storage com Persistência)
 * Armazenamento em memória com persistência em JSON para desenvolvimento
 * Em produção, usar banco de dados Manus
 */

import { loadOrders, saveOrders } from "./persist";

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

export interface TrackPoint {
  ts?: string | number | Date;
  lat: number;
  lng: number;
  speedKmh?: number;
  heading?: number;
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
  tracking?: TrackPoint[];
}

interface OrderStore {
  seq: number;
  map: Record<string, Order>;
}

// Armazenamento global em memória com persistência
const G = globalThis as any;
if (!G._bz_orders) {
  G._bz_orders = loadOrders() as OrderStore;
}

/**
 * Persiste o estado dos pedidos no arquivo JSON
 */
function persist(): void {
  saveOrders(G._bz_orders);
}

// Regras de transição válidas entre status
const TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING_PAYMENT: ["PAID"],
  PAID: ["CONFIRMED"],
  CONFIRMED: ["ASSIGNED"],
  ASSIGNED: ["PICKED_UP"],
  PICKED_UP: ["DELIVERED"],
  DELIVERED: [],
};

// Base de "preparo" por loja (mock em minutos)
const PREP_BASE_MIN: Record<string | number, number> = {
  1: 12, // Brasil Burgers
  2: 18, // Sushi
  3: 8, // Açaí
};

/**
 * Simula tempo de deslocamento baseado na loja
 */
function travelMinutesMock(merchantId: string | number | null | undefined): number {
  const id = String(merchantId);
  switch (id) {
    case "1":
      return 10 + Math.floor(Math.random() * 6); // 10–15
    case "2":
      return 14 + Math.floor(Math.random() * 8); // 14–21
    case "3":
      return 7 + Math.floor(Math.random() * 5); // 7–11
    default:
      return 12;
  }
}

/**
 * Calcula ETA automático baseado em preparo + deslocamento
 */
function computeEtaMin(merchantId: string | number | null | undefined): number {
  const prep = PREP_BASE_MIN[String(merchantId) as any] ?? 10;
  const travel = travelMinutesMock(merchantId);
  const eta = Math.max(5, Math.round(prep + travel));
  return eta;
}

/**
 * Gera PIN de 4 dígitos para entrega
 */
function genPin4(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}

/**
 * Cria um novo pedido
 */
export function createOrder(payload: {
  items: OrderItem[];
  total: number;
  merchantId?: string | number | null;
  client?: { name: string };
}): Order {
  const id = String(G._bz_orders.seq++);
  const now = new Date().toISOString();

  const order: Order = {
    id,
    items: payload.items || [],
    total: payload.total || 0,
    client: payload.client || { name: "Visitante" },
    merchantId: payload.merchantId || null,
    status: "PAID", // Mock: já consideramos pago
    timeline: [{ ts: now, type: "PAID" }],
    driver: null,
    etaMin: null,
    createdAt: now,
    pinDelivery: genPin4(),
    pod: null,
  };

  G._bz_orders.map[id] = order;
  persist();
  return order;
}

/**
 * Lista todos os pedidos (ordenado por ID decrescente)
 */
export function listOrders(): Order[] {
  return Object.values(G._bz_orders.map as Record<string, Order>).sort(
    (a, b) => Number(b.id) - Number(a.id)
  );
}

/**
 * Obtém um pedido por ID
 */
export function getOrder(id: string): Order | null {
  return G._bz_orders.map[id] || null;
}

/**
 * Atualiza o status de um pedido com validação
 */
export function updateOrderStatus(
  id: string,
  newStatus: OrderStatus,
  pod?: { type: "photo" | "pin"; url?: string; code?: string }
): Order | null {
  const order = G._bz_orders.map[id];
  if (!order) return null;

  const valid = TRANSITIONS[order.status as OrderStatus];
  if (!valid || !valid.includes(newStatus)) {
    return null; // Transição inválida
  }

  order.status = newStatus;
  order.timeline.push({ ts: new Date().toISOString(), type: newStatus });

  // Salvar POD se fornecido
  if (pod && newStatus === "DELIVERED") {
    order.pod = {
      type: pod.type,
      url: pod.type === "photo" ? pod.url : undefined,
      code: pod.type === "pin" ? "****" : undefined,
      at: new Date().toISOString(),
    };
  }

  persist();
  return order;
}

/**
 * Atribui um entregador a um pedido
 */
export function assignDriver(id: string, driver: Driver): Order | null {
  const order = G._bz_orders.map[id];
  if (!order) return null;

  if (order.status !== "CONFIRMED") {
    return null; // Só pode atribuir em CONFIRMED
  }

  order.driver = driver;
  order.etaMin = computeEtaMin(order.merchantId);
  order.status = "ASSIGNED";
  order.timeline.push({
    ts: new Date().toISOString(),
    type: "ASSIGNED",
  });

  persist();
  return order;
}

/**
 * Confirma um pedido (PAID → CONFIRMED)
 */
export function confirmOrder(id: string): Order | null {
  const order = G._bz_orders.map[id];
  if (!order) return null;

  if (order.status !== "PAID") {
    return null;
  }

  order.status = "CONFIRMED";
  order.timeline.push({
    ts: new Date().toISOString(),
    type: "CONFIRMED",
  });

  persist();
  return order;
}
