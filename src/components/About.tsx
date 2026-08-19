"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { usePortfolio, useUI } from "@/context/LocaleContext";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

export default function About() {
  const { about, profile, languages } = usePortfolio();
  const t = useUI();

  return (
    <section id="apropos" className="section-pad">
      <div className="container-x">
        <SectionHeading index={t.about.index} eyebrow={t.about.eyebrow} title={t.about.title} />

        <div className="grid items-start gap-10 md:grid-cols-[320px_1fr] md:gap-14">
          <Reveal>
            <div className="relative mx-auto w-full max-w-[300px]">
              <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-primary/30 to-transparent blur-2xl" />
              <div className="glass relative overflow-hidden rounded-3xl p-2">
                <Image
                  src={profile.photo}
                  alt={profile.name}
                  width={640}
                  height={640}
                  sizes="(max-width: 768px) 280px, 300px"
                  className="rounded-2xl object-cover"
                  loading="lazy"
                />
                <div className="pointer-events-none absolute inset-2 rounded-2xl ring-1 ring-inset ring-white/10" />
              </div>
              <div className="glass-strong absolute -bottom-4 -right-3 rounded-2xl px-4 py-3 shadow-card">
                <p className="font-mono text-lg font-semibold text-primary">4+ ans</p>
                <p className="text-[11px] text-muted">{t.about.experience}</p>
              </div>
            </div>
          </Reveal>

          <div>
            {about.paragraphs.map((p, idx) => (
              <Reveal key={idx} delay={idx * 0.08}>
                <p className="mb-5 text-base leading-relaxed text-muted sm:text-lg">{p}</p>
              </Reveal>
            ))}

            <Reveal delay={0.24}>
              <div className="mt-6 flex flex-wrap gap-2">
                {about.atouts.map((a) => (
                  <span
                    key={a}
                    className="glass rounded-full px-3.5 py-1.5 text-sm text-white/90"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="mt-8 flex flex-wrap gap-6">
                {languages.map((l) => (
                  <motion.div key={l.name} whileHover={{ y: -2 }}>
                    <p className="font-display text-base font-semibold text-white">{l.name}</p>
                    <p className="text-sm text-muted">{l.level}</p>
                  </motion.div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
