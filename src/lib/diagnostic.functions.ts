import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

async function pingLovableGateway() {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) return { ok: false, status: 0, error: "LOVABLE_API_KEY non définie côté serveur" };

  try {
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [{ role: "user", content: "ping" }],
        max_tokens: 5,
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      return { ok: false, status: res.status, error: text.slice(0, 200) };
    }
    return { ok: true, status: res.status, error: null };
  } catch (e) {
    return { ok: false, status: 0, error: e instanceof Error ? e.message : String(e) };
  }
}

export const checkLovableApiKey = createServerFn({ method: "GET" }).handler(async () => pingLovableGateway());

export const runPostRedeployVerification = createServerFn({ method: "POST" }).handler(async () => {
  const ai = await pingLovableGateway();
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const db = { ok: false, error: "Variables serveur base manquantes" as string | null };

  if (url && serviceKey) {
    const admin = createClient<Record<string, never>>(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const { error } = await admin.from("training_sessions").select("id", { count: "exact", head: true });
    db.ok = !error;
    db.error = error?.message ?? null;
    await admin.from("deployment_checks").insert({
      check_name: "post_redeploy",
      status: ai.ok && db.ok ? "ok" : "error",
      details: { ai, db },
    });
  }

  return { ok: ai.ok && db.ok, ai, db, checked_at: new Date().toISOString() };
});