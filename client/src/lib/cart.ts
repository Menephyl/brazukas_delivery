/**
 * Brazukas Delivery - Shopping Cart Management
 * Armazenamento em localStorage com suporte a cupons
 */

export interface CartItem {
  id: string;
  nome: string;
  preco: number;
  qty: number;
  merchantId?: string | number;
  foto?: string;
}

export interface Coupon {
  code: string;
  type: "percent" | "fixed" | "free_shipping";
  value: number;
  min?: number;
  maxOff?: number;
}

export interface Cart {
  items: CartItem[];
  coupon: Coupon | null;
}

const CART_KEY = "brazukas_cart_v1";

/**
 * Lê o carrinho do localStorage
 */
function read(): Cart {
  if (typeof window === "undefined") return { items: [], coupon: null };
  try {
    const data = JSON.parse(localStorage.getItem(CART_KEY) || "{}");
    return data && data.items ? data : { items: [], coupon: null };
  } catch {
    return { items: [], coupon: null };
  }
}

/**
 * Escreve o carrinho no localStorage
 */
function write(cart: Cart): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

/**
 * Obtém o carrinho atual
 */
export function getCart(): Cart {
  return read();
}

/**
 * Salva o carrinho
 */
export function saveCart(cart: Cart): void {
  write(cart);
}

/**
 * Adiciona um item ao carrinho com bloqueio multiloja
 */
export function addItem(item: CartItem): Cart & { _error?: string } {
  const cart = read();

  // 🔒 Bloqueio multiloja (MVP): só itens da mesma merchantId
  const currentMerchant = cart.items[0]?.merchantId || null;
  if (currentMerchant && currentMerchant !== item.merchantId) {
    return {
      ...cart,
      _error:
        "Seu carrinho já contém itens de outra loja. Finalize ou esvazie para mudar de estabelecimento.",
    };
  }

  const idx = cart.items.findIndex((i) => i.id === item.id);
  if (idx >= 0) {
    cart.items[idx].qty += 1;
  } else {
    cart.items.push({ ...item, qty: 1 });
  }

  write(cart);
  return cart;
}

/**
 * Remove um item do carrinho (decrementa quantidade)
 */
export function removeItem(id: string): Cart {
  const cart = read();
  const idx = cart.items.findIndex((i) => i.id === id);

  if (idx >= 0) {
    cart.items[idx].qty -= 1;
    if (cart.items[idx].qty <= 0) {
      cart.items.splice(idx, 1);
    }
  }

  // Se esvaziou, remover cupom
  if (!cart.items.length) {
    cart.coupon = null;
  }

  write(cart);
  return cart;
}

/**
 * Limpa o carrinho completamente
 */
export function clearCart(): void {
  write({ items: [], coupon: null });
}

/**
 * Define um cupom no carrinho
 */
export function setCoupon(coupon: Coupon): Cart {
  const cart = read();
  cart.coupon = coupon;
  write(cart);
  return cart;
}

/**
 * Remove o cupom do carrinho
 */
export function clearCoupon(): Cart {
  const cart = read();
  cart.coupon = null;
  write(cart);
  return cart;
}

/**
 * Calcula o desconto baseado no cupom
 */
function calcDiscount(subtotal: number, coupon: Coupon | null): number {
  if (!coupon) return 0;

  if (coupon.min && subtotal < coupon.min) return 0;

  let off = 0;

  if (coupon.type === "percent") {
    off = Math.round(subtotal * (coupon.value / 100));
  }

  if (coupon.type === "fixed") {
    off = Math.round(coupon.value);
  }

  if (coupon.maxOff) {
    off = Math.min(off, coupon.maxOff);
  }

  off = Math.max(0, Math.min(off, subtotal));
  return off;
}

/**
 * Calcula os totais do carrinho
 */
export function calculateTotals() {
  const cart = read();
  const subtotal = cart.items.reduce((sum, item) => sum + item.preco * item.qty, 0);
  const desconto = calcDiscount(subtotal, cart.coupon);
  const taxaEntrega = cart.items.length ? 8000 : 0; // 8.000 PYG
  const total = Math.max(0, subtotal - desconto) + taxaEntrega;

  return {
    subtotal,
    desconto,
    taxaEntrega,
    total,
    itemCount: cart.items.length,
    items: cart.items,
    coupon: cart.coupon,
  };
}

/**
 * Obtém quantidade total de itens no carrinho
 */
export function getCartItemCount(): number {
  const cart = read();
  return cart.items.reduce((sum, item) => sum + item.qty, 0);
}
