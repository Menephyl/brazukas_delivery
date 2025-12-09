/**
 * Brazukas Delivery - Orders API Adapter
 * Abstrai chamadas para mock ou Manus
 */

import { supabase } from "../supabase";

export interface ListOrdersParams {
  merchantId?: string;
  status?: string;
  limit?: number;
  cursor?: string;
}

export interface CreateOrderPayload {
  items: any[];
  total: number;
  merchantId: string;
  client?: any;
}

/**
 * Lista pedidos
 */
export async function list(params: ListOrdersParams = {}) {
  let query = supabase.from('orders').select('*');

  if (params.merchantId) {
    query = query.eq('restaurant_id', params.merchantId);
  }
  if (params.status) {
    query = query.eq('status', params.status);
  }
  if (params.limit) {
    query = query.limit(params.limit);
  }

  // Order by newest first by default
  query = query.order('created_at', { ascending: false });

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching orders:', error);
    return [];
  }

  return data.map((o: any) => ({
    id: o.id,
    merchantId: o.restaurant_id,
    total: o.total,
    status: o.status,
    createdAt: o.created_at,
    client: o.client_info || {}, // inference
    items: [], // usually list doesn't return items unless eager loaded, kept empty for now or could fetch
  }));
}

/**
 * Obtém um pedido por ID
 */
export async function get(id: string) {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)') // Embed items
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching order:', error);
    return null;
  }

  return {
    id: data.id,
    merchantId: data.restaurant_id,
    total: data.total,
    status: data.status,
    createdAt: data.created_at,
    client: data.client_info || {},
    items: data.order_items.map((i: any) => ({
      id: i.product_id, // mapping back to UI expectation
      nome: i.name,
      preco: i.price,
      qty: i.quantity,
    })),
    driver: data.driver_info, // assuming driver info is stored here or joined
  };
}

/**
 * Cria um pedido
 */
export async function createOrder(payload: CreateOrderPayload) {
  // 1. Insert Order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      restaurant_id: payload.merchantId,
      total: payload.total,
      status: 'pending', // Default status
      // client_info: payload.client, // Assuming jsonb or similar if needed, or map fields
      address: payload.client ? { street: payload.client.street, ref: payload.client.ref } : {},
    })
    .select()
    .single();

  if (orderError) {
    console.error('Error creating order:', orderError);
    throw orderError;
  }

  if (!order) {
    throw new Error('Order creation failed');
  }

  // 2. Insert Order Items
  const itemsToInsert = payload.items.map((item: any) => ({
    order_id: order.id,
    product_id: item.id,
    name: item.nome,
    price: item.preco,
    quantity: item.qty || 1, // Fallback qty
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(itemsToInsert);

  if (itemsError) {
    console.error('Error creating order items:', itemsError);
    // Ideally we should rollback here, but Supabase-js doesn't support transactions client-side easily 
    // without RPC. Start with this for now as per instructions "Refactor...".
    throw itemsError;
  }

  return order;
}

// Alias for backward compatibility if needed
export const createMockFromCart = createOrder;

/**
 * Avança o status de um pedido
 */
export async function advanceStatus(id: string, status: string) {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
  return data;
}

/**
 * Atribui um entregador a um pedido
 */
export async function assignDriver(id: string, driver: any) {
  // Store driver info in a jsonb column 'driver_info' or specific columns
  const driverData = {
    id: driver.id,
    name: driver.nome || driver.name,
    vehicle: driver.veiculo || driver.vehicle,
  };

  const { data, error } = await supabase
    .from('orders')
    .update({
      driver_id: driver.id,
      driver_info: driverData // store snapshot or assume column
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error assigning driver:', error);
    throw error;
  }
  return data;
}

/**
 * Define o ETA de um pedido
 */
export async function setETA(id: string, eta: number) {
  const { data, error } = await supabase
    .from('orders')
    .update({ eta_min: eta })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error setting ETA:', error);
    throw error;
  }
  return data;
}
