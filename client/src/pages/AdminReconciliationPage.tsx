/**
 * Brazukas Delivery - Admin Reconciliation Page
 * Painel financeiro com rastreamento de pagamentos PIX
 */

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { RefreshCw } from "lucide-react";

interface PixTransaction {
  txid: string;
  amount: number;
  payer: string;
  receivedAt: string;
}

export default function AdminReconciliationPage() {
  const [transactions, setTransactions] = useState<PixTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalReceived, setTotalReceived] = useState(0);

  async function load() {
    try {
      const r = await fetch("/api/reconciliation");
      const data = await r.json();
      setTransactions(data);

      const total = data.reduce((sum: number, t: PixTransaction) => sum + t.amount, 0);
      setTotalReceived(total);
      setLoading(false);
    } catch (err) {
      console.error("Erro ao carregar reconciliação:", err);
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container py-8">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold">Reconciliação PIX</h1>
            <button
              onClick={load}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
            >
              <RefreshCw className="h-4 w-4" />
              Atualizar
            </button>
          </div>

          {/* KPI */}
          <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-border bg-card p-6">
              <p className="text-sm text-muted-foreground mb-1">Total Recebido</p>
              <p className="text-3xl font-bold text-green-700">
                R$ {totalReceived.toFixed(2)}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <p className="text-sm text-muted-foreground mb-1">Transações</p>
              <p className="text-3xl font-bold">{transactions.length}</p>
            </div>
          </div>

          {/* Tabela */}
          {loading ? (
            <div className="rounded-2xl border border-border bg-card p-6 text-center">
              <p className="text-muted-foreground">Carregando...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
              <p className="text-lg font-medium text-muted-foreground">
                Nenhuma transação PIX recebida
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted border-b border-border">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">TXID</th>
                      <th className="px-4 py-3 text-left font-semibold">Valor</th>
                      <th className="px-4 py-3 text-left font-semibold">Pagador</th>
                      <th className="px-4 py-3 text-left font-semibold">Recebido em</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx, i) => (
                      <tr key={i} className="border-b border-border hover:bg-muted/50 transition">
                        <td className="px-4 py-3 font-mono text-xs">
                          <code className="bg-muted px-2 py-1 rounded">{tx.txid}</code>
                        </td>
                        <td className="px-4 py-3 font-semibold text-green-700">
                          R$ {tx.amount.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{tx.payer}</td>
                        <td className="px-4 py-3 text-xs">
                          {new Date(tx.receivedAt).toLocaleString("pt-BR")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Voltar */}
          <div className="mt-8">
            <Link href="/admin">
              <button className="rounded-lg border border-border px-4 py-2 font-medium hover:bg-muted transition-colors">
                ← Voltar ao Admin
              </button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
