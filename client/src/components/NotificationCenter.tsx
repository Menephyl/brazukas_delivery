/**
 * Brazukas Delivery - NotificationCenter Component
 * Centro de notificações com suporte a notificações em tempo real
 */

import { useState, useEffect } from "react";
import { Bell, X, Check, AlertCircle } from "lucide-react";

export interface Notification {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface NotificationCenterProps {
  onNotification?: (notification: Notification) => void;
}

export default function NotificationCenter({ onNotification }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const addNotification = (
    type: Notification["type"],
    title: string,
    message: string
  ) => {
    const notification: Notification = {
      id: `notif-${Date.now()}`,
      type,
      title,
      message,
      timestamp: new Date(),
      read: false,
    };

    setNotifications((prev) => [notification, ...prev].slice(0, 20));
    onNotification?.(notification);

    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
    }, 5000);
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <Check className="h-5 w-5 text-green-600" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-blue-600" />;
    }
  };

  const getBgColor = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "error":
        return "bg-red-50 border-red-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      default:
        return "bg-blue-50 border-blue-200";
    }
  };

  // Expose methods globally for testing
  useEffect(() => {
    (window as any).notificationCenter = {
      success: (title: string, message: string) =>
        addNotification("success", title, message),
      error: (title: string, message: string) =>
        addNotification("error", title, message),
      warning: (title: string, message: string) =>
        addNotification("warning", title, message),
      info: (title: string, message: string) =>
        addNotification("info", title, message),
    };
  }, []);

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-muted rounded-lg transition"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 h-5 w-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center font-bold">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-lg border border-border bg-card shadow-lg z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="font-semibold">Notificações</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-muted rounded transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              <div className="divide-y divide-border">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => markAsRead(notif.id)}
                    className={`p-4 cursor-pointer hover:bg-muted/50 transition border-l-4 ${
                      notif.type === "success"
                        ? "border-l-green-600"
                        : notif.type === "error"
                        ? "border-l-red-600"
                        : notif.type === "warning"
                        ? "border-l-yellow-600"
                        : "border-l-blue-600"
                    } ${!notif.read ? "bg-muted/30" : ""}`}
                  >
                    <div className="flex gap-3">
                      {getIcon(notif.type)}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{notif.title}</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {notif.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {notif.timestamp.toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNotification(notif.id);
                        }}
                        className="p-1 hover:bg-muted rounded transition"
                      >
                        <X className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                <p className="text-sm text-muted-foreground">
                  Nenhuma notificação
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
