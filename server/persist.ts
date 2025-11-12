/**
 * Brazukas Delivery - Persistence Module
 * Salva pedidos em arquivo JSON para desenvolvimento
 * Em produção, usar banco de dados Manus
 */

import * as fs from "fs";
import * as path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "orders.json");

/**
 * Garante que o diretório de dados existe
 */
export function ensureDataDir(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (error) {
    console.warn("[Persist] Erro ao criar diretório de dados:", error);
  }
}

/**
 * Carrega pedidos do arquivo JSON
 */
export function loadOrders(): any {
  ensureDataDir();
  try {
    if (!fs.existsSync(FILE)) {
      return { seq: 1, map: {} };
    }
    const raw = fs.readFileSync(FILE, "utf-8");
    const json = JSON.parse(raw);
    return json && typeof json === "object" ? json : { seq: 1, map: {} };
  } catch (error) {
    console.warn("[Persist] Erro ao carregar pedidos:", error);
    return { seq: 1, map: {} };
  }
}

/**
 * Salva pedidos no arquivo JSON
 */
export function saveOrders(state: any): void {
  ensureDataDir();
  try {
    fs.writeFileSync(FILE, JSON.stringify(state, null, 2), "utf-8");
  } catch (error) {
    console.warn("[Persist] Erro ao salvar pedidos:", error);
  }
}
