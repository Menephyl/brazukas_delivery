/**
 * Brazukas Delivery - Audit Log System
 * Sistema de auditoria para registrar eventos importantes
 */

interface AuditEvent {
  timestamp: string;
  event: string;
  userId?: number | string;
  userRole?: string;
  resourceType?: string;
  resourceId?: string | number;
  action?: string;
  changes?: Record<string, any>;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  status: "success" | "failure";
  errorMessage?: string;
}

// Armazenamento em memória (em produção, usar banco de dados)
const auditLogs: AuditEvent[] = [];

/**
 * Registrar um evento de auditoria
 */
export async function audit(
  event: string,
  data: Partial<AuditEvent> = {}
): Promise<void> {
  const auditEvent: AuditEvent = {
    timestamp: new Date().toISOString(),
    event,
    status: data.status || "success",
    ...data,
  };

  // Log no console
  console.log("[AUDIT]", JSON.stringify(auditEvent));

  // Armazenar em memória
  auditLogs.push(auditEvent);

  // Manter apenas últimos 10000 eventos
  if (auditLogs.length > 10000) {
    auditLogs.shift();
  }

  // Em produção, enviar para serviço de logging (Sentry, DataDog, etc)
  if (process.env.NODE_ENV === "production") {
    try {
      // Exemplo: enviar para Sentry
      // await Sentry.captureMessage(JSON.stringify(auditEvent), 'info');
    } catch (error) {
      console.error("[AUDIT] Erro ao enviar evento:", error);
    }
  }
}

/**
 * Obter logs de auditoria
 */
export function getAuditLogs(
  filter?: Partial<AuditEvent>
): AuditEvent[] {
  if (!filter) {
    return auditLogs;
  }

  return auditLogs.filter((log) => {
    for (const [key, value] of Object.entries(filter)) {
      if (log[key as keyof AuditEvent] !== value) {
        return false;
      }
    }
    return true;
  });
}

/**
 * Limpar logs de auditoria
 */
export function clearAuditLogs(): void {
  auditLogs.length = 0;
}

/**
 * Eventos de auditoria predefinidos
 */
export const auditEvents = {
  // Autenticação
  USER_LOGIN: "USER_LOGIN",
  USER_LOGOUT: "USER_LOGOUT",
  USER_SIGNUP: "USER_SIGNUP",
  PASSWORD_CHANGE: "PASSWORD_CHANGE",
  PASSWORD_RESET: "PASSWORD_RESET",

  // Pedidos
  ORDER_CREATED: "ORDER_CREATED",
  ORDER_CONFIRMED: "ORDER_CONFIRMED",
  ORDER_CANCELLED: "ORDER_CANCELLED",
  ORDER_STATUS_CHANGED: "ORDER_STATUS_CHANGED",
  ORDER_DELIVERED: "ORDER_DELIVERED",

  // Pagamentos
  PAYMENT_INITIATED: "PAYMENT_INITIATED",
  PAYMENT_COMPLETED: "PAYMENT_COMPLETED",
  PAYMENT_FAILED: "PAYMENT_FAILED",
  PAYMENT_REFUNDED: "PAYMENT_REFUNDED",

  // Comerciantes
  MERCHANT_SIGNUP: "MERCHANT_SIGNUP",
  MERCHANT_UPDATED: "MERCHANT_UPDATED",
  MERCHANT_DELETED: "MERCHANT_DELETED",
  PRODUCT_CREATED: "PRODUCT_CREATED",
  PRODUCT_UPDATED: "PRODUCT_UPDATED",
  PRODUCT_DELETED: "PRODUCT_DELETED",

  // Entregadores
  DRIVER_SIGNUP: "DRIVER_SIGNUP",
  DRIVER_UPDATED: "DRIVER_UPDATED",
  DRIVER_DELETED: "DRIVER_DELETED",
  DRIVER_LOCATION_UPDATE: "DRIVER_LOCATION_UPDATE",

  // Admin
  ADMIN_LOGIN: "ADMIN_LOGIN",
  ADMIN_ACTION: "ADMIN_ACTION",
  SYSTEM_CONFIG_CHANGED: "SYSTEM_CONFIG_CHANGED",

  // Segurança
  SUSPICIOUS_ACTIVITY: "SUSPICIOUS_ACTIVITY",
  RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",
  UNAUTHORIZED_ACCESS: "UNAUTHORIZED_ACCESS",
  DATA_EXPORT: "DATA_EXPORT",
};

/**
 * Helpers para eventos comuns
 */
export async function auditOrderStatusChange(
  orderId: string | number,
  fromStatus: string,
  toStatus: string,
  userId?: string | number,
  userRole?: string
): Promise<void> {
  await audit(auditEvents.ORDER_STATUS_CHANGED, {
    userId,
    userRole,
    resourceType: "order",
    resourceId: orderId,
    action: `${fromStatus} -> ${toStatus}`,
    changes: { status: { from: fromStatus, to: toStatus } },
    status: "success",
  });
}

export async function auditPaymentEvent(
  orderId: string | number,
  event: string,
  amount: number,
  method: string,
  status: "success" | "failure" = "success",
  errorMessage?: string
): Promise<void> {
  await audit(event, {
    resourceType: "payment",
    resourceId: orderId,
    metadata: { amount, method },
    status,
    errorMessage,
  });
}

export async function auditUserAction(
  userId: string | number,
  userRole: string,
  action: string,
  resourceType?: string,
  resourceId?: string | number,
  changes?: Record<string, any>
): Promise<void> {
  await audit(auditEvents.ADMIN_ACTION, {
    userId,
    userRole,
    action,
    resourceType,
    resourceId,
    changes,
    status: "success",
  });
}

export async function auditSecurityEvent(
  event: string,
  ipAddress?: string,
  userAgent?: string,
  metadata?: Record<string, any>
): Promise<void> {
  await audit(event, {
    ipAddress,
    userAgent,
    metadata,
    status: "failure",
  });
}
