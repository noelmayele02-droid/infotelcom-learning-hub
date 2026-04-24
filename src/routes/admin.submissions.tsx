import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Inbox, Mail, MessageSquare, Phone, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/submissions")({
  component: AdminSubmissions,
});

type Submission = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  formation_slug: string | null;
  session_id: string | null;
  status: "new" | "in_progress" | "done" | "archived";
  admin_notes: string | null;
  created_at: string;
};

const STATUS_LABEL: Record<Submission["status"], string> = {
  new: "Nouvelle",
  in_progress: "En cours",
  done: "Traitée",
  archived: "Archivée",
};

const STATUS_COLOR: Record<Submission["status"], string> = {
  new: "bg-primary/15 text-primary",
  in_progress: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  done: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  archived: "bg-muted text-muted-foreground",
};

function AdminSubmissions() {
  const [items, setItems] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | Submission["status"]>("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error(error.message);
    } else {
      setItems((data ?? []) as Submission[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id: string, status: Submission["status"]) => {
    const { error } = await supabase
      .from("contact_submissions")
      .update({ status })
      .eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Statut mis à jour");
      setItems((prev) => prev.map((x) => (x.id === id ? { ...x, status } : x)));
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer définitivement cette demande ?")) return;
    const { error } = await supabase.from("contact_submissions").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Demande supprimée");
      setItems((prev) => prev.filter((x) => x.id !== id));
    }
  };

  const filtered = filter === "all" ? items : items.filter((x) => x.status === filter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">Demandes de contact</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Toutes les demandes envoyées via le formulaire de contact.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["all", "new", "in_progress", "done", "archived"] as const).map((k) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              filter === k
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-foreground/80 hover:bg-secondary"
            }`}
          >
            {k === "all" ? `Toutes (${items.length})` : `${STATUS_LABEL[k]} (${items.filter((x) => x.status === k).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          Chargement…
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <Inbox className="mx-auto h-8 w-8 text-muted-foreground" />
          <div className="mt-2 text-sm text-muted-foreground">Aucune demande pour ce filtre.</div>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((s) => {
            const isOpen = openId === s.id;
            return (
              <div key={s.id} className="rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
                <button
                  onClick={() => setOpenId(isOpen ? null : s.id)}
                  className="flex w-full items-start justify-between gap-3 p-4 text-left"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-foreground">{s.name}</span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLOR[s.status]}`}>
                        {STATUS_LABEL[s.status]}
                      </span>
                      {s.formation_slug && (
                        <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                          {s.formation_slug}
                        </span>
                      )}
                    </div>
                    <div className="mt-1 truncate text-sm text-muted-foreground">{s.subject}</div>
                  </div>
                  <div className="shrink-0 text-xs text-muted-foreground">
                    {new Date(s.created_at).toLocaleDateString("fr-FR")}
                  </div>
                </button>
                {isOpen && (
                  <div className="space-y-4 border-t border-border p-4">
                    <div className="grid gap-3 text-sm sm:grid-cols-2">
                      <a href={`mailto:${s.email}`} className="inline-flex items-center gap-2 text-foreground hover:text-primary">
                        <Mail className="h-4 w-4 text-primary" /> {s.email}
                      </a>
                      {s.phone && (
                        <a href={`tel:${s.phone}`} className="inline-flex items-center gap-2 text-foreground hover:text-primary">
                          <Phone className="h-4 w-4 text-primary" /> {s.phone}
                        </a>
                      )}
                    </div>
                    <div className="rounded-lg border border-border bg-secondary/30 p-3">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        <MessageSquare className="h-3 w-3" /> Message
                      </div>
                      <p className="mt-2 whitespace-pre-wrap text-sm text-foreground/90">{s.message}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(["new", "in_progress", "done", "archived"] as const).map((st) => (
                        <Button
                          key={st}
                          variant={s.status === st ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateStatus(s.id, st)}
                        >
                          {STATUS_LABEL[st]}
                        </Button>
                      ))}
                      <Button variant="outline" size="sm" onClick={() => remove(s.id)} className="ml-auto text-destructive">
                        <Trash2 className="h-3 w-3" /> Supprimer
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}