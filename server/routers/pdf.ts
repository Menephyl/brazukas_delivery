/**
 * Brazukas Delivery - PDF Export Router
 * Exporta pedidos em formato PDF
 */

import { publicProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { getOrder } from "../orders";

export const pdfRouter = router({
  /**
   * Gera PDF de um pedido
   * Retorna buffer do PDF em base64 para download no cliente
   */
  generateOrderPdf: publicProcedure
    .input(z.object({ orderId: z.string() }))
    .query(async ({ input }) => {
      const order = getOrder(input.orderId);

      if (!order) {
        throw new Error("Pedido não encontrado");
      }

      // Importa dinamicamente pois pdf-lib pode não estar disponível em todos os ambientes
      let PDFDocument: any;
      let StandardFonts: any;
      let rgb: any;

      try {
        const pdfLib = await import("pdf-lib");
        PDFDocument = pdfLib.PDFDocument;
        StandardFonts = pdfLib.StandardFonts;
        rgb = pdfLib.rgb;
      } catch {
        // Se pdf-lib não estiver disponível, retorna um erro amigável
        throw new Error(
          "Biblioteca PDF não disponível. Instale: npm install pdf-lib"
        );
      }

      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595, 842]); // A4
      const { width } = page.getSize();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      let y = 800;

      const draw = (
        text: string,
        opts: { bold?: boolean; size?: number } = {}
      ) => {
        const f = opts.bold ? fontBold : font;
        const size = opts.size || 12;
        page.drawText(String(text), {
          x: 50,
          y,
          size,
          font: f,
          color: rgb(0, 0, 0),
        });
        y -= size + 6;
      };

      // Cabeçalho com cor Brazukas
      page.drawRectangle({
        x: 0,
        y: 812,
        width,
        height: 30,
        color: rgb(0, 0.415, 0.227), // Verde Brazukas
      });
      page.drawText("Brazukas Delivery — Pedido", {
        x: 50,
        y: 820,
        size: 14,
        font: fontBold,
        color: rgb(1, 1, 1),
      });

      // Informações do pedido
      draw(`Pedido #${order.id}`, { bold: true, size: 16 });
      draw(
        `Data: ${new Date(order.createdAt).toLocaleString("pt-BR", {
          timeZone: "America/Asuncion",
        })}`
      );
      draw(`Cliente: ${order.client?.name || "Visitante"}`);
      draw(`Status: ${order.status}`);

      if (order.driver) {
        draw(`Entregador: ${order.driver.nome} — ${order.driver.veiculo}`);
      }

      if (typeof order.etaMin === "number") {
        draw(`ETA: ${order.etaMin} min`);
      }

      // Linha separadora
      y -= 6;
      page.drawLine({
        start: { x: 50, y },
        end: { x: width - 50, y },
        thickness: 1,
        color: rgb(0.9, 0.9, 0.9),
      });
      y -= 16;

      // Itens
      draw("Itens", { bold: true, size: 14 });
      order.items.forEach((item: any) => {
        draw(
          `${item.qty}x ${item.nome} — ${(item.preco * item.qty).toLocaleString(
            "pt-BR"
          )} PYG`,
          { size: 12 }
        );
      });

      // Linha separadora
      y -= 6;
      page.drawLine({
        start: { x: 50, y },
        end: { x: width - 50, y },
        thickness: 1,
        color: rgb(0.9, 0.9, 0.9),
      });
      y -= 16;

      // Total
      draw(`Total: ${order.total.toLocaleString("pt-BR")} PYG`, {
        bold: true,
        size: 14,
      });

      const pdfBytes = await pdfDoc.save();
      const base64 = Buffer.from(pdfBytes).toString("base64");

      return {
        success: true,
        pdf: base64,
        filename: `pedido-${order.id}.pdf`,
      };
    }),
});
