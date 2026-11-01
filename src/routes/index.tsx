import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Lock, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { tools } from "@/components/site-chrome";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "FileForge — Free Online File Converters",
      },
      {
        name: "description",
        content:
          "Convert Word to PDF, images to PDF, JPG to PNG and more — free, fast and 100% private, right in your browser.",
      },
      { property: "og:title", content: "FileForge — Free Online File Converters" },
      {
        property: "og:description",
        content:
          "Convert Word to PDF, images to PDF, JPG to PNG and more — free, fast and 100% private, right in your browser.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div>
      {/* Hero */}
      <section className="hero-wash relative overflow-hidden border-b border-border/60">
        <div className="bg-dots absolute inset-0 opacity-40" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
            <Lock className="size-3.5 text-primary" />
            100% private — everything runs in your browser
          </span>
          <h1 className="heading-display mx-auto mt-6 max-w-3xl text-4xl leading-tight text-foreground sm:text-6xl">
            Convert any file,<br />
            <span className="text-brand-gradient">right in your browser.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            Word to PDF, images to PDF, JPG to PNG and back — fast, free conversions with no
            uploads, no sign-up and no watermarks.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/word-to-pdf"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-opacity hover:opacity-90"
            >
              Convert a document <ArrowRight className="size-4" />
            </Link>
            <a
              href="#tools"
              className="inline-flex items-center gap-2 rounded-full border border-input bg-card px-6 py-3 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-accent"
            >
              Browse all tools
            </a>
          </div>
        </div>
      </section>

      {/* Tool grid */}
      <section id="tools" className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="grid gap-5 sm:grid-cols-2">
          {tools.map((tool) => (
            <Link
              key={tool.to}
              to={tool.to}
              className="group relative flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
            >
              <span className="grid size-12 place-items-center rounded-xl bg-secondary text-secondary-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <tool.icon className="size-6" />
              </span>
              <h2 className="heading-display mt-4 text-lg text-foreground">{tool.title}</h2>
              <p className="mt-1.5 flex-1 text-sm text-muted-foreground">{tool.description}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                Open tool
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Why FileForge */}
      <section className="border-y border-border/60 bg-card/50">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-3">
          {[
            {
              icon: ShieldCheck,
              title: "Truly private",
              text: "Your files are processed on your own device and never touch a server. Close the tab and they're gone.",
            },
            {
              icon: Zap,
              title: "Instant results",
              text: "No queues, no waiting for uploads. Conversions start the moment you drop a file in.",
            },
            {
              icon: Sparkles,
              title: "No strings attached",
              text: "Every tool is free with no sign-up, no page limits and no watermarks stamped on your work.",
            },
          ].map((feature) => (
            <div key={feature.title} className="flex flex-col items-start gap-3">
              <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <feature.icon className="size-5" />
              </span>
              <h3 className="heading-display text-base text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <h2 className="heading-display text-center text-2xl text-foreground sm:text-3xl">
          Three steps, done
        </h2>
        <div className="mx-auto mt-10 grid max-w-4xl gap-6 sm:grid-cols-3">
          {[
            "Pick a tool and drop your file in — or click to browse.",
            "Tweak the options if you like, then hit convert.",
            "Your finished file downloads instantly. That's it.",
          ].map((text, i) => (
            <div key={text} className="relative rounded-2xl border border-border bg-card p-6 text-center">
              <span className="heading-display absolute -top-4 left-1/2 grid size-8 -translate-x-1/2 place-items-center rounded-full bg-primary text-sm text-primary-foreground shadow">
                {i + 1}
              </span>
              <p className="mt-2 text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
