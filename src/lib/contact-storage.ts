// Persist contact submissions in localStorage so the confirmation page can
// show a recap and the admin dashboard (Phase 2/3) can display history.

export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: number;
};

const STORAGE_KEY = "infotelcom:contact:submissions";
const LAST_KEY = "infotelcom:contact:last";

export function saveSubmission(
  data: Omit<ContactSubmission, "id" | "createdAt">,
): ContactSubmission {
  const submission: ContactSubmission = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };
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