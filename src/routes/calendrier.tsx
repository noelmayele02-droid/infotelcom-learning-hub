import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarDays, Filter, MapPin, Users } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { sessions, getFormationTitle, getFormationCategory } from "@/data/sessions";
import { trackEvent } from "@/lib/analytics";

export const Route = createFileRoute("/calendrier")({
  head: () => ({
    meta: [
      { title: "Calendrier des sessions — Infotelcom" },
      {
        name: "description",
        content:
          "Consultez le calendrier des prochaines sessions de formation Infotelcom (télécoms et informatique) et demandez votre inscription.",
      },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Calendrier des sessions — Infotelcom" },
      { property: "og:description", content: "Toutes nos sessions de formation à venir." },
    ],
  }),
  component: CalendarPage,
});

const filters = ["Toutes", "Télécoms", "Informatique"] as const;
type F = (typeof filters)[number];

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
}

function CalendarPage() {
  const [active, setActive] = useState<F>("Toutes");
  const list = sessions
    .filter((s) => active === "Toutes" || getFormationCategory(s.formationSlug) === active)
    .sort((a, b) => a.startDate.localeCompare(b.startDate));

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <section className="bg-[image:var(--gradient-hero)] py-14 text-primary-foreground">
          <div className="container mx-auto px-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1 text-xs font-medium">
              <CalendarDays className="h-3.5 w-3.5" /> Sessions 2026
            </span>
            <h1 className="mt-4 text-4xl font-bold md:text-5xl">Calendrier des sessions</h1>
            <p className="mt-3 max-w-2xl text-primary-foreground/80">
              Réservez votre place dans une session inter-entreprise ou demandez une session intra à vos dates.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Filter className="h-4 w-4" /> Filtrer :
            </span>
            {filters.map((c) => (
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

          <div className="mt-8 overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
            <div className="hidden grid-cols-[1.5fr_1fr_1fr_0.8fr_0.8fr_auto] gap-4 border-b border-border bg-secondary/40 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground md:grid">
              <div>Formation</div>
              <div>Dates</div>
              <div>Lieu</div>
              <div>Format</div>
              <div>Places</div>
              <div></div>
            </div>
            <ul>
              {list.length === 0 && (
                <li className="px-5 py-10 text-center text-sm text-muted-foreground">
                  Aucune session pour cette catégorie.
                </li>
              )}
              {list.map((s) => (
                <li
                  key={s.id}
                  className="grid gap-3 border-b border-border/60 px-5 py-4 last:border-0 md:grid-cols-[1.5fr_1fr_1fr_0.8fr_0.8fr_auto] md:items-center md:gap-4"
                >
                  <div>
                    <Link
                      to="/formations/$slug"
                      params={{ slug: s.formationSlug }}
                      className="font-semibold text-foreground hover:text-primary"
                    >
                      {getFormationTitle(s.formationSlug)}
                    </Link>
                    <div className="text-xs text-muted-foreground md:hidden">
                      {fmtDate(s.startDate)} → {fmtDate(s.endDate)}
                    </div>
                  </div>
                  <div className="hidden text-sm text-muted-foreground md:block">
                    {fmtDate(s.startDate)}
                    <div className="text-xs">au {fmtDate(s.endDate)}</div>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary" /> {s.city}
                  </div>
                  <div className="text-sm text-foreground/85">{s.mode}</div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Users className="h-4 w-4 text-primary" /> {s.seats}
                  </div>
                  <div>
                    <Button
                      asChild
                      size="sm"
                      onClick={() =>
                        trackEvent("cta_click", {
                          source: "calendrier",
                          label: "inscription",
                          session: s.id,
                          formation: s.formationSlug,
                        })
                      }
                    >
                      <Link to="/contact" search={{ formation: s.formationSlug, session: s.id }}>
                        Demander une inscription
                      </Link>
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}