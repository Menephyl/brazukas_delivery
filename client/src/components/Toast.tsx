/**
 * Brazukas Delivery - Toast Component
 * Componente para notificações inline com auto-dismiss
 */

import { useState, useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";

interface ToastProps {
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onClose?: () => void;
}

export default function Toast({
  type,
  title,
  message,
  duration = 4000,
  onClose,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const typeConfig = {
    success: {
      bg: "bg-green-50 border-green-200",
      icon: <CheckCircle className="h-5 w-5 text-green-600" />,
      text: "text-green-900",
    },
    error: {
      bg: "bg-red-50 border-red-200",
      icon: <AlertCircle className="h-5 w-5 text-red-600" />,
      text: "text-red-900",
    },
    warning: {
      bg: "bg-yellow-50 border-yellow-200",
      icon: <AlertCircle className="h-5 w-5 text-yellow-600" />,
      text: "text-yellow-900",
    },
    info: {
      bg: "bg-blue-50 border-blue-200",
      icon: <Info className="h-5 w-5 text-blue-600" />,
      text: "text-blue-900",
    },
  };

  const config = typeConfig[type];

  return (
    <div
      className={`fixed bottom-4 right-4 max-w-md rounded-lg border ${config.bg} p-4 shadow-lg animate-slide-up z-50`}
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0">{config.icon}</div>
        <div className="flex-1 min-w-0">
          <p className={`font-semibold ${config.text}`}>{title}</p>
          {message && <p className={`text-sm mt-1 ${config.text} opacity-90`}>{message}</p>}
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            onClose?.();
          }}
          className={`flex-shrink-0 ${config.text} opacity-50 hover:opacity-100 transition`}
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
