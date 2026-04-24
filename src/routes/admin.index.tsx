import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, BarChart3, CalendarDays, Inbox, MousePointerClick } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

type Stats = {
  totalSubmissions: number;
  newSubmissions: number;
  upcomingSessions: number;
  ctaClicks7d: number;
  formSubmits7d: number;
  formationViews7d: number;
};

function AdminOverview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const since = new Date();
      since.setDate(since.getDate() - 7);
      const sinceISO = since.toISOString();
      const todayISO = new Date().toISOString().slice(0, 10);

      const [subAll, subNew, sessionsUp, cta, form, views] = await Promise.all([
        supabase.from("contact_submissions").select("*", { count: "exact", head: true }),
        supabase.from("contact_submissions").select("*", { count: "exact", head: true }).eq("status", "new"),
        supabase.from("training_sessions").select("*", { count: "exact", head: true }).gte("start_date", todayISO),
        supabase.from("analytics_events").select("*", { count: "exact", head: true }).eq("event_type", "cta_click").gte("created_at", sinceISO),
        supabase.from("analytics_events").select("*", { count: "exact", head: true }).eq("event_type", "contact_submit").gte("created_at", sinceISO),
        supabase.from("analytics_events").select("*", { count: "exact", head: true }).eq("event_type", "formation_view").gte("created_at", sinceISO),
      ]);

      setStats({
        totalSubmissions: subAll.count ?? 0,
        newSubmissions: subNew.count ?? 0,
        upcomingSessions: sessionsUp.count ?? 0,
        ctaClicks7d: cta.count ?? 0,
        formSubmits7d: form.count ?? 0,
        formationViews7d: views.count ?? 0,
      });
      setLoading(false);
    };
    load();
  }, []);

  const cards = [
    { title: "Demandes nouvelles", value: stats?.newSubmissions, total: stats?.totalSubmissions, icon: Inbox, link: "/admin/submissions", linkLabel: "Voir les demandes", accent: "primary" },
    { title: "Sessions à venir", value: stats?.upcomingSessions, icon: CalendarDays, link: "/admin/sessions", linkLabel: "Gérer le calendrier", accent: "primary" },
    { title: "Conversions (7j)", value: stats?.formSubmits7d, sub: `${stats?.ctaClicks7d ?? 0} clics CTA`, icon: MousePointerClick, link: "/admin/analytics", linkLabel: "Voir l'analytics", accent: "primary" },
    { title: "Vues formations (7j)", value: stats?.formationViews7d, icon: BarChart3, link: "/admin/analytics", linkLabel: "Détails", accent: "primary" },
  ] as const;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">Vue d'ensemble</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Activité du site Infotelcom — formations, demandes et conversions.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.title} className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{c.title}</div>
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[image:var(--gradient-primary)] text-primary-foreground">
                <c.icon className="h-4 w-4" />
              </span>
            </div>
            <div className="mt-3 text-3xl font-bold text-foreground">
              {loading ? "…" : c.value ?? 0}
            </div>
            {"total" in c && c.total !== undefined && (
              <div className="mt-1 text-xs text-muted-foreground">/ {c.total} au total</div>
            )}
            {"sub" in c && c.sub && (
              <div className="mt-1 text-xs text-muted-foreground">{c.sub}</div>
            )}
            <Link to={c.link as "/admin/submissions"} className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
              {c.linkLabel} <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
        <h2 className="text-lg font-semibold text-foreground">Raccourcis</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Link to="/admin/submissions" className="rounded-xl border border-border p-4 hover:bg-secondary">
            <div className="font-medium text-foreground">Traiter les demandes</div>
            <div className="text-xs text-muted-foreground">Répondre aux nouvelles demandes de contact / inscription.</div>
          </Link>
          <Link to="/admin/sessions" className="rounded-xl border border-border p-4 hover:bg-secondary">
            <div className="font-medium text-foreground">Ajouter une session</div>
            <div className="text-xs text-muted-foreground">Programmer une nouvelle session de formation.</div>
          </Link>
        </div>
      </div>
    </div>
  );
}