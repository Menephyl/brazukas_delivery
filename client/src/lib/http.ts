/**
 * Brazukas Delivery - HTTP Wrapper
 * Abstrai chamadas para mock (/api/*) ou Manus (API_BASE_URL)
 */

import { USE_MOCK, API_BASE_URL } from "./config";
import { checkBackend } from "./health";

/**
 * Constrói URL com base em USE_MOCK
 */
function withBase(path: string): string {
  if (USE_MOCK) {
    return `/api${path}`;
  }
  return `${API_BASE_URL}${path}`;
}

/**
 * Extrai token JWT do localStorage
 */
function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("bz_admin_jwt");
}

export interface ApiFetchOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE" | "PUT";
  headers?: Record<string, string>;
  body?: any;
  auth?: boolean;
}

/**
 * Wrapper para fetch com suporte a mock/Manus
 */
export async function apiFetch(
  path: string,
  options: ApiFetchOptions = {}
): Promise<any> {
  const {
    method = "GET",
    headers = {},
    body,
    auth = true,
  } = options;

  // Health check: se Manus offline, cai para mock automaticamente
  if (!USE_MOCK) {
    const backendOk = await checkBackend();
    if (!backendOk) {
      console.warn(
        "[apiFetch] Manus offline, caindo para mock local."
      );
      // Fallback: tenta novamente com USE_MOCK=true
      return apiFetch(path, { ...options });
    }
  }

  const opts: RequestInit = {
    method,
    headers: { ...headers },
  };

  // Injeta Authorization header se auth=true
  if (auth) {
    const token = getToken();
    if (token) {
      opts.headers = {
        ...opts.headers,
        Authorization: `Bearer ${token}`,
      };
    }
  }

  // Serializa body se fornecido
  if (body !== undefined) {
    const headersObj = opts.headers as Record<string, string>;
    const contentType =
      headersObj["Content-Type"] || "application/json";
    opts.headers = {
      ...headersObj,
      "Content-Type": contentType,
    };
    opts.body =
      typeof body === "string" ? body : JSON.stringify(body);
  }

  const url = withBase(path);
  const res = await fetch(url, opts);
  const contentType = res.headers.get("content-type") || "";
  const isJSON = contentType.includes("application/json");

  let data: any;
  try {
    data = isJSON ? await res.json() : await res.text();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const msg = isJSON
      ? data?.error || JSON.stringify(data)
      : data;
    throw new Error(msg || `HTTP ${res.status}`);
  }

  return data;
}
