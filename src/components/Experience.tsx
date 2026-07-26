"use client";

import { GraduationCap } from "lucide-react";
import { experiences, education } from "@/data/portfolio";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

export default function Experience() {
  return (
    <section id="experience" className="section-pad">
      <div className="container-x">
        <SectionHeading index="06" eyebrow="Expérience" title="Parcours professionnel" />

        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-14">
          {/* Expériences */}
          <div className="space-y-4">
            {experiences.map((e, i) => (
              <Reveal key={e.role + e.company} delay={i * 0.05}>
                <div className="glass rounded-2xl p-6 transition hover:border-primary/25">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h3 className="font-display text-lg font-semibold text-white">{e.role}</h3>
                    <span className="font-mono text-xs text-primary">{e.period}</span>
                  </div>
                  <p className="mb-3 text-sm font-medium text-primary/80">{e.company}</p>
                  <ul className="space-y-1.5">
                    {e.points.map((pt) => (
                      <li key={pt} className="flex gap-2 text-sm text-muted">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary/60" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Formation */}
          <div>
            <Reveal>
              <div className="mb-4 flex items-center gap-2">
                <GraduationCap size={18} className="text-primary" />
                <h3 className="font-display text-lg font-semibold text-white">
                  Diplômes & Formation
                </h3>
              </div>
            </Reveal>
            <div className="space-y-4">
              {education.map((ed, i) => (
                <Reveal key={ed.degree} delay={i * 0.06}>
                  <div className="relative rounded-2xl border border-white/5 bg-white/[0.02] p-5">
                    <p className="font-mono text-xs text-primary">{ed.period}</p>
                    <p className="mt-1 font-display font-semibold text-white">{ed.degree}</p>
                    <p className="text-sm text-muted">{ed.school}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
