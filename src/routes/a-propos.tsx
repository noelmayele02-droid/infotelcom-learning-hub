import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, HeartHandshake, Lightbulb, Target } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/a-propos")({
  head: () => ({
    meta: [
      { title: "À propos — Infotelcom Formation" },
      {
        name: "description",
        content:
          "Découvrez Infotelcom : centre de formation spécialisé en télécoms et informatique, sa mission, ses valeurs et son équipe.",
      },
      { property: "og:title", content: "À propos — Infotelcom Formation" },
      { property: "og:description", content: "Notre mission : former les talents techniques d'aujourd'hui et de demain." },
    ],
  }),
  component: AboutPage,
});

const values = [
  { icon: Target, title: "Excellence", desc: "Un haut niveau d'exigence sur la qualité pédagogique et technique." },
  { icon: HeartHandshake, title: "Proximité", desc: "Un accompagnement humain, du diagnostic à la fin du parcours." },
  { icon: Lightbulb, title: "Innovation", desc: "Des contenus à jour des dernières évolutions technologiques." },
  { icon: Building2, title: "Ancrage terrain", desc: "Des formateurs ingénieurs avec une expérience opérateur concrète." },
];

function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <section className="bg-[image:var(--gradient-hero)] py-16 text-primary-foreground">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">À propos d'Infotelcom</h1>
            <p className="mt-4 max-w-2xl text-primary-foreground/80">
              Depuis plus de 12 ans, nous formons techniciens et ingénieurs aux métiers stratégiques des télécoms et de l'informatique.
            </p>
          </div>
        </section>

        <section className="container mx-auto grid gap-12 px-4 py-20 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Notre mission</h2>
            <p className="mt-4 text-muted-foreground">
              Rendre l'expertise télécoms et numérique accessible à tous les profils techniques. Nous concevons des parcours pratiques, encadrés par des professionnels du secteur, pour développer des compétences immédiatement opérationnelles sur le terrain.
            </p>
            <p className="mt-3 text-muted-foreground">
              Que vous soyez un opérateur, un intégrateur, un installateur ou un service IT d'entreprise, nous adaptons nos programmes à vos enjeux métier et à vos contraintes calendaires.
            </p>
            <Button asChild className="mt-6">
              <Link to="/contact">Discutons de votre projet</Link>
            </Button>
          </div>

          <div className="rounded-2xl bg-[image:var(--gradient-subtle)] p-8 shadow-[var(--shadow-card)]">
            <dl className="grid grid-cols-2 gap-6">
              {[
                ["12+", "Années"],
                ["2 000+", "Stagiaires"],
                ["30+", "Programmes"],
                ["98%", "Satisfaction"],
              ].map(([v, l]) => (
                <div key={l}>
                  <dt className="text-3xl font-bold text-primary md:text-4xl">{v}</dt>
                  <dd className="text-sm text-muted-foreground">{l}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="bg-secondary/40 py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold text-foreground">Nos valeurs</h2>
              <p className="mt-3 text-muted-foreground">
                Quatre piliers qui guident chaque session de formation.
              </p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((v) => (
                <div
                  key={v.title}
                  className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]"
                >
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-[image:var(--gradient-primary)] text-primary-foreground">
                    <v.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-foreground">{v.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}