import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  getCart,
  removeItem,
  clearCart,
  calculateTotals,
  setCoupon,
  clearCoupon,
  Coupon,
} from "@/lib/cart";
import { Link } from "wouter";
import { Trash2, Plus, Minus, Tag } from "lucide-react";
import PaymentPix from "@/components/PaymentPix";
import { genTxid } from "@/lib/pix";
import { sendWhatsAppText, msgDeliveryPin } from "@/lib/whatsapp";
import CouponInput from "@/components/CouponInput";

interface CartState {
  items: any[];
  coupon: Coupon | null;
}

interface Totals {
  subtotal: number;
  desconto: number;
  taxaEntrega: number;
  total: number;
  items: any[];
  coupon: Coupon | null;
}

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartState>({ items: [], coupon: null });
  const [totals, setTotals] = useState<Totals>({
    subtotal: 0,
    desconto: 0,
    taxaEntrega: 0,
    total: 0,
    items: [],
    coupon: null,
  });
  const [submitted, setSubmitted] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponList, setCouponList] = useState<Coupon[]>([]);
  const [shipFree, setShipFree] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [street, setStreet] = useState("");
  const [ref, setRef] = useState("");
  const [payMethod, setPayMethod] = useState<"pix" | "cash">("pix");
  const [pixOpen, setPixOpen] = useState(false);
  const [txid, setTxid] = useState(() => genTxid());

  useEffect(() => {
    setCart(getCart());
    setTotals(calculateTotals());

    // Carrega lista de cupons
    fetch("/api/coupons")
      .then((r) => r.json())
      .then(setCouponList)
      .catch(() => setCouponList([]));
  }, []);

  const handleRemoveItem = (id: string) => {
    removeItem(id);
    setCart(getCart());
    setTotals(calculateTotals());
  };

  const applyCoupon = () => {
    setCouponError("");
    const found = couponList.find(
      (c) => c.code.toUpperCase() === couponCode.trim().toUpperCase()
    );

    if (!found) {
      setCouponError("Cupom inválido. Tente novamente.");
      return;
    }

    if (found.type === "free_shipping") {
      setShipFree(true);
      clearCoupon();
      setCouponCode("");
      alert("Frete grátis aplicado!");
      return;
    }

    const updatedCart = setCoupon(found);
    setCart(updatedCart);
    setTotals(calculateTotals());
    setCouponCode("");
    alert("Cupom aplicado com sucesso!");
  };

  const removeCoupon = () => {
    setShipFree(false);
    clearCoupon();
    setCart(getCart());
    setTotals(calculateTotals());
  };

  const handleFinish = async () => {
    if (cart.items.length === 0) return;
    if (!street.trim()) {
      alert("Por favor, informe o endereço de entrega.");
      return;
    }

    try {
      const payload = {
        items: cart.items,
        total: totals.total,
        merchantId: cart.items[0]?.merchantId || null,
        client: { name: "Visitante" },
        address: { street, reference: ref },
        payment: { method: payMethod, txid: payMethod === "pix" ? txid : undefined, paid: false },
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar pedido");
      }

      const order = await response.json();
      
      // Enviar notificacao PIN via WhatsApp (mock - sem numero real)
      if (order.pinDelivery) {
        const trackingUrl = `${window.location.origin}/order/${order.id}`;
        const message = msgDeliveryPin({
          orderId: order.id,
          pin: order.pinDelivery,
          url: trackingUrl,
        });
        // Em producao, usar numero real do cliente
        await sendWhatsAppText({ to: "5512999999999", text: message });
      }
      
      clearCart();
      setCart(getCart());
      setTotals(calculateTotals());
      setSubmitted(true);

      setTimeout(() => {
        window.location.href = `/order/${order.id}`;
      }, 2000);
    } catch (error) {
      console.error("Erro ao finalizar pedido:", error);
      alert("Erro ao finalizar pedido. Tente novamente.");
    }
  };

  const formattedSubtotal = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "PYG",
    maximumFractionDigits: 0,
  }).format(totals.subtotal);

  const formattedDesconto = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "PYG",
    maximumFractionDigits: 0,
  }).format(totals.desconto);

  const formattedTaxa = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "PYG",
    maximumFractionDigits: 0,
  }).format(shipFree ? 0 : totals.taxaEntrega);

  const finalTotal = Math.max(0, totals.subtotal - totals.desconto) + (shipFree ? 0 : totals.taxaEntrega);
  const formattedTotal = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "PYG",
    maximumFractionDigits: 0,
  }).format(finalTotal);

  if (cart.items.length === 0 && !submitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-12 text-center">
          <p className="text-lg text-muted-foreground mb-6">
            Seu carrinho está vazio
          </p>
          <Link href="/">
            <button className="rounded-lg bg-primary px-6 py-2 font-medium text-primary-foreground hover:opacity-90">
              Voltar às lojas
            </button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="mb-4 text-5xl">✓</div>
            <h1 className="text-2xl font-bold mb-2">Pedido Criado!</h1>
            <p className="text-muted-foreground mb-6">
              Redirecionando para o tracking...
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Endereço e Pagamento */}
            <div className="lg:col-span-2 space-y-6">
              {/* Endereço */}
              <div className="rounded-2xl border border-border bg-card p-6">
                <h2 className="text-xl font-semibold mb-4">Endereço de Entrega</h2>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Rua e Número</label>
                    <input
                      type="text"
                      placeholder="Ex: Rua das Flores, 123"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Referência (opcional)</label>
                    <input
                      type="text"
                      placeholder="Ex: Próximo ao mercado"
                      value={ref}
                      onChange={(e) => setRef(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>
              </div>

              {/* Método de Pagamento */}
              <div className="rounded-2xl border border-border bg-card p-6">
                <h2 className="text-xl font-semibold mb-4">Método de Pagamento</h2>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted transition">
                    <input
                      type="radio"
                      name="payMethod"
                      value="pix"
                      checked={payMethod === "pix"}
                      onChange={(e) => setPayMethod(e.target.value as "pix" | "cash")}
                      className="w-4 h-4"
                    />
                    <span className="font-medium">PIX (QR Code)</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted transition">
                    <input
                      type="radio"
                      name="payMethod"
                      value="cash"
                      checked={payMethod === "cash"}
                      onChange={(e) => setPayMethod(e.target.value as "pix" | "cash")}
                      className="w-4 h-4"
                    />
                    <span className="font-medium">Dinheiro na Entrega</span>
                  </label>
                </div>

                {payMethod === "pix" && (
                  <div className="mt-4">
                    <button
                      onClick={() => setPixOpen(!pixOpen)}
                      className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
                    >
                      {pixOpen ? "Ocultar PIX" : "Mostrar PIX"}
                    </button>
                    {pixOpen && <PaymentPix amountBRL={0} txid={txid} />}
                  </div>
                )}
              </div>

              {/* Itens */}
              <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Itens do Pedido</h2>
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-border bg-card p-4 flex items-center justify-between"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.nome}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "PYG",
                        maximumFractionDigits: 0,
                      }).format(item.preco)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-muted rounded-lg px-2 py-1">
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-1 hover:bg-background rounded"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center font-medium">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => {
                          const result = require("@/lib/cart").addItem({
                            ...item,
                            qty: 1,
                          });
                          if (result?._error) alert(result._error);
                          else {
                            setCart(getCart());
                            setTotals(calculateTotals());
                          }
                        }}
                        className="p-1 hover:bg-background rounded"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <p className="font-semibold w-24 text-right">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "PYG",
                        maximumFractionDigits: 0,
                      }).format(item.preco * item.qty)}
                    </p>

                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Resumo e Cupons */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 rounded-2xl border border-border bg-card p-6 space-y-4">
                {/* Cupóm */}
                <div>
                  <label className="text-sm font-semibold flex items-center gap-2 mb-3">
                    <Tag className="h-4 w-4" />
                    Cupóm de Desconto
                  </label>
                  <CouponInput
                    orderTotal={totals.subtotal}
                    onCouponApplied={(coupon) => {
                      setCoupon({ code: coupon.code, value: coupon.discount, type: "percent" });
                      setCart(getCart());
                      setTotals(calculateTotals());
                    }}
                    onCouponRemoved={() => {
                      clearCoupon();
                      setCart(getCart());
                      setTotals(calculateTotals());
                    }}
                  />
                </div>

                {/* Totais */}
                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">{formattedSubtotal}</span>
                  </div>

                  {totals.desconto > 0 && (
                    <div className="flex justify-between text-sm text-primary">
                      <span>Desconto</span>
                      <span className="font-medium">-{formattedDesconto}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Taxa de entrega</span>
                    <span className="font-medium">{formattedTaxa}</span>
                  </div>

                  <div className="border-t border-border pt-2 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">{formattedTotal}</span>
                  </div>
                </div>

                <button
                  onClick={handleFinish}
                  className="w-full rounded-lg bg-primary px-4 py-3 font-medium text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  Finalizar Pedido
                </button>

                <Link href="/">
                  <button className="w-full rounded-lg border border-border px-4 py-3 font-medium hover:bg-muted transition-colors">
                    Continuar Comprando
                  </button>
                </Link>
              </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
