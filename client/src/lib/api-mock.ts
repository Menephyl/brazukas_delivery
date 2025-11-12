/**
 * Brazukas Delivery - Mock API
 * Dados de teste para lojas e produtos
 */

export interface Merchant {
  id: number;
  nome: string;
  categoria: string;
  banner: string;
  descricao?: string;
  avaliacao?: number;
  tempoEntrega?: number;
}

export interface Product {
  id: string;
  nome: string;
  descricao?: string;
  preco: number;
  foto: string;
  merchantId: number;
}

/**
 * Lojas mock
 */
export const MERCHANTS: Merchant[] = [
  {
    id: 1,
    nome: "Brasil Burgers",
    categoria: "Lanches",
    banner: "https://picsum.photos/seed/brazukas-burgers/600/400",
    descricao: "Os melhores hambúrgueres da fronteira",
    avaliacao: 4.8,
    tempoEntrega: 30,
  },
  {
    id: 2,
    nome: "Sushi da Fronteira",
    categoria: "Japonesa",
    banner: "https://picsum.photos/seed/brazukas-sushi/600/400",
    descricao: "Sushi fresco todos os dias",
    avaliacao: 4.9,
    tempoEntrega: 40,
  },
  {
    id: 3,
    nome: "Açaí do Leste",
    categoria: "Saudável",
    banner: "https://picsum.photos/seed/brazukas-acai/600/400",
    descricao: "Açaí natural e saudável",
    avaliacao: 4.7,
    tempoEntrega: 20,
  },
  {
    id: 4,
    nome: "Pizzaria Brasil",
    categoria: "Italiana",
    banner: "https://picsum.photos/seed/brazukas-pizza/600/400",
    descricao: "Pizza autêntica ao forno de lenha",
    avaliacao: 4.6,
    tempoEntrega: 35,
  },
  {
    id: 5,
    nome: "Tacos Fronterizos",
    categoria: "Mexicana",
    banner: "https://picsum.photos/seed/brazukas-tacos/600/400",
    descricao: "Tacos e burritos autênticos",
    avaliacao: 4.5,
    tempoEntrega: 25,
  },
  {
    id: 6,
    nome: "Café do Comércio",
    categoria: "Café & Doces",
    banner: "https://picsum.photos/seed/brazukas-cafe/600/400",
    descricao: "Café premium e bolos caseiros",
    avaliacao: 4.9,
    tempoEntrega: 15,
  },
];

/**
 * Produtos mock por loja
 */
