import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, Briefcase, Code, Database, Mail, Phone, Shield } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import teamLead from "@/assets/team-mayele-albert.jpg";

export const Route = createFileRoute("/equipe")({
  head: () => ({
    meta: [
      { title: "Notre équipe — Infotelcom" },
      {
        name: "description",
        content:
          "Rencontrez l'équipe Infotelcom : experts en cybersécurité, développement, data et télécoms qui forment vos talents.",
      },
      { property: "og:type", content: "profile" },
      { property: "og:title", content: "Notre équipe — Infotelcom" },
      { property: "og:description", content: "Direction et formateurs Infotelcom." },
      { property: "og:image", content: teamLead },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: teamLead },
    ],
  }),
  component: TeamPage,
});

const expertises = [
  { icon: Shield, label: "Cybersécurité" },
  { icon: Code, label: "Dev Web / Mobile / Desktop" },
  { icon: Database, label: "Data Analyse" },
  { icon: Briefcase, label: "Chef de projet" },
  { icon: Award, label: "Dev Full-Stack" },
];

function TeamPage() {
  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Mayele Albert Isaac Noël",
    jobTitle: "Dirigeant & Expert technique — Infotelcom",
    image: teamLead,
    knowsAbout: [
      "Cybersécurité",
      "Programmation Web",
      "Développement Mobile",
      "Développement Desktop",
      "Data Analyse",
      "Gestion de projet",
      "Développement Full-Stack",
    ],
    worksFor: { "@type": "Organization", name: "Infotelcom" },
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
      <main className="flex-1">
        <section className="bg-[image:var(--gradient-hero)] py-14 text-primary-foreground">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold md:text-5xl">Notre équipe</h1>
            <p className="mt-3 max-w-2xl text-primary-foreground/80">
              Une direction technique généraliste et des formateurs experts dans leurs domaines.
            </p>
          </div>
        </section>

        <section className="container mx-auto grid gap-10 px-4 py-16 md:grid-cols-[1fr_2fr] md:items-center">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-elegant)]">
            <img
              src={teamLead}
              alt="Mayele Albert Isaac Noël, dirigeant d'Infotelcom"
              className="aspect-[3/4] w-full object-cover"
              loading="eager"
            />
          </div>
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
              Dirigeant & Responsable
            </span>
            <h2 className="mt-3 text-3xl font-bold text-foreground md:text-4xl">
              Mayele Albert Isaac Noël
            </h2>
            <p className="mt-2 text-sm font-medium text-primary">
              Expert généraliste — Cybersécurité, développement, data, gestion de projet
            </p>
            <p className="mt-4 text-muted-foreground">
              À la tête d'Infotelcom, Mayele Albert Isaac Noël met son expertise pluridisciplinaire au service de la formation. Profil rare alliant maîtrise technique pointue et vision stratégique, il accompagne aussi bien les techniciens en reconversion que les équipes IT d'entreprises sur leurs projets de montée en compétences.
            </p>

            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              {expertises.map((e) => (
                <div
                  key={e.label}
                  className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 shadow-[var(--shadow-card)]"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[image:var(--gradient-primary)] text-primary-foreground">
                    <e.icon className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-medium text-foreground">{e.label}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/contact">Le contacter</Link>
              </Button>
              <a
                href="mailto:infotelcomtech@gmail.com"
                className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary"
              >
                <Mail className="h-4 w-4 text-primary" /> infotelcomtech@gmail.com
              </a>
              <a
                href="tel:+33652861159"
                className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary"
              >
                <Phone className="h-4 w-4 text-primary" /> +33 6 52 86 11 59
              </a>
            </div>
          </div>
        </section>

        <section className="bg-secondary/40 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">Rejoindre nos formateurs</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Vous êtes ingénieur télécom, expert cybersécurité ou développeur senior et souhaitez transmettre ? Écrivez-nous.
            </p>
            <Button asChild className="mt-6">
              <Link to="/contact">Postuler comme formateur</Link>
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}