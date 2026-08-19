"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Download, Menu, X } from "lucide-react";
import { usePortfolio, useLocale, useUI } from "@/context/LocaleContext";

export default function Navbar() {
  const { profile } = usePortfolio();
  const { locale, toggle } = useLocale();
  const t = useUI();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <nav
        className={`container-x flex items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-300 sm:px-6 ${
          scrolled ? "glass-strong shadow-card" : "bg-transparent"
        }`}
      >
        <a href="#top" className="group flex items-center gap-2.5">
          <span className="relative h-9 w-9 overflow-hidden rounded-xl ring-1 ring-primary/40">
            <Image
              src={profile.photo}
              alt={profile.name}
              width={72}
              height={72}
              className="h-full w-full object-cover"
              priority
            />
          </span>
          <span className="hidden font-display text-sm font-semibold tracking-tight text-white sm:block">
            {profile.name}
          </span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {t.nav.links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="rounded-lg px-3 py-2 text-sm text-muted transition hover:bg-white/5 hover:text-white"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            aria-label="Toggle language"
            className="flex items-center gap-0.5 rounded-lg px-2 py-1.5 text-xs font-semibold ring-1 ring-white/10 transition hover:bg-white/5"
          >
            <span className={locale === "fr" ? "text-primary" : "text-muted"}>FR</span>
            <span className="text-muted/50 mx-0.5">|</span>
            <span className={locale === "en" ? "text-primary" : "text-muted"}>EN</span>
          </button>
          <a
            href={profile.cvPath}
            download
            className="hidden items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-base transition hover:bg-primary/90 sm:flex"
          >
            <Download size={16} />
            CV
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            className="grid h-10 w-10 place-items-center rounded-xl text-white ring-1 ring-white/10 md:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="container-x mt-2 md:hidden">
          <ul className="glass-strong flex flex-col gap-1 rounded-2xl p-3">
            {t.nav.links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm text-muted transition hover:bg-white/5 hover:text-white"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href={profile.cvPath}
                download
                onClick={() => setOpen(false)}
                className="mt-1 flex items-center gap-2 rounded-lg bg-primary px-3 py-2.5 text-sm font-semibold text-base"
              >
                <Download size={16} /> {t.nav.downloadCv}
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
