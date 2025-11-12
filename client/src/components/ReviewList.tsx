/**
 * Brazukas Delivery - ReviewList Component
 * Componente para exibir lista de avaliações
 */

import { useState, useEffect } from "react";
import { Star, Loader2 } from "lucide-react";

interface Review {
  id: string;
  rating: number;
  comment: string;
  userName: string;
  createdAt: string;
}

interface ReviewListProps {
  merchantId: string | number;
  limit?: number;
}

export default function ReviewList({ merchantId, limit = 5 }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    loadReviews();
  }, [merchantId]);

  const loadReviews = async () => {
    setLoading(true);
    try {
      // Simular carregamento de API
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock data
      const mockReviews: Review[] = [
        {
          id: "1",
          rating: 5,
          comment: "Excelente comida! Entrega rápida e quente.",
          userName: "João Silva",
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "2",
          rating: 4,
          comment: "Muito bom, mas demorou um pouco.",
          userName: "Maria Santos",
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "3",
          rating: 5,
          comment: "Sushi fresco e delicioso!",
          userName: "Pedro Costa",
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];

      setReviews(mockReviews.slice(0, limit));
      setAverageRating(4.7);
      setTotalReviews(mockReviews.length);
    } catch (error) {
      console.error("Erro ao carregar avaliações:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Hoje";
    if (diffDays === 1) return "Ontem";
    if (diffDays < 7) return `${diffDays} dias atrás`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} semanas atrás`;
    return `${Math.floor(diffDays / 30)} meses atrás`;
  };

  if (loading) {
    return (
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header com rating médio */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-4xl font-bold text-primary">{averageRating}</p>
            <p className="text-sm text-muted-foreground">de 5</p>
          </div>
          <div>
            <div className="flex gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.round(averageRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              {totalReviews} avaliação{totalReviews !== 1 ? "ões" : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Lista de avaliações */}
      <div className="space-y-3">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-lg border border-border bg-card p-4 animate-fade-in"
            >
              {/* Header da avaliação */}
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium">{review.userName}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(review.createdAt)}
                  </p>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Comentário */}
              {review.comment && (
                <p className="text-sm text-foreground">{review.comment}</p>
              )}
            </div>
          ))
        ) : (
          <div className="rounded-lg border border-dashed border-border bg-card p-8 text-center">
            <p className="text-muted-foreground">Nenhuma avaliação ainda</p>
          </div>
        )}
      </div>
    </div>
  );
}
