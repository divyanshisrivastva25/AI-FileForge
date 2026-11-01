import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Merge, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FileDropzone } from "@/components/file-dropzone";
import { FileList, type FileItem } from "@/components/file-list";
import { ToolShell } from "@/components/tool-shell";
import { mergePdfFiles, mergedPdfFileName } from "@/lib/convert/pdf";
import { downloadBlob, formatBytes } from "@/lib/convert/helpers";

export const Route = createFileRoute("/merge-pdf")({
  head: () => ({
    meta: [
      {
        title: "Merge PDFs — Combine PDF Files | FileForge",
      },
      {
        name: "description",
        content:
          "Combine several PDF files into one, in exactly the order you choose. Runs entirely in your browser — free, private, no watermarks.",
      },
      {
        property: "og:title",
        content: "Merge PDFs — Combine PDF Files | FileForge",
      },
      {
        property: "og:description",
        content:
          "Combine several PDF files into one, in exactly the order you choose. Runs entirely in your browser — free, private, no watermarks.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MergePdf,
});

function MergePdf() {
  const [items, setItems] = useState<FileItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addFiles = (files: File[]) => {
    const pdfs = files.filter(
      (f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"),
    );
    if (pdfs.length === 0) {
      setError("Those files aren't PDFs. Drop one or more .pdf files to merge.");
      return;
    }
    setError(null);
    setItems((prev) => [...prev, ...pdfs.map((file) => ({ id: crypto.randomUUID(), file }))]);
  };

  const move = (id: string, direction: -1 | 1) => {
    setItems((prev) => {
      const index = prev.findIndex((item) => item.id === id);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      const moving = next[index]!;
      const other = next[target]!;
      next[index] = other;
      next[target] = moving;
      return next;
    });
  };

  const merge = async () => {
    if (items.length < 2 || busy) return;
    setError(null);
    setBusy(true);
    try {
      const blob = await mergePdfFiles(items.map((item) => item.file));
      const name = mergedPdfFileName(items.map((item) => item.file));
      downloadBlob(blob, name);
      toast.success("PDF merged", {
        description: `${name} · ${formatBytes(blob.size)}`,
      });
    } catch (e) {
      const message =
        e instanceof Error
          ? e.message
          : "Something went wrong while merging these PDFs. One of them may be password-protected.";
      setError(message);
      toast.error("Merge failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell
      icon={<Merge className="size-6" />}
      title="Merge PDFs"
      description="Stitch several PDF files together into a single document. Rearrange them until the order is exactly right, then merge in one click."
      steps={[
        "Drop in two or more PDF files.",
        "Reorder them with the arrows until they read right.",
        "Hit Merge — the combined PDF downloads instantly.",
      ]}
    >
      <div className="space-y-5">
        <FileDropzone
          accept="application/pdf,.pdf"
          multiple
          onFiles={addFiles}
          disabled={busy}
          title="Drop PDFs here"
          subtitle="Add two or more files — merge as many as you like"
          icon={<Merge className="size-7" />}
        />

        {items.length > 0 ? (
          <FileList
            items={items}
            onRemove={(id) => setItems((prev) => prev.filter((item) => item.id !== id))}
            onMove={move}
            icon="document"
          />
        ) : null}

        <Button
          size="lg"
          className="w-full rounded-full"
          onClick={merge}
          disabled={busy || items.length < 2}
        >
          {busy ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Merging…
            </>
          ) : (
            <>
              <Wand2 className="size-4" /> Merge {items.length} PDFs
            </>
          )}
        </Button>
      </div>

      {error ? (
        <p role="alert" className="mt-4 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </ToolShell>
  );
}
