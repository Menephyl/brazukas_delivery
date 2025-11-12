/**
 * Brazukas Delivery - PIX BR Code Generator
 * Gera BR Code EMV para PIX estático/dinâmico + CRC16
 * Referência: EMVCo + Bacen (simplificado para MVP)
 */

function pad2(n: number | string): string {
  return String(n).padStart(2, "0");
}

function tlv(id: string, value: string | number | null): string {
  const v = String(value || "");
  return id + pad2(v.length) + v;
}

function crc16(str: string): string {
  let crc = 0xffff;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) crc = (crc << 1) ^ 0x1021;
      else crc <<= 1;
      crc &= 0xffff;
    }
  }
  return (crc >>> 0).toString(16).toUpperCase().padStart(4, "0");
}

interface BRCodeOptions {
  chave: string;
  nome?: string;
  cidade?: string;
  txid?: string;
  amount?: number | null;
  url?: string | null;
}

/**
 * buildBRCode({ chave, nome, cidade, txid, amount })
 * amount em BRL string/number (opcional). Para PY use conversão antes (MVP).
 */
export function buildBRCode({
  chave,
  nome = "BRAZUKAS",
  cidade = "CDE",
  txid = "",
  amount = null,
  url = null,
}: BRCodeOptions): string {
  // 00 - Payload Format Indicator
  const id00 = tlv("00", "01");
  // 01 - Point of Initiation Method ("11" dinâmico, "12" estático). Usaremos "12" (MVP)
  const id01 = tlv("01", "12");

  // 26 - Merchant Account Info (PIX = GUI br.gov.bcb.pix)
  const gui = tlv("00", "br.gov.bcb.pix");
  const chaveK = tlv("01", chave);
  const urlK = url ? tlv("25", url) : "";
  const id26 = tlv("26", gui + chaveK + urlK);

  // 52 - Merchant Category Code (0000 = default)
  const id52 = tlv("52", "0000");
  // 53 - Moeda (986 = BRL)
  const id53 = tlv("53", "986");
  // 54 - Valor (opcional)
  const id54 = amount ? tlv("54", Number(amount).toFixed(2)) : "";
  // 58 - País
  const id58 = tlv("58", "BR");
  // 59 - Nome recebedor (até 25 chars)
  const id59 = tlv("59", String(nome).slice(0, 25));
  // 60 - Cidade
  const id60 = tlv("60", String(cidade).slice(0, 15));

  // 62 - Additional Data Field (txid)
  const ad01 = tlv("05", String(txid || "BRAZUKAS").slice(0, 25));
  const id62 = tlv("62", ad01);

  const semCRC = id00 + id01 + id26 + id52 + id53 + id54 + id58 + id59 + id60 + id62 + "6304";
  const crcValue = crc16(semCRC);
  return semCRC + crcValue;
}

/** Gera TXID curto legível */
export function genTxid(prefix = "BZ"): string {
  const r = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${prefix}-${Date.now().toString().slice(-6)}-${r}`;
}
