import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FileText, Loader2, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FileDropzone } from "@/components/file-dropzone";
import { ToolShell } from "@/components/tool-shell";
import { docxToPdf, docxPdfFileName } from "@/lib/convert/docx";
import { downloadBlob, extensionOf, formatBytes } from "@/lib/convert/helpers";

export const Route = createFileRoute("/word-to-pdf")({
  head: () => ({
    meta: [
      {
        title: "Word to PDF Converter — Free & Private | FileForge",
      },
      {
        name: "description",
        content:
          "Convert Word documents (.docx) to PDF right in your browser. Free, private, no uploads and no watermarks.",
      },
      {
        property: "og:title",
        content: "Word to PDF Converter — Free & Private | FileForge",
      },
      {
        property: "og:description",
        content:
          "Convert Word documents (.docx) to PDF right in your browser. Free, private, no uploads and no watermarks.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WordToPdf,
});

function WordToPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [stage, setStage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const busy = stage !== null;

  const addFile = (files: File[]) => {
    const candidate = files[0];
    if (!candidate) return;
    if (extensionOf(candidate.name) !== "docx") {
      setError("Only .docx files are supported. Legacy .doc files need to be re-saved as .docx first.");
      setFile(null);
      return;
    }
    setError(null);
    setFile(candidate);
  };

  const convert = async () => {
    if (!file || busy) return;
    setError(null);
    try {
      const blob = await docxToPdf(file, setStage);
      const name = docxPdfFileName(file);
      downloadBlob(blob, name);
      toast.success("PDF ready", { description: `${name} · ${formatBytes(blob.size)}` });
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Something went wrong while converting this document.";
      setError(message);
      toast.error("Conversion failed");
    } finally {
      setStage(null);
    }
  };

  return (
    <ToolShell
      icon={<FileText className="size-6" />}
      title="Word to PDF"
      description="Drop in a Word document (.docx) and get a clean, shareable PDF back — text, headings, lists and images all preserved."
      steps={[
        "Drop your .docx file into the box below.",
        "Press Convert — everything happens on your device.",
        "The finished PDF downloads automatically.",
      ]}
    >
      {!file ? (
        <FileDropzone
          accept=".docx"
          onFiles={addFile}
          disabled={busy}
          title="Drop your Word document here"
          subtitle="or click to browse — .docx files up to your device's memory limit"
          icon={<FileText className="size-7" />}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3">
            <span className="grid size-10 place-items-center rounded-lg bg-secondary text-secondary-foreground">
              <FileText className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{file.name}</p>
              <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setFile(null)} disabled={busy}>
              Change file
            </Button>
          </div>

          <Button size="lg" className="w-full rounded-full" onClick={convert} disabled={busy}>
            {busy ? (
              <>
                <Loader2 className="size-4 animate-spin" /> {stage}
              </>
            ) : (
              <>
                <Wand2 className="size-4" /> Convert to PDF
              </>
            )}
          </Button>
        </div>
      )}

      {error ? (
        <p role="alert" className="mt-4 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </ToolShell>
  );
}
