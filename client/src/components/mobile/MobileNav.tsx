
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
            <div className="fixed bottom-0 left-0 z-[9999] w-full border-t border-border bg-background pb-[calc(env(safe-area-inset-bottom)+50px)] md:hidden shadow-[0_-5px_10px_rgba(0,0,0,0.05)]">
                <nav className="grid h-16 grid-cols-4">
                    <Link href="/" className="flex flex-col items-center justify-center gap-1">
                        <div className={`p-1 rounded-full transition-colors ${isActive('/') ? 'text-primary' : 'text-zinc-500'}`}>
                            <Home size={24} strokeWidth={isActive('/') ? 2.5 : 2} />
                        </div>
                        <span className={`text-[11px] font-medium leading-none ${isActive('/') ? 'text-primary' : 'text-zinc-500'}`}>
                            Inicio
                        </span>
                    </Link>

                    <a href="#" onClick={(e) => handleComingSoonClick(e, "Promoções")} className="flex flex-col items-center justify-center gap-1 cursor-pointer">
                        <div className={`p-1 rounded-full transition-colors ${isActive('/promocoes') ? 'text-primary' : 'text-zinc-500'}`}>
                            <Percent size={24} strokeWidth={isActive('/promocoes') ? 2.5 : 2} />
                        </div>
                        <span className={`text-[11px] font-medium leading-none ${isActive('/promocoes') ? 'text-primary' : 'text-zinc-500'}`}>
                            Promoções
                        </span>
                    </a>

                    <a href="#" onClick={(e) => handleComingSoonClick(e, "Meus Pedidos")} className="flex flex-col items-center justify-center gap-1 cursor-pointer">
                        <div className={`p-1 rounded-full transition-colors ${isActive('/pedidos') ? 'text-primary' : 'text-zinc-500'}`}>
                            <FileText size={24} strokeWidth={isActive('/pedidos') ? 2.5 : 2} />
                        </div>
                        <span className={`text-[11px] font-medium leading-none ${isActive('/pedidos') ? 'text-primary' : 'text-zinc-500'}`}>
                            Pedidos
                        </span>
                    </a>

                    <Link href={user ? "/profile" : "#"} onClick={handleProfileClick} className="flex flex-col items-center justify-center gap-1">
                        <div className={`p-1 rounded-full transition-colors ${isActive('/profile') ? 'text-primary' : 'text-zinc-500'}`}>
                            <User size={24} strokeWidth={isActive('/profile') ? 2.5 : 2} />
                        </div>
                        <span className={`text-[11px] font-medium leading-none ${isActive('/profile') ? 'text-primary' : 'text-zinc-500'}`}>
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
