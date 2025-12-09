
import { Home, Percent, FileText, User } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { AuthModal } from "@/components/auth/AuthModal";
import { ComingSoonModal } from "@/components/ComingSoonModal";

export function MobileNav() {
    const [location] = useLocation();
    const { user } = useAuth();
    const [authModalOpen, setAuthModalOpen] = useState(false);

    // Coming Soon Modal State
    const [comingSoonOpen, setComingSoonOpen] = useState(false);
    const [comingSoonTitle, setComingSoonTitle] = useState("");

    const isActive = (path: string) => location === path;

    const handleProfileClick = (e: React.MouseEvent) => {
        if (!user) {
            e.preventDefault();
            setAuthModalOpen(true);
        }
    };

    const handleComingSoonClick = (e: React.MouseEvent, title: string) => {
        e.preventDefault();
        setComingSoonTitle(title);
        setComingSoonOpen(true);
    };

    return (
        <>
            <div className="fixed bottom-0 left-0 z-50 w-full border-t border-border bg-background pb-safe md:hidden">
                <nav className="grid h-16 grid-cols-4">
                    <Link href="/" className="flex flex-col items-center justify-center gap-1">
                        <div className={`p-1 rounded-full transition-colors ${isActive('/') ? 'text-primary' : 'text-muted-foreground'}`}>
                            <Home size={24} strokeWidth={isActive('/') ? 2.5 : 2} />
                        </div>
                        <span className={`text-[10px] font-medium ${isActive('/') ? 'text-primary' : 'text-muted-foreground'}`}>
                            Inicio
                        </span>
                    </Link>

                    <a href="#" onClick={(e) => handleComingSoonClick(e, "Promoções")} className="flex flex-col items-center justify-center gap-1 cursor-pointer">
                        <div className={`p-1 rounded-full transition-colors ${isActive('/promocoes') ? 'text-primary' : 'text-muted-foreground'}`}>
                            <Percent size={24} strokeWidth={isActive('/promocoes') ? 2.5 : 2} />
                        </div>
                        <span className={`text-[10px] font-medium ${isActive('/promocoes') ? 'text-primary' : 'text-muted-foreground'}`}>
                            Promoções
                        </span>
                    </a>

                    <a href="#" onClick={(e) => handleComingSoonClick(e, "Meus Pedidos")} className="flex flex-col items-center justify-center gap-1 cursor-pointer">
                        <div className={`p-1 rounded-full transition-colors ${isActive('/pedidos') ? 'text-primary' : 'text-muted-foreground'}`}>
                            <FileText size={24} strokeWidth={isActive('/pedidos') ? 2.5 : 2} />
                        </div>
                        <span className={`text-[10px] font-medium ${isActive('/pedidos') ? 'text-primary' : 'text-muted-foreground'}`}>
                            Pedidos
                        </span>
                    </a>

                    <Link href={user ? "/profile" : "#"} onClick={handleProfileClick} className="flex flex-col items-center justify-center gap-1">
                        <div className={`p-1 rounded-full transition-colors ${isActive('/profile') ? 'text-primary' : 'text-muted-foreground'}`}>
                            <User size={24} strokeWidth={isActive('/profile') ? 2.5 : 2} />
                        </div>
                        <span className={`text-[10px] font-medium ${isActive('/profile') ? 'text-primary' : 'text-muted-foreground'}`}>
                            Meu Perfil
                        </span>
                    </Link>
                </nav>
            </div>

            <AuthModal
                isOpen={authModalOpen}
                onClose={() => setAuthModalOpen(false)}
                defaultTab="login"
            />

            <ComingSoonModal
                open={comingSoonOpen}
                onOpenChange={setComingSoonOpen}
                title={comingSoonTitle}
            />
        </>
    );
}
