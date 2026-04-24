// Persist contact submissions in localStorage (for the immediate confirmation
// recap) AND insert them into Lovable Cloud so the admin dashboard can show
// the full history with status tracking.

import { supabase } from "@/integrations/supabase/client";

export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  formationSlug?: string;
  sessionId?: string;
  createdAt: number;
};

const STORAGE_KEY = "infotelcom:contact:submissions";
const LAST_KEY = "infotelcom:contact:last";

export async function saveSubmission(
  data: Omit<ContactSubmission, "id" | "createdAt">,
): Promise<ContactSubmission> {
  const submission: ContactSubmission = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };

  // Insert into Supabase first; keep going even if it fails (offline fallback).
  try {
    const { data: inserted, error } = await supabase
      .from("contact_submissions")
      .insert({
        name: data.name,
        email: data.email,
        phone: data.phone ?? null,
        subject: data.subject,
        message: data.message,
        formation_slug: data.formationSlug ?? null,
        session_id: data.sessionId ?? null,
      })
      .select()
      .single();
    if (!error && inserted) {
      submission.id = inserted.id;
      submission.createdAt = new Date(inserted.created_at).getTime();
    }
  } catch {
    /* offline fallback */
  }

  if (typeof window === "undefined") return submission;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const list: ContactSubmission[] = raw ? JSON.parse(raw) : [];
    list.push(submission);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.localStorage.setItem(LAST_KEY, JSON.stringify(submission));
  } catch {
    /* ignore */
  }
  return submission;
}

export function getLastSubmission(): ContactSubmission | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LAST_KEY);
    return raw ? (JSON.parse(raw) as ContactSubmission) : null;
  } catch {
    return null;
  }
}

export function getAllSubmissions(): ContactSubmission[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ContactSubmission[]) : [];
  } catch {
    return [];
  }
}