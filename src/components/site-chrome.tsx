import { ClientOnly, Link } from "@tanstack/react-router";
import { FileText, Image as ImageIcon, Images, Merge } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export const tools = [
  {
    to: "/word-to-pdf",
    title: "Word to PDF",
    description: "Turn .docx documents into polished PDFs, formatting and images included.",
    icon: FileText,
  },
  {
    to: "/image-to-pdf",
    title: "Image to PDF",
    description: "Combine JPG, PNG or WebP photos into a single tidy PDF document.",
    icon: Images,
  },
  {
    to: "/image-converter",
    title: "Image Converter",
    description: "Convert between JPG, PNG and WebP with quality control and bulk export.",
    icon: ImageIcon,
  },
  {
    to: "/merge-pdf",
    title: "Merge PDFs",
    description: "Stitch several PDF files together into one, in exactly the order you want.",
    icon: Merge,
  },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden>
              <path
                d="M6 3.5h8.5L19 8v12.5H6z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <path d="M14 3.5V8h5" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              <path d="M9 13h6M9 16.5h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </span>
          <span className="heading-display text-lg tracking-tight">
            File<span className="text-primary">Forge</span>
          </span>
        </Link>

        <nav aria-label="Tools" className="hidden items-center gap-1 lg:flex">
          {tools.map((tool) => (
            <Link
              key={tool.to}
              to={tool.to}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              activeProps={{ className: "text-primary bg-accent" }}
            >
              {tool.title}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Link
            to="/word-to-pdf"
            className="mr-1 hidden rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90 sm:inline-flex"
          >
            Start converting
          </Link>
          <ClientOnly fallback={<span className="inline-block size-9" aria-hidden />}>
            <ThemeToggle />
          </ClientOnly>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-card/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="heading-display text-base">
            File<span className="text-primary">Forge</span>
          </p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Fast, private file conversions that run entirely in your browser. Your files never
            leave your device.
          </p>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
          {tools.map((tool) => (
            <Link
              key={tool.to}
              to={tool.to}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {tool.title}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} FileForge. Built with care, one conversion at a time.
      </div>
    </footer>
  );
}
