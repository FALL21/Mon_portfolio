"use client";

import { timeline } from "@/data/portfolio";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

export default function Timeline() {
  return (
    <section id="parcours" className="section-pad">
      <div className="container-x">
        <SectionHeading
          index="02"
          eyebrow="Parcours"
          title="Des mathématiques à l'IA en production"
          description="Un fil conducteur : la rigueur analytique mise au service de produits qui tournent réellement."
        />

        <div className="relative ml-2">
          {/* Ligne verticale */}
          <div className="absolute left-[15px] top-2 h-[calc(100%-1rem)] w-px bg-gradient-to-b from-primary/60 via-primary/20 to-transparent" />

          <div className="space-y-8">
            {timeline.map((item, i) => {
              const Icon = item.icon;
              return (
                <Reveal key={i} delay={i * 0.06}>
                  <div className="relative flex gap-6 pl-1">
                    <div className="relative z-10 mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-base ring-1 ring-primary/40">
                      <Icon size={15} className="text-primary" />
                    </div>
                    <div className="glass flex-1 rounded-2xl px-5 py-4 transition hover:border-primary/30">
                      <p className="font-mono text-xs text-primary">{item.year}</p>
                      <h3 className="mt-1 font-display text-lg font-semibold text-white">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted">{item.org}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
