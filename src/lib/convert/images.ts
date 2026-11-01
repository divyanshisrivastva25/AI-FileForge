import { baseFileName } from "./helpers";

/**
 * Image and image-to-PDF conversion. All functions are browser-only and must
 * be called from event handlers/effects — the heavy libraries are dynamically
 * imported so they never load during SSR.
 */

export type ImageTargetFormat = "png" | "jpeg" | "webp";

export interface ConvertedResult {
  blob: Blob;
  width: number;
  height: number;
  suggestedName: string;
}

export async function convertImageFile(
  file: File,
  target: ImageTargetFormat,
  quality = 0.9,
): Promise<ConvertedResult> {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Your browser could not process this image.");

  // JPEG has no alpha channel — composite onto white so transparency looks right.
  if (target === "jpeg") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(
      (b) => resolve(b && b.type === `image/${target}` ? b : null),
      `image/${target}`,
      target === "png" ? undefined : quality,
    ),
  );
  if (!blob) {
    throw new Error(
      target === "webp"
        ? "This browser can't encode WebP images — try PNG or JPG."
        : "Could not convert this image in your browser.",
    );
  }

  const ext = target === "jpeg" ? "jpg" : target;
  return {
    blob,
    width: canvas.width,
    height: canvas.height,
    suggestedName: `${baseFileName(file.name)}.${ext}`,
  };
}

export type PdfPageSize = "a4" | "letter" | "fit";
export type PdfOrientation = "portrait" | "landscape" | "auto";

export interface ImagesToPdfOptions {
  pageSize: PdfPageSize;
  orientation: PdfOrientation;
  /** Margin around each image, in millimetres. */
  marginMm: number;
}

const MM_PER_INCH = 25.4;
const PT_PER_MM = 72 / 25.4;

async function readImage(file: File): Promise<{ w: number; h: number; draw: (c: HTMLCanvasElement) => void }> {
  const bitmap = await createImageBitmap(file);
  return {
    w: bitmap.width,
    h: bitmap.height,
    draw: (canvas) => canvas.getContext("2d")!.drawImage(bitmap, 0, 0),
  };
}

function toDataUrl(
  draw: (c: HTMLCanvasElement) => void,
  w: number,
  h: number,
): { data: string; format: "JPEG" | "PNG" } {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);
  draw(canvas);
  // JPEG pages keep PDFs compact; the white base layer hides transparency.
  return { data: canvas.toDataURL("image/jpeg", 0.92), format: "JPEG" };
}

export async function imagesToPdf(files: File[], options: ImagesToPdfOptions): Promise<Blob> {
  if (files.length === 0) throw new Error("Add at least one image first.");
  const { jsPDF } = await import("jspdf");

  const A4_PT: [number, number] = [595.28, 841.89];
  const LETTER_PT: [number, number] = [612, 792];

  let pdf: import("jspdf").jsPDF | null = null;

  for (const file of files) {
    const img = await readImage(file);
    const marginPt = options.marginMm * PT_PER_MM;

    let pageW: number;
    let pageH: number;
    if (options.pageSize === "fit") {
      // Image defines the page: 1px treated as 1pt (72dpi), margins added.
      pageW = img.w + marginPt * 2;
      pageH = img.h + marginPt * 2;
    } else {
      const [sw, sh] = options.pageSize === "a4" ? A4_PT : LETTER_PT;
      const orientation =
        options.orientation === "auto" ? (img.h >= img.w ? "portrait" : "landscape") : options.orientation;
      pageW = orientation === "portrait" ? sw : sh;
      pageH = orientation === "portrait" ? sh : sw;
    }

    // Fit the image inside the page with margins, preserving aspect ratio.
    const availW = pageW - marginPt * 2;
    const availH = pageH - marginPt * 2;
    const scale = Math.min(availW / img.w, availH / img.h);
    const drawW = img.w * scale;
    const drawH = img.h * scale;
    const x = (pageW - drawW) / 2;
    const y = (pageH - drawH) / 2;

    if (!pdf) {
      pdf = new jsPDF({
        unit: "pt",
        format: [pageW, pageH],
        orientation: pageH >= pageW ? "portrait" : "landscape",
        compress: true,
      });
    } else {
      pdf.addPage([pageW, pageH], pageH >= pageW ? "portrait" : "landscape");
    }

    const { data, format } = toDataUrl(img.draw, img.w, img.h);
    pdf.addImage(data, format, x, y, drawW, drawH);
  }

  if (!pdf) throw new Error("Add at least one image first.");
  return pdf.output("blob");
}

export function pdfFileName(files: File[]): string {
  const first = files[0];
  if (files.length === 1 && first) return `${baseFileName(first.name)}.pdf`;
  const stamp = new Date().toISOString().slice(0, 10);
  return `images-${stamp}.pdf`;
}

export { MM_PER_INCH };
