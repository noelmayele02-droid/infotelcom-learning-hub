import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, Check, Clock, GraduationCap, Layers, Users } from "lucide-react";
import { useEffect } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { FaqJsonLd, FaqSection } from "@/components/FaqSection";
import { formations } from "@/data/formations";
import { trackEvent } from "@/lib/analytics";

function getFormation(slug: string) {
  const f = formations.find((x) => x.slug === slug);
  if (!f) throw notFound();
  return f;
}

export const Route = createFileRoute("/formations/$slug")({
  loader: ({ params }) => getFormation(params.slug),
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Formation — Infotelcom" }] };
    const f = loaderData;
    const title = `${f.title} — Formation Infotelcom`;
    const desc = f.description;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:type", content: "article" },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:url", content: `https://infotelcom.com/formations/${f.slug}` },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: desc },
      ],
    };
  },
  component: FormationDetail,
  notFoundComponent: () => (
    <div className="container mx-auto px-4 py-24 text-center">
      <h1 className="text-3xl font-bold">Formation introuvable</h1>
      <Button asChild className="mt-6">
        <Link to="/formations">Retour au catalogue</Link>
      </Button>
    </div>
  ),
});

const defaultObjectives = [
  "Acquérir les bases théoriques et pratiques",
  "Mettre en œuvre les bons outils sur le terrain",
  "Diagnostiquer et résoudre les problèmes courants",
  "Appliquer les normes et bonnes pratiques du secteur",
];

const defaultPrerequisites = [
  "Connaissances de base en informatique",
  "Niveau Bac scientifique ou équivalent",
  "Motivation et assiduité",
];

const defaultModalities = [
  "Formation en présentiel ou distanciel",
  "Alternance théorie / travaux pratiques",
  "Support de cours numérique fourni",
  "Évaluation continue + attestation de fin de formation",
];

const defaultFaq = [
  { q: "Comment s'inscrire à cette formation ?", a: "Cliquez sur « S'inscrire » et complétez le formulaire de contact. Notre équipe vous recontacte sous 24h ouvrées pour finaliser votre inscription." },
  { q: "La formation est-elle certifiante ?", a: "Oui, une attestation de fin de formation est remise à chaque participant ayant suivi le cursus complet et validé l'évaluation finale." },
  { q: "Peut-on organiser cette formation en intra-entreprise ?", a: "Absolument. Nous proposons des sessions intra adaptées à votre planning et vos enjeux métier. Demandez un devis via le formulaire de contact." },
  { q: "Quel est le tarif ?", a: "Le tarif dépend du format (inter, intra, distanciel) et du nombre de participants. Contactez-nous pour un devis personnalisé." },
];

function FormationDetail() {
  const f = Route.useLoaderData();
  const objectives = f.objectives ?? defaultObjectives;
  const prerequisites = f.prerequisites ?? defaultPrerequisites;
  const modalities = f.modalities ?? defaultModalities;
  const faq = f.faq ?? defaultFaq;
  const program = f.program ?? [
    { title: "Module 1 — Fondamentaux", items: f.highlights.slice(0, 2).concat("Introduction au domaine") },
    { title: "Module 2 — Approfondissement", items: f.highlights },
    { title: "Module 3 — Pratique terrain", items: ["Travaux pratiques encadrés", "Études de cas réels", "Évaluation finale"] },
  ];

  useEffect(() => {
    trackEvent("formation_view", { slug: f.slug, category: f.category });
  }, [f.slug, f.category]);

  const courseLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: f.title,
    description: f.description,
    provider: {
      "@type": "Organization",
      name: "Infotelcom",
      sameAs: "https://infotelcom.com",
    },
    educationalLevel: f.level,
    timeRequired: f.duration,
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <FaqJsonLd items={faq} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseLd) }}
      />
      <main className="flex-1">
        <section className="bg-[image:var(--gradient-hero)] py-14 text-primary-foreground">
          <div className="container mx-auto px-4">
            <Link
              to="/formations"
              className="inline-flex items-center gap-2 text-sm text-primary-foreground/80 hover:text-primary-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> Retour au catalogue
            </Link>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1 text-xs font-medium">
                {f.category}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-primary-foreground/80">
                <Clock className="h-3.5 w-3.5" /> {f.duration}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-primary-foreground/80">
                <GraduationCap className="h-3.5 w-3.5" /> Niveau {f.level}
              </span>
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">{f.title}</h1>
            <p className="mt-3 max-w-3xl text-primary-foreground/85">{f.description}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                asChild
                variant="hero"
                size="lg"
                onClick={() => trackEvent("cta_click", { source: `formation_${f.slug}`, label: "inscription" })}
              >
                <Link to="/contact" search={{ formation: f.slug }}>S'inscrire à cette formation</Link>
              </Button>
              <Button asChild variant="heroOutline" size="lg">
                <Link to="/calendrier">Voir le calendrier</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="container mx-auto grid gap-10 px-4 py-14 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-10">
            <div>
              <h2 className="flex items-center gap-2 text-2xl font-bold text-foreground">
                <BookOpen className="h-5 w-5 text-primary" /> Objectifs pédagogiques
              </h2>
              <ul className="mt-4 grid gap-2">
                {objectives.map((o) => (
                  <li key={o} className="flex items-start gap-2 text-sm text-foreground/85">
                    <Check className="mt-0.5 h-4 w-4 text-primary" /> {o}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="flex items-center gap-2 text-2xl font-bold text-foreground">
                <Layers className="h-5 w-5 text-primary" /> Programme détaillé
              </h2>
              <div className="mt-4 space-y-4">
                {program.map((m, idx) => (
                  <div
                    key={m.title}
                    className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]"
                  >
                    <div className="text-xs font-semibold uppercase tracking-wider text-primary">
                      Étape {idx + 1}
                    </div>
                    <h3 className="mt-1 font-semibold text-foreground">{m.title}</h3>
                    <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                      {m.items.map((it) => (
                        <li key={it} className="flex items-start gap-2">
                          <Check className="mt-0.5 h-4 w-4 text-primary" /> {it}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="flex items-center gap-2 text-2xl font-bold text-foreground">
                <Users className="h-5 w-5 text-primary" /> Modalités
              </h2>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {modalities.map((m) => (
                  <li key={m} className="flex items-start gap-2 text-sm text-foreground/85">
                    <Check className="mt-0.5 h-4 w-4 text-primary" /> {m}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Prérequis</div>
              <ul className="mt-3 space-y-2 text-sm text-foreground/85">
                {prerequisites.map((p) => (
                  <li key={p} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 text-primary" /> {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-[image:var(--gradient-subtle)] p-6 shadow-[var(--shadow-card)]">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Tarif</div>
              <div className="mt-1 text-2xl font-bold text-foreground">{f.price}</div>
              <p className="mt-2 text-sm text-muted-foreground">
                Devis personnalisé selon le format (inter / intra / distanciel) et le nombre de participants.
              </p>
              <Button
                asChild
                className="mt-4 w-full"
                onClick={() => trackEvent("cta_click", { source: `formation_${f.slug}_aside`, label: "devis" })}
              >
                <Link to="/contact" search={{ formation: f.slug }}>Demander un devis</Link>
              </Button>
            </div>
          </aside>
        </section>

        <FaqSection items={faq} />
      </main>
      <SiteFooter />
    </div>
  );
}