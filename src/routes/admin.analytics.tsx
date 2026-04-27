import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { BarChart3, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/analytics")({
  component: AdminAnalytics,
});

type EventRow = {
  id: string;
  event_type: string;
  source: string | null;
  page: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
};

function AdminAnalytics() {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<7 | 30 | 90 | "custom">(7);
  const today = new Date().toISOString().slice(0, 10);
  const defaultFrom = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
  const [fromDate, setFromDate] = useState<string>(defaultFrom);
  const [toDate, setToDate] = useState<string>(today);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      let sinceISO: string;
      let untilISO: string | null = null;
      if (range === "custom") {
        sinceISO = new Date(fromDate + "T00:00:00").toISOString();
        untilISO = new Date(toDate + "T23:59:59").toISOString();
      } else {
        const since = new Date();
        since.setDate(since.getDate() - range);
        sinceISO = since.toISOString();
      }
      let q = supabase
        .from("analytics_events")
        .select("*")
        .gte("created_at", sinceISO)
        .order("created_at", { ascending: false })
        .limit(1000);
      if (untilISO) q = q.lte("created_at", untilISO);
      const { data, error } = await q;
      if (!error) setEvents((data ?? []) as EventRow[]);
      setLoading(false);
    };
    load();
  }, [range, fromDate, toDate]);

  const stats = useMemo(() => {
    const byType: Record<string, number> = {};
    const bySource: Record<string, number> = {};
    const byPage: Record<string, number> = {};
    const sessions = new Set<string>();
    for (const e of events) {
      byType[e.event_type] = (byType[e.event_type] ?? 0) + 1;
      if (e.source) bySource[e.source] = (bySource[e.source] ?? 0) + 1;
      if (e.page) byPage[e.page] = (byPage[e.page] ?? 0) + 1;
      const meta = (e.metadata ?? {}) as Record<string, unknown>;
      // anon session not in select for size; rely on metadata if present
      const sid = typeof meta.session === "string" ? meta.session : null;
      if (sid) sessions.add(sid);
    }
    return { byType, bySource, byPage, total: events.length };
  }, [events]);

  const top = (obj: Record<string, number>, n = 8) =>
    Object.entries(obj).sort((a, b) => b[1] - a[1]).slice(0, n);

  const exportCsv = () => {
    if (events.length === 0) return;
    const headers = ["created_at", "event_type", "source", "page"];
    const escape = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""').replace(/\r?\n/g, " ")}"`;
    const rows = events.map((e) => [e.created_at, e.event_type, e.source, e.page].map(escape).join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">Analytics & conversions</h1>
          <p className="mt-1 text-sm text-muted-foreground">Suivi des clics CTA, soumissions et vues.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {([7, 30, 90] as const).map((n) => (
            <button
              key={n}
              onClick={() => setRange(n)}
              className={`rounded-md border px-3 py-1.5 text-xs font-medium ${
                range === n
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground/80 hover:bg-secondary"
              }`}
            >
              {n} jours
            </button>
          ))}
          <button
            onClick={() => setRange("custom")}
            className={`rounded-md border px-3 py-1.5 text-xs font-medium ${
              range === "custom"
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-foreground/80 hover:bg-secondary"
            }`}
          >
            Personnalisé
          </button>
          {range === "custom" && (
            <>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="rounded-md border border-border bg-card px-2 py-1 text-xs text-foreground"
              />
              <span className="text-xs text-muted-foreground">→</span>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="rounded-md border border-border bg-card px-2 py-1 text-xs text-foreground"
              />
            </>
          )}
          <button
            onClick={exportCsv}
            disabled={events.length === 0}
            className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground/80 hover:bg-secondary disabled:opacity-50"
          >
            <Download className="h-3 w-3" /> CSV
          </button>
        </div>
      </div>

      {loading ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">Chargement…</div>
      ) : events.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <BarChart3 className="mx-auto h-8 w-8 text-muted-foreground" />
          <div className="mt-2 text-sm text-muted-foreground">Aucun événement sur cette période.</div>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Événements" value={stats.total} />
            <Stat label="Clics CTA" value={stats.byType["cta_click"] ?? 0} />
            <Stat label="Soumissions contact" value={stats.byType["contact_submit"] ?? 0} />
            <Stat label="Vues formations" value={stats.byType["formation_view"] ?? 0} />
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <RankCard title="Top types d'événements" rows={top(stats.byType)} />
            <RankCard title="Top sources CTA" rows={top(stats.bySource)} />
            <RankCard title="Top pages" rows={top(stats.byPage)} />
          </div>

          <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-secondary/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3">Page</th>
                </tr>
              </thead>
              <tbody>
                {events.slice(0, 50).map((e) => (
                  <tr key={e.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-2 text-muted-foreground">{new Date(e.created_at).toLocaleString("fr-FR")}</td>
                    <td className="px-4 py-2 font-medium text-foreground">{e.event_type}</td>
                    <td className="px-4 py-2 text-muted-foreground">{e.source ?? "—"}</td>
                    <td className="px-4 py-2 text-muted-foreground">{e.page ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-2 text-3xl font-bold text-foreground">{value}</div>
    </div>
  );
}

function RankCard({ title, rows }: { title: string; rows: [string, number][] }) {
  const max = Math.max(1, ...rows.map((r) => r[1]));
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
      <div className="text-sm font-semibold text-foreground">{title}</div>
      <ul className="mt-3 space-y-2">
        {rows.length === 0 && <li className="text-xs text-muted-foreground">Aucune donnée</li>}
        {rows.map(([k, v]) => (
          <li key={k}>
            <div className="flex items-center justify-between text-xs">
              <span className="truncate text-foreground/85" title={k}>{k}</span>
              <span className="font-semibold text-foreground">{v}</span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-secondary">
              <div className="h-full rounded-full bg-[image:var(--gradient-primary)]" style={{ width: `${(v / max) * 100}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}