/**
 * Brazukas Delivery - NotificationPanel Component
 * Componente para exibir painel de notificações push
 */

import { useState, useEffect } from "react";
import {
  Bell,
  CheckCircle,
  Truck,
  Package,
  DollarSign,
  Trash2,
  Loader2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Notification {
  id: string;
  type: "order_confirmed" | "driver_assigned" | "order_picked_up" | "order_delivered" | "payment_received";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface NotificationPanelProps {
  userId: string | number;
  onClose?: () => void;
}

const notificationIcons = {
  order_confirmed: <CheckCircle className="h-5 w-5 text-green-500" />,
  driver_assigned: <Truck className="h-5 w-5 text-blue-500" />,
  order_picked_up: <Package className="h-5 w-5 text-yellow-500" />,
  order_delivered: <CheckCircle className="h-5 w-5 text-green-600" />,
  payment_received: <DollarSign className="h-5 w-5 text-purple-500" />,
};

const notificationColors = {
  order_confirmed: "bg-green-50 border-green-200",
  driver_assigned: "bg-blue-50 border-blue-200",
  order_picked_up: "bg-yellow-50 border-yellow-200",
  order_delivered: "bg-green-50 border-green-200",
  payment_received: "bg-purple-50 border-purple-200",
};

export default function NotificationPanel({
  userId,
  onClose,
}: NotificationPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadNotifications();
  }, [userId]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      // Simular carregamento de notificações
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock data
      const mockNotifications: Notification[] = [
        {
          id: "1",
          type: "order_confirmed",
          title: "Pedido Confirmado",
          message: "Seu pedido #1234 foi confirmado com sucesso!",
          read: false,
          createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        },
        {
          id: "2",
          type: "driver_assigned",
          title: "Entregador Atribuído",
          message: "João está a caminho com seu pedido",
          read: false,
          createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        },
        {
          id: "3",
          type: "order_picked_up",
          title: "Pedido Retirado",
          message: "Seu pedido foi retirado da loja",
          read: true,
          createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        },
      ];

      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter((n) => !n.read).length);
    } catch (error) {
      console.error("Erro ao carregar notificações:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
    setUnreadCount(Math.max(0, unreadCount - 1));
  };

  const handleDelete = async (notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  };

  const handleMarkAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Agora";
    if (diffMins < 60) return `${diffMins}m atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays < 7) return `${diffDays}d atrás`;
    return date.toLocaleDateString("pt-BR");
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-end">
      <div className="w-full max-w-md h-screen bg-background flex flex-col rounded-l-lg shadow-xl animate-slide-left">
        {/* Header */}
        <div className="border-b border-border p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <h2 className="font-semibold">Notificações</h2>
            {unreadCount > 0 && (
              <span className="bg-primary text-primary-foreground text-xs font-bold rounded-full px-2 py-0.5">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-lg transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Actions */}
        {unreadCount > 0 && (
          <div className="border-b border-border px-4 py-2">
            <button
              onClick={handleMarkAllAsRead}
              className="text-sm text-primary hover:underline font-medium"
            >
              Marcar tudo como lido
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : notifications.length > 0 ? (
            <div className="space-y-2 p-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`rounded-lg border p-4 transition ${
                    notification.read
                      ? "bg-background border-border"
                      : `${notificationColors[notification.type]} border-2`
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {notificationIcons[notification.type]}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">{notification.title}</p>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatTime(notification.createdAt)}
                      </p>
                    </div>

                    <div className="flex-shrink-0 flex gap-1">
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="p-1 hover:bg-muted rounded transition"
                          title="Marcar como lido"
                        >
                          <CheckCircle className="h-4 w-4 text-muted-foreground hover:text-primary" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notification.id)}
                        className="p-1 hover:bg-muted rounded transition"
                        title="Deletar"
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mb-3 opacity-50" />
              <p className="text-muted-foreground">Nenhuma notificação</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border p-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={onClose}
          >
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
}
