/**
 * Brazukas Delivery - Mercado Pago Router
 * Integração com Mercado Pago para pagamentos com PIX e webhook
 */

import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import crypto from "crypto";

interface PaymentIntent {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  paymentMethod: "pix" | "credit_card" | "debit_card";
  qrCode?: string;
  qrCodeUrl?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Mock storage para payment intents
const mockPaymentIntents: Map<string, PaymentIntent> = new Map();

const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN || "test_token";
const MP_WEBHOOK_SECRET = process.env.MP_WEBHOOK_SECRET || "test_secret";

/**
 * Gera QR Code PIX mock (em produção, usar API real do Mercado Pago)
 */
function generateMockQRCode(amount: number): { qrCode: string; qrCodeUrl: string } {
  const qrCode = `00020126580014br.gov.bcb.pix0136${crypto.randomUUID()}52040000530398654061${amount.toFixed(2)}5802BR5913Brazukas6009Sao Paulo62410503***63047E5D`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrCode)}`;

  return { qrCode, qrCodeUrl };
}

export const mercadopagoRouter = router({
  /**
   * Create payment intent for PIX
   */
  createPaymentIntent: publicProcedure
    .input(
      z.object({
        orderId: z.string(),
        amount: z.number().positive(),
        currency: z.string().default("BRL"),
        paymentMethod: z.enum(["pix", "credit_card", "debit_card"]).default("pix"),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const intentId = `pi_${Date.now()}`;

        let qrCode: string | undefined;
        let qrCodeUrl: string | undefined;

        // Generate PIX QR Code
        if (input.paymentMethod === "pix") {
          const { qrCode: code, qrCodeUrl: url } = generateMockQRCode(input.amount);
          qrCode = code;
          qrCodeUrl = url;
        }

        const intent: PaymentIntent = {
          id: intentId,
          orderId: input.orderId,
          amount: input.amount,
          currency: input.currency,
          status: "pending",
          paymentMethod: input.paymentMethod,
          qrCode,
          qrCodeUrl,
          expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        mockPaymentIntents.set(intentId, intent);

        return {
          success: true,
          paymentIntent: intent,
          clientSecret: intentId,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Falha ao criar intenção de pagamento",
        });
      }
    }),

  /**
   * Get payment intent status
   */
  getPaymentIntent: publicProcedure
    .input(z.object({ intentId: z.string() }))
    .query(async ({ input }) => {
      const intent = mockPaymentIntents.get(input.intentId);

      if (!intent) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Intenção de pagamento não encontrada",
        });
      }

      return intent;
    }),

  /**
   * Confirm payment (in production, this would be called by webhook)
   */
  confirmPayment: publicProcedure
    .input(
      z.object({
        intentId: z.string(),
        paymentToken: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const intent = mockPaymentIntents.get(input.intentId);

      if (!intent) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Intenção de pagamento não encontrada",
        });
      }

      // Simulate payment confirmation
      intent.status = "approved";
      intent.updatedAt = new Date().toISOString();
      mockPaymentIntents.set(input.intentId, intent);

      return {
        success: true,
        paymentIntent: intent,
      };
    }),

  /**
   * Cancel payment
   */
  cancelPayment: publicProcedure
    .input(z.object({ intentId: z.string() }))
    .mutation(async ({ input }) => {
      const intent = mockPaymentIntents.get(input.intentId);

      if (!intent) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Intenção de pagamento não encontrada",
        });
      }

      intent.status = "cancelled";
      intent.updatedAt = new Date().toISOString();
      mockPaymentIntents.set(input.intentId, intent);

      return {
        success: true,
      };
    }),

  /**
   * Get payment methods
   */
  getPaymentMethods: publicProcedure.query(async () => {
    return {
      methods: [
        {
          id: "pix",
          name: "PIX",
          description: "Transferência instantânea",
          icon: "💳",
          enabled: true,
        },
        {
          id: "credit_card",
          name: "Cartão de Crédito",
          description: "Parcelado até 12x",
          icon: "💳",
          enabled: true,
        },
        {
          id: "debit_card",
          name: "Cartão de Débito",
          description: "Débito imediato",
          icon: "💳",
          enabled: true,
        },
      ],
    };
  }),

  /**
   * Get transaction history
   */
  getTransactionHistory: publicProcedure
    .input(
      z.object({
        limit: z.number().default(10),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      const transactions = Array.from(mockPaymentIntents.values())
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(input.offset, input.offset + input.limit);

      return {
        transactions,
        total: mockPaymentIntents.size,
      };
    }),

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature: publicProcedure
    .input(
      z.object({
        signature: z.string(),
        timestamp: z.string(),
        payload: z.string(),
      })
    )
    .query(async ({ input }) => {
      // In production, verify against MP_WEBHOOK_SECRET
      const expectedSignature = crypto
        .createHmac("sha256", MP_WEBHOOK_SECRET)
        .update(`${input.timestamp}.${input.payload}`)
        .digest("hex");

      const isValid = expectedSignature === input.signature;

      return {
        valid: isValid,
      };
    }),
});
