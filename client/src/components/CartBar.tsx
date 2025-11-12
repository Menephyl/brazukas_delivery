import { calculateTotals } from "@/lib/cart";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "wouter";

export default function CartBar() {
  const [totals, setTotals] = useState(calculateTotals());

  useEffect(() => {
    // Atualiza totais a cada 500ms
    const interval = setInterval(() => {
      setTotals(calculateTotals());
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Se carrinho vazio, não exibe
  if (totals.itemCount === 0) {
    return null;
  }

  const formattedTotal = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "PYG",
    maximumFractionDigits: 0,
  }).format(totals.total);

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
      <div className="container">
        <Link href="/checkout">
          <button className="w-full flex items-center justify-between gap-3 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              <span>{totals.itemCount} item{totals.itemCount > 1 ? "s" : ""}</span>
            </div>
            <span>{formattedTotal}</span>
          </button>
        </Link>
      </div>
    </div>
  );
}
