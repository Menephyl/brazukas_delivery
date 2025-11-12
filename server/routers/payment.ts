/**
 * Brazukas Delivery - Payment Router
 * Rotas tRPC para integração com gateway de pagamento (Stripe, Mercado Pago, PayPal)
 */

import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";

interface PaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status: "pending" | "succeeded" | "failed";
}

// Mock storage para payment intents
const mockPaymentIntents: Map<string, PaymentIntent> = new Map();

export const paymentRouter = router({
  /**
   * Create payment intent for order
   */
  createPaymentIntent: publicProcedure
    .input(
      z.object({
        orderId: z.string().or(z.number()),
        amount: z.number().min(0.01),
        currency: z.string().default("BRL"),
        paymentMethod: z.enum(["card", "pix", "boleto"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      // Simular criação de payment intent
      await new Promise((resolve) => setTimeout(resolve, 800));

      const paymentIntentId = `pi_${Date.now()}`;
      const clientSecret = `${paymentIntentId}_secret_${Math.random().toString(36).substr(2, 9)}`;

      const intent: PaymentIntent = {
        id: paymentIntentId,
        clientSecret,
        amount: input.amount,
        currency: input.currency,
        status: "pending",
      };

      mockPaymentIntents.set(paymentIntentId, intent);

      return {
        paymentIntentId,
        clientSecret,
        amount: input.amount,
        currency: input.currency,
        paymentMethod: input.paymentMethod || "card",
      };
    }),

  /**
   * Confirm payment
   */
  confirmPayment: publicProcedure
    .input(
      z.object({
        paymentIntentId: z.string(),
        paymentMethod: z.enum(["card", "pix", "boleto"]),
        cardToken: z.string().optional(),
        pixKey: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const intent = mockPaymentIntents.get(input.paymentIntentId);

      if (!intent) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Payment intent não encontrado",
        });
      }

      // Simular processamento de pagamento
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock: 95% de sucesso
      const success = Math.random() > 0.05;

      if (success) {
        intent.status = "succeeded";
        mockPaymentIntents.set(input.paymentIntentId, intent);

        return {
          success: true,
          status: "succeeded",
          transactionId: `txn_${Date.now()}`,
          message: "Pagamento confirmado com sucesso!",
        };
      } else {
        intent.status = "failed";
        mockPaymentIntents.set(input.paymentIntentId, intent);

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Falha ao processar pagamento. Tente novamente.",
        });
      }
    }),

  /**
   * Get payment methods available
   */
  getPaymentMethods: publicProcedure.query(async () => {
    return {
      methods: [
        {
          id: "card",
          name: "Cartão de Crédito",
          icon: "💳",
          description: "Visa, Mastercard, Elo",
          installments: [1, 2, 3, 6, 12],
        },
        {
          id: "pix",
          name: "PIX",
          icon: "🔑",
          description: "Transferência instantânea",
          fee: 0,
        },
        {
          id: "boleto",
          name: "Boleto Bancário",
          icon: "📄",
          description: "Pagamento até 3 dias úteis",
          fee: 2.5,
        },
      ],
    };
  }),

  /**
   * Get payment status
   */
  getPaymentStatus: publicProcedure
    .input(z.object({ paymentIntentId: z.string() }))
    .query(async ({ input }) => {
      const intent = mockPaymentIntents.get(input.paymentIntentId);

      if (!intent) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Payment intent não encontrado",
        });
      }

      return {
        status: intent.status,
        amount: intent.amount,
        currency: intent.currency,
        createdAt: new Date().toISOString(),
      };
    }),

  /**
   * Process refund
   */
  processRefund: publicProcedure
    .input(
      z.object({
        paymentIntentId: z.string(),
        amount: z.number().optional(),
        reason: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const intent = mockPaymentIntents.get(input.paymentIntentId);

      if (!intent) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Payment intent não encontrado",
        });
      }

      if (intent.status !== "succeeded") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Apenas pagamentos confirmados podem ser reembolsados",
        });
      }

      // Simular processamento de reembolso
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const refundAmount = input.amount || intent.amount;

      return {
        success: true,
        refundId: `ref_${Date.now()}`,
        amount: refundAmount,
        status: "processed",
        message: "Reembolso processado com sucesso",
      };
    }),

  /**
   * Get transaction history
   */
  getTransactionHistory: publicProcedure
    .input(
      z.object({
        userId: z.string().or(z.number()),
        limit: z.number().default(10),
      })
    )
    .query(async () => {
      // Mock transaction history
      const transactions = [
        {
          id: "txn_1",
          amount: 89.9,
          status: "succeeded",
          method: "card",
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          orderId: "order_1",
        },
        {
          id: "txn_2",
          amount: 45.5,
          status: "succeeded",
          method: "pix",
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          orderId: "order_2",
        },
        {
          id: "txn_3",
          amount: 120,
          status: "succeeded",
          method: "card",
          date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          orderId: "order_3",
        },
      ];

      return {
        transactions: transactions.slice(0, 10),
        total: transactions.length,
      };
    }),

  /**
   * Save payment method for future use
   */
  savePaymentMethod: publicProcedure
    .input(
      z.object({
        userId: z.string().or(z.number()),
        type: z.enum(["card", "pix", "boleto"]),
        token: z.string(),
        lastFour: z.string().optional(),
        expiryMonth: z.number().optional(),
        expiryYear: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      // Simular salvamento de método de pagamento
      await new Promise((resolve) => setTimeout(resolve, 500));

      return {
        success: true,
        paymentMethodId: `pm_${Date.now()}`,
        type: input.type,
        lastFour: input.lastFour,
        message: "Método de pagamento salvo com sucesso",
      };
    }),

  /**
   * Get saved payment methods
   */
  getSavedPaymentMethods: publicProcedure
    .input(z.object({ userId: z.string().or(z.number()) }))
    .query(async () => {
      // Mock saved payment methods
      return {
        methods: [
          {
            id: "pm_1",
            type: "card",
            lastFour: "4242",
            expiryMonth: 12,
            expiryYear: 2025,
            brand: "Visa",
          },
          {
            id: "pm_2",
            type: "pix",
            key: "seu-email@example.com",
          },
        ],
      };
    }),
});
