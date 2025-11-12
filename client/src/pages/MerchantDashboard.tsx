/**
 * Brazukas Delivery - Merchant Dashboard
 * Dashboard principal com KPIs e resumo da loja
 */

import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import MerchantLayout from "@/components/MerchantLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, ShoppingCart, Star, Users, AlertCircle } from "lucide-react";
import MerchantNotificationCenter from "@/components/MerchantNotificationCenter";
import { trpc } from "@/lib/trpc";

export default function MerchantDashboard() {
  const [match, params] = useRoute("/merchant/dashboard/:merchantId");
  const merchantId = params?.merchantId ? parseInt(params.merchantId) : 0;
  const [merchant, setMerchant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const { data: merchantData } = trpc.merchants.getProfile.useQuery(
    { merchantId },
    { enabled: merchantId > 0 }
  );

  const handleNewOrder = (orderId: number) => {
    console.log(`Novo pedido recebido: #${orderId}`);
    // Aqui você pode adicionar lógica para redirecionar ou exibir alerta
  };

  useEffect(() => {
    if (merchantData) {
      setMerchant(merchantData);
      setLoading(false);
    }
  }, [merchantData]);

  if (!match) return null;
  if (loading) return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  if (error) return <div className="text-red-600">Erro: {error}</div>;
  if (!merchant) return <div className="text-muted-foreground">Loja não encontrada</div>;

  // Mock data for KPIs
  const kpis = [
    {
      title: "Pedidos Hoje",
      value: "12",
      icon: ShoppingCart,
      color: "bg-blue-100 text-blue-600",
      trend: "+2 vs ontem",
    },
    {
      title: "Faturamento",
      value: "R$ 1.250",
      icon: TrendingUp,
      color: "bg-green-100 text-green-600",
      trend: "+15% vs semana",
    },
    {
      title: "Rating",
      value: merchant.rating || "4.8",
      icon: Star,
      color: "bg-yellow-100 text-yellow-600",
      trend: `${merchant.reviewCount || 0} avaliações`,
    },
    {
      title: "Clientes",
      value: "234",
      icon: Users,
      color: "bg-purple-100 text-purple-600",
      trend: "+12 novos",
    },
  ];

  return (
    <MerchantLayout merchantId={merchantId} merchantName={merchant.name}>
      {/* Notification Center */}
      <div className="fixed top-4 right-4 z-40">
        <MerchantNotificationCenter merchantId={merchantId} onNewOrder={handleNewOrder} />
      </div>

      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Bem-vindo ao painel da sua loja</p>
        </div>

        {/* KPIs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi, index) => {
            const Icon = kpi.icon;
            return (
              <Card key={index} className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">{kpi.title}</p>
                    <p className="text-3xl font-bold">{kpi.value}</p>
                    <p className="text-xs text-muted-foreground mt-2">{kpi.trend}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${kpi.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informações da Loja */}
          <Card className="p-6 lg:col-span-2">
            <h2 className="text-xl font-bold mb-4">Informações da Loja</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                {merchant.logo && (
                  <img
                    src={merchant.logo}
                    alt={merchant.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{merchant.name}</h3>
                  <p className="text-sm text-muted-foreground">{merchant.category}</p>
                  <p className="text-sm text-muted-foreground mt-2">{merchant.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-medium">{merchant.email}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Telefone</p>
                  <p className="font-medium">{merchant.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Raio de Entrega</p>
                  <p className="font-medium">{merchant.deliveryRadius} km</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Taxa de Entrega</p>
                  <p className="font-medium">R$ {(merchant.deliveryFee / 100).toFixed(2)}</p>
                </div>
              </div>

              <Button variant="outline" className="w-full mt-4">
                Editar Informações
              </Button>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Ações Rápidas</h2>
            <div className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Novo Produto
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <AlertCircle className="w-4 h-4 mr-2" />
                Ver Pedidos
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <TrendingUp className="w-4 h-4 mr-2" />
                Ver Métricas
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Star className="w-4 h-4 mr-2" />
                Ver Avaliações
              </Button>
            </div>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Pedidos Recentes</h2>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">Pedido #{1000 + i}</p>
                  <p className="text-sm text-muted-foreground">Cliente: João Silva</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">R$ 85,90</p>
                  <p className="text-sm text-green-600">Entregue</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </MerchantLayout>
  );
}
