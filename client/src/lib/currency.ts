/**
 * Brazukas Delivery - Currency Conversion
 * Converte PYG para BRL usando taxa do dia + margem
 */

export interface ExchangeRate {
  pygPerBrl: number;
  brlPerPyg: number;
}

export async function getExchangeRatePYGtoBRL(): Promise<ExchangeRate> {
  try {
    const r = await fetch("https://economia.awesomeapi.com.br/json/last/BRL-PYG");
    const j = await r.json();
    // 1 BRL = X PYG
    const pygPerBrl = Number(j?.BRLPYG?.bid || 1400);
    return { pygPerBrl, brlPerPyg: 1 / pygPerBrl };
  } catch {
    return { pygPerBrl: 1400, brlPerPyg: 1 / 1400 }; // fallback
  }
}

export function convertPYGtoBRL(pyg: number, margin = 0.05): number {
  const brl = (pyg / 1400) * (1 + margin);
  return Number(brl.toFixed(2));
}
