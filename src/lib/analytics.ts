// Analytics: persist events both in localStorage (offline fallback)
// and in the Lovable Cloud `analytics_events` table for the admin dashboard.

import { supabase } from "@/integrations/supabase/client";

export type AnalyticsEvent = {
  name: string;
  ts: number;
  props?: Record<string, string | number | boolean | undefined>;
};

const STORAGE_KEY = "infotelcom:analytics:events";
const SESSION_KEY = "infotelcom:analytics:session";
const MAX_EVENTS = 500;

function getAnonSessionId(): string {
  if (typeof window === "undefined") return "ssr";
  try {
    let id = window.localStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      window.localStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return "anon";
  }
}

export function trackEvent(name: string, props?: AnalyticsEvent["props"]) {
  if (typeof window === "undefined") return;
  const event: AnalyticsEvent = { name, ts: Date.now(), props };

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const list: AnalyticsEvent[] = raw ? JSON.parse(raw) : [];
    list.push(event);
    if (list.length > MAX_EVENTS) list.splice(0, list.length - MAX_EVENTS);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    /* ignore storage errors */
  }

  // Forward to dataLayer (GTM/GA) when available.
  const w = window as unknown as { dataLayer?: unknown[] };
  if (Array.isArray(w.dataLayer)) {
    w.dataLayer.push({ event: name, ...props });
  }

  // Fire-and-forget insert into Supabase. Errors are silently swallowed
  // so analytics never break the user experience.
  const source = typeof props?.source === "string" ? props.source : null;
  void supabase
    .from("analytics_events")
    .insert({
      event_type: name,
      source,
      page: window.location.pathname,
      metadata: (props as Record<string, unknown>) ?? {},
      anon_session_id: getAnonSessionId(),
      user_agent: navigator.userAgent,
    })
    .then(() => {});
}

export function getEvents(): AnalyticsEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AnalyticsEvent[]) : [];
  } catch {
    return [];
  }
}

export function clearEvents() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}