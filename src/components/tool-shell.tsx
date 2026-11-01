import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, ShieldCheck, Zap } from "lucide-react";

interface ToolShellProps {
  icon: ReactNode;
  title: string;
  description: string;
  steps?: string[];
  children: ReactNode;
}

export function ToolShell({ icon, title, description, steps, children }: ToolShellProps) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> All tools
      </Link>

      <div className="mt-6 flex items-start gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-sm sm:size-14">
          {icon}
        </span>
        <div>
          <h1 className="heading-display text-2xl text-foreground sm:text-3xl">{title}</h1>
          <p className="mt-1.5 max-w-xl text-sm text-muted-foreground sm:text-base">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-8">{children}</div>

      {steps && steps.length > 0 ? (
        <div className="mt-10 grid gap-4 rounded-2xl border border-border bg-card/60 p-6 sm:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step} className="flex items-start gap-3">
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
                {i + 1}
              </span>
              <p className="text-sm text-muted-foreground">{step}</p>
            </div>
          ))}
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <ShieldCheck className="size-4 text-primary" /> Files are processed on your device and
          never uploaded
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Zap className="size-4 text-primary" /> No sign-up, no watermarks, no limits
        </span>
        <span className="inline-flex items-center gap-1.5">
          <CheckCircle2 className="size-4 text-primary" /> Works offline once the page has loaded
        </span>
      </div>
    </div>
  );
}
