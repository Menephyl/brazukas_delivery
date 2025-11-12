import { useEffect, useState, useMemo } from "react";
import { useLocation } from "wouter";
import { Order, STATUS_LABELS, STATUS_COLORS } from "@/lib/order-types";
import { Driver } from "@/lib/drivers-mock";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AlertCircle, CheckCircle, Clock, Download } from "lucide-react";
import { Link } from "wouter";

const FLOW = ["PAID", "CONFIRMED", "ASSIGNED", "PICKED_UP", "DELIVERED"];

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [etaDraft, setEtaDraft] = useState<Record<string, string>>({});
  const [drvSelect, setDrvSelect] = useState<Record<string, string>>({});
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [, setLocation] = useLocation();

  // 🔒 Proteção simples (DEV)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("bz_admin_token");
    if (!token) {
      setLocation("/admin/login");
    }
  }, [setLocation]);

  const driverMap = useMemo(() => {
    const m: Record<string, Driver> = {};
    drivers.forEach((d) => (m[d.id] = d));
    return m;
  }, [drivers]);

  async function load() {
    try {
      const [ordersRes, driversRes] = await Promise.all([
        fetch("/api/orders"),
        fetch("/api/drivers"),
      ]);

      if (!ordersRes.ok || !driversRes.ok) throw new Error("Erro ao carregar dados");

      const ordersData = await ordersRes.json();
      const driversData = await driversRes.json();

      setOrders(ordersData);
      setDrivers(driversData);
      setLoading(false);
    } catch (err) {
      console.error("Erro ao carregar:", err);
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, 1500);
    return () => clearInterval(interval);
  }, []);

  async function advance(order: Order) {
    setError("");
    const idx = FLOW.indexOf(order.status as any);
    const next = FLOW[Math.min(idx + 1, FLOW.length - 1)];

    try {
      const response = await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data?.error || "Erro ao avançar status");
        return;
      }

      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao avançar status");
    }
  }

  async function doAssign(order: Order) {
    setError("");
    const chosenId = drvSelect[order.id];
    const drv = drivers.find((d) => d.id === chosenId);

    if (!drv) {
      setError("Selecione um entregador.");
      return;
    }

    try {
      const response = await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "assign_driver", driver: drv }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data?.error || "Erro ao atribuir entregador");
        return;
      }

      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atribuir entregador");
    }
  }

  async function saveEta(order: Order) {
    setError("");
    const eta = Number(etaDraft[order.id]);

    if (!Number.isFinite(eta) || eta <= 0) {
      setError("Informe um ETA válido (minutos).");
      return;
    }

    try {
      const response = await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "set_eta", etaMin: eta }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data?.error || "Erro ao definir ETA");
        return;
      }

      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao definir ETA");
    }
  }

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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container py-8">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold">Painel Admin — Pedidos</h1>
            <Link href="/">
              <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                ← Voltar
              </button>
            </Link>
          </div>

          {/* Links de navegação */}
          <div className="mb-6 grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Link href="/admin/health" className="rounded-lg border border-border bg-card p-4 hover:shadow-md transition">
              <div className="text-sm font-semibold text-green-700">🏥 Health</div>
              <div className="text-xs text-muted-foreground">Status do sistema</div>
            </Link>
            <Link href="/admin/logs" className="rounded-lg border border-border bg-card p-4 hover:shadow-md transition">
              <div className="text-sm font-semibold text-green-700">📋 Logs</div>
              <div className="text-xs text-muted-foreground">Histórico de erros</div>
            </Link>
            <Link href="/admin/metrics" className="rounded-lg border border-border bg-card p-4 hover:shadow-md transition">
              <div className="text-sm font-semibold text-green-700">📊 Métricas</div>
              <div className="text-xs text-muted-foreground">KPIs e gráficos</div>
            </Link>
            <Link href="/admin/metrics-advanced" className="rounded-lg border border-border bg-card p-4 hover:shadow-md transition">
              <div className="text-sm font-semibold text-green-700">📈 Ranking</div>
              <div className="text-xs text-muted-foreground">SLA e exportação</div>
            </Link>
            <Link href="/admin/reconciliation" className="rounded-lg border border-border bg-card p-4 hover:shadow-md transition">
              <div className="text-sm font-semibold text-green-700">💰 Reconciliação</div>
              <div className="text-xs text-muted-foreground">Pagamentos PIX</div>
            </Link>
            <Link href="/driver" className="rounded-lg border border-border bg-card p-4 hover:shadow-md transition">
              <div className="text-sm font-semibold text-green-700">🚗 App Entregador</div>
              <div className="text-xs text-muted-foreground">Painel de rotas</div>
            </Link>
          </div>

          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 flex gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {orders.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center">
              <Clock className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-lg font-medium text-muted-foreground">
                Nenhum pedido no momento
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-2xl border border-border bg-card p-6"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">Pedido #{order.id}</h3>
                      <div className={`mt-2 inline-block rounded-lg px-3 py-1 text-sm ${STATUS_COLORS[order.status]}`}>
                        {STATUS_LABELS[order.status]}
                      </div>

                      {order.etaMin && (
                        <p className="mt-2 text-sm text-muted-foreground">
                          ETA: ~{order.etaMin} min
                        </p>
                      )}

                      {order.driver && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          Entregador: {order.driver.nome} — {order.driver.veiculo}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      {/* Atribuir entregador */}
                      {order.status === "CONFIRMED" && (
                        <div className="flex items-center gap-2">
                          <select
                            className="rounded-lg border border-border px-3 py-2 text-sm"
                            value={drvSelect[order.id] || ""}
                            onChange={(e) =>
                              setDrvSelect((s) => ({ ...s, [order.id]: e.target.value }))
                            }
                          >
                            <option value="">Selecione entregador</option>
                            {drivers.map((d) => (
                              <option key={d.id} value={d.id}>
                                {d.nome} ({d.veiculo})
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => doAssign(order)}
                            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
                          >
                            Atribuir
                          </button>
                        </div>
                      )}

                      {/* Definir ETA */}
                      {(order.status === "CONFIRMED" || order.status === "ASSIGNED") && (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="5"
                            className="w-24 rounded-lg border border-border px-3 py-2 text-sm"
                            placeholder="ETA (min)"
                            value={etaDraft[order.id] ?? ""}
                            onChange={(e) =>
                              setEtaDraft((s) => ({ ...s, [order.id]: e.target.value }))
                            }
                          />
                          <button
                            onClick={() => saveEta(order)}
                            className="rounded-lg bg-muted px-4 py-2 text-sm font-medium hover:bg-muted/80 transition-colors"
                          >
                            Salvar
                          </button>
                        </div>
                      )}

                      {/* Avançar status */}
                      <button
                        onClick={() => advance(order)}
                        disabled={
                          order.status === "DELIVERED" ||
                          (order.status === "CONFIRMED" && !order.driver)
                        }
                        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                        title={
                          order.status === "CONFIRMED" && !order.driver
                            ? "Atribua um entregador antes de avançar."
                            : "Avança uma etapa por vez"
                        }
                      >
                        {order.status === "DELIVERED" ? (
                          <span className="flex items-center gap-1">
                            <CheckCircle className="h-4 w-4" />
                            Concluído
                          </span>
                        ) : (
                          "Avançar status"
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Itens */}
                  <div className="border-t border-border pt-4">
                    <p className="text-sm font-medium mb-2">Itens:</p>
                    <ul className="space-y-1">
                      {order.items.map((item) => (
                        <li key={item.id} className="flex justify-between text-sm text-muted-foreground">
                          <span>
                            {item.qty}x {item.nome}
                          </span>
                          <span>
                            {new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "PYG",
                              maximumFractionDigits: 0,
                            }).format(item.preco * item.qty)}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-2 flex justify-between font-semibold">
                      <span>Total</span>
                      <span>
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "PYG",
                          maximumFractionDigits: 0,
                        }).format(order.total)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
