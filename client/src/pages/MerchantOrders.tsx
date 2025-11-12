/**
 * Brazukas Delivery - Merchant Orders
 * Página de listagem e gerenciamento de pedidos
 */

import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import MerchantLayout from "@/components/MerchantLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Eye, Clock, CheckCircle, AlertCircle, Truck } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface Order {
  id: number;
  customerName: string;
  customerPhone: string;
  total: number;
  status: string;
  createdAt: Date;
  estimatedDelivery: Date;
  items: Array<{ name: string; quantity: number; price: number }>;
}

const statusConfig = {
  pending: { label: "Pendente", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  confirmed: { label: "Confirmado", color: "bg-blue-100 text-blue-800", icon: CheckCircle },
  preparing: { label: "Preparando", color: "bg-purple-100 text-purple-800", icon: AlertCircle },
  ready: { label: "Pronto", color: "bg-green-100 text-green-800", icon: CheckCircle },
  out_for_delivery: { label: "Em Entrega", color: "bg-cyan-100 text-cyan-800", icon: Truck },
  delivered: { label: "Entregue", color: "bg-green-100 text-green-800", icon: CheckCircle },
  cancelled: { label: "Cancelado", color: "bg-red-100 text-red-800", icon: AlertCircle },
};

export default function MerchantOrders() {
  const [match, params] = useRoute("/merchant/orders/:merchantId");
  const merchantId = params?.merchantId ? parseInt(params.merchantId) : 0;
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [page, setPage] = useState(1);

  const { data: ordersData } = trpc.merchantOrders.listOrders.useQuery(
    {
      merchantId,
      status: statusFilter as any,
      page,
      search: searchTerm,
    },
    { enabled: merchantId > 0 }
  );

  useEffect(() => {
    if (ordersData) {
      setOrders(ordersData.orders as Order[]);
      setLoading(false);
    }
  }, [ordersData]);

  const handleViewOrder = (orderId: number) => {
    window.location.href = `/merchant/orders/${merchantId}/${orderId}`;
  };

  if (!match) return null;

  return (
    <MerchantLayout merchantId={merchantId} merchantName="Minha Loja">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Pedidos</h1>
          <p className="text-muted-foreground">Gerenciar todos os pedidos recebidos</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <p className="text-xs text-muted-foreground">Pendentes</p>
            <p className="text-2xl font-bold">3</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-muted-foreground">Preparando</p>
            <p className="text-2xl font-bold">8</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-muted-foreground">Prontos</p>
            <p className="text-2xl font-bold">2</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-muted-foreground">Entregues Hoje</p>
            <p className="text-2xl font-bold">24</p>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por ID, nome ou telefone..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border border-border rounded-lg bg-background"
          >
            <option value="">Todos os Status</option>
            <option value="pending">Pendente</option>
            <option value="confirmed">Confirmado</option>
            <option value="preparing">Preparando</option>
            <option value="ready">Pronto</option>
            <option value="out_for_delivery">Em Entrega</option>
            <option value="delivered">Entregue</option>
            <option value="cancelled">Cancelado</option>
          </select>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Carregando pedidos...</div>
        ) : orders.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground mb-4">Nenhum pedido encontrado</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => {
              const config = statusConfig[order.status as keyof typeof statusConfig];
              const Icon = config?.icon || AlertCircle;
              return (
                <Card key={order.id} className="p-4 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold">Pedido #{order.id}</h3>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${config?.color}`}>
                          <Icon className="w-3 h-3" />
                          {config?.label}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Cliente</p>
                          <p className="font-medium">{order.customerName}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Telefone</p>
                          <p className="font-medium">{order.customerPhone}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Total</p>
                          <p className="font-bold">R$ {(order.total / 100).toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Itens</p>
                          <p className="font-medium">{order.items.length} item(ns)</p>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        <p>Criado: {new Date(order.createdAt).toLocaleString("pt-BR")}</p>
                        <p>Entrega estimada: {new Date(order.estimatedDelivery).toLocaleString("pt-BR")}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleViewOrder(order.id)}
                      className="gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Ver Detalhes
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {ordersData && ordersData.pages > 1 && (
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Anterior
            </Button>
            <div className="flex items-center gap-2">
              {Array.from({ length: ordersData.pages }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  variant={page === p ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPage(p)}
                >
                  {p}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              disabled={page === ordersData.pages}
              onClick={() => setPage(page + 1)}
            >
              Próximo
            </Button>
          </div>
        )}
      </div>
    </MerchantLayout>
  );
}
