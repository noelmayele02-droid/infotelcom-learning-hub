import { Link } from "@tanstack/react-router";
import { Radio } from "lucide-react";

const navItems = [
  { to: "/", label: "Accueil" },
  { to: "/formations", label: "Formations" },
  { to: "/a-propos", label: "À propos" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-card)]">
            <Radio className="h-5 w-5" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-base font-bold tracking-tight text-foreground">Infotelcom</span>
            <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              Formation
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-primary data-[status=active]:bg-secondary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          to="/contact"
          className="hidden rounded-md bg-[image:var(--gradient-primary)] px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-card)] transition-all hover:shadow-[var(--shadow-glow)] md:inline-flex"
        >
          Demander un devis
        </Link>
      </div>
    </header>
  );
}