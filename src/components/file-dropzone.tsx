import { useRef, useState, type ReactNode } from "react";
import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileDropzoneProps {
  accept: string;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  disabled?: boolean;
  className?: string;
}

export function FileDropzone({
  accept,
  multiple = false,
  onFiles,
  title,
  subtitle,
  icon,
  disabled,
  className,
}: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const openPicker = () => {
    if (!disabled) inputRef.current?.click();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (disabled) return;
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) onFiles(multiple ? files : files.slice(0, 1));
  };

  return (
    <button
      type="button"
      onClick={openPicker}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openPicker();
        }
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      disabled={disabled}
      className={cn(
        "group flex w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-colors sm:py-16",
        dragging
          ? "border-primary bg-primary/5"
          : "border-border bg-card/50 hover:border-primary/50 hover:bg-accent/40",
        disabled && "pointer-events-none opacity-60",
        className,
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          if (files.length > 0) onFiles(files);
          e.target.value = "";
        }}
      />
      <span
        className={cn(
          "grid size-14 place-items-center rounded-2xl bg-secondary text-secondary-foreground transition-colors",
          dragging && "bg-primary text-primary-foreground",
        )}
      >
        {icon ?? <UploadCloud className="size-7" />}
      </span>
      <span className="heading-display text-base text-foreground sm:text-lg">{title}</span>
      {subtitle ? <span className="max-w-sm text-sm text-muted-foreground">{subtitle}</span> : null}
    </button>
  );
}
