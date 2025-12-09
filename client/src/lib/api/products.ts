/**
 * Brazukas Delivery - Products API Adapter
 * Abstrai chamadas para mock ou Manus
 */

import { supabase } from "../supabase";

/**
 * Lista produtos de uma loja
 */
export async function listByMerchant(merchantId: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('restaurant_id', merchantId); // Assuming FK is restaurant_id since table is restaurants

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  // Normaliza resposta (Map snake_case from DB to Portuguese keys for UI)
  return data.map((p: any) => ({
    id: p.id,
    nome: p.name,
    preco: p.price,
    foto: p.image_url || p.photo_url || "", // Fallback
    descricao: p.description, // Added this field as it was in the interface
  }));
}
