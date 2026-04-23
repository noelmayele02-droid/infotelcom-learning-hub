import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen, Check, Clock, Filter } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { formations } from "@/data/formations";

export const Route = createFileRoute("/formations")({
  head: () => ({
    meta: [
      { title: "Catalogue des formations — Infotelcom" },
      {
        name: "description",
        content:
          "Catalogue complet des formations Infotelcom en télécoms (fibre, radio, transmission) et informatique (cybersécurité, dev, data).",
      },
      { property: "og:title", content: "Catalogue des formations — Infotelcom" },
      { property: "og:description", content: "Toutes nos formations télécoms et informatique." },
    ],
  }),
  component: FormationsPage,
});

const categories = ["Toutes", "Télécoms", "Informatique"] as const;
type Cat = (typeof categories)[number];

function FormationsPage() {
  const [active, setActive] = useState<Cat>("Toutes");
  const list = active === "Toutes" ? formations : formations.filter((f) => f.category === active);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        {/* Page header */}
        <section className="bg-[image:var(--gradient-hero)] py-16 text-primary-foreground">
          <div className="container mx-auto px-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1 text-xs font-medium">
              <BookOpen className="h-3.5 w-3.5" /> Catalogue 2026
            </span>
            <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">Nos formations</h1>
            <p className="mt-3 max-w-2xl text-primary-foreground/80">
              Des programmes pratiques conçus pour les techniciens, ingénieurs et équipes d'entreprise.
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="container mx-auto px-4 py-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Filter className="h-4 w-4" /> Filtrer :
            </span>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
                  active === c
                    ? "border-primary bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-card)]"
                    : "border-border bg-background text-muted-foreground hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {list.map((f) => (
              <article
                key={f.slug}
                className="flex flex-col rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)]"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                    {f.category}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" /> {f.duration}
                  </span>
                </div>
                <h2 className="mt-4 text-lg font-semibold text-foreground">{f.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{f.description}</p>
                <ul className="mt-4 space-y-1.5 text-sm text-foreground/80">
                  {f.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 text-primary" /> {h}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex items-center justify-between border-t border-border/60 pt-4">
                  <span className="text-xs text-muted-foreground">Niveau {f.level}</span>
                  <Button asChild size="sm">
                    <Link to="/contact">S'inscrire</Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}