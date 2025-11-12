/**
 * Brazukas Delivery - Merchant Orders Router
 * Rotas tRPC para gerenciar pedidos do comerciante
 */

import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";

export const merchantOrdersRouter = router({
  /**
   * Listar pedidos do comerciante com filtros
   */
  listOrders: protectedProcedure
    .input(
      z.object({
        merchantId: z.number(),
        status: z.enum(["pending", "confirmed", "preparing", "ready", "out_for_delivery", "delivered", "cancelled"]).optional(),
        page: z.number().default(1),
        limit: z.number().default(10),
        search: z.string().optional(),
      })
    )
    .query(async ({ input }: any) => {
      // Mock data - em produção, buscar do banco de dados
      const mockOrders = [
        {
          id: 1001,
          customerId: 1,
          customerName: "João Silva",
          customerPhone: "11999999999",
          items: [
            { name: "Hambúrguer Premium", quantity: 2, price: 2340 },
            { name: "Refrigerante", quantity: 2, price: 800 },
          ],
          subtotal: 3140,
          deliveryFee: 500,
          discount: 0,
          total: 3640,
          status: "preparing",
          address: "Rua A, 123, Apto 45",
          createdAt: new Date(Date.now() - 15 * 60000),
          estimatedDelivery: new Date(Date.now() + 30 * 60000),
        },
        {
          id: 1002,
          customerId: 2,
          customerName: "Maria Santos",
          customerPhone: "11988888888",
          items: [
            { name: "Pizza Margherita", quantity: 1, price: 4500 },
            { name: "Cerveja", quantity: 2, price: 1000 },
          ],
          subtotal: 5500,
          deliveryFee: 500,
          discount: 0,
          total: 6000,
          status: "ready",
          address: "Rua B, 456, Apto 12",
          createdAt: new Date(Date.now() - 45 * 60000),
          estimatedDelivery: new Date(Date.now() + 15 * 60000),
        },
        {
          id: 1003,
          customerId: 3,
          customerName: "Pedro Costa",
          customerPhone: "11977777777",
          items: [
            { name: "Açaí", quantity: 2, price: 2800 },
          ],
          subtotal: 2800,
          deliveryFee: 500,
          discount: 0,
          total: 3300,
          status: "delivered",
          address: "Rua C, 789, Apto 67",
          createdAt: new Date(Date.now() - 120 * 60000),
          estimatedDelivery: new Date(Date.now() - 30 * 60000),
        },
      ];

      // Filtrar por status
      let filtered = mockOrders;
      if (input.status) {
        filtered = filtered.filter((o) => o.status === input.status);
      }

      // Filtrar por busca (nome, telefone, ID)
      if (input.search) {
        const searchLower = input.search.toLowerCase();
        filtered = filtered.filter(
          (o) =>
            o.id.toString().includes(searchLower) ||
            o.customerName.toLowerCase().includes(searchLower) ||
            o.customerPhone.includes(searchLower)
        );
      }

      // Paginação
      const start = (input.page - 1) * input.limit;
      const end = start + input.limit;
      const paginated = filtered.slice(start, end);

      return {
        orders: paginated,
        total: filtered.length,
        page: input.page,
        limit: input.limit,
        pages: Math.ceil(filtered.length / input.limit),
      };
    }),

  /**
   * Obter detalhes de um pedido específico
   */
  getOrder: protectedProcedure
    .input(z.object({ orderId: z.number() }))
    .query(async ({ input }: any) => {
      // Mock data
      return {
        id: input.orderId,
        customerId: 1,
        customerName: "João Silva",
        customerPhone: "11999999999",
        customerEmail: "joao@email.com",
        items: [
          { id: 1, name: "Hambúrguer Premium", quantity: 2, price: 2340, notes: "Sem cebola" },
          { id: 2, name: "Refrigerante", quantity: 2, price: 800, notes: "" },
        ],
        subtotal: 3140,
        deliveryFee: 500,
        discount: 0,
        total: 3640,
        status: "preparing",
        paymentMethod: "pix",
        paymentStatus: "paid",
        address: "Rua A, 123, Apto 45",
        neighborhood: "Centro",
        city: "São Paulo",
        zipCode: "01234-567",
        createdAt: new Date(Date.now() - 15 * 60000),
        estimatedDelivery: new Date(Date.now() + 30 * 60000),
        timeline: [
          { status: "pending", timestamp: new Date(Date.now() - 15 * 60000), message: "Pedido recebido" },
          { status: "confirmed", timestamp: new Date(Date.now() - 14 * 60000), message: "Pedido confirmado" },
          { status: "preparing", timestamp: new Date(Date.now() - 10 * 60000), message: "Preparando pedido" },
        ],
      };
    }),

  /**
   * Atualizar status do pedido
   */
  updateOrderStatus: protectedProcedure
    .input(
      z.object({
        orderId: z.number(),
        status: z.enum(["pending", "confirmed", "preparing", "ready", "out_for_delivery", "delivered", "cancelled"]),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }: any) => {
      // Em produção, atualizar no banco de dados
      return {
        success: true,
        orderId: input.orderId,
        status: input.status,
        updatedAt: new Date(),
      };
    }),

  /**
   * Obter estatísticas de pedidos
   */
  getStats: protectedProcedure
    .input(z.object({ merchantId: z.number() }))
    .query(async ({ input }: any) => {
      return {
        total: 125,
        pending: 3,
        confirmed: 5,
        preparing: 8,
        ready: 2,
        outForDelivery: 1,
        delivered: 104,
        cancelled: 2,
        todayRevenue: 8770,
        averageDeliveryTime: 35,
      };
    }),
});
