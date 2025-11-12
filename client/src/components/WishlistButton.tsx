/**
 * Brazukas Delivery - WishlistButton Component
 * Botão para adicionar/remover de favoritos
 */

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";

interface WishlistButtonProps {
  itemId: string;
  itemName: string;
  onToggle?: (isFavorite: boolean) => void;
}

export default function WishlistButton({
  itemId,
  itemName,
  onToggle,
}: WishlistButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // Check if item is in wishlist
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setIsFavorite(wishlist.includes(itemId));
  }, [itemId]);

  const handleToggle = () => {
    let wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");

    if (isFavorite) {
      wishlist = wishlist.filter((id: string) => id !== itemId);
    } else {
      wishlist.push(itemId);
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    setIsFavorite(!isFavorite);
    onToggle?.(!isFavorite);
  };

  return (
    <button
      onClick={handleToggle}
      className={`p-2 rounded-full transition-all ${
        isFavorite
          ? "bg-red-100 text-red-500 hover:bg-red-200"
          : "bg-muted text-muted-foreground hover:bg-muted/80"
      }`}
      title={isFavorite ? `Remover ${itemName} dos favoritos` : `Adicionar ${itemName} aos favoritos`}
    >
      <Heart
        className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`}
      />
    </button>
  );
}
