/**
 * Brazukas Delivery - Merchant Analytics
 * Painel de análise com gráficos e métricas de vendas
 */

import { useState } from "react";
import { useRoute } from "wouter";
import MerchantLayout from "@/components/MerchantLayout";
import { SalesChart, HourlyChart, TopProductsChart, PaymentMethodsChart, MetricCard } from "@/components/AnalyticsCharts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Package, Users, CreditCard, Truck, Download } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function MerchantAnalytics() {
  const [match, params] = useRoute("/merchant/analytics/:merchantId");
  const merchantId = params?.merchantId ? parseInt(params.merchantId) : 0;
  const [period, setPeriod] = useState<"today" | "week" | "month">("week");

  // Fetch data from tRPC
  const { data: salesSummary } = trpc.merchantAnalytics.getSalesSummary.useQuery(
    { merchantId, period },
    { enabled: merchantId > 0 }
  );

  const { data: dailySalesData } = trpc.merchantAnalytics.getDailySalesChart.useQuery(
    { merchantId, days: 30 },
    { enabled: merchantId > 0 }
  );

  const { data: topProducts } = trpc.merchantAnalytics.getTopProducts.useQuery(
    { merchantId, limit: 10, period },
    { enabled: merchantId > 0 }
  );

  const { data: hourlyData } = trpc.merchantAnalytics.getHourlyPerformance.useQuery(
    { merchantId },
    { enabled: merchantId > 0 }
  );

  const { data: conversionMetrics } = trpc.merchantAnalytics.getConversionMetrics.useQuery(
    { merchantId, period },
    { enabled: merchantId > 0 }
  );

  const { data: customerMetrics } = trpc.merchantAnalytics.getCustomerMetrics.useQuery(
    { merchantId, period },
    { enabled: merchantId > 0 }
  );

  const { data: paymentMetrics } = trpc.merchantAnalytics.getPaymentMetrics.useQuery(
    { merchantId, period },
    { enabled: merchantId > 0 }
  );

  const { data: deliveryMetrics } = trpc.merchantAnalytics.getDeliveryMetrics.useQuery(
    { merchantId, period },
    { enabled: merchantId > 0 }
  );

  const exportMutation = trpc.merchantAnalytics.exportReport.useMutation();

  const handleExport = async (format: "csv" | "pdf") => {
    await exportMutation.mutateAsync({
      merchantId,
      period,
      format,
    });
  };

  if (!match) return null;

  return (
    <MerchantLayout merchantId={merchantId} merchantName="Análise">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Análise de Dados</h1>
            <p className="text-muted-foreground">Acompanhe as principais métricas de vendas e desempenho</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleExport("csv")}>
              <Download className="w-4 h-4 mr-2" />
              CSV
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport("pdf")}>
              <Download className="w-4 h-4 mr-2" />
              PDF
            </Button>
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex gap-2">
          {(["today", "week", "month"] as const).map((p) => (
            <Button
              key={p}
              variant={period === p ? "default" : "outline"}
              size="sm"
              onClick={() => setPeriod(p)}
              className="capitalize"
            >
              {p === "today" ? "Hoje" : p === "week" ? "Semana" : "Mês"}
            </Button>
          ))}
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total de Pedidos"
            value={salesSummary?.totalOrders || 0}
            trend={`${salesSummary?.growth?.orders || 0}% vs período anterior`}
            icon={<TrendingUp className="w-6 h-6" />}
            color="bg-blue-100 text-blue-600"
          />
          <MetricCard
            title="Receita Total"
            value={`R$ ${(salesSummary?.totalRevenue || 0).toFixed(2)}`}
            trend={`${salesSummary?.growth?.revenue || 0}% vs período anterior`}
            icon={<CreditCard className="w-6 h-6" />}
            color="bg-green-100 text-green-600"
          />
          <MetricCard
            title="Ticket Médio"
            value={`R$ ${(salesSummary?.averageOrderValue || 0).toFixed(2)}`}
            icon={<Package className="w-6 h-6" />}
            color="bg-yellow-100 text-yellow-600"
          />
          <MetricCard
            title="Taxa de Conversão"
            value={`${salesSummary?.conversionRate || 0}%`}
            icon={<Users className="w-6 h-6" />}
            color="bg-purple-100 text-purple-600"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Chart */}
          {dailySalesData && <SalesChart data={dailySalesData} title="Vendas nos Últimos 30 Dias" />}

          {/* Hourly Performance */}
          {hourlyData && <HourlyChart data={hourlyData} title="Desempenho por Hora" />}

          {/* Top Products */}
          {topProducts && <TopProductsChart data={topProducts} title="Produtos Mais Vendidos" />}

          {/* Payment Methods */}
          {paymentMetrics && <PaymentMethodsChart data={paymentMetrics} title="Métodos de Pagamento" />}
        </div>

        {/* Detailed Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Conversion Metrics */}
          {conversionMetrics && (
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">Conversão</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Taxa de Conversão</span>
                  <span className="font-bold">{conversionMetrics.conversionRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Tempo Médio de Sessão</span>
                  <span className="font-bold">{conversionMetrics.averageSessionDuration}m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Taxa de Rejeição</span>
                  <span className="font-bold">{conversionMetrics.bounceRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Clientes Recorrentes</span>
                  <span className="font-bold">{conversionMetrics.repeatCustomerRate}%</span>
                </div>
              </div>
            </Card>
          )}

          {/* Customer Metrics */}
          {customerMetrics && (
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">Clientes</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total de Clientes</span>
                  <span className="font-bold">{customerMetrics.totalCustomers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Novos Clientes</span>
                  <span className="font-bold text-green-600">+{customerMetrics.newCustomers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Clientes Recorrentes</span>
                  <span className="font-bold">{customerMetrics.returningCustomers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Valor Médio</span>
                  <span className="font-bold">R$ {customerMetrics.averageCustomerValue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Satisfação</span>
                  <span className="font-bold">⭐ {customerMetrics.customerSatisfaction}</span>
                </div>
              </div>
            </Card>
          )}

          {/* Delivery Metrics */}
          {deliveryMetrics && (
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">Entrega</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total de Entregas</span>
                  <span className="font-bold">{deliveryMetrics.totalDeliveries}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">No Prazo</span>
                  <span className="font-bold text-green-600">{deliveryMetrics.onTimeDeliveries}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Atrasadas</span>
                  <span className="font-bold text-red-600">{deliveryMetrics.lateDeliveries}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Tempo Médio</span>
                  <span className="font-bold">{deliveryMetrics.averageDeliveryTime}m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Taxa de Pontualidade</span>
                  <span className="font-bold text-green-600">{deliveryMetrics.onTimeRate}%</span>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </MerchantLayout>
  );
}
