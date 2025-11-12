/**
 * Brazukas Delivery - JWT Authentication
 * Mock para desenvolvimento, será substituído por Manus Auth em produção
 */

import * as jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "dev_brazukas_secret_change_me";
const EXPIRES_IN = "2d";

export interface JWTPayload {
  sub: string;
  role: "admin" | "merchant" | "driver" | "client";
  email: string;
  iat?: number;
  exp?: number;
}

/**
 * Assina um JWT
 */
export function sign(payload: Omit<JWTPayload, "iat" | "exp">): string {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
}

/**
 * Verifica um JWT
 */
export function verify(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

/**
 * Extrai o token do header Authorization
 */
export function extractToken(authHeader: string | undefined): string | null {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.substring(7);
}
