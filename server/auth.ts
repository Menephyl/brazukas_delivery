/**
 * Brazukas Delivery - JWT Authentication
 * Wrapper around server/_core/jwt.ts for backward compatibility.
 * Uses jose for consistency with sdk.ts implementation.
 */

import { issueToken, verifyToken } from "./_core/jwt";
export type { JWTPayload } from "./_core/jwt";

/**
 * Assina um JWT (uses jose library via _core/jwt.ts).
 * Note: This now returns a Promise. Callers should await.
 */
export async function sign(
  payload: Record<string, any>,
  expiresIn: string = "7d"
): Promise<string> {
  return issueToken(payload, expiresIn);
}

/**
 * Verifica um JWT (returns Promise for consistency with async jose verification).
 */
export async function verify(
  token: string
): Promise<Record<string, any> | null> {
  return verifyToken(token);
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
