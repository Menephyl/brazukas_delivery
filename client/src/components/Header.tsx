
import { APP_LOGO, APP_TITLE } from "@/const";
import { ShoppingCart, Sun, Moon, LogOut } from "lucide-react";
import { Link } from "wouter";
import { getCartItemCount } from "@/lib/cart";
import { useEffect, useState } from "react";
import NotificationCenter from "./NotificationCenter";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { ComingSoonModal } from "./ComingSoonModal";
import { LocationSelector } from "./LocationSelector";
import { AuthModal } from "./auth/AuthModal";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Header() {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [cartCount, setCartCount] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");

  // Auth Modal State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "register">("login");

  useEffect(() => {
    // Atualiza contagem do carrinho a cada 500ms
    const interval = setInterval(() => {
      setCartCount(getCartItemCount());
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const openAuthModal = (tab: "login" | "register") => {
    setAuthTab(tab);
    setAuthModalOpen(true);
  };

  return (
    <header className="hidden md:block sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center flex-1 gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <img src={APP_LOGO} alt={APP_TITLE} className="h-8 w-8 rounded" />
          <span className="hidden lg:inline font-bold text-lg">{APP_TITLE}</span>
        </Link>

        {/* Location Selector */}
        <div className="hidden sm:block">
          <LocationSelector />
        </div>

        {/* Separator / Spacer */}
        <div className="flex-1" />

        {/* Navigation - Desktop Links */}
        <nav className="hidden md:flex items-center gap-6 mr-4">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
            Lojas
          </Link>
          <Link href="/history" className="text-sm font-medium hover:text-primary transition-colors">
            Histórico
          </Link>
          <Link href="/coupons" className="text-sm font-medium hover:text-primary transition-colors">
            Cupóns
          </Link>
        </nav>

        {/* Actions Area */}
        <div className="flex items-center gap-2 sm:gap-4">

          <NotificationCenter />

          <Link href="/checkout" className="relative group">
            <button className="relative inline-flex items-center gap-2 rounded-full bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity">
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Carrinho</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs font-bold text-white shadow-sm ring-1 ring-background">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </button>
          </Link>

          {!user && (
            <div className="flex items-center gap-2 ml-2">
              <Button size="sm" onClick={() => openAuthModal("login")}>
                Entrar
              </Button>
            </div>
          )}

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email} />
                    <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.user_metadata?.full_name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">Perfil</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">Configurações</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()} className="text-red-500 focus:text-red-500">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="rounded-full p-2 text-foreground/80 hover:bg-accent hover:text-foreground transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Alternar tema"
          >
            {theme === "dark" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <ComingSoonModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={modalTitle}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab={authTab}
      />
    </header>
  );
}
