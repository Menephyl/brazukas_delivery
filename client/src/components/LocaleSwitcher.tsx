import { getLocale, setLocale } from "@/lib/i18n";
import { Globe } from "lucide-react";

export default function LocaleSwitcher() {
  const locale = typeof window !== "undefined" ? getLocale() : "pt";

  return (
    <div className="flex items-center gap-2 bg-white/10 rounded-lg p-1">
      <button
        onClick={() => setLocale("pt")}
        className={`px-3 py-1 rounded text-sm font-medium transition-all ${
          locale === "pt"
            ? "bg-white text-primary"
            : "text-white hover:bg-white/20"
        }`}
      >
        PT
      </button>
      <button
        onClick={() => setLocale("es")}
        className={`px-3 py-1 rounded text-sm font-medium transition-all ${
          locale === "es"
            ? "bg-white text-primary"
            : "text-white hover:bg-white/20"
        }`}
      >
        ES
      </button>
    </div>
  );
}
