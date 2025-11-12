/**
 * Brazukas Delivery - Rate Limit Middleware
 * Middleware para limitar requisições em APIs sensíveis
 */

import { Request, Response } from "express";

interface RateLimitOptions {
  windowMs?: number; // Janela de tempo em ms (padrão: 60s)
  max?: number; // Máximo de requisições por janela (padrão: 60)
}

// Armazenamento em memória para rate limiting
const BUCKET = new Map<string, number[]>();

/**
 * Middleware de rate limiting
 * Retorna true se a requisição foi bloqueada, false caso contrário
 */
export function rateLimit(options: RateLimitOptions = {}) {
  const { windowMs = 60000, max = 60 } = options;

  return (req: Request, res: Response): boolean => {
    // Gerar chave única por IP + URL
    const ip =
      (req.headers["x-real-ip"] as string) ||
      (req.headers["x-forwarded-for"] as string) ||
      req.socket.remoteAddress ||
      "unknown";

    const key = `${ip}:${req.path}`;
    const now = Date.now();

    // Obter histórico de requisições
    const arr = BUCKET.get(key) || [];

    // Filtrar requisições dentro da janela de tempo
    const fresh = arr.filter((timestamp) => now - timestamp < windowMs);
    fresh.push(now);

    // Atualizar bucket
    BUCKET.set(key, fresh);

    // Verificar se excedeu o limite
    if (fresh.length > max) {
      res.status(429).json({
        error: "rate_limited",
        message: `Muitas requisições. Tente novamente em ${Math.ceil(windowMs / 1000)}s.`,
        retryAfter: Math.ceil(windowMs / 1000),
      });
      return true; // Requisição bloqueada
    }

    return false; // Requisição permitida
  };
}

/**
 * Limpar entradas antigas do bucket periodicamente
 * Executar a cada 5 minutos
 */
export function startCleanupInterval() {
  setInterval(() => {
    const now = Date.now();
    const maxAge = 5 * 60 * 1000; // 5 minutos

    const keysToDelete: string[] = [];
    BUCKET.forEach((timestamps, key) => {
      const fresh = timestamps.filter((t: number) => now - t < maxAge);

      if (fresh.length === 0) {
        keysToDelete.push(key);
      } else {
        BUCKET.set(key, fresh);
      }
    });

    keysToDelete.forEach((key) => BUCKET.delete(key));
  }, 5 * 60 * 1000);
}

/**
 * Presets de rate limiting para diferentes tipos de API
 */
export const rateLimitPresets = {
  // APIs públicas - mais permissivo
  public: { windowMs: 60000, max: 120 },

  // APIs de webhook - moderado
  webhook: { windowMs: 60000, max: 100 },

  // APIs de pagamento - restritivo
  payment: { windowMs: 60000, max: 30 },

  // APIs de autenticação - muito restritivo
  auth: { windowMs: 60000, max: 10 },

  // APIs de upload - moderado
  upload: { windowMs: 60000, max: 20 },
};
