/**
 * Brazukas Delivery - Driver Home
 * Painel do entregador com lista de entregas
 */

import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ModalPOD from "@/components/ModalPOD";
import { watchLocation, stopWatch } from "@/lib/location";
import { MapPin, Phone, AlertCircle, CheckCircle } from "lucide-react";

interface DriverOrder {
  id: string;
  status: string;
  dropoff: {
    street: string;
    number?: string;
    reference?: string;
  };
  total: number;
  items: Array<{ id: string; nome: string; qty: number }>;
  driver?: { id: string; nome: string };
  pinDelivery?: string;
}

export default function DriverHomePage() {
  const [orders, setOrders] = useState<DriverOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [podOrderId, setPodOrderId] = useState<string | null>(null);
  const [, setLocation] = useLocation();

  // Proteção de rota
  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("bz_driver_token");
    if (!token) {
      setLocation("/driver/login");
    }
  }, [setLocation]);

  // Carregar pedidos
  async function loadOrders() {
    try {
      const token = localStorage.getItem("bz_driver_token");
      const response = await fetch("/api/orders", {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) throw new Error("Erro ao carregar pedidos");

      const data = await response.json();
      // Filtrar apenas pedidos atribuídos ao entregador
      const driverOrders = data.filter(
        (o: any) =>
          o.status === "ASSIGNED" ||
          o.status === "PICKED_UP" ||
          o.status === "DELIVERED"
      );
      setOrders(driverOrders);
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
  }, []);

  async function changeStatus(orderId: string, action: string) {
    setError("");

    try {
      const token = localStorage.getItem("bz_driver_token");
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Erro ao atualizar status");
        return;
      }

      // Iniciar GPS ao retirar pedido
      if (action === "pickup") {
        watchLocation(orderId);
        setActiveOrderId(orderId);
      }

      // Parar GPS ao entregar
      if (action === "deliver") {
        stopWatch();
        setActiveOrderId(null);
      }

      loadOrders();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar status");
    }
  }

  function handleLogout() {
    localStorage.removeItem("bz_driver_token");
    localStorage.removeItem("driver_id");
    stopWatch();
    setLocation("/driver/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-8">
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
            <h1 className="text-3xl font-bold">Minhas Entregas</h1>
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Sair
            </button>
          </div>

          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 flex gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {activeOrderId && (
            <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 flex gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-green-700">
                📍 GPS ativo para pedido #{activeOrderId}
              </p>
            </div>
          )}

          {orders.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center">
              <MapPin className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-lg font-medium text-muted-foreground">
                Nenhuma entrega no momento
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
                      <div className="mt-2 flex items-start gap-2">
                        <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium">
                            {order.dropoff.street}{" "}
                            {order.dropoff.number && `nº ${order.dropoff.number}`}
                          </p>
                          {order.dropoff.reference && (
                            <p className="text-xs text-muted-foreground">
                              Ref: {order.dropoff.reference}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-medium text-muted-foreground">
                        {order.items.length} item(ns)
                      </p>
                      <p className="text-lg font-bold text-primary">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "PYG",
                          maximumFractionDigits: 0,
                        }).format(order.total)}
                      </p>
                    </div>
                  </div>

                  {/* Itens */}
                  <div className="border-t border-border pt-4 mb-4">
                    <p className="text-xs font-medium text-muted-foreground mb-2">
                      ITENS
                    </p>
                    <ul className="space-y-1">
                      {order.items.map((item) => (
                        <li
                          key={item.id}
                          className="flex justify-between text-sm text-muted-foreground"
                        >
                          <span>
                            {item.qty}x {item.nome}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Ações */}
                  <div className="flex gap-2">
                    {order.status === "ASSIGNED" && (
                      <button
                        onClick={() => changeStatus(order.id, "pickup")}
                        className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
                      >
                        Retirar Pedido
                      </button>
                    )}

                    {order.status === "PICKED_UP" && (
                      <button
                        onClick={() => setPodOrderId(order.id)}
                        className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors"
                      >
                        Entregar Pedido
                      </button>
                    )}

                    {order.status === "DELIVERED" && (
                      <button
                        disabled
                        className="flex-1 rounded-lg bg-muted px-4 py-2 text-sm font-medium text-muted-foreground cursor-not-allowed"
                      >
                        ✓ Entregue
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {podOrderId && (
        <ModalPOD
          orderId={podOrderId}
          pinDelivery={orders.find((o) => o.id === podOrderId)?.pinDelivery || ""}
          onClose={() => setPodOrderId(null)}
          onSubmit={async (pod) => {
            try {
              const token = localStorage.getItem("bz_driver_token");
              const response = await fetch(`/api/orders/${podOrderId}`, {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                  ...(token && { Authorization: `Bearer ${token}` }),
                },
                body: JSON.stringify({ action: "deliver", pod }),
              });

              if (!response.ok) {
                const data = await response.json();
                setError(data.error || "Erro ao finalizar entrega");
                return;
              }

              stopWatch();
              setActiveOrderId(null);
              setPodOrderId(null);
              loadOrders();
            } catch (err) {
              setError(err instanceof Error ? err.message : "Erro ao finalizar entrega");
            }
          }}
        />
      )}

      <Footer />
    </div>
  );
}
