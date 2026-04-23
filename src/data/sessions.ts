import { formations } from "./formations";

export type Session = {
  id: string;
  formationSlug: string;
  startDate: string; // ISO
  endDate: string;
  city: string;
  mode: "Présentiel" | "Distanciel" | "Hybride";
  seats: number;
};

export const sessions: Session[] = [
  { id: "s1", formationSlug: "fibre-optique-ftth", startDate: "2026-02-09", endDate: "2026-02-13", city: "Brazzaville", mode: "Présentiel", seats: 12 },
  { id: "s2", formationSlug: "radio-bts-5g", startDate: "2026-02-16", endDate: "2026-02-20", city: "Pointe-Noire", mode: "Présentiel", seats: 10 },
  { id: "s3", formationSlug: "cybersecurite", startDate: "2026-03-02", endDate: "2026-03-06", city: "Brazzaville", mode: "Hybride", seats: 15 },
  { id: "s4", formationSlug: "developpement-web", startDate: "2026-03-09", endDate: "2026-03-20", city: "En ligne", mode: "Distanciel", seats: 20 },
  { id: "s5", formationSlug: "data-analyse-power-bi", startDate: "2026-03-23", endDate: "2026-03-25", city: "Brazzaville", mode: "Présentiel", seats: 14 },
  { id: "s6", formationSlug: "voip-asterisk", startDate: "2026-04-06", endDate: "2026-04-09", city: "En ligne", mode: "Distanciel", seats: 12 },
  { id: "s7", formationSlug: "reseaux-transmission", startDate: "2026-04-13", endDate: "2026-04-16", city: "Brazzaville", mode: "Présentiel", seats: 12 },
  { id: "s8", formationSlug: "administration-systeme-linux", startDate: "2026-04-20", endDate: "2026-04-23", city: "Pointe-Noire", mode: "Hybride", seats: 12 },
  { id: "s9", formationSlug: "fibre-optique-ftth", startDate: "2026-05-04", endDate: "2026-05-08", city: "Brazzaville", mode: "Présentiel", seats: 12 },
  { id: "s10", formationSlug: "cybersecurite", startDate: "2026-05-11", endDate: "2026-05-15", city: "En ligne", mode: "Distanciel", seats: 18 },
];

export function getFormationTitle(slug: string): string {
  return formations.find((f) => f.slug === slug)?.title ?? slug;
}

export function getFormationCategory(slug: string) {
  return formations.find((f) => f.slug === slug)?.category;
}