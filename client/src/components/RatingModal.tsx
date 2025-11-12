/**
 * Brazukas Delivery - RatingModal Component
 * Modal para avaliar lojas e produtos
 */

import { useState } from "react";
import { X, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import RatingStars from "./RatingStars";

interface RatingModalProps {
  title: string;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => Promise<void>;
}

export default function RatingModal({ title, onClose, onSubmit }: RatingModalProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (rating === 0) {
      setError("Por favor, selecione uma avaliação");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await onSubmit(rating, comment);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao enviar avaliação");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Avaliar {title}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Rating Selection */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-3">Qual sua avaliação?</p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`h-8 w-8 ${
                    star <= rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Comentário (opcional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Compartilhe sua experiência..."
            maxLength={500}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600 resize-none"
            rows={4}
          />
          <p className="text-xs text-gray-500 mt-1">
            {comment.length}/500 caracteres
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || rating === 0}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            {loading ? "Enviando..." : "Enviar Avaliação"}
          </Button>
        </div>
      </div>
    </div>
  );
}
