import { Merchant } from "@/lib/api-mock";
import { Clock } from "lucide-react";
import { Link } from "wouter";
import RatingStars from "./RatingStars";

interface StoreCardProps {
  store: Merchant;
}

export default function StoreCard({ store }: StoreCardProps) {
  return (
    <Link href={`/store/${store.id}`}>
      <div className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow cursor-pointer">
        {/* Banner */}
        <div className="relative h-40 w-full overflow-hidden bg-muted">
          <img
            src={store.banner}
            alt={store.nome}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        {/* Conteúdo */}
        <div className="p-4">
          <h3 className="font-semibold text-lg">{store.nome}</h3>
          <p className="text-sm text-muted-foreground">{store.categoria}</p>

          {/* Descrição */}
          {store.descricao && (
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
              {store.descricao}
            </p>
          )}

          {/* Avaliação e Tempo */}
          <div className="mt-3 flex items-center justify-between text-sm">
            {store.avaliacao && (
              <RatingStars rating={store.avaliacao} size="sm" />
            )}
            {store.tempoEntrega && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{store.tempoEntrega} min</span>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="mt-4">
            <button className="w-full rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity">
              Ver cardápio
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
