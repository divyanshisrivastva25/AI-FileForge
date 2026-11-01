import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Image as ImageIcon, Loader2, Wand2 } from "lucide-react";
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
import { convertImageFile, type ImageTargetFormat } from "@/lib/convert/images";
import { downloadBlob, downloadAsZip } from "@/lib/convert/helpers";

export const Route = createFileRoute("/image-converter")({
  head: () => ({
    meta: [
      {
        title: "Image Converter — JPG, PNG, WebP | FileForge",
      },
      {
        name: "description",
        content:
          "Convert images between JPG, PNG and WebP right in your browser. Quality control, bulk conversion and one-click ZIP download — free and private.",
      },
      {
        property: "og:title",
        content: "Image Converter — JPG, PNG, WebP | FileForge",
      },
      {
        property: "og:description",
        content:
          "Convert images between JPG, PNG and WebP right in your browser. Quality control, bulk conversion and one-click ZIP download — free and private.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ImageConverter,
});

const ACCEPTED = "image/jpeg,image/png,image/webp,image/avif,image/gif,image/bmp,image/svg+xml";

function ImageConverter() {
  const [items, setItems] = useState<FileItem[]>([]);
  const [target, setTarget] = useState<ImageTargetFormat>("png");
  const [quality, setQuality] = useState(90);
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

  const convert = async () => {
    if (items.length === 0 || busy) return;
    setError(null);
    setBusy(true);
    try {
      const results = [] as Array<{ name: string; blob: Blob }>;
      for (const item of items) {
        const result = await convertImageFile(item.file, target, quality / 100);
        results.push({ name: result.suggestedName, blob: result.blob });
      }
      if (results.length === 1) {
        downloadBlob(results[0]!.blob, results[0]!.name);
      } else {
        await downloadAsZip(results, `converted-${target}-${Date.now()}.zip`);
      }
      const size = results.reduce((sum, r) => sum + r.blob.size, 0);
      toast.success("Images converted", {
        description: `${results.length} file${results.length > 1 ? "s" : ""} · ${target.toUpperCase()}`,
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Something went wrong while converting.";
      setError(message);
      toast.error("Conversion failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell
      icon={<ImageIcon className="size-6" />}
      title="Image Converter"
      description="Switch images between JPG, PNG and WebP in a single step. Convert one picture or a whole batch — multiple results arrive as a tidy ZIP."
      steps={[
        "Drop in one image or a whole batch.",
        "Pick the output format and quality.",
        "Hit Convert — files download instantly.",
      ]}
    >
      <div className="space-y-5">
        <FileDropzone
          accept={ACCEPTED}
          multiple
          onFiles={addFiles}
          disabled={busy}
          title="Drop images here"
          subtitle="JPG, PNG, WebP and more — convert one or a whole batch"
          icon={<ImageIcon className="size-7" />}
        />

        {items.length > 0 ? (
          <FileList items={items} onRemove={(id) => setItems((prev) => prev.filter((item) => item.id !== id))} icon="image" />
        ) : null}

        <div className="grid gap-5 rounded-2xl border border-border bg-card/70 p-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="target-format">Convert to</Label>
            <Select value={target} onValueChange={(v) => setTarget(v as ImageTargetFormat)}>
              <SelectTrigger id="target-format" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="png">PNG — lossless, supports transparency</SelectItem>
                <SelectItem value="jpeg">JPG — small, great for photos</SelectItem>
                <SelectItem value="webp">WebP — modern and compact</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="quality">Quality</Label>
              <span className="text-xs text-muted-foreground">
                {target === "png" ? "lossless" : `${quality}%`}
              </span>
            </div>
            <Slider
              id="quality"
              min={10}
              max={100}
              step={5}
              value={[quality]}
              onValueChange={(v) => setQuality(v[0] ?? quality)}
              disabled={target === "png"}
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
              <Loader2 className="size-4 animate-spin" /> Converting…
            </>
          ) : (
            <>
              <Wand2 className="size-4" /> Convert to {target.toUpperCase()} ({items.length}{" "}
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
