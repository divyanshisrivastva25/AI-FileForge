import { baseFileName } from "./helpers";

/**
 * Word (.docx) to PDF. Runs entirely in the browser: mammoth extracts rich
 * HTML from the document, then the HTML is rendered off-screen and rasterised
 * onto A4 PDF pages. Browser-only — call from event handlers.
 */

export async function docxToPdf(
  file: File,
  onStage?: (stage: string) => void,
): Promise<Blob> {
  onStage?.("Reading document…");
  const mammothModule = await import("mammoth/mammoth.browser");
  const arrayBuffer = await file.arrayBuffer();
  const { value: html } = await mammothModule.convertToHtml({ arrayBuffer });
  if (!html.trim()) {
    throw new Error("This document appears to be empty.");
  }

  onStage?.("Laying out pages…");
  const PAGE_W_PX = 794; // A4 at 96dpi
  const PADDING_PX = 56;

  const container = document.createElement("div");
  container.setAttribute("aria-hidden", "true");
  container.style.position = "fixed";
  container.style.left = "-10000px";
  container.style.top = "0";
  container.style.width = `${PAGE_W_PX}px`;
  container.style.padding = `${PADDING_PX}px`;
  container.style.boxSizing = "border-box";
  container.style.background = "#ffffff";
  container.style.color = "#111827";
  container.style.fontFamily = "Georgia, 'Times New Roman', serif";
  container.style.fontSize = "15px";
  container.style.lineHeight = "1.65";
  container.innerHTML = html;
  document.body.appendChild(container);

  try {
    // Wait for embedded images so the raster isn't captured before they load.
    const images = Array.from(container.querySelectorAll("img"));
    await Promise.all(
      images.map((img) =>
        img.complete && img.naturalWidth > 0
          ? Promise.resolve()
          : new Promise<void>((resolve) => {
              img.addEventListener("load", () => resolve(), { once: true });
              img.addEventListener("error", () => resolve(), { once: true });
            }),
      ),
    );
    if (document.fonts?.ready) await document.fonts.ready;

    const html2canvas = (await import("html2canvas-pro")).default;
    const canvas = await html2canvas(container, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
      logging: false,
    });

    onStage?.("Writing PDF…");
    const { jsPDF } = await import("jspdf");
    const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait", compress: true });

    const pxPerMm = canvas.width / 210;
    const sliceHeightPx = Math.floor(297 * pxPerMm);
    let y = 0;
    let firstPage = true;
    while (y < canvas.height - 1) {
      const h = Math.min(sliceHeightPx, canvas.height - y);
      const pageCanvas = document.createElement("canvas");
      pageCanvas.width = canvas.width;
      pageCanvas.height = h;
      const pctx = pageCanvas.getContext("2d");
      if (!pctx) throw new Error("Your browser could not process this document.");
      pctx.fillStyle = "#ffffff";
      pctx.fillRect(0, 0, pageCanvas.width, h);
      pctx.drawImage(canvas, 0, y, canvas.width, h, 0, 0, canvas.width, h);
      if (!firstPage) pdf.addPage();
      pdf.addImage(pageCanvas.toDataURL("image/jpeg", 0.92), "JPEG", 0, 0, 210, h / pxPerMm);
      firstPage = false;
      y += h;
    }
    return pdf.output("blob");
  } finally {
    container.remove();
  }
}

export function docxPdfFileName(file: File): string {
  return `${baseFileName(file.name)}.pdf`;
}
