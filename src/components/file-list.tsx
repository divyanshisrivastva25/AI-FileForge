import type { ReactNode } from "react";
import { ChevronDown, ChevronUp, FileText, Image as ImageIcon, X } from "lucide-react";
import { formatBytes } from "@/lib/convert/helpers";

export interface FileItem {
  id: string;
  file: File;
}

interface FileListProps {
  items: FileItem[];
  onRemove: (id: string) => void;
  onMove?: (id: string, direction: -1 | 1) => void;
  icon?: "image" | "document";
  trailing?: (item: FileItem) => ReactNode;
}

export function FileList({ items, onRemove, onMove, icon = "document", trailing }: FileListProps) {
  const Icon = icon === "image" ? ImageIcon : FileText;
  return (
    <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
      {items.map((item, index) => (
        <li key={item.id} className="flex items-center gap-3 px-4 py-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-secondary text-secondary-foreground">
            <Icon className="size-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">{item.file.name}</p>
            <p className="text-xs text-muted-foreground">
              {formatBytes(item.file.size)}
              {items.length > 1 ? ` · #${index + 1}` : ""}
            </p>
          </div>
          {trailing?.(item)}
          {onMove ? (
            <div className="flex flex-col">
              <button
                type="button"
                aria-label={`Move ${item.file.name} up`}
                disabled={index === 0}
                onClick={() => onMove(item.id, -1)}
                className="rounded p-0.5 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
              >
                <ChevronUp className="size-4" />
              </button>
              <button
                type="button"
                aria-label={`Move ${item.file.name} down`}
                disabled={index === items.length - 1}
                onClick={() => onMove(item.id, 1)}
                className="rounded p-0.5 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
              >
                <ChevronDown className="size-4" />
              </button>
            </div>
          ) : null}
          <button
            type="button"
            aria-label={`Remove ${item.file.name}`}
            onClick={() => onRemove(item.id)}
            className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </li>
      ))}
    </ul>
  );
}
