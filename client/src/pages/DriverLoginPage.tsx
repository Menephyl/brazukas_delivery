/**
 * Brazukas Delivery - Driver Login
 * Autenticação de entregadores
 */

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AlertCircle } from "lucide-react";

export default function DriverLoginPage() {
  const [email, setEmail] = useState("driver@brazukas.app");
  const [password, setPassword] = useState("brazukas2025");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const r = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await r.json();

      if (!r.ok) {
        setError(data.error || "Falha no login");
        setLoading(false);
        return;
      }

      localStorage.setItem("bz_driver_token", data.token);
      localStorage.setItem("driver_id", data.driverId || "driver-1");
      window.location.href = "/driver";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao fazer login");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-sm">
          <div className="rounded-2xl border border-border bg-card p-8">
            <h1 className="text-2xl font-bold mb-2">Entregador</h1>
            <p className="text-sm text-muted-foreground mb-6">
              Acesse sua conta para gerenciar entregas
            </p>

            {error && (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 flex gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="driver@brazukas.app"
                  className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Senha</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-primary px-4 py-3 font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Entrando..." : "Entrar"}
              </button>
            </form>

            <p className="mt-6 text-xs text-muted-foreground text-center">
              Credenciais de teste:
              <br />
              driver@brazukas.app / brazukas2025
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
