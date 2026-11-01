import { baseFileName } from "./helpers";

/**
 * PDF merging with pdf-lib. Browser-only — call from event handlers.
 */

export async function mergePdfFiles(files: File[]): Promise<Blob> {
  if (files.length < 2) throw new Error("Add at least two PDF files to merge.");
  const { PDFDocument } = await import("pdf-lib");

  const merged = await PDFDocument.create();
  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const source = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const pages = await merged.copyPages(source, source.getPageIndices());
    pages.forEach((page) => merged.addPage(page));
  }
  const saved = await merged.save();
  return new Blob([saved as unknown as BlobPart], { type: "application/pdf" });
}

export function mergedPdfFileName(files: File[]): string {
  const first = files[0];
  const second = files[1];
  if (files.length === 1 && first) return `${baseFileName(first.name)}-merged.pdf`;
  if (files.length === 2 && first && second) {
    return `${baseFileName(first.name)}-${baseFileName(second.name)}.pdf`.slice(0, 80);
  }
  return `merged-${files.length}-documents.pdf`;
}
