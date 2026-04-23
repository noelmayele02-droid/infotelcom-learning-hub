import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { z } from "zod";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Infotelcom Formation" },
      {
        name: "description",
        content:
          "Contactez Infotelcom pour vos besoins en formation télécoms et informatique : devis, inscription, sessions intra-entreprise.",
      },
      { property: "og:title", content: "Contact — Infotelcom Formation" },
      { property: "og:description", content: "Demandez un devis ou inscrivez-vous à nos formations." },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Nom trop court").max(100),
  email: z.string().trim().email("Email invalide").max(255),
  subject: z.string().trim().min(2).max(150),
  message: z.string().trim().min(10, "Message trop court").max(2000),
});

function ContactPage() {
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      name: form.get("name"),
      email: form.get("email"),
      subject: form.get("subject"),
      message: form.get("message"),
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Formulaire invalide");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success("Message envoyé ! Nous vous répondons sous 24h.");
      (e.target as HTMLFormElement).reset();
    }, 600);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <Toaster />
      <main className="flex-1">
        <section className="bg-[image:var(--gradient-hero)] py-16 text-primary-foreground">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Contactez-nous</h1>
            <p className="mt-3 max-w-2xl text-primary-foreground/80">
              Une question, un devis ou un projet de formation pour vos équipes ? Écrivez-nous.
            </p>
          </div>
        </section>

        <section className="container mx-auto grid gap-10 px-4 py-16 lg:grid-cols-[1fr_2fr]">
          <div className="space-y-6">
            {[
              { icon: MapPin, title: "Adresse", value: "Avenue des Télécoms, Douala" },
              { icon: Phone, title: "Téléphone", value: "+237 6 00 00 00 00" },
              { icon: Mail, title: "Email", value: "contact@infotelcom.com" },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[image:var(--gradient-primary)] text-primary-foreground">
                  <item.icon className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-sm font-semibold text-foreground">{item.title}</div>
                  <div className="text-sm text-muted-foreground">{item.value}</div>
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={onSubmit}
            className="space-y-5 rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-card)]"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input id="name" name="name" required maxLength={100} placeholder="Jean Dupont" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required maxLength={255} placeholder="vous@exemple.com" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Sujet</Label>
              <Input id="subject" name="subject" required maxLength={150} placeholder="Demande de devis pour…" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" name="message" required maxLength={2000} rows={6} placeholder="Décrivez votre besoin…" />
            </div>
            <Button type="submit" variant="hero" size="lg" disabled={submitting} className="w-full md:w-auto">
              <Send className="h-4 w-4" />
              {submitting ? "Envoi…" : "Envoyer le message"}
            </Button>
          </form>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}