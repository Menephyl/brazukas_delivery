import { APP_LOGO, APP_TITLE } from "@/const";
import { ShoppingCart } from "lucide-react";
import { Link } from "wouter";
import { getCartItemCount } from "@/lib/cart";
import { useEffect, useState } from "react";
import NotificationCenter from "./NotificationCenter";

export default function Header() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Atualiza contagem do carrinho a cada 500ms
    const interval = setInterval(() => {
      setCartCount(getCartItemCount());
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo e título */}
        <Link href="/" className="flex items-center gap-2">
          <img src={APP_LOGO} alt={APP_TITLE} className="h-8 w-8 rounded" />
          <span className="hidden font-bold text-lg sm:inline">{APP_TITLE}</span>
        </Link>

        {/* Navegação */}
        <nav className="flex items-center gap-4">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
            Lojas
          </Link>
          <Link href="/history" className="text-sm font-medium hover:text-primary transition-colors">
            Histórico
          </Link>
          <Link href="/coupons" className="text-sm font-medium hover:text-primary transition-colors">
            Cupóns
          </Link>
          <NotificationCenter />
          <Link href="/checkout" className="relative">
            <button className="relative inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity">
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Carrinho</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
