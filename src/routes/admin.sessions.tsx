import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { CalendarDays, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { formations } from "@/data/formations";

export const Route = createFileRoute("/admin/sessions")({
  component: AdminSessions,
});

type SessionRow = {
  id: string;
  formation_slug: string;
  city: string;
  mode: "Présentiel" | "Distanciel" | "Hybride";
  start_date: string;
  end_date: string;
  seats: number;
  status: "draft" | "published" | "full" | "cancelled" | "completed";
};

function AdminSessions() {
  const [items, setItems] = useState<SessionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("training_sessions")
      .select("*")
      .order("start_date", { ascending: true });
    if (error) toast.error(error.message);
    else setItems((data ?? []) as SessionRow[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const add = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      formation_slug: String(fd.get("formation_slug")),
      city: String(fd.get("city")),
      mode: String(fd.get("mode")) as SessionRow["mode"],
      start_date: String(fd.get("start_date")),
      end_date: String(fd.get("end_date")),
      seats: Number(fd.get("seats")),
    };
    const { error } = await supabase.from("training_sessions").insert(payload);
    if (error) toast.error(error.message);
    else {
      toast.success("Session ajoutée");
      setShowForm(false);
      load();
    }
  };

  const updateField = async (id: string, patch: Partial<SessionRow>) => {
    const { error } = await supabase.from("training_sessions").update(patch).eq("id", id);
    if (error) toast.error(error.message);
    else {
      setItems((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x)));
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer cette session ?")) return;
    const { error } = await supabase.from("training_sessions").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Session supprimée");
      setItems((prev) => prev.filter((x) => x.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">Sessions de formation</h1>
          <p className="mt-1 text-sm text-muted-foreground">Gérez le calendrier des sessions à venir.</p>
        </div>
        <Button onClick={() => setShowForm((v) => !v)}>
          <Plus className="h-4 w-4" /> Nouvelle session
        </Button>
      </div>

      {showForm && (
        <form onSubmit={add} className="grid gap-4 rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)] md:grid-cols-3">
          <div className="md:col-span-2">
            <Label htmlFor="formation_slug">Formation</Label>
            <select id="formation_slug" name="formation_slug" required className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              {formations.map((f) => (
                <option key={f.slug} value={f.slug}>{f.title}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="mode">Mode</Label>
            <select id="mode" name="mode" required className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="Présentiel">Présentiel</option>
              <option value="Distanciel">Distanciel</option>
              <option value="Hybride">Hybride</option>
            </select>
          </div>
          <div>
            <Label htmlFor="city">Ville</Label>
            <Input id="city" name="city" required placeholder="Brazzaville" />
          </div>
          <div>
            <Label htmlFor="start_date">Début</Label>
            <Input id="start_date" name="start_date" type="date" required />
          </div>
          <div>
            <Label htmlFor="end_date">Fin</Label>
            <Input id="end_date" name="end_date" type="date" required />
          </div>
          <div>
            <Label htmlFor="seats">Places</Label>
            <Input id="seats" name="seats" type="number" min={1} max={500} defaultValue={12} required />
          </div>
          <div className="flex items-end gap-2 md:col-span-3">
            <Button type="submit" variant="hero">Enregistrer</Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Annuler</Button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">Chargement…</div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <CalendarDays className="mx-auto h-8 w-8 text-muted-foreground" />
          <div className="mt-2 text-sm text-muted-foreground">Aucune session programmée.</div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-secondary/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Formation</th>
                <th className="px-4 py-3">Dates</th>
                <th className="px-4 py-3">Lieu</th>
                <th className="px-4 py-3">Mode</th>
                <th className="px-4 py-3">Places</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((s) => (
                <tr key={s.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-foreground">{s.formation_slug}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(s.start_date).toLocaleDateString("fr-FR")} → {new Date(s.end_date).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-4 py-3">{s.city}</td>
                  <td className="px-4 py-3">{s.mode}</td>
                  <td className="px-4 py-3">{s.seats}</td>
                  <td className="px-4 py-3">
                    <select
                      value={s.status}
                      onChange={(e) => updateField(s.id, { status: e.target.value as SessionRow["status"] })}
                      className="rounded-md border border-input bg-background px-2 py-1 text-xs"
                    >
                      <option value="draft">Brouillon</option>
                      <option value="published">Publiée</option>
                      <option value="full">Complète</option>
                      <option value="cancelled">Annulée</option>
                      <option value="completed">Terminée</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm" onClick={() => remove(s.id)} className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}