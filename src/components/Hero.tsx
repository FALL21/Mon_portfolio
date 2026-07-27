"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Download, MapPin, Sparkles } from "lucide-react";
import { profile } from "@/data/portfolio";

const NeuralMesh = dynamic(() => import("./NeuralMesh"), { ssr: false });

export default function Hero() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % profile.roles.length), 2400);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="top" className="relative min-h-[100svh] overflow-hidden">
      {/* Fond : grille + halo + maillage neuronal (chargé après hydratation) */}
      <div className="bg-dotgrid absolute inset-0" />
      <div className="absolute inset-0">
        <NeuralMesh />
      </div>
      <div className="pointer-events-none absolute left-1/2 top-[-10%] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-base to-transparent" />

      <div className="container-x relative flex min-h-[100svh] flex-col justify-center px-5 pb-16 pt-32 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="glass mb-6 inline-flex w-fit items-center gap-2 rounded-full px-3.5 py-1.5 text-xs text-muted"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          Disponible pour de nouveaux projets
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.04 }}
          className="font-mono text-sm text-primary"
        >
          Bonjour, je suis
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="mt-2 font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-7xl"
        >
          {profile.name}
        </motion.h1>

        <div className="mt-4 flex min-h-[2.6rem] items-center gap-3 sm:min-h-[3.2rem]">
          <span className="hidden h-px w-8 bg-primary/50 sm:block" />
          <AnimatePresence mode="wait">
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.3 }}
              className="font-display text-2xl font-bold text-gradient sm:text-4xl"
            >
              {profile.roles[i]}
            </motion.span>
          </AnimatePresence>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.14 }}
          className="mt-7 max-w-2xl text-base leading-relaxed text-muted sm:text-lg"
        >
          {profile.pitch}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="mt-9 flex flex-wrap items-center gap-3"
        >
          <a
            href="#projets"
            className="group flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-base transition hover:bg-primary/90 hover:shadow-glow"
          >
            Voir mes projets
            <ArrowRight size={16} className="transition group-hover:translate-x-1" />
          </a>
          <a
            href={profile.cvPath}
            download
            className="glass flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
          >
            <Download size={16} /> Télécharger mon CV
          </a>
          <a
            href="#contact"
            className="px-3 py-3 text-sm font-semibold text-muted transition hover:text-white"
          >
            Me contacter
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.28 }}
          className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted"
        >
          <span className="inline-flex items-center gap-1.5">
            <MapPin size={13} className="text-primary" /> {profile.location}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Sparkles size={13} className="text-primary" /> Master ESP Dakar · Licence Maths UCAD
          </span>
        </motion.div>
      </div>
    </section>
  );
}
