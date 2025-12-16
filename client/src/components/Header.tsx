
import { APP_LOGO, APP_TITLE } from "@/const";
import { ShoppingCart, Sun, Moon, LogOut, Search, User, ChevronDown } from "lucide-react";
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
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center flex-1 gap-4 justify-between">

        {/* Left Section: Logo & Location */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <img src={APP_LOGO} alt={APP_TITLE} className="h-8 w-8 rounded" />
            <span className="hidden lg:inline font-bold text-lg">{APP_TITLE}</span>
          </Link>

          <div className="hidden sm:block">
            <LocationSelector />
          </div>
        </div>

        {/* Center Section: Search Bar (New) */}
        <div className="hidden md:flex flex-1 max-w-[420px] mx-4">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Buscar locales"
              className="w-full h-10 pl-5 pr-12 rounded-full bg-muted/20 border-none focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm placeholder:text-muted-foreground/70"
            />
            <div className="absolute right-1 top-1 h-8 w-8 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors">
              <Search className="h-4 w-4 text-primary-foreground" />
            </div>
          </div>
        </div>

        {/* Right Section: Actions & User */}
        <div className="flex items-center gap-2 sm:gap-4">

          {/* Navigation Links (Desktop) - Reduced visibility to prioritize search */}
          <nav className="hidden xl:flex items-center gap-6 mr-2">
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

          <NotificationCenter />

          <Link href="/checkout" className="relative group">
            <button className="relative inline-flex items-center justify-center h-9 w-9 xl:w-auto xl:h-auto xl:px-3 xl:py-2 xl:gap-2 rounded-full hover:bg-accent transition-colors">
              <ShoppingCart className="h-5 w-5 xl:h-4 xl:w-4" />
              <span className="hidden xl:inline text-sm font-medium">Carrinho</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 xl:h-5 xl:w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white shadow-sm ring-1 ring-background">
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

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer hover:bg-accent/50 p-1.5 px-3 rounded-full transition-colors border border-transparent hover:border-border">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="hidden lg:flex flex-col items-start leading-none">
                    <span className="text-sm font-medium">Mi Perfil</span>
                    {/* Optional: Show minimal email or role if desired, keeping it clean for now as per print */}
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground hidden lg:block" />
                </div>
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
                  <Link href="/history">Meus Pedidos</Link>
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
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="rounded-full p-2 text-foreground/80 hover:bg-accent hover:text-foreground transition-all duration-300 hidden sm:block"
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
