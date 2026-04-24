import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, BookOpen, Check, GraduationCap, Network, ShieldCheck, Users, Zap } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { formations } from "@/data/formations";
import heroImg from "@/assets/hero-training.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Infotelcom — Formations Télécoms & Informatique" },
      {
        name: "description",
        content:
          "Centre de formation Infotelcom : fibre optique, réseaux, radio 4G/5G, cybersécurité, développement et data. Sessions certifiantes pour pros et entreprises.",
      },
      { property: "og:title", content: "Infotelcom — Formations Télécoms & Informatique" },
      { property: "og:description", content: "Formations certifiantes en télécoms et informatique." },
    ],
  }),
  component: Index,
});

const stats = [
  { value: "12+", label: "Années d'expérience" },
  { value: "2 000+", label: "Stagiaires formés" },
  { value: "30+", label: "Programmes" },
  { value: "98%", label: "Satisfaction" },
];

const features = [
  { icon: Network, title: "Expertise Télécoms", desc: "Fibre, transport, radio mobile : nos formateurs sont des ingénieurs terrain." },
  { icon: ShieldCheck, title: "Cybersécurité", desc: "Programmes alignés sur les standards ISO 27001 et bonnes pratiques ANSSI." },
  { icon: GraduationCap, title: "Certifications", desc: "Attestations reconnues par les opérateurs et entreprises du secteur." },
  { icon: Users, title: "Sur-mesure entreprise", desc: "Sessions intra-entreprise adaptées à vos équipes et vos sites." },
];

function Index() {
  const featured = formations.slice(0, 3);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[image:var(--gradient-hero)]" aria-hidden />
          <img
            src={heroImg}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover opacity-25 mix-blend-luminosity"
            width={1920}
            height={1280}
          />
          <div className="relative container mx-auto grid gap-10 px-4 py-20 md:py-28 lg:grid-cols-2 lg:items-center">
            <div className="space-y-6 text-primary-foreground">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                <Zap className="h-3.5 w-3.5" /> Centre agréé — sessions 2026 ouvertes
              </span>
              <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
                Formez-vous aux métiers des <span className="bg-gradient-to-r from-accent to-primary-foreground bg-clip-text text-transparent">télécoms</span> et de l'<span className="bg-gradient-to-r from-accent to-primary-foreground bg-clip-text text-transparent">informatique</span>
              </h1>
              <p className="max-w-xl text-lg text-primary-foreground/80">
                Infotelcom accompagne professionnels et entreprises avec des formations certifiantes, animées par des experts terrain.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="hero" size="xl">
                  <Link to="/formations">Voir les formations</Link>
                </Button>
                <Button asChild variant="heroOutline" size="xl">
                  <Link to="/contact">Nous contacter</Link>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-primary-foreground/15 bg-primary-foreground/5 p-6 backdrop-blur-md"
                >
                  <div className="text-3xl font-bold text-primary-foreground md:text-4xl">{s.value}</div>
                  <div className="mt-1 text-sm text-primary-foreground/70">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="container mx-auto px-4 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Pourquoi choisir Infotelcom ?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Une approche pédagogique pratique, des plateaux techniques équipés et des formateurs issus du secteur.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="group rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)]"
              >
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-[image:var(--gradient-primary)] text-primary-foreground">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold text-foreground">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Featured trainings */}
        <section className="bg-[image:var(--gradient-subtle)] py-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                  Formations phares
                </h2>
                <p className="mt-2 text-muted-foreground">Une sélection de nos programmes les plus demandés.</p>
              </div>
              <Button asChild variant="outline">
                <Link to="/formations">Voir le catalogue complet</Link>
              </Button>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {featured.map((f) => (
                <article
                  key={f.slug}
                  className="flex flex-col rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)]"
                >
                  <span className="inline-flex w-fit items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                    <BookOpen className="h-3 w-3" /> {f.category}
                  </span>
                  <h3 className="mt-4 text-xl font-semibold text-foreground">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.description}</p>
                  <ul className="mt-4 space-y-1.5 text-sm text-foreground/80">
                    {f.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 text-primary" /> {h}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4 text-sm">
                    <span className="text-muted-foreground">{f.duration} · {f.level}</span>
                    <span className="font-semibold text-primary">{f.price}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4 py-20">
          <div className="relative overflow-hidden rounded-2xl bg-[image:var(--gradient-hero)] p-10 text-primary-foreground shadow-[var(--shadow-elegant)] md:p-16">
            <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <Award className="mb-4 h-10 w-10 text-accent" />
                <h2 className="text-3xl font-bold md:text-4xl">Une formation pour vos équipes ?</h2>
                <p className="mt-3 max-w-2xl text-primary-foreground/80">
                  Nous concevons des programmes intra-entreprise adaptés à vos enjeux techniques et à votre calendrier.
                </p>
              </div>
              <Button asChild variant="hero" size="xl">
                <Link to="/contact">Demander un devis</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
