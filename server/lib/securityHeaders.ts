/**
 * Brazukas Delivery - Security Headers Middleware
 * Middleware para adicionar headers de segurança
 */

import { Request, Response, NextFunction } from "express";

/**
 * Configurar CORS restrito por origem
 */
export function corsMiddleware(req: Request, res: Response, next: NextFunction) {
  const allowedOrigins = [
    process.env.VITE_FRONTEND_URL || "http://localhost:3000",
    process.env.FRONTEND_URL || "http://localhost:3000",
  ].filter(Boolean);

  const origin = req.headers.origin || "";

  // Verificar se a origem é permitida
  if (allowedOrigins.some((allowed) => origin === allowed || origin.startsWith(allowed))) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }

  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type,Authorization,X-Requested-With"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "86400");

  // Responder a requisições OPTIONS
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  next();
}

/**
 * Adicionar headers de segurança
 */
export function securityHeadersMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Prevenir clickjacking
  res.setHeader("X-Frame-Options", "SAMEORIGIN");

  // Prevenir MIME type sniffing
  res.setHeader("X-Content-Type-Options", "nosniff");

  // Habilitar XSS protection
  res.setHeader("X-XSS-Protection", "1; mode=block");

  // Referrer Policy
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  // Permissions Policy
  res.setHeader(
    "Permissions-Policy",
    "geolocation=(self), microphone=(), camera=()"
  );

  // Content Security Policy (básico)
  const cspHeader = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https:",
    "frame-ancestors 'self'",
  ].join("; ");

  res.setHeader("Content-Security-Policy", cspHeader);

  next();
}

/**
 * Middleware para remover headers sensíveis
 */
export function removeServerHeadersMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Remover header Server
  res.removeHeader("Server");
  res.removeHeader("X-Powered-By");

  next();
}

/**
 * Middleware para adicionar headers de cache
 */
export function cacheHeadersMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // APIs não devem ser cacheadas
  if (req.path.startsWith("/api/")) {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
  }

  // Assets estáticos podem ser cacheados
  if (
    req.path.match(/\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/i)
  ) {
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  }

  next();
}

/**
 * Aplicar todos os middlewares de segurança
 */
export function applySecurityMiddlewares(app: any) {
  app.use(corsMiddleware);
  app.use(securityHeadersMiddleware);
  app.use(removeServerHeadersMiddleware);
  app.use(cacheHeadersMiddleware);
}
