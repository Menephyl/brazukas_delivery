/**
 * Brazukas Delivery - FilterPanel Component
 * Componente de filtros para lojas e produtos
 */

import { useState } from "react";
import { ChevronDown, X } from "lucide-react";

interface FilterOption {
  id: string;
  label: string;
  value: string;
}

interface FilterPanelProps {
  categories?: FilterOption[];
  onCategoryChange?: (category: string | null) => void;
  onPriceChange?: (min: number, max: number) => void;
  onRatingChange?: (minRating: number) => void;
  onClose?: () => void;
}

export default function FilterPanel({
  categories = [],
  onCategoryChange,
  onPriceChange,
  onRatingChange,
  onClose,
}: FilterPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [minRating, setMinRating] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const handleCategoryChange = (categoryId: string) => {
    const newCategory = selectedCategory === categoryId ? null : categoryId;
    setSelectedCategory(newCategory);
    onCategoryChange?.(newCategory);
  };

  const handlePriceChange = (type: "min" | "max", value: number) => {
    const newRange = { ...priceRange, [type]: value };
    setPriceRange(newRange);
    onPriceChange?.(newRange.min, newRange.max);
  };

  const handleRatingChange = (rating: number) => {
    setMinRating(rating);
    onRatingChange?.(rating);
  };

  const handleClear = () => {
    setSelectedCategory(null);
    setPriceRange({ min: 0, max: 100000 });
    setMinRating(0);
    onCategoryChange?.(null);
    onPriceChange?.(0, 100000);
    onRatingChange?.(0);
  };

  const hasActiveFilters = selectedCategory || minRating > 0 || priceRange.min > 0 || priceRange.max < 100000;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filtros</h3>
        <div className="flex gap-2">
          {hasActiveFilters && (
            <button
              onClick={handleClear}
              className="text-sm text-primary hover:opacity-80 transition-opacity"
            >
              Limpar
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-muted rounded transition"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Categorias */}
      {categories.length > 0 && (
        <div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted transition"
          >
            <span className="font-medium">Categoria</span>
            <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
          </button>
          {isOpen && (
            <div className="mt-2 space-y-2 pl-3">
              {categories.map((cat) => (
                <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedCategory === cat.id}
                    onChange={() => handleCategoryChange(cat.id)}
                    className="rounded border-border"
                  />
                  <span className="text-sm">{cat.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Preço */}
      <div>
        <label className="block text-sm font-medium mb-2">Preço</label>
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="number"
              value={priceRange.min}
              onChange={(e) => handlePriceChange("min", Number(e.target.value))}
              placeholder="Mín"
              className="flex-1 px-3 py-2 rounded border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="number"
              value={priceRange.max}
              onChange={(e) => handlePriceChange("max", Number(e.target.value))}
              placeholder="Máx"
              className="flex-1 px-3 py-2 rounded border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* Rating */}
      <div>
        <label className="block text-sm font-medium mb-2">Avaliação Mínima</label>
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              onClick={() => handleRatingChange(rating)}
              className={`px-3 py-2 rounded text-sm font-medium transition ${
                minRating === rating
                  ? "bg-primary text-primary-foreground"
                  : "border border-border hover:bg-muted"
              }`}
            >
              {rating === 0 ? "Todos" : `${rating}⭐`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
