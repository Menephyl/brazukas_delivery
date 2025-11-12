/**
 * Brazukas Delivery - Admin Health Page
 * Monitora status de Manus, mock e fallback
 */

import { useEffect, useState } from "react";
import { API_BASE_URL, USE_MOCK } from "@/lib/config";
import { checkBackend, ping } from "@/lib/health";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, Zap } from "lucide-react";

interface PingResult {
  ok: boolean;
  ms: number;
}

export default function AdminHealthPage() {
  const [manus, setManus] = useState<PingResult>({ ok: false, ms: 0 });
  const [mock, setMock] = useState<PingResult>({ ok: false, ms: 0 });
  const [ordersCount, setOrdersCount] = useState(0);
  const [fallback, setFallback] = useState(false);
  const [loading, setLoading] = useState(true);

  const healthQuery = trpc.health.check.useQuery();
  const ordersQuery = trpc.orders.list.useQuery();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        // Testa Manus
        const backendOk = await checkBackend();
        const manusPing = await ping(`${API_BASE_URL}/health`);
        setManus({ ok: backendOk && manusPing.ok, ms: manusPing.ms });
        setFallback(!backendOk);

        // Testa Mock
        const mockPing = await ping("/api/health");
        setMock(mockPing);

        // Conta pedidos
        if (ordersQuery.data) {
          const count = Array.isArray(ordersQuery.data)
            ? ordersQuery.data.length
            : (ordersQuery.data as any)?.items?.length || 0;
          setOrdersCount(count);
        }
      } catch (err) {
        console.error("Health check error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [ordersQuery.data]);

  const StatusBadge = ({ ok, ms }: PingResult) => (
    <div className="flex items-center gap-2">
      {ok ? (
        <CheckCircle2 className="h-5 w-5 text-green-600" />
      ) : (
        <AlertCircle className="h-5 w-5 text-red-600" />
      )}
      <span className={ok ? "text-green-700 font-semibold" : "text-red-700 font-semibold"}>
        {ok ? "Online" : "Offline"}
      </span>
      {ms > 0 && (
        <span className="text-sm text-gray-500">({ms}ms)</span>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin — Health Check
          </h1>
          <p className="mt-2 text-gray-600">
            Monitore o status de seus backends e fallback automático
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin">
              <Zap className="h-8 w-8 text-green-600" />
            </div>
            <p className="mt-4 text-gray-600">Verificando status...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Manus Status */}
            <Card className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Backend (Manus)
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    {API_BASE_URL}/health
                  </p>
                </div>
                <StatusBadge {...manus} />
              </div>
            </Card>

            {/* Mock Status */}
            <Card className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Mock Local
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">/api/health</p>
                </div>
                <StatusBadge {...mock} />
              </div>
            </Card>

            {/* Fallback Status */}
            <Card className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Fallback
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    {fallback
                      ? "Ativo (usando mock)"
                      : USE_MOCK
                      ? "Forçado por flag (mock)"
                      : "Inativo (usando Manus)"}
                  </p>
                </div>
                <Badge
                  variant={fallback ? "secondary" : "outline"}
                  className={
                    fallback
                      ? "bg-orange-100 text-orange-800"
                      : "bg-gray-100 text-gray-800"
                  }
                >
                  {fallback ? "Ativo" : "Inativo"}
                </Badge>
              </div>
            </Card>

            {/* Orders Count */}
            <Card className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Pedidos na Fila
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    Total de pedidos registrados
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-green-600">
                    {ordersCount}
                  </p>
                </div>
              </div>
            </Card>

            {/* Info Box */}
            <Card className="p-6 bg-blue-50 border-blue-200">
              <h3 className="font-semibold text-blue-900">ℹ️ Informações</h3>
              <ul className="mt-3 space-y-2 text-sm text-blue-800">
                <li>
                  • Se Manus estiver offline, o app automaticamente cai para
                  mock
                </li>
                <li>
                  • Verifique os logs em{" "}
                  <code className="bg-white px-2 py-1 rounded">
                    /admin/logs
                  </code>{" "}
                  para detalhes de erros
                </li>
                <li>
                  • Latência em ms indica tempo de resposta do servidor
                </li>
              </ul>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
