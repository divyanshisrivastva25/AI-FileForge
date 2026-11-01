/** Pure helpers shared by the converter tools. */

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Filename without its extension, safe to append a new one. */
export function baseFileName(name: string): string {
  const dot = name.lastIndexOf(".");
  return dot > 0 ? name.slice(0, dot) : name;
}

export function extensionOf(name: string): string {
  const dot = name.lastIndexOf(".");
  return dot > 0 ? name.slice(dot + 1).toLowerCase() : "";
}

/** Trigger a browser download for a blob. Browser-only: call from handlers. */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/** Bundle blobs into a single .zip download. Browser-only. */
export async function downloadAsZip(
  entries: Array<{ name: string; blob: Blob }>,
  zipName: string,
) {
  const JSZip = (await import("jszip")).default;
  const zip = new JSZip();
  for (const entry of entries) zip.file(entry.name, entry.blob);
  const blob = await zip.generateAsync({ type: "blob" });
  downloadBlob(blob, zipName);
}
