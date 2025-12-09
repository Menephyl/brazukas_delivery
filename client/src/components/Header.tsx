import { APP_LOGO, APP_TITLE } from "@/const";
import { ShoppingCart } from "lucide-react";
import { Link } from "wouter";
import { getCartItemCount } from "@/lib/cart";
import { useEffect, useState } from "react";
import NotificationCenter from "./NotificationCenter";
import { useAuth } from "@/contexts/AuthContext";
import { ComingSoonModal } from "./ComingSoonModal";

export default function Header() {
  const { user, signOut } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");

  useEffect(() => {
    // Atualiza contagem do carrinho a cada 500ms
    const interval = setInterval(() => {
      setCartCount(getCartItemCount());
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const openModal = (title: string) => {
    setModalTitle(title);
    setModalOpen(true);
  };

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
          <button
            onClick={() => openModal("Área do Parceiro")}
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Sou Parceiro
          </button>
          <button
            onClick={() => openModal("Área do Entregador")}
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Sou Entregador
          </button>

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

          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium">
                  Hello, {user.user_metadata?.full_name?.split(' ')[0] || "Usuário"}
                </span>
              </div>
              <button
                onClick={() => signOut()}
                className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors"
              >
                Sair
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
                Entrar
              </Link>
              <Link href="/register" className="hidden sm:inline-flex rounded-md bg-primary/10 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/20 transition-colors">
                Cadastrar
              </Link>
            </div>
          )}
        </nav>
      </div>

      <ComingSoonModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={modalTitle}
      />
    </header>
  );
}
