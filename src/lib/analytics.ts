// Lightweight analytics shim. Stores events in localStorage for the dashboard
// (Phase 1) and pushes to window.dataLayer if Google Tag Manager is present.
// In Phase 2 we'll wire this to a server endpoint.

export type AnalyticsEvent = {
  name: string;
  ts: number;
  props?: Record<string, string | number | boolean | undefined>;
};

const STORAGE_KEY = "infotelcom:analytics:events";
const MAX_EVENTS = 500;

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