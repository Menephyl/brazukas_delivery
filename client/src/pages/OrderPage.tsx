import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { Order, STATUS_LABELS, STATUS_COLORS } from "@/lib/order-types";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Truck, MapPin, Clock, CheckCircle, Download, Lock } from "lucide-react";
import { Link } from "wouter";

const STATUS_ICONS: Record<string, React.ReactNode> = {
  PAID: <Clock className="h-5 w-5" />,
  CONFIRMED: <CheckCircle className="h-5 w-5" />,
  ASSIGNED: <Truck className="h-5 w-5" />,
  PICKED_UP: <MapPin className="h-5 w-5" />,
  DELIVERED: <CheckCircle className="h-5 w-5" />,
};

export default function OrderPage() {
  const [, params] = useRoute("/order/:id");
  const orderId = params?.id;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;

    let alive = true;

    async function fetchOrder() {
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        if (!response.ok) throw new Error("Pedido não encontrado");
        const data = await response.json();
        if (alive) {
          setOrder(data);
          setError(null);
        }
      } catch (err) {
        if (alive) {
          setError(err instanceof Error ? err.message : "Erro ao carregar pedido");
        }
      } finally {
        if (alive) setLoading(false);
      }
    }

    fetchOrder();
    const interval = setInterval(fetchOrder, 2000);

    return () => {
      alive = false;
      clearInterval(interval);
    };
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-8">
          <div className="h-10 w-1/3 bg-muted animate-pulse rounded mb-8" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-8 text-center">
          <p className="text-red-600 mb-4">{error || "Pedido não encontrado"}</p>
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

  const formattedTotal = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "PYG",
    maximumFractionDigits: 0,
  }).format(order.total);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container py-8">
          <div className="mb-8">
            <Link href="/">
              <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                ← Voltar às lojas
              </button>
            </Link>
          </div>

          <h1 className="text-3xl font-bold mb-8">Pedido #{order.id}</h1>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Status Atual */}
            <div className="lg:col-span-2 space-y-6">
              {/* Status Card */}
              <div className="rounded-2xl border border-border bg-card p-6">
                <h2 className="text-lg font-semibold mb-4">Status Atual</h2>
                <div className={`inline-block rounded-lg px-4 py-2 ${STATUS_COLORS[order.status]}`}>
                  {STATUS_LABELS[order.status]}
                </div>

                {order.etaMin && (
                  <div className="mt-4 flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-5 w-5" />
                    <span>ETA estimado: ~{order.etaMin} minutos</span>
                  </div>
                )}

                {order.driver && (
                  <div className="mt-4 rounded-lg bg-muted p-4">
                    <h3 className="font-semibold mb-2">Informações do Entregador</h3>
                    <p className="text-sm">
                      <span className="font-medium">{order.driver.nome}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">{order.driver.veiculo}</p>
                  </div>
                )}
              </div>

              {/* Itens */}
              <div className="rounded-2xl border border-border bg-card p-6">
                <h2 className="text-lg font-semibold mb-4">Itens do Pedido</h2>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between pb-3 border-b border-border last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium">{item.nome}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.qty}x {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "PYG",
                            maximumFractionDigits: 0,
                          }).format(item.preco)}
                        </p>
                      </div>
                      <p className="font-semibold">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "PYG",
                          maximumFractionDigits: 0,
                        }).format(item.preco * item.qty)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 border-t border-border pt-4 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">{formattedTotal}</span>
                </div>
              </div>
              {/* Informações do Pedido */}
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Informações</h2>
                  <a
                    href={`/api/orders/${orderId}/pdf`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-primary hover:opacity-80 transition-opacity"
                  >
                    <Download className="h-4 w-4" />
                    PDF
                  </a>
                </div>
                {/* Mapa estático simulado */}
                <div className="h-48 w-full overflow-hidden rounded-xl bg-gradient-to-br from-muted to-muted-foreground/20" />

                {/* Barra de progresso baseada no status */}
                <div className="mt-4">
                  <div className="mb-2 flex justify-between text-xs text-muted-foreground">
                    <span>Pago</span>
                    <span>Confirmado</span>
                    <span>Em rota</span>
                    <span>Retirado</span>
                    <span>Entregue</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-2 rounded-full bg-primary transition-all duration-500"
                      style={{
                        width:
                          order.status === "PAID"
                            ? "20%"
                            : order.status === "CONFIRMED"
                              ? "40%"
                              : order.status === "ASSIGNED"
                                ? "60%"
                                : order.status === "PICKED_UP"
                                  ? "80%"
                                  : "100%",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="rounded-2xl border border-border bg-card p-6">
                <h2 className="text-lg font-semibold mb-4">Linha do Tempo</h2>
                <div className="space-y-4">
                  {order.timeline.map((event, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          {STATUS_ICONS[event.type] || <CheckCircle className="h-5 w-5" />}
                        </div>
                        {idx < order.timeline.length - 1 && (
                          <div className="h-8 w-0.5 bg-border mt-2" />
                        )}
                      </div>
                      <div className="pt-2">
                        <p className="font-medium">{STATUS_LABELS[event.type]}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(event.ts).toLocaleString("pt-BR")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Resumo Lateral */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 rounded-2xl border border-border bg-card p-6">
                <h2 className="text-lg font-semibold mb-4">Resumo</h2>

                <div className="space-y-3 mb-4 pb-4 border-b border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Itens</span>
                    <span className="font-medium">
                      {order.items.reduce((sum, item) => sum + item.qty, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Data</span>
                    <span className="font-medium">
                      {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                </div>

                <div className="mb-6 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">{formattedTotal}</span>
                </div>

                {order.pinDelivery && order.status !== "DELIVERED" && (
                  <div className="mb-4 rounded-lg bg-blue-50 border border-blue-200 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Lock className="h-4 w-4 text-blue-600" />
                      <p className="text-xs font-medium text-blue-600">PIN DE ENTREGA</p>
                    </div>
                    <p className="text-2xl font-bold text-blue-600 text-center tracking-widest">
                      {order.pinDelivery}
                    </p>
                    <p className="text-xs text-blue-600 text-center mt-2">
                      Compartilhe com o entregador
                    </p>
                  </div>
                )}

                <Link href="/">
                  <button className="w-full rounded-lg border border-border px-4 py-3 font-medium hover:bg-muted transition-colors">
                    Fazer Novo Pedido
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
