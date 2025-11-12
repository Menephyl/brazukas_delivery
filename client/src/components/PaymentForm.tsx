/**
 * Brazukas Delivery - PaymentForm Component
 * Componente para processar pagamentos com múltiplos métodos
 */

import { useState } from "react";
import { CreditCard, QrCode, FileText, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaymentFormProps {
  amount: number;
  orderId: string | number;
  onSuccess?: (transactionId: string) => void;
  onError?: (error: string) => void;
}

type PaymentMethod = "card" | "pix" | "boleto";

export default function PaymentForm({
  amount,
  orderId,
  onSuccess,
  onError,
}: PaymentFormProps) {
  const [method, setMethod] = useState<PaymentMethod>("card");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState("");

  // Card fields
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVC, setCardCVC] = useState("");
  const [installments, setInstallments] = useState(1);

  // PIX fields
  const [pixKey, setPixKey] = useState("");

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (method === "card" && (!cardNumber || !cardName || !cardExpiry || !cardCVC)) {
      onError?.("Preencha todos os campos do cartão");
      return;
    }

    setLoading(true);

    try {
      // Simular processamento de pagamento
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock: 95% de sucesso
      const paymentSuccess = Math.random() > 0.05;

      if (paymentSuccess) {
        const txnId = `txn_${Date.now()}`;
        setTransactionId(txnId);
        setSuccess(true);
        onSuccess?.(txnId);

        // Reset form after 3 seconds
        setTimeout(() => {
          setSuccess(false);
          setCardNumber("");
          setCardName("");
          setCardExpiry("");
          setCardCVC("");
          setPixKey("");
        }, 3000);
      } else {
        throw new Error("Falha ao processar pagamento. Tente novamente.");
      }
    } catch (error) {
      onError?.(error instanceof Error ? error.message : "Erro ao processar pagamento");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-8 text-center animate-slide-up">
        <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-green-900 mb-2">Pagamento Confirmado!</h3>
        <p className="text-green-800 mb-4">
          Seu pedido foi confirmado com sucesso.
        </p>
        <p className="text-sm text-green-700">
          ID da Transação: <span className="font-mono font-semibold">{transactionId}</span>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handlePayment} className="space-y-6">
      {/* Payment Method Selection */}
      <div>
        <h3 className="font-semibold mb-4">Método de Pagamento</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: "card", name: "Cartão", icon: CreditCard },
            { id: "pix", name: "PIX", icon: QrCode },
            { id: "boleto", name: "Boleto", icon: FileText },
          ].map(({ id, name, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setMethod(id as PaymentMethod)}
              className={`rounded-lg border-2 p-4 flex flex-col items-center gap-2 transition ${
                method === id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <Icon className="h-6 w-6" />
              <span className="text-sm font-medium">{name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Card Payment */}
      {method === "card" && (
        <div className="space-y-4 rounded-lg border border-border bg-card p-4">
          <div>
            <label className="block text-sm font-medium mb-2">Número do Cartão</label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) =>
                setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))
              }
              placeholder="0000 0000 0000 0000"
              disabled={loading}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Nome do Titular</label>
            <input
              type="text"
              value={cardName}
              onChange={(e) => setCardName(e.target.value.toUpperCase())}
              placeholder="JOÃO SILVA"
              disabled={loading}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-2">Validade</label>
              <input
                type="text"
                value={cardExpiry}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, "");
                  if (value.length >= 2) {
                    value = value.slice(0, 2) + "/" + value.slice(2, 4);
                  }
                  setCardExpiry(value);
                }}
                placeholder="MM/YY"
                disabled={loading}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">CVC</label>
              <input
                type="text"
                value={cardCVC}
                onChange={(e) => setCardCVC(e.target.value.replace(/\D/g, "").slice(0, 3))}
                placeholder="000"
                disabled={loading}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Parcelamento</label>
            <select
              value={installments}
              onChange={(e) => setInstallments(Number(e.target.value))}
              disabled={loading}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
            >
              {[1, 2, 3, 6, 12].map((n) => (
                <option key={n} value={n}>
                  {n}x de R$ {(amount / n).toFixed(2)}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* PIX Payment */}
      {method === "pix" && (
        <div className="space-y-4 rounded-lg border border-border bg-card p-4">
          <div className="text-center py-8">
            <QrCode className="h-24 w-24 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-4">
              Escaneie o código QR com seu celular para fazer o pagamento
            </p>
            <div className="bg-muted p-4 rounded-lg font-mono text-xs break-all">
              00020126580014br.gov.bcb.pix...
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Ou informe sua chave PIX</label>
            <input
              type="text"
              value={pixKey}
              onChange={(e) => setPixKey(e.target.value)}
              placeholder="seu-email@example.com ou CPF"
              disabled={loading}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
            />
          </div>
        </div>
      )}

      {/* Boleto Payment */}
      {method === "boleto" && (
        <div className="rounded-lg border border-border bg-card p-4 text-center">
          <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-3">
            Você receberá um boleto para pagar em até 3 dias úteis
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
            Taxa de R$ {(amount * 0.025).toFixed(2)} será adicionada
          </div>
        </div>
      )}

      {/* Amount Summary */}
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex justify-between mb-2">
          <span className="text-muted-foreground">Subtotal</span>
          <span>R$ {amount.toFixed(2)}</span>
        </div>
        {method === "boleto" && (
          <div className="flex justify-between mb-2 text-sm">
            <span className="text-muted-foreground">Taxa</span>
            <span>R$ {(amount * 0.025).toFixed(2)}</span>
          </div>
        )}
        <div className="border-t border-border pt-2 flex justify-between font-bold">
          <span>Total</span>
          <span className="text-primary">
            R$ {(method === "boleto" ? amount * 1.025 : amount).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-primary hover:bg-primary/90"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Processando...
          </>
        ) : (
          <>Confirmar Pagamento</>
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Seu pagamento é seguro e criptografado
      </p>
    </form>
  );
}
