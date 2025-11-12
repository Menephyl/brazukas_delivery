/**
 * Brazukas Delivery - Configuration
 * Controla se usa mocks locais ou API real (Manus)
 */

export const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

if (!USE_MOCK && !API_BASE_URL) {
  console.warn(
    "[Config] USE_MOCK=false mas API_BASE_URL não definido. Voltando para mocks."
  );
}
