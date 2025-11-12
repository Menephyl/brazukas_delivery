/**
 * Brazukas Delivery - CouponInput Component
 * Componente para aplicar cupons de desconto
 */

import { useState } from "react";
import { X, Check, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CouponInputProps {
  orderTotal: number;
  onCouponApplied?: (coupon: {
    code: string;
    discount: number;
    finalTotal: number;
  }) => void;
  onCouponRemoved?: () => void;
}

export default function CouponInput({
  orderTotal,
  onCouponApplied,
  onCouponRemoved,
}: CouponInputProps) {
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
    finalTotal: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setError("Digite um código de cupom");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      // Simular chamada à API
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock validation
      const validCoupons: Record<string, { discount: number; type: string }> = {
        PROMO20: { discount: (orderTotal * 20) / 100, type: "percentage" },
        DESCONTO10: { discount: 10, type: "fixed" },
        FRETE5: { discount: 5, type: "fixed" },
        PRIMEIRA15: { discount: (orderTotal * 15) / 100, type: "percentage" },
      };

      const coupon = validCoupons[couponCode.toUpperCase()];

      if (!coupon) {
        setError("Cupom não encontrado");
        setLoading(false);
        return;
      }

      const discount = Math.min(coupon.discount, orderTotal);
      const finalTotal = orderTotal - discount;

      const appliedData = {
        code: couponCode.toUpperCase(),
        discount,
        finalTotal,
      };

      setAppliedCoupon(appliedData);
      setSuccess(true);
      setCouponCode("");
      onCouponApplied?.(appliedData);

      // Auto-hide success message
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao aplicar cupom");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setError("");
    setSuccess(false);
    onCouponRemoved?.();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleApplyCoupon();
    }
  };

  if (appliedCoupon) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-4 animate-slide-up">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-green-900">Cupom aplicado!</p>
              <p className="text-sm text-green-800 mt-1">
                Código: <span className="font-mono font-bold">{appliedCoupon.code}</span>
              </p>
              <p className="text-sm text-green-800">
                Desconto: <span className="font-bold">R$ {appliedCoupon.discount.toFixed(2)}</span>
              </p>
            </div>
          </div>
          <button
            onClick={handleRemoveCoupon}
            className="text-green-600 hover:text-green-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="flex-1">
          <input
            type="text"
            value={couponCode}
            onChange={(e) => {
              setCouponCode(e.target.value.toUpperCase());
              setError("");
            }}
            onKeyPress={handleKeyPress}
            placeholder="Digite o código do cupom"
            disabled={loading}
            className="w-full px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          />
        </div>
        <Button
          onClick={handleApplyCoupon}
          disabled={loading || !couponCode.trim()}
          className="bg-primary hover:bg-primary/90"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Aplicar"
          )}
        </Button>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 animate-slide-up">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 p-3 animate-slide-up">
          <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-green-700">Cupom aplicado com sucesso!</p>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Cupons disponíveis: PROMO20, DESCONTO10, FRETE5, PRIMEIRA15
      </p>
    </div>
  );
}
