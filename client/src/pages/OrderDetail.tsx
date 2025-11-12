/**
 * Brazukas Delivery - Order Detail
 * Página de detalhes do pedido do comerciante
 */

import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import MerchantLayout from "@/components/MerchantLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock, DollarSign, Package, Download, TrendingUp } from "lucide-react";
import { trpc } from "@/lib/trpc";
import TrackingMap from "@/components/TrackingMap";
import RouteStats from "@/components/RouteStats";

const statusOptions = [
  { value: "pending", label: "Pendente" },
  { value: "confirmed", label: "Confirmado" },
  { value: "preparing", label: "Preparando" },
  { value: "ready", label: "Pronto" },
  { value: "out_for_delivery", label: "Em Entrega" },
  { value: "delivered", label: "Entregue" },
  { value: "cancelled", label: "Cancelado" },
];

export default function OrderDetail() {
  const [match, params] = useRoute("/merchant/orders/:merchantId/:orderId");
  const merchantId = params?.merchantId ? parseInt(params.merchantId) : 0;
  const orderId = params?.orderId ? parseInt(params.orderId) : 0;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState("");
  const [updating, setUpdating] = useState(false);
  const [trackingStats, setTrackingStats] = useState<any>(null);

  const { data: orderData } = trpc.merchantOrders.getOrder.useQuery(
    { orderId },
    { enabled: orderId > 0 }
  );

  const { data: trackingStatsData } = trpc.orders.getTrackingStats.useQuery(
    { id: String(orderId) },
    { enabled: orderId > 0 }
  );

  const updateMutation = trpc.merchantOrders.updateOrderStatus.useMutation();

  useEffect(() => {
    if (orderData) {
      setOrder(orderData);
      setNewStatus(orderData.status);
      setLoading(false);
    }
  }, [orderData]);

  useEffect(() => {
    if (trackingStatsData) {
      setTrackingStats(trackingStatsData);
    }
  }, [trackingStatsData]);

  const handleUpdateStatus = async () => {
    setUpdating(true);
    try {
      await updateMutation.mutateAsync({
        orderId,
        status: newStatus as any,
      });
      setOrder({ ...order, status: newStatus });
      alert("Status atualizado com sucesso!");
    } catch (error) {
      alert("Erro ao atualizar status");
    } finally {
      setUpdating(false);
    }
  };

  const downloadFile = async (format: "csv" | "gpx") => {
    try {
      const result = format === "csv"
        ? await (trpc.orders.exportTrackingCSV as any).query({ id: String(orderId) })
        : await (trpc.orders.exportTrackingGPX as any).query({ id: String(orderId) });

      const blob = new Blob([result.content], { type: result.mimeType });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = result.fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert(`Erro ao exportar ${format.toUpperCase()}`);
    }
  };

  if (!match) return null;
  if (loading) return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  if (!order) return <div className="text-muted-foreground">Pedido não encontrado</div>;

  return (
    <MerchantLayout merchantId={merchantId} merchantName="Minha Loja">
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Pedido #{order.id}</h1>
            <p className="text-muted-foreground">
              Criado em {new Date(order.createdAt).toLocaleString("pt-BR")}
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-green-600">R$ {(order.total / 100).toFixed(2)}</p>
            <p className="text-muted-foreground">Total</p>
          </div>
        </div>

        {/* Status Update */}
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h2 className="text-lg font-bold mb-4">Atualizar Status</h2>
          <div className="flex gap-3">
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="flex-1 px-4 py-2 border border-border rounded-lg bg-white"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <Button
              onClick={handleUpdateStatus}
              disabled={updating || newStatus === order.status}
            >
              {updating ? "Atualizando..." : "Atualizar"}
            </Button>
          </div>
        </Card>

        {/* Customer Info */}
        <Card className="p-6">
          <h2 className="text-lg font-bold mb-4">Informações do Cliente</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="font-bold">{order.customerName.charAt(0)}</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Nome</p>
                <p className="font-medium">{order.customerName}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Phone className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Telefone</p>
                <p className="font-medium">{order.customerPhone}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{order.customerEmail}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <MapPin className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Endereço</p>
                <p className="font-medium">{order.address}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Items */}
        <Card className="p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Package className="w-5 h-5" />
            Itens do Pedido
          </h2>
          <div className="space-y-3">
            {order.items.map((item: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  {item.notes && <p className="text-xs text-muted-foreground">Obs: {item.notes}</p>}
                </div>
                <div className="text-right">
                  <p className="text-sm">Qtd: {item.quantity}</p>
                  <p className="font-medium">R$ {(item.price / 100).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Pricing */}
        <Card className="p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Resumo Financeiro
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>R$ {(order.subtotal / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxa de Entrega</span>
              <span>R$ {(order.deliveryFee / 100).toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Desconto</span>
                <span>-R$ {(order.discount / 100).toFixed(2)}</span>
              </div>
            )}
            <div className="border-t pt-2 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>R$ {(order.total / 100).toFixed(2)}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Método de Pagamento: {order.paymentMethod === "pix" ? "PIX" : "Dinheiro"}</p>
              <p>Status do Pagamento: {order.paymentStatus === "paid" ? "Pago" : "Pendente"}</p>
            </div>
          </div>
        </Card>

        {/* Tracking Map and Stats Side by Side */}
        {order.tracking && order.tracking.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
            {/* Map Section - 2 columns */}
            <div className="lg:col-span-2">
              <Card className="p-6 h-full">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Mapa de Rastreamento
                </h2>
                <TrackingMap points={order.tracking} height="500px" />
              </Card>
            </div>

            {/* Stats Panel - 1 column */}
            <div className="lg:col-span-1">
              <RouteStats
                stats={trackingStats}
                trackingPoints={order.tracking}
                isLoading={false}
              />
            </div>
          </div>
        )}

        {/* Export Options */}
        <Card className="p-6 bg-green-50 border-green-200">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Download className="w-5 h-5" />
            Exportar Rastreamento
          </h2>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => downloadFile("csv")}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Exportar CSV
            </Button>
            <Button
              onClick={() => downloadFile("gpx")}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Exportar GPX
            </Button>
          </div>
        </Card>

        {/* Timeline */}
        <Card className="p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Histórico
          </h2>
          <div className="space-y-4">
            {order.timeline?.map((event: any, idx: number) => (
              <div key={idx} className="flex gap-4">
                <div className="w-3 h-3 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium">{event.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(event.timestamp).toLocaleString("pt-BR")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => window.history.back()}>
            Voltar
          </Button>
          <Button variant="outline" className="text-red-600 border-red-200">
            Cancelar Pedido
          </Button>
        </div>
      </div>
    </MerchantLayout>
  );
}
