/**
 * Brazukas Delivery - Admin Metrics Advanced Page
 * Ranking de lojas e entregadores com filtros e exportação CSV
 */

import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw, Download } from "lucide-react";

interface StoreMetricsLocal {
  merchantId: string;
  name: string | null;
  count: number;
  delivered: number;
  sla: {
    paid_to_confirmed: number | null;
    confirmed_to_assigned: number | null;
    assigned_to_picked: number | null;
    picked_to_delivered: number | null;
    total_paid_to_delivered: number | null;
  };
}

interface DriverMetricsLocal {
  driverId: string;
  name: string;
  vehicle: string;
  count: number;
  delivered: number;
  sla: {
    paid_to_confirmed: number | null;
    confirmed_to_assigned: number | null;
    assigned_to_picked: number | null;
    picked_to_delivered: number | null;
    total_paid_to_delivered: number | null;
  };
}

function isoToday(delta: number = 0): string {
  const dt = new Date();
  dt.setDate(dt.getDate() + delta);
  return dt.toISOString().slice(0, 10);
}

function fmt(d: number | null): string {
  if (d == null) return "—";
  return `${d} min`;
}

function pct(x: number): string {
  return `${x}%`;
}

export default function AdminMetricsAdvancedPage() {
  const [start, setStart] = useState(isoToday(-7));
  const [end, setEnd] = useState(isoToday(0));
  const [merchantId, setMerchantId] = useState("");
  const [tab, setTab] = useState<"stores" | "drivers">("stores");

  const summaryQuery = trpc.metricsDetailed.summary.useQuery({
    start: `${start}T00:00:00Z`,
    end: `${end}T23:59:59Z`,
    merchantId: merchantId || undefined,
  });

  const storesQuery = trpc.metricsDetailed.storeRanking.useQuery({
    start: `${start}T00:00:00Z`,
    end: `${end}T23:59:59Z`,
    limit: 50,
  });

  const driversQuery = trpc.metricsDetailed.driverRanking.useQuery({
    start: `${start}T00:00:00Z`,
    end: `${end}T23:59:59Z`,
    limit: 50,
  });

  const storesCSVQuery = trpc.csvExport.stores.useQuery({
    start: `${start}T00:00:00Z`,
    end: `${end}T23:59:59Z`,
    merchantId: merchantId || undefined,
  });

  const driversCSVQuery = trpc.csvExport.drivers.useQuery({
    start: `${start}T00:00:00Z`,
    end: `${end}T23:59:59Z`,
    merchantId: merchantId || undefined,
  });

  const handleExportStores = () => {
    if (!storesCSVQuery.data?.csv) return;
    const blob = new Blob([storesCSVQuery.data.csv], {
      type: "text/csv; charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = storesCSVQuery.data.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportDrivers = () => {
    if (!driversCSVQuery.data?.csv) return;
    const blob = new Blob([driversCSVQuery.data.csv], {
      type: "text/csv; charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = driversCSVQuery.data.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const isLoading =
    summaryQuery.isLoading ||
    storesQuery.isLoading ||
    driversQuery.isLoading;

  const data = summaryQuery.data;
  const stores = storesQuery.data || [];
  const drivers = driversQuery.data || [];

  const KpiCard = ({
    title,
    value,
    unit = "",
  }: {
    title: string;
    value: number | null | undefined;
    unit?: string;
  }) => (
    <Card className="p-4">
      <div className="text-sm text-gray-600">{title}</div>
      <div className="mt-2 text-3xl font-bold text-green-700">
        {value !== null && value !== undefined ? `${value}${unit}` : "—"}
      </div>
    </Card>
  );

  const Th = ({ children }: { children: React.ReactNode }) => (
    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">
      {children}
    </th>
  );

  const Td = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <td className={`px-3 py-2 text-sm text-gray-900 ${className}`}>{children}</td>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin — Métricas Avançadas
          </h1>
          <p className="mt-2 text-gray-600">
            Ranking de lojas e entregadores com SLA e exportação
          </p>
        </div>

        {/* Filtros */}
        <Card className="p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Início
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={start}
                onChange={(e) => setStart(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fim
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loja (opcional)
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="merchantId"
                value={merchantId}
                onChange={(e) => setMerchantId(e.target.value)}
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={() => {
                  summaryQuery.refetch();
                  storesQuery.refetch();
                  driversQuery.refetch();
                }}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 disabled:opacity-50"
              >
                <RefreshCw className="h-4 w-4" />
                Aplicar
              </button>
            </div>
          </div>
        </Card>

        {/* KPIs */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
          <KpiCard title="Pedidos" value={data?.kpi?.total} />
          <KpiCard title="Entregues" value={data?.kpi?.delivered} />
          <KpiCard title="Taxa Conclusão" value={data?.kpi?.completionRate} unit="%" />
          <KpiCard
            title="Período"
            value={`${start} → ${end}`.length}
            unit=""
          />
        </div>

        {/* Abas */}
        <div className="mb-6 flex gap-2 border-b border-gray-200">
          <button
            className={`px-4 py-2 font-medium ${
              tab === "stores"
                ? "border-b-2 border-green-700 text-green-700"
                : "text-gray-600"
            }`}
            onClick={() => setTab("stores")}
          >
            Ranking — Lojas
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              tab === "drivers"
                ? "border-b-2 border-green-700 text-green-700"
                : "text-gray-600"
            }`}
            onClick={() => setTab("drivers")}
          >
            Ranking — Entregadores
          </button>
        </div>

        {/* Tabela de Lojas */}
        {tab === "stores" && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Ranking por SLA Total
              </h2>
              <button
                onClick={handleExportStores}
                disabled={storesCSVQuery.isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 disabled:opacity-50"
              >
                <Download className="h-4 w-4" />
                Exportar CSV
              </button>
            </div>
            <div className="overflow-auto">
              <table className="min-w-full text-sm">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <Th>#</Th>
                    <Th>Loja</Th>
                    <Th>Pedidos</Th>
                    <Th>Entregues</Th>
                    <Th>Conclusão</Th>
                    <Th>PAID→CONF</Th>
                    <Th>CONF→ASSIGN</Th>
                    <Th>ASSIGN→PICK</Th>
                    <Th>PICK→DELIV</Th>
                    <Th>Total SLA</Th>
                  </tr>
                </thead>
                <tbody>
                  {stores.map((s: StoreMetricsLocal, i: number) => (
                    <tr key={s.merchantId} className="border-b hover:bg-gray-50">
                      <Td>{i + 1}</Td>
                      <Td className="font-medium" >{s.name}</Td>
                      <Td>{s.count}</Td>
                      <Td>{s.delivered}</Td>
                      <Td>
                        {pct(
                          s.count
                            ? Math.round((s.delivered / s.count) * 100)
                            : 0
                        )}
                      </Td>
                      <Td>{fmt(s.sla.paid_to_confirmed)}</Td>
                      <Td>{fmt(s.sla.confirmed_to_assigned)}</Td>
                      <Td>{fmt(s.sla.assigned_to_picked)}</Td>
                      <Td>{fmt(s.sla.picked_to_delivered)}</Td>
                      <Td className="font-semibold text-green-700">
                        {fmt(s.sla.total_paid_to_delivered)}
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!stores.length && (
                <div className="text-center py-8 text-gray-600">
                  Nenhuma loja encontrada
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Tabela de Entregadores */}
        {tab === "drivers" && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Ranking por SLA Total
              </h2>
              <button
                onClick={handleExportDrivers}
                disabled={driversCSVQuery.isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 disabled:opacity-50"
              >
                <Download className="h-4 w-4" />
                Exportar CSV
              </button>
            </div>
            <div className="overflow-auto">
              <table className="min-w-full text-sm">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <Th>#</Th>
                    <Th>Entregador</Th>
                    <Th>Veículo</Th>
                    <Th>Pedidos</Th>
                    <Th>Entregues</Th>
                    <Th>Conclusão</Th>
                    <Th>PAID→CONF</Th>
                    <Th>CONF→ASSIGN</Th>
                    <Th>ASSIGN→PICK</Th>
                    <Th>PICK→DELIV</Th>
                    <Th>Total SLA</Th>
                  </tr>
                </thead>
                <tbody>
                  {drivers.map((d: DriverMetricsLocal, i: number) => (
                    <tr key={d.driverId} className="border-b hover:bg-gray-50">
                      <Td>{i + 1}</Td>
                      <Td className="font-medium">{d.name}</Td>
                      <Td>{d.vehicle}</Td>
                      <Td>{d.count}</Td>
                      <Td>{d.delivered}</Td>
                      <Td>
                        {pct(
                          d.count
                            ? Math.round((d.delivered / d.count) * 100)
                            : 0
                        )}
                      </Td>
                      <Td>{fmt(d.sla.paid_to_confirmed)}</Td>
                      <Td>{fmt(d.sla.confirmed_to_assigned)}</Td>
                      <Td>{fmt(d.sla.assigned_to_picked)}</Td>
                      <Td>{fmt(d.sla.picked_to_delivered)}</Td>
                      <Td className="font-semibold text-green-700">
                        {fmt(d.sla.total_paid_to_delivered)}
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!drivers.length && (
                <div className="text-center py-8 text-gray-600">
                  Nenhum entregador encontrado
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
