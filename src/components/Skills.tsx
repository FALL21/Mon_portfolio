"use client";

import { motion } from "framer-motion";
import { usePortfolio, useUI } from "@/context/LocaleContext";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

export default function Skills() {
  const { skillGroups } = usePortfolio();
  const t = useUI();

  return (
    <section id="competences" className="section-pad bg-surface/30">
      <div className="container-x">
        <SectionHeading
          index={t.skills.index}
          eyebrow={t.skills.eyebrow}
          title={t.skills.title}
        />

        <div className="grid gap-5 md:grid-cols-2">
          {skillGroups.map((group, gi) => (
            <Reveal key={group.name} delay={gi * 0.06}>
              <div className="glass h-full rounded-2xl p-6">
                <div className="mb-4 flex items-center gap-3">
                  <span className="font-mono text-xs text-primary">
                    {String(gi + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-lg font-semibold text-white">
                    {group.name}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <motion.span
                      key={item}
                      whileHover={{ y: -2, scale: 1.03 }}
                      className="cursor-default rounded-lg border border-white/5 bg-white/[0.03] px-3 py-1.5 text-sm text-white/85 transition hover:border-primary/40 hover:text-primary"
                    >
                      {item}
                    </motion.span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
