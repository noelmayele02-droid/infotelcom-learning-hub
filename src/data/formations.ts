export type Formation = {
  slug: string;
  title: string;
  category: "Télécoms" | "Informatique";
  duration: string;
  level: "Débutant" | "Intermédiaire" | "Avancé";
  price: string;
  description: string;
  highlights: string[];
};

export const formations: Formation[] = [
  {
    slug: "fibre-optique-ftth",
    title: "Fibre Optique & FTTH",
    category: "Télécoms",
    duration: "5 jours",
    level: "Débutant",
    price: "Sur devis",
    description:
      "Maîtrisez l'installation, la soudure et le raccordement de la fibre optique en environnement FTTH.",
    highlights: ["Soudure & mesures OTDR", "Raccordement client", "Sécurité chantier"],
  },
  {
    slug: "reseaux-transmission",
    title: "Réseaux de Transmission",
    category: "Télécoms",
    duration: "4 jours",
    level: "Intermédiaire",
    price: "Sur devis",
    description:
      "Comprendre les architectures SDH, DWDM et IP/MPLS des opérateurs télécoms modernes.",
    highlights: ["SDH / DWDM", "IP / MPLS", "Supervision réseau"],
  },
  {
    slug: "radio-bts-5g",
    title: "Radio Mobile 4G / 5G",
    category: "Télécoms",
    duration: "5 jours",
    level: "Avancé",
    price: "Sur devis",
    description:
      "Déploiement et exploitation des sites radio 4G/5G : antennes, BBU, RRU et mesures terrain.",
    highlights: ["Architecture RAN", "Mesures drive-test", "Optimisation cellules"],
  },
  {
    slug: "cybersecurite",
    title: "Cybersécurité Fondamentaux",
    category: "Informatique",
    duration: "5 jours",
    level: "Intermédiaire",
    price: "Sur devis",
    description:
      "Identifier les menaces, sécuriser un SI et appliquer les bonnes pratiques ISO 27001.",
    highlights: ["Pentest basics", "Hardening", "ISO 27001"],
  },
  {
    slug: "administration-systeme-linux",
    title: "Administration Linux",
    category: "Informatique",
    duration: "4 jours",
    level: "Intermédiaire",
    price: "Sur devis",
    description:
      "Installer, configurer et maintenir un serveur Linux en production (Debian / RHEL).",
    highlights: ["Bash & scripts", "Services réseau", "Sécurité système"],
  },
  {
    slug: "developpement-web",
    title: "Développement Web Full-Stack",
    category: "Informatique",
    duration: "10 jours",
    level: "Débutant",
    price: "Sur devis",
    description:
      "De HTML/CSS à React et Node.js : créez des applications web modernes et performantes.",
    highlights: ["React / TypeScript", "API REST", "Déploiement"],
  },
  {
    slug: "data-analyse-power-bi",
    title: "Data Analyse & Power BI",
    category: "Informatique",
    duration: "3 jours",
    level: "Débutant",
    price: "Sur devis",
    description:
      "Exploitez vos données métier avec Excel avancé et Power BI pour piloter votre activité.",
    highlights: ["Excel avancé", "DAX & modèles", "Dashboards"],
  },
  {
    slug: "voip-asterisk",
    title: "VoIP & Asterisk",
    category: "Télécoms",
    duration: "4 jours",
    level: "Intermédiaire",
    price: "Sur devis",
    description:
      "Déployez une solution de téléphonie IP d'entreprise avec Asterisk et SIP.",
    highlights: ["SIP / RTP", "Asterisk PBX", "QoS voix"],
  },
];