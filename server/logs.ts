/**
 * Brazukas Delivery - Logs Module
 * Persistência de logs em JSON (data/logs.json)
 */

import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "logs.json");

function ensure() {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch {}
}

export interface LogEntry {
  ts?: string;
  level?: "error" | "warn" | "info";
  source?: "frontend" | "mock" | "manus";
  path?: string;
  method?: string;
  status?: number | null;
  message?: string;
  meta?: any;
}

/**
 * Carrega todos os logs do arquivo
 */
export function loadLogs(): LogEntry[] {
  ensure();
  try {
    const raw = fs.readFileSync(FILE, "utf-8");
    const json = JSON.parse(raw);
    return Array.isArray(json) ? json : [];
  } catch {
    return [];
  }
}

/**
 * Adiciona uma entrada de log
 */
export function appendLog(entry: LogEntry): LogEntry {
  const logs = loadLogs();
  const row: LogEntry = {
    ts: new Date().toISOString(),
    level: entry.level || "error",
    source: entry.source || "frontend",
    path: entry.path || "",
    method: entry.method || "",
    status: entry.status ?? null,
    message: String(entry.message || ""),
    meta: entry.meta || null,
  };
  logs.push(row);
  ensure();
  // Mantém últimas 2000 entradas
  fs.writeFileSync(
    FILE,
    JSON.stringify(logs.slice(-2000), null, 2),
    "utf-8"
  );
  return row;
}

/**
 * Limpa todos os logs
 */
export function clearLogs(): boolean {
  ensure();
  fs.writeFileSync(FILE, "[]", "utf-8");
  return true;
}

/**
 * Filtra logs por nível
 */
export function filterLogs(level?: string): LogEntry[] {
  const all = loadLogs();
  if (!level) return all;
  return all.filter(
    (l) => l.level?.toLowerCase() === level.toLowerCase()
  );
}
