import { Product } from "@/lib/api-mock";
import { Plus } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
}

export default function ProductCard({ product, onAdd }: ProductCardProps) {
  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "PYG",
    maximumFractionDigits: 0,
  }).format(product.preco);

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
      {/* Imagem */}
      <div className="relative h-40 w-full overflow-hidden bg-muted">
        <img
          src={product.foto}
          alt={product.nome}
          className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Conteúdo */}
      <div className="p-4">
        <h3 className="font-semibold">{product.nome}</h3>

        {/* Descrição */}
        {product.descricao && (
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {product.descricao}
          </p>
        )}

        {/* Preço e Botão */}
        <div className="mt-3 flex items-center justify-between">
          <span className="font-bold text-primary">{formattedPrice}</span>
          <button
            onClick={() => onAdd(product)}
            className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Adicionar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
