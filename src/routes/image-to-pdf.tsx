import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Images, Loader2, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileDropzone } from "@/components/file-dropzone";
import { FileList, type FileItem } from "@/components/file-list";
import { ToolShell } from "@/components/tool-shell";
import { imagesToPdf, pdfFileName, type PdfOrientation, type PdfPageSize } from "@/lib/convert/images";
import { downloadBlob } from "@/lib/convert/helpers";

export const Route = createFileRoute("/image-to-pdf")({
  head: () => ({
    meta: [
      {
        title: "Image to PDF Converter — JPG, PNG, WebP | FileForge",
      },
      {
        name: "description",
        content:
          "Combine JPG, PNG and WebP images into a single PDF in your browser. Choose page size, orientation and margins — free and private.",
      },
      {
        property: "og:title",
        content: "Image to PDF Converter — JPG, PNG, WebP | FileForge",
      },
      {
        property: "og:description",
        content:
          "Combine JPG, PNG and WebP images into a single PDF in your browser. Choose page size, orientation and margins — free and private.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ImageToPdf,
});

const ACCEPTED = "image/jpeg,image/png,image/webp,image/avif,image/gif,image/bmp,image/svg+xml";

function ImageToPdf() {
  const [items, setItems] = useState<FileItem[]>([]);
  const [pageSize, setPageSize] = useState<PdfPageSize>("a4");
  const [orientation, setOrientation] = useState<PdfOrientation>("auto");
  const [marginMm, setMarginMm] = useState(10);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addFiles = (files: File[]) => {
    const images = files.filter((f) => f.type.startsWith("image/"));
    if (images.length === 0) {
      setError("Those files aren't images. Drop JPG, PNG, WebP or similar.");
      return;
    }
    setError(null);
    setItems((prev) => [...prev, ...images.map((file) => ({ id: crypto.randomUUID(), file }))]);
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

  const convert = async () => {
    if (items.length === 0 || busy) return;
    setError(null);
    setBusy(true);
    try {
      const blob = await imagesToPdf(
        items.map((item) => item.file),
        { pageSize, orientation, marginMm },
      );
      const name = pdfFileName(items.map((item) => item.file));
      downloadBlob(blob, name);
      toast.success("PDF ready", { description: `${name} · ${items.length} image${items.length > 1 ? "s" : ""}` });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Something went wrong while building the PDF.";
      setError(message);
      toast.error("Conversion failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell
      icon={<Images className="size-6" />}
      title="Image to PDF"
      description="Combine photos and screenshots into one tidy PDF. Choose the page size, orientation and margins — or let each image define its own page."
      steps={[
        "Drop in one or more images and put them in order.",
        "Pick a page size and margins if you want them.",
        "Hit Convert to download your single PDF.",
      ]}
    >
      <div className="space-y-5">
        <FileDropzone
          accept={ACCEPTED}
          multiple
          onFiles={addFiles}
          disabled={busy}
          title="Drop images here"
          subtitle="JPG, PNG, WebP and more — add as many as you like"
          icon={<Images className="size-7" />}
        />

        {items.length > 0 ? (
          <FileList items={items} onRemove={(id) => setItems((prev) => prev.filter((item) => item.id !== id))} onMove={move} icon="image" />
        ) : null}

        <div className="grid gap-5 rounded-2xl border border-border bg-card/70 p-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="page-size">Page size</Label>
            <Select value={pageSize} onValueChange={(v) => setPageSize(v as PdfPageSize)}>
              <SelectTrigger id="page-size" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="a4">A4</SelectItem>
                <SelectItem value="letter">US Letter</SelectItem>
                <SelectItem value="fit">Fit to image</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="orientation">Orientation</Label>
            <Select
              value={orientation}
              onValueChange={(v) => setOrientation(v as PdfOrientation)}
              disabled={pageSize === "fit"}
            >
              <SelectTrigger id="orientation" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto (best fit)</SelectItem>
                <SelectItem value="portrait">Portrait</SelectItem>
                <SelectItem value="landscape">Landscape</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="margin">Margin</Label>
              <span className="text-xs text-muted-foreground">{marginMm} mm</span>
            </div>
            <Slider
              id="margin"
              min={0}
              max={30}
              step={1}
              value={[marginMm]}
              onValueChange={(v) => setMarginMm(v[0] ?? marginMm)}
            />
          </div>
        </div>

        <Button
          size="lg"
          className="w-full rounded-full"
          onClick={convert}
          disabled={busy || items.length === 0}
        >
          {busy ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Building PDF…
            </>
          ) : (
            <>
              <Wand2 className="size-4" /> Convert to PDF ({items.length}{" "}
              {items.length === 1 ? "image" : "images"})
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