export const PRODUCTS: Record<number, Product[]> = {
  1: [
    {
      id: "1a",
      nome: "Burger Clássico",
      descricao: "Pão, carne, alface, tomate e molho",
      preco: 35000,
      foto: "https://picsum.photos/seed/burger-classico/400/300",
      merchantId: 1,
    },
    {
      id: "1b",
      nome: "Cheddar Bacon",
      descricao: "Carne, cheddar, bacon crocante e molho especial",
      preco: 42000,
      foto: "https://picsum.photos/seed/burger-bacon/400/300",
      merchantId: 1,
    },
    {
      id: "1c",
      nome: "Batata Média",
      descricao: "Batata frita crocante com sal",
      preco: 18000,
      foto: "https://picsum.photos/seed/batata-frita/400/300",
      merchantId: 1,
    },
    {
      id: "1d",
      nome: "Refrigerante 2L",
      descricao: "Refrigerante gelado",
      preco: 12000,
      foto: "https://picsum.photos/seed/refrigerante/400/300",
      merchantId: 1,
    },
  ],
  2: [
    {
      id: "2a",
      nome: "Combo 8 Hot Rolls",
      descricao: "8 unidades de hot roll variado",
      preco: 48000,
      foto: "https://picsum.photos/seed/hot-roll/400/300",
      merchantId: 2,
    },
    {
      id: "2b",
      nome: "Nigiri Mix (6un)",
      descricao: "6 peças de nigiri variado",
      preco: 52000,
      foto: "https://picsum.photos/seed/nigiri/400/300",
      merchantId: 2,
    },
    {
      id: "2c",
      nome: "Sashimi Premium",
      descricao: "Seleção premium de sashimi",
      preco: 65000,
      foto: "https://picsum.photos/seed/sashimi/400/300",
      merchantId: 2,
    },
    {
      id: "2d",
      nome: "Temaki Especial",
      descricao: "Temaki com ingredientes especiais",
      preco: 28000,
      foto: "https://picsum.photos/seed/temaki/400/300",
      merchantId: 2,
    },
  ],
  3: [
    {
      id: "3a",
      nome: "Açaí 300ml",
      descricao: "Açaí com granola e mel",
      preco: 22000,
      foto: "https://picsum.photos/seed/acai-300/400/300",
      merchantId: 3,
    },
    {
      id: "3b",
      nome: "Açaí 500ml",
      descricao: "Açaí grande com frutas e granola",
      preco: 29000,
      foto: "https://picsum.photos/seed/acai-500/400/300",
      merchantId: 3,
    },
    {
      id: "3c",
      nome: "Smoothie de Frutas",
      descricao: "Smoothie natural de frutas da estação",
      preco: 18000,
      foto: "https://picsum.photos/seed/smoothie/400/300",
      merchantId: 3,
    },
    {
      id: "3d",
      nome: "Suco Natural",
      descricao: "Suco natural de laranja ou melancia",
      preco: 12000,
      foto: "https://picsum.photos/seed/suco/400/300",
      merchantId: 3,
    },
  ],
  4: [
    {
      id: "4a",
      nome: "Pizza Margherita",
      descricao: "Tomate, mozzarella, manjericão",
      preco: 45000,
      foto: "https://picsum.photos/seed/pizza-margherita/400/300",
      merchantId: 4,
    },
    {
      id: "4b",
      nome: "Pizza Calabresa",
      descricao: "Calabresa, cebola e azeitonas",
      preco: 48000,
      foto: "https://picsum.photos/seed/pizza-calabresa/400/300",
      merchantId: 4,
    },
    {
      id: "4c",
      nome: "Pizza 4 Queijos",
      descricao: "Mozzarella, gorgonzola, parmesão e brie",
      preco: 52000,
      foto: "https://picsum.photos/seed/pizza-queijos/400/300",
      merchantId: 4,
    },
  ],
  5: [
    {
      id: "5a",
      nome: "Taco Carne",
      descricao: "Taco com carne moída temperada",
      preco: 18000,
      foto: "https://picsum.photos/seed/taco-carne/400/300",
      merchantId: 5,
    },
    {
      id: "5b",
      nome: "Burrito Especial",
      descricao: "Burrito com carne, feijão e queijo",
      preco: 32000,
      foto: "https://picsum.photos/seed/burrito/400/300",
      merchantId: 5,
    },
    {
      id: "5c",
      nome: "Quesadilla",
      descricao: "Quesadilla com queijo e frango",
      preco: 28000,
      foto: "https://picsum.photos/seed/quesadilla/400/300",
      merchantId: 5,
    },
  ],
  6: [
    {
      id: "6a",
      nome: "Café Espresso",
      descricao: "Café espresso duplo",
      preco: 8000,
      foto: "https://picsum.photos/seed/cafe-espresso/400/300",
      merchantId: 6,
    },
    {
      id: "6b",
      nome: "Cappuccino",
      descricao: "Cappuccino cremoso",
      preco: 12000,
      foto: "https://picsum.photos/seed/cappuccino/400/300",
      merchantId: 6,
    },
    {
      id: "6c",
      nome: "Bolo de Chocolate",
      descricao: "Bolo caseiro de chocolate",
      preco: 15000,
      foto: "https://picsum.photos/seed/bolo-chocolate/400/300",
      merchantId: 6,
    },
    {
      id: "6d",
      nome: "Croissant",
      descricao: "Croissant francês fresco",
      preco: 10000,
      foto: "https://picsum.photos/seed/croissant/400/300",
      merchantId: 6,
    },
  ],
};

/**
 * Busca todas as lojas
 */
export async function fetchMerchants(): Promise<Merchant[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MERCHANTS), 300);
  });
}

/**
 * Busca uma loja por ID
 */
export async function fetchMerchant(id: number): Promise<Merchant | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MERCHANTS.find((m) => m.id === id)), 300);
  });
}

/**
 * Busca produtos de uma loja
 */
export async function fetchProducts(merchantId: number): Promise<Product[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(PRODUCTS[merchantId] || []), 300);
  });
}
