import { useState } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Lock, AlertCircle } from "lucide-react";

const ADMIN_PASSWORD = "brazukas2025"; // DEV ONLY - Mude em produção

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simula validação
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        localStorage.setItem("bz_admin_token", "ok");
        setLocation("/admin");
      } else {
        setError("Senha incorreta. Tente novamente.");
        setPassword("");
      }
      setLoading(false);
    }, 300);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-sm">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <div className="flex justify-center mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Lock className="h-6 w-6 text-primary" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-center mb-2">Painel Admin</h1>
            <p className="text-center text-sm text-muted-foreground mb-6">
              Acesso restrito — Digite sua senha
            </p>

            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 flex gap-2">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  Senha
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={loading || !password}
                className="w-full rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Verificando..." : "Entrar"}
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              <strong>Dev:</strong> Use <code className="bg-muted px-1 rounded">brazukas2025</code>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
