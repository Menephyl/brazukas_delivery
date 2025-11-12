/**
 * Brazukas Delivery - Merchant Notification Center
 * Centro de notificações para comerciante com alertas de novos pedidos
 */

import { useEffect, useState } from "react";
import { Bell, X, Volume2, AlertCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface Notification {
  id: string;
  type: "new_order" | "order_update" | "payment_received" | "review" | "system";
  title: string;
  message: string;
  orderId?: number;
  createdAt: Date;
  read: boolean;
}

interface MerchantNotificationCenterProps {
  merchantId: number;
  onNewOrder?: (orderId: number) => void;
}

export default function MerchantNotificationCenter({
  merchantId,
  onNewOrder,
}: MerchantNotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [enableSound, setEnableSound] = useState(true);

  const { data: notificationsData } = trpc.merchantNotifications.listNotifications.useQuery(
    { merchantId, limit: 20 },
    { refetchInterval: 5000 } // Atualizar a cada 5 segundos
  );

  const { data: unreadData } = trpc.merchantNotifications.getUnreadCount.useQuery(
    { merchantId },
    { refetchInterval: 10000 } // Atualizar a cada 10 segundos
  );

  const markAsReadMutation = trpc.merchantNotifications.markAsRead.useMutation();
  const markAllAsReadMutation = trpc.merchantNotifications.markAllAsRead.useMutation();
  const deleteNotificationMutation = trpc.merchantNotifications.deleteNotification.useMutation();

  useEffect(() => {
    if (notificationsData) {
      setNotifications(notificationsData as Notification[]);
    }
  }, [notificationsData]);

  useEffect(() => {
    if (unreadData) {
      setUnreadCount(unreadData.unreadCount);
    }
  }, [unreadData]);

  // Reproduzir som quando nova notificação chega
  useEffect(() => {
    if (notifications.length > 0 && enableSound) {
      const newNotification = notifications[0];
      if (!newNotification.read && newNotification.type === "new_order") {
        playNotificationSound();
        if (newNotification.orderId && onNewOrder) {
          onNewOrder(newNotification.orderId);
        }
      }
    }
  }, [notifications, enableSound, onNewOrder]);

  const playNotificationSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = "sine";

    gain.gain.setValueAtTime(0.3, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const handleMarkAsRead = async (notificationId: string) => {
    await markAsReadMutation.mutateAsync({ notificationId });
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsReadMutation.mutateAsync({ merchantId });
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const handleDelete = async (notificationId: string) => {
    await deleteNotificationMutation.mutateAsync({ notificationId });
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "new_order":
        return "🛒";
      case "payment_received":
        return "💰";
      case "order_update":
        return "📦";
      case "review":
        return "⭐";
      case "system":
        return "ℹ️";
      default:
        return "🔔";
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "new_order":
        return "bg-blue-50 border-blue-200";
      case "payment_received":
        return "bg-green-50 border-green-200";
      case "order_update":
        return "bg-yellow-50 border-yellow-200";
      case "review":
        return "bg-purple-50 border-purple-200";
      case "system":
        return "bg-gray-50 border-gray-200";
      default:
        return "bg-white border-gray-200";
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Agora";
    if (minutes < 60) return `${minutes}m atrás`;
    if (hours < 24) return `${hours}h atrás`;
    if (days < 7) return `${days}d atrás`;
    return new Date(date).toLocaleDateString("pt-BR");
  };

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-muted rounded-lg transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-96 bg-white border border-border rounded-lg shadow-lg z-50">
          {/* Header */}
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="font-bold text-lg">Notificações</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEnableSound(!enableSound)}
                className={`p-2 rounded-lg transition-colors ${
                  enableSound ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"
                }`}
                title={enableSound ? "Som ativado" : "Som desativado"}
              >
                <Volume2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-muted rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Nenhuma notificação</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-border last:border-b-0 ${getNotificationColor(
                    notification.type
                  )} transition-colors hover:bg-opacity-75 cursor-pointer`}
                  onClick={() => {
                    if (!notification.read) {
                      handleMarkAsRead(notification.id);
                    }
                  }}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl">{getNotificationIcon(notification.type)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-sm">{notification.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-muted-foreground">
                          {formatTime(notification.createdAt)}
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(notification.id);
                          }}
                          className="text-xs text-red-600 hover:text-red-700"
                        >
                          Deletar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {unreadCount > 0 && (
            <div className="p-3 border-t border-border">
              <button
                onClick={handleMarkAllAsRead}
                className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Marcar todas como lidas
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
