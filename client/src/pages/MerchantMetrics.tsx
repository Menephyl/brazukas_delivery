/**
 * Brazukas Delivery - Merchant Metrics
 * Relatórios e analytics para o comerciante
 */

import { useRoute } from "wouter";
import MerchantLayout from "@/components/MerchantLayout";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function MerchantMetrics() {
  const [match, params] = useRoute("/merchant/metrics/:merchantId");
  const merchantId = params?.merchantId ? parseInt(params.merchantId) : 0;

  // Mock data
  const dailyData = [
    { date: "Seg", pedidos: 12, faturamento: 850 },
    { date: "Ter", pedidos: 15, faturamento: 1050 },
    { date: "Qua", pedidos: 10, faturamento: 720 },
    { date: "Qui", pedidos: 18, faturamento: 1250 },
    { date: "Sex", pedidos: 22, faturamento: 1550 },
    { date: "Sab", pedidos: 28, faturamento: 1950 },
    { date: "Dom", pedidos: 20, faturamento: 1400 },
  ];

  const categoryData = [
    { name: "Lanches", value: 35, fill: "#3b82f6" },
    { name: "Bebidas", value: 25, fill: "#10b981" },
    { name: "Sobremesas", value: 20, fill: "#f59e0b" },
    { name: "Outros", value: 20, fill: "#8b5cf6" },
  ];

  const topProducts = [
    { name: "Hambúrguer Premium", vendas: 156, faturamento: 2340 },
    { name: "Pizza Margherita", vendas: 142, faturamento: 2130 },
    { name: "Refrigerante 2L", vendas: 128, faturamento: 512 },
    { name: "Açaí", vendas: 98, faturamento: 1470 },
    { name: "Batata Frita", vendas: 87, faturamento: 870 },
  ];

  if (!match) return null;

  return (
    <MerchantLayout merchantId={merchantId} merchantName="Minha Loja">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Métricas</h1>
          <p className="text-muted-foreground">Análise de desempenho da sua loja</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Pedidos (7 dias)</p>
            <p className="text-3xl font-bold">125</p>
            <p className="text-xs text-green-600 mt-2">↑ 12% vs semana anterior</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Faturamento (7 dias)</p>
            <p className="text-3xl font-bold">R$ 8.770</p>
            <p className="text-xs text-green-600 mt-2">↑ 15% vs semana anterior</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Ticket Médio</p>
            <p className="text-3xl font-bold">R$ 70,16</p>
            <p className="text-xs text-green-600 mt-2">↑ 3% vs semana anterior</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Taxa de Conversão</p>
            <p className="text-3xl font-bold">8,2%</p>
            <p className="text-xs text-yellow-600 mt-2">→ Estável vs semana anterior</p>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pedidos e Faturamento */}
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-4">Pedidos e Faturamento (7 dias)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="pedidos" fill="#3b82f6" name="Pedidos" />
                <Bar yAxisId="right" dataKey="faturamento" fill="#10b981" name="Faturamento (R$)" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Vendas por Categoria */}
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-4">Vendas por Categoria</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Top Products */}
        <Card className="p-6">
          <h2 className="text-lg font-bold mb-4">Produtos Mais Vendidos</h2>
          <div className="space-y-3">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-muted-foreground">{product.vendas} vendas</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">R$ {(product.faturamento / 100).toFixed(2)}</p>
                  <div className="w-24 h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full bg-green-600"
                      style={{ width: `${(product.vendas / 160) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </MerchantLayout>
  );
}
