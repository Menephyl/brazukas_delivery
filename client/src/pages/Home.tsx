import { useState, useEffect } from "react";
import { fetchMerchants, Merchant } from "@/lib/api-mock";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StoreCard from "@/components/StoreCard";
import SearchBar from "@/components/SearchBar";
import FilterPanel from "@/components/FilterPanel";
import { MapPin, Zap, Filter } from "lucide-react";

export default function Home() {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [filteredMerchants, setFilteredMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchMerchants()
      .then(setMerchants)
      .catch(() => setMerchants([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    // Filtrar lojas por busca
    const filtered = merchants.filter((m) =>
      m.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.descricao && m.descricao.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredMerchants(filtered);
  }, [searchQuery, merchants]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary to-primary/80 py-12 sm:py-16">
          <div className="container">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/20 px-4 py-2 text-sm font-medium text-primary-foreground">
                <Zap className="h-4 w-4" />
                Novo em Ciudad del Este
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-primary-foreground">
                O Delivery da Comunidade
              </h1>
              <p className="text-lg text-primary-foreground/90 max-w-2xl">
                Peça dos melhores estabelecimentos de Ciudad del Este. Rápido, seguro e feito por brasileiros para brasileiros.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <a
                  href="#lojas"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-foreground px-6 py-3 font-semibold text-primary hover:opacity-90 transition-opacity"
                >
                  <MapPin className="h-5 w-5" />
                  Ver Lojas
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Lojas Section */}
        <section id="lojas" className="py-12 sm:py-16">
          <div className="container">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Lojas em Destaque</h2>
              <p className="text-muted-foreground mb-6">
                Escolha entre os melhores estabelecimentos da região
              </p>

              {/* Busca e Filtros */}
              <div className="flex gap-4 items-start">
                <div className="flex-1">
                  <SearchBar
                    placeholder="Buscar lojas..."
                    onSearch={setSearchQuery}
                    onClear={() => setSearchQuery("")}
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="mt-0 px-4 py-3 rounded-lg border border-border hover:bg-muted transition flex items-center gap-2"
                >
                  <Filter className="h-5 w-5" />
                  <span className="hidden sm:inline">Filtros</span>
                </button>
              </div>

              {/* Painel de Filtros */}
              {showFilters && (
                <div className="mt-6 rounded-lg border border-border bg-card p-6">
                  <FilterPanel
                    onClose={() => setShowFilters(false)}
                  />
                </div>
              )}
            </div>

            {/* Grid de Lojas */}
            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-80 rounded-2xl bg-muted animate-pulse"
                  />
                ))}
              </div>
            ) : filteredMerchants.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredMerchants.map((merchant) => (
                  <StoreCard key={merchant.id} store={merchant} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border p-12 text-center">
                <p className="text-muted-foreground">
                  {searchQuery
                    ? `Nenhuma loja encontrada para "${searchQuery}"`
                    : "Nenhuma loja disponível no momento"}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 sm:py-16 bg-muted/30">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Por que escolher Brazukas?
            </h2>
            <div className="grid gap-8 sm:grid-cols-3">
              <div className="text-center">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Rápido</h3>
                <p className="text-sm text-muted-foreground">
                  Entrega rápida e confiável na sua região
                </p>
              </div>
              <div className="text-center">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Local</h3>
                <p className="text-sm text-muted-foreground">
                  Apoiando o comércio local da fronteira
                </p>
              </div>
              <div className="text-center">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Seguro</h3>
                <p className="text-sm text-muted-foreground">
                  Transações seguras e dados protegidos
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
