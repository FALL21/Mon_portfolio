"use client";

import { motion } from "framer-motion";
import { Mail, Phone, Linkedin, Github, Download, ArrowRight } from "lucide-react";
import { usePortfolio, useUI } from "@/context/LocaleContext";
import Reveal from "./Reveal";

export default function Contact() {
  const { profile } = usePortfolio();
  const t = useUI();

  const items = [
    { icon: Mail, label: "Email", value: profile.email, href: `mailto:${profile.email}`, external: false },
    { icon: Phone, label: t.contact.eyebrow === "Contact" ? "Phone" : "Téléphone", value: profile.phone, href: `tel:${profile.phone.replace(/\s/g, "")}`, external: false },
    { icon: Linkedin, label: "LinkedIn", value: profile.linkedinHandle, href: profile.linkedin, external: true },
    { icon: Github, label: "GitHub", value: profile.githubHandle, href: profile.github, external: true },
  ];

  return (
    <section id="contact" className="section-pad">
      <div className="container-x">
        <Reveal>
          <div className="glass-strong relative overflow-hidden rounded-[2rem] px-6 py-14 text-center sm:px-12 md:py-20">
            <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/20 blur-[100px]" />
            <div className="bg-dotgrid pointer-events-none absolute inset-0 opacity-40" />

            <div className="relative">
              <p className="eyebrow">{t.contact.eyebrow}</p>
              <h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl font-bold tracking-tight text-white sm:text-5xl">
                {t.contact.title}{" "}
                <span className="text-gradient">{t.contact.titleHighlight}</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base text-muted">
                {t.contact.subtitle}
              </p>

              <div className="mx-auto mt-10 grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {items.map((it) => {
                  const Icon = it.icon;
                  return (
                    <motion.a
                      key={it.label}
                      href={it.href}
                      target={it.external ? "_blank" : undefined}
                      rel={it.external ? "noopener noreferrer" : undefined}
                      whileHover={{ y: -4 }}
                      className="glass flex flex-col items-center gap-2 rounded-2xl p-5 transition hover:border-primary/30"
                    >
                      <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                        <Icon size={18} />
                      </span>
                      <span className="text-xs text-muted">{it.label}</span>
                      <span className="text-sm font-medium text-white">{it.value}</span>
                    </motion.a>
                  );
                })}
              </div>

              <div className="mt-10 flex flex-wrap justify-center gap-3">
                <a
                  href={`mailto:${profile.email}`}
                  className="group flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-base transition hover:bg-primary/90 hover:shadow-glow"
                >
                  {t.contact.cta}
                  <ArrowRight size={16} className="transition group-hover:translate-x-1" />
                </a>
                <a
                  href={profile.cvPath}
                  download
                  className="glass flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
                >
                  <Download size={16} /> {t.contact.cv}
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
