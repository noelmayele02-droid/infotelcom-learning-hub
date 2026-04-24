import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Lock, LogIn } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/lib/use-admin-auth";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Connexion administrateur — Infotelcom" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLogin,
});

const schema = z.object({
  email: z.string().trim().email("Email invalide").max(255),
  password: z.string().min(6, "Mot de passe trop court").max(100),
});

function AdminLogin() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user, isAdmin, loading } = useAdminAuth();

  useEffect(() => {
    if (!loading && user && isAdmin) {
      navigate({ to: "/admin" });
    }
  }, [user, isAdmin, loading, navigate]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      email: fd.get("email"),
      password: fd.get("password"),
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Formulaire invalide");
      return;
    }
    setSubmitting(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("Compte créé. Vous pouvez vous connecter.");
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: parsed.data.email,
          password: parsed.data.password,
        });
        if (error) throw error;
        toast.success("Connexion réussie");
        // Redirect handled by useEffect once role is fetched.
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erreur";
      if (msg.toLowerCase().includes("invalid login")) {
        toast.error("Email ou mot de passe incorrect");
      } else if (msg.toLowerCase().includes("already registered")) {
        toast.error("Cet email est déjà inscrit. Connectez-vous.");
        setMode("signin");
      } else {
        toast.error(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[image:var(--gradient-subtle)] px-4 py-12">
      <Toaster />
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-elegant)]">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-glow)]">
            <Lock className="h-6 w-6" />
          </span>
          <h1 className="mt-4 text-2xl font-bold text-foreground">Espace administrateur</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Réservé à l'équipe Infotelcom
          </p>
        </div>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required maxLength={255} placeholder="admin@infotelcom.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input id="password" name="password" type="password" required minLength={6} maxLength={100} placeholder="••••••••" />
          </div>
          <Button type="submit" variant="hero" size="lg" disabled={submitting} className="w-full">
            <LogIn className="h-4 w-4" />
            {submitting ? "Connexion…" : mode === "signin" ? "Se connecter" : "Créer le compte"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          {mode === "signin" ? (
            <>
              Premier accès ?{" "}
              <button type="button" onClick={() => setMode("signup")} className="font-medium text-primary hover:underline">
                Créer le compte admin
              </button>
            </>
          ) : (
            <>
              Déjà un compte ?{" "}
              <button type="button" onClick={() => setMode("signin")} className="font-medium text-primary hover:underline">
                Se connecter
              </button>
            </>
          )}
        </div>

        <div className="mt-4 text-center">
          <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">
            ← Retour au site
          </Link>
        </div>
      </div>
    </div>
  );
}