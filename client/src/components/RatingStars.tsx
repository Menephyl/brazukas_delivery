/**
 * Brazukas Delivery - RatingStars Component
 * Componente para exibir e interagir com avaliações em estrelas
 */

import { Star } from "lucide-react";

interface RatingStarsProps {
  rating: number;
  count?: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
  size?: "sm" | "md" | "lg";
}

export default function RatingStars({
  rating,
  count,
  interactive = false,
  onRate,
  size = "md",
}: RatingStarsProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const handleRate = (value: number) => {
    if (interactive && onRate) {
      onRate(value);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRate(star)}
            className={`transition-transform ${
              interactive ? "hover:scale-110 cursor-pointer" : "cursor-default"
            }`}
          >
            <Star
              className={`${sizeClasses[size]} ${
                star <= Math.round(rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground"
              }`}
            />
          </button>
        ))}
      </div>
      <div className="flex items-center gap-1 text-sm">
        <span className="font-semibold">{rating.toFixed(1)}</span>
        {count && <span className="text-muted-foreground">({count})</span>}
      </div>
    </div>
  );
}
