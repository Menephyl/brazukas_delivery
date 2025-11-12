/**
 * Brazukas Delivery - Coupons Page
 * Página com cupons disponíveis para o usuário
 */

import { useState, useEffect } from "react";
import { Copy, Check, Tag, Calendar, DollarSign } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { fetchAvailableCoupons, formatCouponDescription, getCouponStatus } from "@/lib/coupons";
import type { Coupon } from "@/lib/coupons";

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    setLoading(true);
    try {
      const available = await fetchAvailableCoupons();
      setCoupons(available);
    } catch (error) {
      console.error("Erro ao carregar cupons:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getDaysUntilExpiry = (expiresAt?: string): number | null => {
    if (!expiresAt) return null;
    const expiresDate = new Date(expiresAt);
    const now = new Date();
    return Math.floor((expiresDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="py-12 sm:py-16">
          <div className="container">
            <div className="mb-12">
              <h1 className="text-3xl sm:text-4xl font-bold mb-3">Cupons Disponíveis</h1>
              <p className="text-muted-foreground text-lg">
                Aproveite nossas promoções e economize em seus pedidos
              </p>
            </div>

            {loading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-48 rounded-lg bg-muted animate-pulse" />
                ))}
              </div>
            ) : coupons.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {coupons.map((coupon) => {
                  const status = getCouponStatus(coupon);
                  const daysUntilExpiry = getDaysUntilExpiry(coupon.expiresAt);

                  return (
                    <div
                      key={coupon.id}
                      className="rounded-lg border border-border bg-card p-6 hover:shadow-md transition animate-fade-in"
                    >
                      {/* Header */}
                      <div className="mb-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Tag className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-mono font-bold text-lg">{coupon.code}</p>
                              <p className="text-xs text-muted-foreground">Código do cupom</p>
                            </div>
                          </div>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              status.status === "active"
                                ? "bg-green-100 text-green-800"
                                : status.status === "expiring"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {status.message}
                          </span>
                        </div>
                      </div>

                      {/* Descrição */}
                      {coupon.description && (
                        <p className="text-sm text-muted-foreground mb-4">{coupon.description}</p>
                      )}

                      {/* Desconto */}
                      <div className="mb-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
                        <p className="text-xs text-muted-foreground mb-1">Desconto</p>
                        <p className="text-xl font-bold text-primary">
                          {formatCouponDescription(coupon)}
                        </p>
                      </div>

                      {/* Detalhes */}
                      <div className="space-y-2 mb-4 text-sm">
                        {coupon.minOrderValue > 0 && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <DollarSign className="h-4 w-4" />
                            <span>Mínimo: R$ {coupon.minOrderValue.toFixed(2)}</span>
                          </div>
                        )}

                        {daysUntilExpiry !== null && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {daysUntilExpiry === 0
                                ? "Expira hoje"
                                : `Expira em ${daysUntilExpiry} dia(s)`}
                            </span>
                          </div>
                        )}

                        {coupon.maxUses && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <span className="text-xs">
                              {coupon.usedCount}/{coupon.maxUses} usos
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Copy Button */}
                      <button
                        onClick={() => handleCopyCoupon(coupon.code)}
                        className={`w-full rounded-lg px-4 py-2 font-medium transition-all flex items-center justify-center gap-2 ${
                          copiedCode === coupon.code
                            ? "bg-green-100 text-green-700"
                            : "bg-primary/10 text-primary hover:bg-primary/20"
                        }`}
                      >
                        {copiedCode === coupon.code ? (
                          <>
                            <Check className="h-4 w-4" />
                            Copiado!
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" />
                            Copiar Código
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-border p-12 text-center">
                <Tag className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-lg font-semibold mb-2">Nenhum cupom disponível</p>
                <p className="text-muted-foreground">
                  Volte mais tarde para conferir nossas promoções
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
