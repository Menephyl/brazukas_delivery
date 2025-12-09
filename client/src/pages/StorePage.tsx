import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { fetchMerchant, fetchProducts, Merchant, Product } from "@/lib/api-mock";
import { addItem } from "@/lib/cart";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import CartBar from "@/components/CartBar";
import { ArrowLeft, Star, Clock, MapPin, SlidersHorizontal } from "lucide-react";
import { Link } from "wouter";
import { ComingSoonModal } from "@/components/ComingSoonModal";

export default function StorePage() {
  const [, params] = useRoute("/store/:id");
  const merchantId = params?.id ? parseInt(params.id) : null;

  const [merchant, setMerchant] = useState<Merchant | null | undefined>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!merchantId) return;

    Promise.all([
      fetchMerchant(merchantId).then((m) => setMerchant(m || null)),
      fetchProducts(merchantId).then(setProducts),
    ]).finally(() => setLoading(false));
  }, [merchantId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-8">
          <div className="h-48 rounded-2xl bg-muted animate-pulse mb-6" />
          <div className="h-10 w-1/3 bg-muted animate-pulse rounded mb-8" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!merchant) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-8 text-center">
          <p className="text-muted-foreground">Loja não encontrada</p>
          <Link href="/">
            <button className="mt-4 rounded-lg bg-primary px-6 py-2 font-medium text-primary-foreground hover:opacity-90">
              Voltar às lojas
            </button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container py-6">
          {/* Voltar */}
          <Link href="/">
            <button className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Voltar às lojas
            </button>
          </Link>

          {/* Banner da loja */}
          <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-muted mb-6">
            <img
              src={merchant.banner}
              alt={merchant.nome}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>

          {/* Informações da loja */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{merchant.nome}</h1>
            <p className="text-muted-foreground mb-4">{merchant.categoria}</p>

            {merchant.descricao && (
              <p className="text-lg text-muted-foreground mb-4">
                {merchant.descricao}
              </p>
            )}

            {/* Detalhes */}
            <div className="flex flex-wrap gap-6">
              {merchant.avaliacao && (
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{merchant.avaliacao}</span>
                  <span className="text-sm text-muted-foreground">(avaliação)</span>
                </div>
              )}
              {merchant.tempoEntrega && (
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <span className="font-semibold">{merchant.tempoEntrega} min</span>
                  <span className="text-sm text-muted-foreground">de entrega</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">
                  Ciudad del Este
                </span>
              </div>
            </div>
          </div>

          {/* Produtos */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Cardápio</h2>
              <button
                onClick={() => setModalOpen(true)}
                className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filtros e Categorias
              </button>
            </div>

            {products.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 pb-24">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAdd={(p) => {
                      addItem({
                        ...p,
                        merchantId: merchant.id,
                        qty: 1,
                      });
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border p-12 text-center">
                <p className="text-muted-foreground mb-4">
                  Nenhum produto disponível no momento
                </p>
                <button
                  onClick={() => setModalOpen(true)}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Solicitar Cardápio
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <CartBar />
      <Footer />
      <ComingSoonModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title="Filtros e Categorias"
        description="Em breve você poderá filtrar por categorias, preço e dietas específicas."
      />
    </div>
  );
}
