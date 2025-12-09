
import { MapPin, Search, Sun, Moon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { LocationSelector } from "@/components/LocationSelector";
import { APP_LOGO } from "@/const";
import { useTheme } from "@/contexts/ThemeContext";

export function MobileHeader() {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="flex flex-col gap-3 bg-primary p-4 pb-6 md:hidden">
            {/* Line 1: Location & Logo */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white">
                    <LocationSelector textColor="text-white" />
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={toggleTheme}
                        className="rounded-full p-1 text-white hover:bg-white/10 transition-colors"
                        aria-label="Alternar tema"
                    >
                        {theme === "dark" ? (
                            <Moon className="h-5 w-5" />
                        ) : (
                            <Sun className="h-5 w-5" />
                        )}
                    </button>
                    <img src={APP_LOGO} alt="Logo" className="h-8 w-8 rounded-full bg-white p-0.5" />
                </div>
            </div>

            {/* Line 2: Search */}
            <div className="relative">
                <Input
                    placeholder="Buscar locales..."
                    className="h-10 w-full rounded-full bg-white/20 pl-4 pr-10 text-white shadow-sm placeholder:text-white/70 border-none focus-visible:ring-0 focus-visible:bg-white/30 transition-colors"
                />
                <div className="absolute right-0 top-0 flex h-full w-10 items-center justify-center rounded-r-full">
                    <Search className="h-5 w-5 text-white/70" />
                </div>
            </div>
        </div>
    );
}
