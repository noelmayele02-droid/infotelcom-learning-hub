import { Link } from "@tanstack/react-router";
import { Mail, MapPin, MessageCircle, Phone, Radio } from "lucide-react";

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
            <li><Link to="/calendrier" className="hover:text-primary">Calendrier</Link></li>
            <li><Link to="/a-propos" className="hover:text-primary">À propos</Link></li>
            <li><Link to="/equipe" className="hover:text-primary">Équipe</Link></li>
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
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 text-primary" /> 17 rue Linengué, Casis — Brazzaville, Congo</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> <a href="tel:+33652861159" className="hover:text-primary">+33 6 52 86 11 59</a></li>
            <li className="flex items-center gap-2"><MessageCircle className="h-4 w-4 text-primary" /> <a href="https://wa.me/242068498792" target="_blank" rel="noopener" className="hover:text-primary">+242 06 849 87 92 (WhatsApp)</a></li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> <a href="mailto:infotelcomtech@gmail.com" className="hover:text-primary">infotelcomtech@gmail.com</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-2 px-4 py-4 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Infotelcom Formation. Tous droits réservés.</span>
          <Link to="/admin/login" className="hover:text-primary">Espace admin</Link>
        </div>
      </div>
    </footer>
  );
}