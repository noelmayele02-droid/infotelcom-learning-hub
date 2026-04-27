import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Loader2, RefreshCw, Database, Key, Cloud, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { checkLovableApiKey } from "@/lib/diagnostic.functions";

export const Route = createFileRoute("/diagnostic")({
  head: () => ({
    meta: [
      { title: "Diagnostic — Infotelcom" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: DiagnosticPage,
});

type Check = {
  status: "idle" | "running" | "ok" | "error";
  message?: string;
  detail?: string;
};

function DiagnosticPage() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

  const [envCheck, setEnvCheck] = useState<Check>({ status: "idle" });
  const [connCheck, setConnCheck] = useState<Check>({ status: "idle" });
  const [authCheck, setAuthCheck] = useState<Check>({ status: "idle" });
  const [aiCheck, setAiCheck] = useState<Check>({ status: "idle" });

  const runAll = async () => {
    // 1. Env
    setEnvCheck({ status: "running" });
    if (!supabaseUrl || !anonKey) {
      setEnvCheck({ status: "error", message: "Variables manquantes", detail: `URL=${!!supabaseUrl} / KEY=${!!anonKey}` });
    } else {
      setEnvCheck({
        status: "ok",
        message: "Variables d'environnement présentes",
        detail: `URL: ${supabaseUrl}\nClé anon: ${anonKey.slice(0, 20)}…${anonKey.slice(-10)}`,
      });
    }

    // 2. Connexion DB (lecture publique)
    setConnCheck({ status: "running" });
    try {
      const { error, count } = await supabase
        .from("training_sessions")
        .select("*", { count: "exact", head: true });
      if (error) {
        setConnCheck({ status: "error", message: "Échec lecture DB", detail: error.message });
      } else {
        setConnCheck({ status: "ok", message: "Connexion DB OK", detail: `${count ?? 0} session(s) accessibles` });
      }
    } catch (e) {
      setConnCheck({ status: "error", message: "Exception", detail: e instanceof Error ? e.message : String(e) });
    }

    // 3. Auth ping
    setAuthCheck({ status: "running" });
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        setAuthCheck({ status: "error", message: "Auth indisponible", detail: error.message });
      } else {
        setAuthCheck({
          status: "ok",
          message: "Service Auth opérationnel",
          detail: data.session ? `Session active: ${data.session.user.email}` : "Aucune session active (normal si non connecté)",
        });
      }
    } catch (e) {
      setAuthCheck({ status: "error", message: "Exception Auth", detail: e instanceof Error ? e.message : String(e) });
    }

    // 4. LOVABLE_API_KEY via server function
    setAiCheck({ status: "running" });
    try {
      const r = await checkLovableApiKey();
      if (r.ok) {
        setAiCheck({ status: "ok", message: "LOVABLE_API_KEY valide", detail: `Gateway HTTP ${r.status}` });
      } else {
        setAiCheck({
          status: "error",
          message: "LOVABLE_API_KEY non fonctionnelle",
          detail: `Status ${r.status} — ${r.error ?? "erreur inconnue"}`,
        });
      }
    } catch (e) {
      setAiCheck({ status: "error", message: "Exception serveur", detail: e instanceof Error ? e.message : String(e) });
    }
  };

  useEffect(() => {
    runAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const allOk = [envCheck, connCheck, authCheck, aiCheck].every((c) => c.status === "ok");
  const anyRunning = [envCheck, connCheck, authCheck, aiCheck].some((c) => c.status === "running");

  return (
    <div className="min-h-screen bg-[image:var(--gradient-subtle)] py-12">
      <div className="mx-auto max-w-3xl px-4">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground md:text-3xl">Diagnostic système</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Vérifie la connexion à Lovable Cloud, la base de données et la clé AI Gateway.
            </p>
          </div>
          <Button onClick={runAll} disabled={anyRunning} variant="outline" size="sm">
            <RefreshCw className={`h-4 w-4 ${anyRunning ? "animate-spin" : ""}`} /> Relancer
          </Button>
        </div>

        {!anyRunning && (
          <div
            className={`mb-6 rounded-xl border p-4 text-sm font-medium ${
              allOk
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                : "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400"
            }`}
          >
            {allOk ? "✅ Tous les systèmes sont opérationnels." : "⚠️ Un ou plusieurs services rencontrent un problème."}
          </div>
        )}

        <div className="space-y-3">
          <CheckCard icon={Key} title="Variables d'environnement" check={envCheck} />
          <CheckCard icon={Database} title="Connexion base de données" check={connCheck} />
          <CheckCard icon={Cloud} title="Service d'authentification" check={authCheck} />
          <CheckCard icon={Server} title="LOVABLE_API_KEY (AI Gateway)" check={aiCheck} />
        </div>
      </div>
    </div>
  );
}

function CheckCard({
  icon: Icon,
  title,
  check,
}: {
  icon: typeof Key;
  title: string;
  check: Check;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary">
          <Icon className="h-4 w-4 text-foreground/70" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="font-semibold text-foreground">{title}</div>
            <StatusBadge status={check.status} />
          </div>
          {check.message && <div className="mt-1 text-sm text-foreground/85">{check.message}</div>}
          {check.detail && (
            <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap break-all rounded-md bg-secondary/40 p-2 text-xs text-muted-foreground">
              {check.detail}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Check["status"] }) {
  if (status === "running")
    return (
      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
        <Loader2 className="h-3 w-3 animate-spin" /> Test…
      </span>
    );
  if (status === "ok")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
        <CheckCircle2 className="h-3 w-3" /> OK
      </span>
    );
  if (status === "error")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-destructive/15 px-2 py-0.5 text-xs font-medium text-destructive">
        <XCircle className="h-3 w-3" /> Erreur
      </span>
    );
  return <span className="text-xs text-muted-foreground">—</span>;
}