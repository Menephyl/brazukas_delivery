/**
 * Brazukas Delivery - Payment PIX Component
 * Gera QR Code com BR Code EMV para PIX
 */

import { useEffect, useRef, useMemo } from "react";
import QRCode from "qrcode";
import { buildBRCode } from "@/lib/pix";

const PIX_KEY = import.meta.env.VITE_PIX_KEY || "chavepix-brazukas@exemplo.com";
const RECEIVER = import.meta.env.VITE_PIX_RECEIVER || "BRAZUKAS DELIVERY";
const CITY = import.meta.env.VITE_PIX_CITY || "FOZ";

interface PaymentPixProps {
  amountBRL?: number;
  txid?: string;
}

export default function PaymentPix({ amountBRL = 0, txid = "BRAZUKAS" }: PaymentPixProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const brcode = useMemo(() => {
    return buildBRCode({
      chave: PIX_KEY,
      nome: RECEIVER,
      cidade: CITY,
      txid: txid || "BRAZUKAS",
      amount: amountBRL || null,
    });
  }, [amountBRL, txid]);

  useEffect(() => {
    if (!canvasRef.current) return;
    QRCode.toCanvas(canvasRef.current, brcode, { margin: 1, scale: 5 });
  }, [brcode]);

  return (
    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="card p-4 flex flex-col items-center">
        <div className="text-sm text-gray-600 mb-2">Escaneie o QR (BR Code)</div>
        <canvas ref={canvasRef} />
        <div className="mt-2 text-xs text-gray-600">
          TXID: <code className="bg-gray-100 px-2 py-1 rounded">{txid || "—"}</code>
        </div>
      </div>
      <div className="card p-4">
        <div className="text-sm text-gray-600 mb-1">Copia e cola (PIX)</div>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-xs"
          rows={6}
          readOnly
          value={brcode}
        />
        <div className="text-xs text-gray-600 mt-2">
          Após pagar, finalize o pedido. O status ficará como <strong>PENDENTE</strong> até
          confirmação.
        </div>
      </div>
    </div>
  );
}
