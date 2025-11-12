/**
 * Brazukas Delivery - Internationalization (PT/ES)
 */

type Locale = "pt" | "es";

const DICTS: Record<Locale, Record<string, string>> = {
  pt: {
    slogan: "O Delivery da Comunidade",
    seeStores: "Ver Lojas",
    goCart: "Ir para o Carrinho",
    cart: "Seu carrinho",
    emptyCart: "Seu carrinho está vazio.",
    backToStores: "Voltar às lojas",
    subtotal: "Subtotal",
    shipping: "Taxa de entrega",
    discount: "Desconto",
    total: "Total",
    finalize: "Finalizar pedido",
    order: "Pedido",
    status: "Status atual",
    items: "Itens",
    timeline: "Linha do tempo",
    paid: "Pago",
    confirmed: "Confirmado pelo restaurante",
    assigned: "Entregador a caminho",
    picked: "Pedido retirado",
    delivered: "Entregue",
    coupon: "Cupom",
    apply: "Aplicar",
    remove: "Remover",
    freeShippingApplied: "FRETEGRATIS ativo — taxa de entrega zerada.",
    admin: "Admin",
    login: "Login",
    email: "E-mail",
    password: "Senha",
    enter: "Entrar",
    logout: "Sair",
    orders: "Pedidos",
    drivers: "Entregadores",
    settings: "Configurações",
    language: "Idioma",
  },
  es: {
    slogan: "El Delivery de la Comunidad",
    seeStores: "Ver Tiendas",
    goCart: "Ir al Carrito",
    cart: "Tu carrito",
    emptyCart: "Tu carrito está vacío.",
    backToStores: "Volver a las tiendas",
    subtotal: "Subtotal",
    shipping: "Costo de envío",
    discount: "Descuento",
    total: "Total",
    finalize: "Finalizar pedido",
    order: "Pedido",
    status: "Estado actual",
    items: "Ítems",
    timeline: "Línea de tiempo",
    paid: "Pagado",
    confirmed: "Confirmado por el restaurante",
    assigned: "Repartidor en camino",
    picked: "Pedido retirado",
    delivered: "Entregado",
    coupon: "Cupón",
    apply: "Aplicar",
    remove: "Quitar",
    freeShippingApplied: "FRETEGRATIS activo — envío gratis.",
    admin: "Admin",
    login: "Iniciar sesión",
    email: "Correo electrónico",
    password: "Contraseña",
    enter: "Entrar",
    logout: "Cerrar sesión",
    orders: "Pedidos",
    drivers: "Repartidores",
    settings: "Configuración",
    language: "Idioma",
  },
};

/**
 * Obtém o locale atual do localStorage
 */
export function getLocale(): Locale {
  if (typeof window === "undefined") return "pt";
  const stored = localStorage.getItem("bz_locale");
  return (stored as Locale) || "pt";
}

/**
 * Define o locale e recarrega a página
 */
export function setLocale(locale: Locale): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("bz_locale", locale);
  window.location.reload();
}

/**
 * Traduz uma chave para o idioma atual
 */
export function t(key: string): string {
  const locale = getLocale();
  return DICTS[locale]?.[key] ?? DICTS.pt[key] ?? key;
}
