/**
 * Brazukas Delivery - Legacy API Adapter (formerly Mock API)
 * Adaptador para manter compatibilidade com componentes que importam diretamente daqui.
 * Agora redireciona para a implementação real no Supabase.
 */

import { list as apiListMerchants, getById as apiGetMerchant } from "./api/merchants";
import { listByMerchant as apiListProducts } from "./api/products";

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
 * Busca todas as lojas (Redireciona para Supabase)
 */
export async function fetchMerchants(): Promise<Merchant[]> {
  const data = await apiListMerchants();
  return data as unknown as Merchant[];
}

/**
 * Busca uma loja por ID (Redireciona para Supabase)
 */
export async function fetchMerchant(id: number): Promise<Merchant | undefined> {
  const data = await apiGetMerchant(String(id));
  return (data as unknown as Merchant) || undefined;
}

/**
 * Busca produtos de uma loja (Redireciona para Supabase)
 */
export async function fetchProducts(merchantId: number): Promise<Product[]> {
  const data = await apiListProducts(String(merchantId));
  return data.map((p: any) => ({
    ...p,
    merchantId: merchantId, // Ensure merchantId is present if needed by UI
  })) as unknown as Product[];
}

