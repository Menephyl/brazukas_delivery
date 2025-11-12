/**
 * Brazukas Delivery - PIX Reconciliation
 * Rastreamento de pagamentos recebidos via webhook
 */

export interface PixTransaction {
  txid: string;
  amount: number;
  payer: string;
  receivedAt: string;
}

let transactions: PixTransaction[] = [];

export function recordPix(txid: string, amount: number, payer: string): void {
  transactions.push({
    txid,
    amount,
    payer,
    receivedAt: new Date().toISOString(),
  });
}

export function listPix(): PixTransaction[] {
  return transactions.slice().sort((a, b) => {
    const dateA = new Date(a.receivedAt).getTime();
    const dateB = new Date(b.receivedAt).getTime();
    return dateB - dateA;
  });
}

export function getPixByTxid(txid: string): PixTransaction | undefined {
  return transactions.find((t) => t.txid === txid);
}
