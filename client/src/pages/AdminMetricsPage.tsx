/**
 * Brazukas Delivery - Admin Metrics Page
 * KPIs, gráficos e análise de pedidos
 */

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefreshCw, TrendingUp } from "lucide-react";

interface KPI {
  total: number;
  delivered: number;
  completionRate: number;
  avgConfirmMin: number | null;
  avgAssignMin: number | null;
  avgPickupMin: number | null;
  avgDeliverMin: number | null;
}

interface MetricsData {
  kpis: KPI;
  byStatus: Record<string, number>;
  series: Array<{ time: string; created: number; delivered: number }>;
  hours: number;
}

export default function AdminMetricsPage() {
  const [hours, setHours] = useState(24);
  const [data, setData] = useState<MetricsData | null>(null);

  const metricsQuery = trpc.metrics.summary.useQuery({ hours });

  useEffect(() => {
    if (metricsQuery.data) {
      setData(metricsQuery.data as MetricsData);
    }
  }, [metricsQuery.data]);

  const handleRefresh = () => {
    metricsQuery.refetch();
  };

  const handleHoursChange = (newHours: string) => {
    const h = Number(newHours);
    setHours(h);
  };

  const kpi = data?.kpis;
  const byStatus = data?.byStatus || {};

  const KpiCard = ({
    title,
    value,
    unit = "",
  }: {
    title: string;
    value: number | null;
    unit?: string;
  }) => (
    <Card className="p-4">
      <div className="text-sm text-gray-600">{title}</div>
      <div className="mt-2 text-3xl font-bold text-green-700">
        {value !== null ? `${value}${unit}` : "—"}
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin — Métricas
          </h1>
          <p className="mt-2 text-gray-600">
            KPIs, gráficos e análise de desempenho
          </p>
        </div>

        {/* Filtros */}
        <Card className="p-6 mb-6">
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Período
              </label>
              <Select value={String(hours)} onValueChange={handleHoursChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">Últimas 6h</SelectItem>
                  <SelectItem value="12">Últimas 12h</SelectItem>
                  <SelectItem value="24">Últimas 24h</SelectItem>
                  <SelectItem value="48">Últimas 48h</SelectItem>
                  <SelectItem value="168">Últimos 7 dias</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleRefresh}
              disabled={metricsQuery.isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Atualizar
            </Button>
          </div>
        </Card>

        {metricsQuery.isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin">
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <p className="mt-4 text-gray-600">Carregando métricas...</p>
          </div>
        ) : (
          <>
            {/* KPIs Grid */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <KpiCard title="Total de Pedidos" value={kpi?.total ?? null} />
              <KpiCard title="Entregues" value={kpi?.delivered ?? null} />
              <KpiCard
                title="Taxa de Conclusão"
                value={kpi?.completionRate ?? null}
                unit="%"
              />
              <KpiCard
                title="Pedidos Pendentes"
                value={
                  kpi
                    ? kpi.total -
                      (kpi.delivered +
                        (byStatus.PICKED_UP || 0) +
                        (byStatus.ASSIGNED || 0))
                    : null
                }
              />
            </div>

            {/* Tempos Médios */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <KpiCard
                title="PAID → CONFIRMED"
                value={kpi?.avgConfirmMin ?? null}
                unit=" min"
              />
              <KpiCard
                title="CONFIRMED → ASSIGNED"
                value={kpi?.avgAssignMin ?? null}
                unit=" min"
              />
              <KpiCard
                title="ASSIGNED → PICKED_UP"
                value={kpi?.avgPickupMin ?? null}
                unit=" min"
              />
              <KpiCard
                title="PICKED_UP → DELIVERED"
                value={kpi?.avgDeliverMin ?? null}
                unit=" min"
              />
            </div>

            {/* Status Breakdown */}
            <Card className="p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Distribuição por Status
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {Object.entries(byStatus).map(([status, count]) => (
                  <div
                    key={status}
                    className="rounded-lg border border-gray-200 p-3 text-center"
                  >
                    <div className="text-xs font-medium text-gray-600">
                      {status}
                    </div>
                    <div className="mt-2 text-2xl font-bold text-green-700">
                      {count}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Time Series Chart */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Pedidos por Hora
              </h2>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={data?.series || []}
                    margin={{ top: 10, right: 20, bottom: 10, left: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="created"
                      stroke="#006A3A"
                      dot={false}
                      name="Criados"
                    />
                    <Line
                      type="monotone"
                      dataKey="delivered"
                      stroke="#F4C542"
                      dot={false}
                      name="Entregues"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
