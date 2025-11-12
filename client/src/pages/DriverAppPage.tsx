/**
 * Brazukas Delivery - Driver App
 * Painel do entregador com rotas, status e histórico
 */

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { MapPin, Clock, CheckCircle, AlertCircle, Phone } from "lucide-react";

interface Order {
  id: string;
  status: string;
  total: number;
  client?: { name?: string; phone?: string };
  address?: { street?: string; reference?: string };
  items: any[];
  etaMin?: number;
  driver?: { id: string; nome: string };
}

interface DriverStats {
  totalOrders: number;
  completed: number;
  inProgress: number;
  earnings: number;
}

export default function DriverAppPage() {
  const [driverId] = useState(() => localStorage.getItem("driver_id") || "driver-1");
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<DriverStats>({
    totalOrders: 0,
    completed: 0,
    inProgress: 0,
    earnings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  async function loadOrders() {
    try {
      const r = await fetch("/api/orders");
      const data = await r.json();

      // Filtrar pedidos do entregador
      const driverOrders = data.filter(
        (o: Order) => o.driver?.id === driverId && o.status !== "DELIVERED"
      );

      setOrders(driverOrders);

      // Calcular stats
      const completed = data.filter(
        (o: Order) => o.driver?.id === driverId && o.status === "DELIVERED"
      ).length;
      const inProgress = driverOrders.length;
      const earnings = data
        .filter((o: Order) => o.driver?.id === driverId && o.status === "DELIVERED")
        .reduce((sum: number, o: Order) => sum + (o.total || 0), 0);

      setStats({
        totalOrders: completed + inProgress,
        completed,
        inProgress,
        earnings,
      });

      setLoading(false);
    } catch (err) {
      console.error("Erro ao carregar pedidos:", err);
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 3000);
    return () => clearInterval(interval);
  }, [driverId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ASSIGNED":
        return "bg-blue-100 text-blue-700";
      case "PICKED_UP":
        return "bg-yellow-100 text-yellow-700";
      case "DELIVERED":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      PAID: "Pagamento Confirmado",
      CONFIRMED: "Confirmado",
      ASSIGNED: "Atribuído",
      PICKED_UP: "Coletado",
      DELIVERED: "Entregue",
    };
    return labels[status] || status;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Painel do Entregador</h1>
            <p className="text-muted-foreground">ID: {driverId}</p>
          </div>

          {/* Stats */}
          <div className="mb-8 grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground mb-1">Total de Pedidos</p>
              <p className="text-2xl font-bold">{stats.totalOrders}</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground mb-1">Em Progresso</p>
              <p className="text-2xl font-bold text-blue-700">{stats.inProgress}</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground mb-1">Entregues</p>
              <p className="text-2xl font-bold text-green-700">{stats.completed}</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground mb-1">Ganhos (PYG)</p>
              <p className="text-2xl font-bold text-primary">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "PYG",
                  maximumFractionDigits: 0,
                }).format(stats.earnings)}
              </p>
            </div>
          </div>

          {/* Rotas */}
          {loading ? (
            <div className="rounded-2xl border border-border bg-card p-6 text-center">
              <p className="text-muted-foreground">Carregando rotas...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
              <Clock className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-lg font-medium text-muted-foreground">
                Nenhum pedido em progresso
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-2xl border border-border bg-card p-6 hover:shadow-md transition cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">Pedido #{order.id}</h3>
                      <div className={`mt-2 inline-block rounded-lg px-3 py-1 text-sm ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </div>

                      {order.address && (
                        <p className="mt-3 text-sm text-muted-foreground flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {order.address.street}
                          {order.address.reference && ` (${order.address.reference})`}
                        </p>
                      )}

                      {order.client?.name && (
                        <p className="mt-2 text-sm text-muted-foreground">
                          Cliente: {order.client.name}
                        </p>
                      )}

                      {order.etaMin && (
                        <p className="mt-2 text-sm text-muted-foreground flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          ETA: ~{order.etaMin} min
                        </p>
                      )}
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "PYG",
                          maximumFractionDigits: 0,
                        }).format(order.total || 0)}
                      </p>

                      {order.client?.phone && (
                        <button className="mt-3 flex items-center gap-2 rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity">
                          <Phone className="h-4 w-4" />
                          Ligar
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Itens */}
                  <div className="border-t border-border pt-4">
                    <p className="text-sm font-medium mb-2">Itens:</p>
                    <ul className="space-y-1">
                      {order.items.map((item, i) => (
                        <li key={i} className="text-xs text-muted-foreground">
                          {item.qty}x {item.nome}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Modal de Detalhes */}
          {selectedOrder && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4">Detalhes do Pedido</h2>

                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Pedido</p>
                    <p className="font-semibold">#{selectedOrder.id}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <div className={`mt-1 inline-block rounded-lg px-3 py-1 text-sm ${getStatusColor(selectedOrder.status)}`}>
                      {getStatusLabel(selectedOrder.status)}
                    </div>
                  </div>

                  {selectedOrder.address && (
                    <div>
                      <p className="text-sm text-muted-foreground">Endereço</p>
                      <p className="font-semibold">{selectedOrder.address.street}</p>
                      {selectedOrder.address.reference && (
                        <p className="text-sm text-muted-foreground">{selectedOrder.address.reference}</p>
                      )}
                    </div>
                  )}

                  {selectedOrder.client && (
                    <div>
                      <p className="text-sm text-muted-foreground">Cliente</p>
                      <p className="font-semibold">{selectedOrder.client.name}</p>
                      {selectedOrder.client.phone && (
                        <p className="text-sm text-muted-foreground">{selectedOrder.client.phone}</p>
                      )}
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-xl font-bold text-primary">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "PYG",
                        maximumFractionDigits: 0,
                      }).format(selectedOrder.total || 0)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-full rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  Fechar
                </button>
              </div>
            </div>
          )}

          {/* Voltar */}
          <div className="mt-8">
            <Link href="/">
              <button className="rounded-lg border border-border px-4 py-2 font-medium hover:bg-muted transition-colors">
                ← Voltar
              </button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
