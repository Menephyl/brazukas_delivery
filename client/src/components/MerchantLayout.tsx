/**
 * Brazukas Delivery - Merchant Layout
 * Layout com sidebar para painel do comerciante
 */

import { useState } from "react";
import { useLocation } from "wouter";
import { Menu, X, LogOut, BarChart3, ShoppingBag, Settings, Home, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MerchantLayoutProps {
  children: React.ReactNode;
  merchantId: number;
  merchantName: string;
}

export default function MerchantLayout({ children, merchantId, merchantName }: MerchantLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [, setLocation] = useLocation();

  const navItems = [
    {
      icon: Home,
      label: "Dashboard",
      href: `/merchant/dashboard/${merchantId}`,
    },
    {
      icon: ShoppingCart,
      label: "Pedidos",
      href: `/merchant/orders/${merchantId}`,
    },
    {
      icon: ShoppingBag,
      label: "Produtos",
      href: `/merchant/products/${merchantId}`,
    },
    {
      icon: BarChart3,
      label: "Análise",
      href: `/merchant/analytics/${merchantId}`,
    },
    {
      icon: Settings,
      label: "Configurações",
      href: `/merchant/settings/${merchantId}`,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("merchant_token");
    setLocation("/");
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-card border-r border-border transition-all duration-300 flex flex-col`}
      >
        {/* Logo/Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          {sidebarOpen && (
            <div>
              <h2 className="font-bold text-lg">Brazukas</h2>
              <p className="text-xs text-muted-foreground">Painel do Comerciante</p>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-muted rounded-lg"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </a>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border space-y-2">
          {sidebarOpen && (
            <div className="px-4 py-2 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground">Conectado como</p>
              <p className="text-sm font-medium truncate">{merchantName}</p>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start gap-2"
          >
            <LogOut className="w-4 h-4" />
            {sidebarOpen && "Sair"}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
