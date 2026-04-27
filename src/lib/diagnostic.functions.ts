import { createServerFn } from "@tanstack/react-start";

export const checkLovableApiKey = createServerFn({ method: "GET" }).handler(async () => {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) {
    return { ok: false, status: 0, error: "LOVABLE_API_KEY non définie côté serveur" };
  }
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
});