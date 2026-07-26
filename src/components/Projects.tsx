"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { projects } from "@/data/portfolio";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

export default function Projects() {
  return (
    <section id="projets" className="section-pad bg-surface/30">
      <div className="container-x">
        <SectionHeading
          index="05"
          eyebrow="Projets"
          title="Des produits qui tournent en production"
          description="Sélection de réalisations, de la vision par ordinateur biométrique aux plateformes SaaS."
        />

        <div className="grid gap-6 lg:grid-cols-2">
          {projects.map((p, i) => (
            <Reveal key={p.name} delay={(i % 2) * 0.08}>
              <motion.article
                whileHover={{ y: -5 }}
                className="glass group relative flex h-full flex-col overflow-hidden rounded-3xl p-7"
              >
                {/* Halo d'accent */}
                <div
                  className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-20 blur-3xl transition group-hover:opacity-40"
                  style={{ background: p.accent }}
                />

                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 font-mono text-[11px] text-primary ring-1 ring-primary/20">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {p.status}
                    </span>
                    <h3 className="font-display text-xl font-bold text-white">{p.name}</h3>
                    <p className="mt-0.5 text-sm text-primary/80">{p.tagline}</p>
                  </div>
                  {p.link && (
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Ouvrir ${p.name}`}
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/5 text-white transition hover:bg-primary hover:text-base"
                    >
                      <ArrowUpRight size={17} />
                    </a>
                  )}
                </div>

                <p className="text-sm leading-relaxed text-muted">{p.description}</p>

                <ul className="mt-4 space-y-2">
                  {p.highlights.map((h) => (
                    <li key={h} className="flex gap-2 text-sm text-white/80">
                      <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-primary" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto flex flex-wrap gap-2 pt-6">
                  {p.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded-md border border-white/5 bg-white/[0.03] px-2.5 py-1 font-mono text-xs text-muted"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </motion.article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
