/**
 * Brazukas Delivery - History Page
 * Página com histórico de pedidos do usuário
 */

import { useState, useEffect } from "react";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Clock, MapPin, Package, ChevronRight, RotateCcw } from "lucide-react";

interface HistoryOrder {
  id: string;
  merchantName: string;
  total: number;
  status: string;
  createdAt: string;
  items: Array<{ nome: string; qty: number }>;
}

export default function HistoryPage() {
  const [orders, setOrders] = useState<HistoryOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "delivered" | "cancelled">("all");

  useEffect(() => {
    // Simular carregamento de histórico
    const mockOrders: HistoryOrder[] = [
      {
        id: "ORDER-001",
        merchantName: "Brasil Burgers",
        total: 45.50,
        status: "DELIVERED",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        items: [
          { nome: "X-Tudo", qty: 2 },
          { nome: "Batata Frita", qty: 1 },
        ],
      },
      {
        id: "ORDER-002",
        merchantName: "Sushi da Fronteira",
        total: 89.90,
        status: "DELIVERED",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        items: [
          { nome: "Sushi Salmão", qty: 1 },
          { nome: "Temaki", qty: 2 },
        ],
      },
      {
        id: "ORDER-003",
        merchantName: "Pizzaria Brasil",
        total: 65.00,
        status: "DELIVERED",
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        items: [
          { nome: "Pizza Margherita", qty: 1 },
          { nome: "Refrigerante", qty: 2 },
        ],
      },
    ];

    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 500);
  }, []);

  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true;
    if (filter === "delivered") return order.status === "DELIVERED";
    if (filter === "cancelled") return order.status === "CANCELLED";
    return true;
  });

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      DELIVERED: "Entregue",
      CANCELLED: "Cancelado",
      PENDING: "Pendente",
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      DELIVERED: "bg-green-100 text-green-800",
      CANCELLED: "bg-red-100 text-red-800",
      PENDING: "bg-yellow-100 text-yellow-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="py-12 sm:py-16">
          <div className="container">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Histórico de Pedidos</h1>
              <p className="text-muted-foreground">
                Acompanhe todos os seus pedidos anteriores
              </p>
            </div>

            {/* Filtros */}
            <div className="mb-8 flex gap-2 flex-wrap">
              {[
                { value: "all", label: "Todos" },
                { value: "delivered", label: "Entregues" },
                { value: "cancelled", label: "Cancelados" },
              ].map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value as any)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    filter === f.value
                      ? "bg-primary text-primary-foreground"
                      : "border border-border hover:bg-muted"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Lista de Pedidos */}
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-32 rounded-lg bg-muted animate-pulse" />
                ))}
              </div>
            ) : filteredOrders.length > 0 ? (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <Link key={order.id} href={`/order/${order.id}`}>
                    <div className="rounded-lg border border-border bg-card p-4 hover:shadow-md transition cursor-pointer">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{order.merchantName}</h3>
                          <p className="text-sm text-muted-foreground">
                            Pedido #{order.id}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusLabel(order.status)}
                        </span>
                      </div>

                      <div className="mb-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                        </div>
                        <div className="flex items-center gap-1">
                          <Package className="h-4 w-4" />
                          {order.items.length} item(ns)
                        </div>
                      </div>

                      <div className="mb-3 text-sm">
                        <p className="text-muted-foreground">
                          {order.items.map((item) => `${item.nome} (${item.qty})`).join(", ")}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">
                          R$ {order.total.toFixed(2)}
                        </span>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-border p-12 text-center">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Package className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground mb-4">
                  Nenhum pedido encontrado
                </p>
                <Link href="/">
                  <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2 font-medium text-primary-foreground hover:opacity-90 transition">
                    <RotateCcw className="h-4 w-4" />
                    Fazer um novo pedido
                  </button>
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
