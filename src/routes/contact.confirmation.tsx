import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, Home, Mail, MessageSquare } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { getLastSubmission, type ContactSubmission } from "@/lib/contact-storage";

export const Route = createFileRoute("/contact/confirmation")({
  head: () => ({
    meta: [
      { title: "Demande enregistrée — Infotelcom" },
      { name: "description", content: "Votre demande a bien été enregistrée. Nous vous recontactons sous 24h ouvrées." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Demande enregistrée — Infotelcom" },
      { property: "og:description", content: "Confirmation de votre demande Infotelcom." },
    ],
  }),
  component: ConfirmationPage,
});

function ConfirmationPage() {
  const [submission, setSubmission] = useState<ContactSubmission | null>(null);

  useEffect(() => {
    setSubmission(getLastSubmission());
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <section className="container mx-auto max-w-3xl px-4 py-16">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-elegant)] md:p-12">
            <div className="flex flex-col items-center text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-glow)]">
                <CheckCircle2 className="h-9 w-9" />
              </span>
              <h1 className="mt-5 text-3xl font-bold text-foreground md:text-4xl">
                Demande enregistrée
              </h1>
              <p className="mt-3 max-w-xl text-muted-foreground">
                Merci ! Votre demande a bien été reçue. Notre équipe vous recontacte sous 24h ouvrées
                par email ou par téléphone.
              </p>
            </div>

            {submission && (
              <div className="mt-8 rounded-xl border border-border bg-secondary/40 p-5">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Récapitulatif
                </div>
                <dl className="mt-3 grid gap-3 text-sm md:grid-cols-2">
                  <div>
                    <dt className="text-muted-foreground">Nom</dt>
                    <dd className="font-medium text-foreground">{submission.name}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Email</dt>
                    <dd className="font-medium text-foreground">{submission.email}</dd>
                  </div>
                  <div className="md:col-span-2">
                    <dt className="text-muted-foreground">Sujet</dt>
                    <dd className="font-medium text-foreground">{submission.subject}</dd>
                  </div>
                  <div className="md:col-span-2">
                    <dt className="text-muted-foreground">Message</dt>
                    <dd className="whitespace-pre-wrap text-foreground/85">{submission.message}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Référence</dt>
                    <dd className="font-mono text-xs text-foreground">{submission.id.slice(0, 8).toUpperCase()}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Envoyée le</dt>
                    <dd className="font-medium text-foreground">
                      {new Date(submission.createdAt).toLocaleString("fr-FR")}
                    </dd>
                  </div>
                </dl>
              </div>
            )}

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <a
                href="mailto:infotelcomtech@gmail.com"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-card px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary"
              >
                <Mail className="h-4 w-4 text-primary" /> infotelcomtech@gmail.com
              </a>
              <a
                href="https://wa.me/242068498792"
                target="_blank"
                rel="noopener"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-card px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary"
              >
                <MessageSquare className="h-4 w-4 text-primary" /> WhatsApp +242 06 849 87 92
              </a>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button asChild variant="outline">
                <Link to="/">
                  <Home className="h-4 w-4" /> Retour à l'accueil
                </Link>
              </Button>
              <Button asChild>
                <Link to="/formations">Découvrir d'autres formations</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}