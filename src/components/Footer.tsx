import { Mail, Linkedin, Phone, Github } from "lucide-react";
import { profile } from "@/data/portfolio";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-surface/40">
      <div className="container-x px-5 py-12 sm:px-8">
        <div className="flex flex-col items-center gap-6 text-center">
          <p className="max-w-xl font-display text-lg font-medium italic text-white/90">
            « La technologie prend tout son sens lorsqu&apos;elle résout des problèmes réels. »
          </p>

          <p className="text-sm font-medium tracking-[0.2em] text-white/70">
            XAM - JEUF - JARIÑU
          </p>

          <div className="flex gap-3">
            <a
              href={`mailto:${profile.email}`}
              aria-label="Email"
              className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 text-muted transition hover:bg-primary hover:text-base"
            >
              <Mail size={17} />
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 text-muted transition hover:bg-primary hover:text-base"
            >
              <Linkedin size={17} />
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 text-muted transition hover:bg-primary hover:text-base"
            >
              <Github size={17} />
            </a>
            <a
              href={`tel:${profile.phone.replace(/\s/g, "")}`}
              aria-label="Téléphone"
              className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 text-muted transition hover:bg-primary hover:text-base"
            >
              <Phone size={17} />
            </a>
          </div>

          <div className="mt-2 h-px w-full max-w-xs bg-white/5" />

          <p className="text-xs text-muted">
            © {new Date().getFullYear()} {profile.name}. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
