import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone, Radio } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-secondary/40">
      <div className="container mx-auto grid gap-10 px-4 py-12 md:grid-cols-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[image:var(--gradient-primary)] text-primary-foreground">
              <Radio className="h-5 w-5" />
            </span>
            <span className="text-base font-bold text-foreground">Infotelcom</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Centre de formation expert en télécoms et informatique. Formations certifiantes pour professionnels et entreprises.
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-foreground">Navigation</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-primary">Accueil</Link></li>
            <li><Link to="/formations" className="hover:text-primary">Formations</Link></li>
            <li><Link to="/a-propos" className="hover:text-primary">À propos</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-foreground">Domaines</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Fibre optique & FTTH</li>
            <li>Réseaux & transmission</li>
            <li>Radio 4G / 5G</li>
            <li>Cybersécurité & dev</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-foreground">Contact</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 text-primary" /> Avenue des Télécoms, Douala</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> +237 6 00 00 00 00</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> contact@infotelcom.com</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="container mx-auto px-4 py-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Infotelcom Formation. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}