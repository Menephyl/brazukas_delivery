/**
 * JWT Token signing and verification using jose library.
 * Centralized module to unify token handling across auth.ts, routers/auth.ts, and sdk.ts.
 */

import { SignJWT, jwtVerify } from "jose";
import { ENV } from "./env";

export interface JWTPayload {
  sub?: string;
  role?: "admin" | "merchant" | "driver" | "client";
  email?: string;
  name?: string;
  openId?: string;
  iat?: number;
  exp?: number;
  [key: string]: any;
}

/**
 * Get the secret key as a Uint8Array for jose operations.
 */
function getSecretKey(): Uint8Array {
  return new TextEncoder().encode(ENV.cookieSecret);
}

/**
 * Sign a JWT token.
 * @param payload Claims to include in the token.
 * @param expiresIn Duration before expiration (default: "7d").
 * @returns Signed JWT string.
 */
export async function issueToken(
  payload: JWTPayload,
  expiresIn: string = "7d"
): Promise<string> {
  const secret = getSecretKey();
  const iat = Math.floor(Date.now() / 1000);

  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt(iat)
    .setExpirationTime(expiresIn)
    .sign(secret);
}

/**
 * Verify and decode a JWT token.
 * @param token JWT string to verify.
 * @returns Decoded payload or null if verification fails.
 */
export async function verifyToken(
  token: string
): Promise<JWTPayload | null> {
  try {
    const secret = getSecretKey();
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });
    return payload as JWTPayload;
  } catch (error) {
    // Token is invalid or expired
    return null;
  }
}

/**
 * Synchronous version of issueToken for compatibility.
 * Note: This is a wrapper that returns a Promise, so callers should still await.
 * For now, returns the async version for future use.
 *
 * If you need fully synchronous signing, consider using jsonwebtoken package
 * (which is already in dependencies via server/auth.ts).
 */
export async function sign(
  payload: Omit<JWTPayload, "iat" | "exp">,
  expiresIn: string = "7d"
): Promise<string> {
  return issueToken(payload, expiresIn);
}

/**
 * Synchronous verification wrapper (returns Promise for consistency).
 */
export async function verify(token: string): Promise<JWTPayload | null> {
  return verifyToken(token);
}
