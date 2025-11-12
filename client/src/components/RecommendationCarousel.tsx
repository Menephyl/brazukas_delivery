/**
 * Brazukas Delivery - RecommendationCarousel Component
 * Componente para exibir recomendações de lojas
 */

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star, Clock, Loader2 } from "lucide-react";
import { Link } from "wouter";

interface Store {
  id: string;
  name: string;
  category: string;
  rating: number;
  image: string;
  deliveryTime: number;
  description: string;
}

interface RecommendationCarouselProps {
  title: string;
  type: "personalized" | "trending" | "quick-delivery";
  limit?: number;
}

export default function RecommendationCarousel({
  title,
  type,
  limit = 6,
}: RecommendationCarouselProps) {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    loadRecommendations();
  }, [type]);

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      // Simular carregamento de API
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock data
      const mockStores: Store[] = [
        {
          id: "1",
          name: "Brasil Burgers",
          category: "Lanches",
          rating: 4.8,
          image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500",
          deliveryTime: 30,
          description: "Os melhores hambúrgueres da fronteira",
        },
        {
          id: "2",
          name: "Sushi da Fronteira",
          category: "Japonesa",
          rating: 4.9,
          image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500",
          deliveryTime: 40,
          description: "Sushi fresco todos os dias",
        },
        {
          id: "3",
          name: "Açaí do Leste",
          category: "Saudável",
          rating: 4.7,
          image: "https://images.unsplash.com/photo-1590080876-c9f0f3f1b3b5?w=500",
          deliveryTime: 20,
          description: "Açaí natural e saudável",
        },
        {
          id: "4",
          name: "Pizzaria Brasil",
          category: "Italiana",
          rating: 4.6,
          image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=500",
          deliveryTime: 35,
          description: "Pizza autêntica ao forno de lenha",
        },
        {
          id: "5",
          name: "Tacos Fronterizos",
          category: "Mexicana",
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500",
          deliveryTime: 25,
          description: "Tacos e burritos autênticos",
        },
        {
          id: "6",
          name: "Café do Comércio",
          category: "Café & Doces",
          rating: 4.9,
          image: "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500",
          deliveryTime: 15,
          description: "Café premium e bolos caseiros",
        },
      ];

      setStores(mockStores.slice(0, limit));
    } catch (error) {
      console.error("Erro ao carregar recomendações:", error);
    } finally {
      setLoading(false);
    }
  };

  const scroll = (direction: "left" | "right") => {
    const container = document.getElementById(`carousel-${type}`);
    if (container) {
      const scrollAmount = 320; // card width + gap
      const newPosition =
        direction === "left"
          ? Math.max(0, scrollPosition - scrollAmount)
          : scrollPosition + scrollAmount;

      container.scrollLeft = newPosition;
      setScrollPosition(newPosition);
    }
  };

  if (loading) {
    return (
      <section className="py-8">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-80 h-64 rounded-lg bg-muted animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>

      {stores.length > 0 ? (
        <div className="relative">
          {/* Scroll Buttons */}
          {scrollPosition > 0 && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}

          {scrollPosition < (stores.length - 3) * 320 && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}

          {/* Carousel */}
          <div
            id={`carousel-${type}`}
            className="flex gap-4 overflow-x-auto pb-4 scroll-smooth"
            style={{ scrollBehavior: "smooth" }}
          >
            {stores.map((store) => (
              <Link key={store.id} href={`/store/${store.id}`}>
                <div className="flex-shrink-0 w-80 rounded-lg border border-border bg-card overflow-hidden hover:shadow-lg transition cursor-pointer animate-fade-in">
                  {/* Image */}
                  <div className="relative h-40 overflow-hidden bg-muted">
                    <img
                      src={store.image}
                      alt={store.name}
                      className="w-full h-full object-cover hover:scale-105 transition"
                    />
                    <div className="absolute top-2 right-2 bg-white rounded-full px-3 py-1 flex items-center gap-1 shadow">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-sm">{store.rating}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold mb-1 line-clamp-1">{store.name}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{store.category}</p>
                    <p className="text-sm text-foreground mb-3 line-clamp-2">
                      {store.description}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{store.deliveryTime} min</span>
                      </div>
                      <span className="text-primary font-medium">Ver cardápio →</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground">Nenhuma recomendação disponível</p>
        </div>
      )}
    </section>
  );
}
