"use client";

import { motion } from "framer-motion";
import { usePortfolio, useUI } from "@/context/LocaleContext";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

export default function Services() {
  const { services } = usePortfolio();
  const t = useUI();

  return (
    <section id="services" className="section-pad">
      <div className="container-x">
        <SectionHeading
          index={t.services.index}
          eyebrow={t.services.eyebrow}
          title={t.services.title}
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.title} delay={(i % 3) * 0.06}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="glass group h-full rounded-2xl p-6 transition hover:border-primary/30 hover:shadow-glow"
                >
                  <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-primary/10 ring-1 ring-primary/20 transition group-hover:bg-primary/20">
                    <Icon size={20} className="text-primary" />
                  </div>
                  <h3 className="font-display text-base font-semibold text-white">
                    {s.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.desc}</p>
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
