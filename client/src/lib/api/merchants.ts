/**
 * Brazukas Delivery - Merchants API Adapter
 */

import { supabase } from "../supabase";

export interface ListMerchantsParams {
  q?: string;
  category?: string;
  limit?: number;
  cursor?: string;
}

/**
 * Lista lojas
 */
export async function list(params: ListMerchantsParams = {}) {
  let query = supabase.from('restaurants').select('*');

  if (params.q) {
    query = query.ilike('name', `%${params.q}%`);
  }
  if (params.category) {
    // Assuming 'category' column exists and matches
    query = query.eq('category', params.category);
  }
  if (params.limit) {
    query = query.limit(params.limit);
  }

  const { data, error } = await query;

  console.log('Supabase Response (Merchants):', { data, error });

  if (error) {
    console.error('Error fetching merchants:', error);
    // Returning empty array as fallback, but logging error is crucial
    return [];
  }

  if (!data) {
    return [];
  }

  // Map snake_case to camelCase / Portuguese keys to match UI expectations
  return data.map((m: any) => ({
    id: m.id,
    nome: m.name,
    categoria: m.category,
    banner: m.image_url || m.banner, // Prioritize snake_case from DB
    descricao: m.description,
    avaliacao: m.rating,
    tempoEntrega: m.delivery_time_min || m.delivery_time || 30, // Fallback
  }));
}

/**
 * Obtém uma loja por ID
 */
export async function getById(id: string) {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching merchant:', error);
    return null;
  }

  return {
    id: data.id,
    nome: data.name,
    categoria: data.category,
    banner: data.image_url || data.banner,
    descricao: data.description,
    avaliacao: data.rating,
    tempoEntrega: data.delivery_time_min || data.delivery_time || 30,
  };
}
