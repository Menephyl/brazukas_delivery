/**
 * Brazukas Delivery - ReviewForm Component
 * Componente para submeter avaliações de lojas
 */

import { useState } from "react";
import { Star, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReviewFormProps {
  merchantId: string | number;
  merchantName: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function ReviewForm({
  merchantId,
  merchantName,
  onSuccess,
  onError,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rating) {
      onError?.("Por favor, selecione uma classificação");
      return;
    }

    if (!userName.trim()) {
      onError?.("Por favor, informe seu nome");
      return;
    }

    setLoading(true);

    try {
      // Simular envio para API
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Mock success
      setSubmitted(true);
      onSuccess?.();

      // Reset form after 2 seconds
      setTimeout(() => {
        setRating(0);
        setComment("");
        setUserName("");
        setSubmitted(false);
      }, 2000);
    } catch (error) {
      onError?.(error instanceof Error ? error.message : "Erro ao enviar avaliação");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center animate-slide-up">
        <div className="text-4xl mb-3">✓</div>
        <h3 className="font-semibold text-green-900 mb-1">Avaliação Enviada!</h3>
        <p className="text-sm text-green-800">
          Obrigado por avaliar {merchantName}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-border bg-card p-6 space-y-4">
      <div>
        <h3 className="font-semibold mb-3">Avalie {merchantName}</h3>

        {/* Star Rating */}
        <div className="flex gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="transition-transform hover:scale-110"
            >
              <Star
                className={`h-8 w-8 ${
                  star <= (hoverRating || rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground"
                }`}
              />
            </button>
          ))}
        </div>

        {rating > 0 && (
          <p className="text-sm text-muted-foreground mb-4">
            {rating === 1 && "Péssimo"}
            {rating === 2 && "Ruim"}
            {rating === 3 && "Bom"}
            {rating === 4 && "Muito Bom"}
            {rating === 5 && "Excelente"}
          </p>
        )}
      </div>

      {/* Name Input */}
      <div>
        <label className="block text-sm font-medium mb-2">Seu Nome</label>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Digite seu nome"
          maxLength={100}
          disabled={loading}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
        />
      </div>

      {/* Comment Input */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Comentário (opcional)
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value.slice(0, 500))}
          placeholder="Compartilhe sua experiência..."
          maxLength={500}
          rows={4}
          disabled={loading}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 resize-none"
        />
        <p className="text-xs text-muted-foreground mt-1">
          {comment.length}/500 caracteres
        </p>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={loading || !rating || !userName.trim()}
        className="w-full bg-primary hover:bg-primary/90"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Enviando...
          </>
        ) : (
          <>
            <Send className="h-4 w-4 mr-2" />
            Enviar Avaliação
          </>
        )}
      </Button>
    </form>
  );
}
