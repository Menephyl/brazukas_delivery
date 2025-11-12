/**
 * Brazukas Delivery - Merchant Analytics Router
 * Rotas tRPC para análise de dados e métricas do comerciante
 */

import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";

export const merchantAnalyticsRouter = router({
  /**
   * Obter resumo de vendas por período
   */
  getSalesSummary: protectedProcedure
    .input(
      z.object({
        merchantId: z.number(),
        period: z.enum(["today", "week", "month", "year"]),
      })
    )
    .query(async ({ input }: any) => {
      // Mock data
      const periods: Record<string, any> = {
        today: {
          totalOrders: 12,
          totalRevenue: 1250.5,
          averageOrderValue: 104.21,
          conversionRate: 8.5,
          previousPeriod: {
            totalOrders: 10,
            totalRevenue: 950.0,
          },
        },
        week: {
          totalOrders: 87,
          totalRevenue: 9250.75,
          averageOrderValue: 106.33,
          conversionRate: 7.2,
          previousPeriod: {
            totalOrders: 82,
            totalRevenue: 8500.0,
          },
        },
        month: {
          totalOrders: 342,
          totalRevenue: 38500.25,
          averageOrderValue: 112.57,
          conversionRate: 6.8,
          previousPeriod: {
            totalOrders: 298,
            totalRevenue: 32500.0,
          },
        },
        year: {
          totalOrders: 4200,
          totalRevenue: 485000.0,
          averageOrderValue: 115.48,
          conversionRate: 6.5,
          previousPeriod: {
            totalOrders: 3500,
            totalRevenue: 385000.0,
          },
        },
      };

      const data = periods[input.period];
      const growth = {
        orders: (((data.totalOrders - data.previousPeriod.totalOrders) / data.previousPeriod.totalOrders) * 100).toFixed(1),
        revenue: (((data.totalRevenue - data.previousPeriod.totalRevenue) / data.previousPeriod.totalRevenue) * 100).toFixed(1),
      };

      return {
        ...data,
        growth,
      };
    }),

  /**
   * Obter dados de vendas por dia (para gráfico)
   */
  getDailySalesChart: protectedProcedure
    .input(
      z.object({
        merchantId: z.number(),
        days: z.number().default(30),
      })
    )
    .query(async ({ input }: any) => {
      // Mock data for chart
      const data = [];
      for (let i = input.days; i > 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        data.push({
          date: date.toISOString().split("T")[0],
          orders: Math.floor(Math.random() * 20) + 5,
          revenue: Math.floor(Math.random() * 2000) + 500,
        });
      }
      return data;
    }),

  /**
   * Obter produtos mais vendidos
   */
  getTopProducts: protectedProcedure
    .input(
      z.object({
        merchantId: z.number(),
        limit: z.number().default(10),
        period: z.enum(["today", "week", "month"]).default("week"),
      })
    )
    .query(async ({ input }: any) => {
      // Mock data
      const products = [
        { id: 1, name: "Hambúrguer Clássico", sales: 45, revenue: 450.0, rating: 4.8 },
        { id: 2, name: "Batata Frita Grande", sales: 38, revenue: 190.0, rating: 4.6 },
        { id: 3, name: "Refrigerante 2L", sales: 35, revenue: 140.0, rating: 4.5 },
        { id: 4, name: "Sanduíche de Frango", sales: 32, revenue: 320.0, rating: 4.7 },
        { id: 5, name: "Milkshake Morango", sales: 28, revenue: 280.0, rating: 4.9 },
        { id: 6, name: "Combo Completo", sales: 25, revenue: 500.0, rating: 4.8 },
        { id: 7, name: "Sorvete de Chocolate", sales: 22, revenue: 110.0, rating: 4.4 },
        { id: 8, name: "Água Mineral", sales: 20, revenue: 40.0, rating: 4.3 },
        { id: 9, name: "Suco Natural", sales: 18, revenue: 90.0, rating: 4.6 },
        { id: 10, name: "Sobremesa Especial", sales: 15, revenue: 225.0, rating: 4.9 },
      ];

      return products.slice(0, input.limit);
    }),

  /**
   * Obter dados de desempenho por hora
   */
  getHourlyPerformance: protectedProcedure
    .input(z.object({ merchantId: z.number() }))
    .query(async ({ input }: any) => {
      // Mock data for hourly performance
      const hours = [];
      for (let i = 0; i < 24; i++) {
        hours.push({
          hour: `${i.toString().padStart(2, "0")}:00`,
          orders: Math.floor(Math.random() * 10) + 1,
          revenue: Math.floor(Math.random() * 500) + 100,
        });
      }
      return hours;
    }),

  /**
   * Obter taxa de conversão
   */
  getConversionMetrics: protectedProcedure
    .input(
      z.object({
        merchantId: z.number(),
        period: z.enum(["today", "week", "month"]).default("week"),
      })
    )
    .query(async ({ input }: any) => {
      return {
        totalVisits: 1250,
        totalOrders: 87,
        conversionRate: 6.96,
        averageSessionDuration: 4.5, // minutos
        bounceRate: 32.5,
        repeatCustomerRate: 28.3,
      };
    }),

  /**
   * Obter dados de clientes
   */
  getCustomerMetrics: protectedProcedure
    .input(
      z.object({
        merchantId: z.number(),
        period: z.enum(["today", "week", "month"]).default("month"),
      })
    )
    .query(async ({ input }: any) => {
      return {
        totalCustomers: 234,
        newCustomers: 12,
        returningCustomers: 75,
        averageCustomerValue: 165.25,
        customerSatisfaction: 4.7,
        churnRate: 5.2,
      };
    }),

  /**
   * Obter dados de pagamentos
   */
  getPaymentMetrics: protectedProcedure
    .input(
      z.object({
        merchantId: z.number(),
        period: z.enum(["today", "week", "month"]).default("week"),
      })
    )
    .query(async ({ input }: any) => {
      return {
        totalTransactions: 87,
        pixTransactions: 45,
        moneyTransactions: 42,
        cardTransactions: 0,
        averageTransactionValue: 106.33,
        failedTransactions: 2,
        successRate: 97.7,
      };
    }),

  /**
   * Obter dados de entrega
   */
  getDeliveryMetrics: protectedProcedure
    .input(
      z.object({
        merchantId: z.number(),
        period: z.enum(["today", "week", "month"]).default("week"),
      })
    )
    .query(async ({ input }: any) => {
      return {
        totalDeliveries: 87,
        onTimeDeliveries: 82,
        lateDeliveries: 5,
        averageDeliveryTime: 32.5, // minutos
        averageDeliveryDistance: 4.2, // km
        onTimeRate: 94.25,
      };
    }),

  /**
   * Exportar relatório em CSV
   */
  exportReport: protectedProcedure
    .input(
      z.object({
        merchantId: z.number(),
        period: z.enum(["today", "week", "month"]),
        format: z.enum(["csv", "pdf"]).default("csv"),
      })
    )
    .mutation(async ({ input }: any) => {
      return {
        success: true,
        fileUrl: `/reports/merchant_${input.merchantId}_${input.period}.${input.format}`,
        fileName: `relatorio_vendas_${input.period}.${input.format}`,
        generatedAt: new Date(),
      };
    }),
});
