/**
 * Brazukas Delivery - Admin Logs Page
 * Visualiza e filtra logs de erros e avisos
 */

import { useEffect, useState } from "react";
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
import { AlertCircle, AlertTriangle, Info, Trash2 } from "lucide-react";

interface LogEntry {
  ts: string;
  level: "error" | "warn" | "info";
  source: string;
  path: string;
  method: string;
  status: number | null;
  message: string;
  meta?: any;
}

export default function AdminLogsPage() {
  const [level, setLevel] = useState<string>("");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const logsQuery = trpc.health.logs.useQuery({ level: level || undefined });
  const clearMutation = trpc.health.clearLogs.useMutation();

  useEffect(() => {
    if (logsQuery.data) {
      setLogs(logsQuery.data as LogEntry[]);
      setLoading(false);
    }
  }, [logsQuery.data]);

  const handleClear = async () => {
    if (!confirm("Tem certeza que deseja limpar todos os logs?")) return;
    try {
      await clearMutation.mutateAsync();
      setLogs([]);
    } catch (err) {
      console.error("Error clearing logs:", err);
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case "warn":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case "info":
        return <Info className="h-4 w-4 text-blue-600" />;
      default:
        return null;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "error":
        return "bg-red-50 border-red-200";
      case "warn":
        return "bg-yellow-50 border-yellow-200";
      case "info":
        return "bg-blue-50 border-blue-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin — Logs
          </h1>
          <p className="mt-2 text-gray-600">
            Visualize erros e avisos do sistema
          </p>
        </div>

        {/* Filtros */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por Nível
              </label>
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Todos os níveis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="error">Errors</SelectItem>
                  <SelectItem value="warn">Warnings</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 pt-6">
              <Button
                variant="outline"
                onClick={() => logsQuery.refetch()}
                disabled={logsQuery.isLoading}
              >
                Atualizar
              </Button>
              <Button
                variant="destructive"
                onClick={handleClear}
                disabled={clearMutation.isPending || logs.length === 0}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Limpar
              </Button>
            </div>
          </div>
        </Card>

        {/* Logs Table */}
        <Card className="overflow-hidden">
          <div className="max-h-[70vh] overflow-auto">
            {logsQuery.isLoading ? (
              <div className="p-6 text-center text-gray-600">
                Carregando logs...
              </div>
            ) : logs.length === 0 ? (
              <div className="p-6 text-center text-gray-600">
                Nenhum log encontrado
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-gray-100 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">
                      Data
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">
                      Nível
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">
                      Fonte
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">
                      Método
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">
                      Path
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">
                      Mensagem
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log, idx) => (
                    <tr
                      key={idx}
                      className={`border-b ${getLevelColor(log.level)}`}
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-600">
                        {new Date(log.ts).toLocaleString("pt-BR")}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {getLevelIcon(log.level)}
                          <span className="capitalize font-medium">
                            {log.level}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {log.source}
                      </td>
                      <td className="px-4 py-3 font-mono text-gray-700">
                        {log.method}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {log.status ?? "—"}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-700 break-all max-w-xs">
                        {log.path}
                      </td>
                      <td className="px-4 py-3 text-gray-700 break-all max-w-sm">
                        {log.message}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>

        {/* Info */}
        <Card className="mt-6 p-6 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-blue-900">ℹ️ Informações</h3>
          <ul className="mt-3 space-y-2 text-sm text-blue-800">
            <li>
              • Logs são persistidos localmente em{" "}
              <code className="bg-white px-2 py-1 rounded">
                data/logs.json
              </code>
            </li>
            <li>• Mantém as últimas 2000 entradas</li>
            <li>
              • Erros são capturados automaticamente pelo wrapper HTTP
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
