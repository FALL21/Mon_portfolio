"use client";

import { useEffect, useRef } from "react";

/**
 * Signature visuelle : maillage de points (face-mesh / embeddings).
 * Mobile : densite reduite, FPS bas, ou dessin statique si economiseur / reduced-motion.
 */
export default function NeuralMesh() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const saveData =
      (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
        ?.saveData === true;

    // Mobile / save-data : un seul frame (statique) — beaucoup plus fluide au scroll
    const staticOnly = reduced || saveData || isMobile;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let visible = true;
    let running = false;
    let raf = 0;
    let startTimer: ReturnType<typeof setTimeout> | null = null;
    let idleHandle: number | null = null;
    let frameSkip = 0;

    type Node = { x: number; y: number; vx: number; vy: number; r: number };
    let nodes: Node[] = [];

    const LINK = isMobile ? 72 : 120;
    // Desktop ~60fps ; tablette legerement throttle si jamais anime
    const FRAME_SKIP = 1;

    function build() {
      const rect = canvas!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 1.5);
      canvas!.width = Math.floor(width * dpr);
      canvas!.height = Math.floor(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const area = width * height;
      const density = isMobile
        ? Math.min(16, Math.floor(area / 42000))
        : Math.min(48, Math.floor(area / 22000));

      nodes = Array.from({ length: Math.max(8, density) }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.2 + 0.6,
      }));
    }

    function paint(animate: boolean) {
      ctx!.clearRect(0, 0, width, height);

      if (animate) {
        for (const n of nodes) {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 0 || n.x > width) n.vx *= -1;
          if (n.y < 0 || n.y > height) n.vy *= -1;
        }
      }

      const linkSq = LINK * LINK;
      ctx!.lineWidth = 0.55;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        // Limite les paires : n'inspecte que les voisins suivants (coupe le cout)
        const maxJ = Math.min(nodes.length, i + (isMobile ? 6 : nodes.length));
        for (let j = i + 1; j < maxJ; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < linkSq) {
            const dist = Math.sqrt(distSq);
            const alpha = (1 - dist / LINK) * 0.32;
            ctx!.strokeStyle = `rgba(34, 197, 94, ${alpha})`;
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.stroke();
          }
        }
      }

      ctx!.fillStyle = "rgba(34, 197, 94, 0.55)";
      for (const n of nodes) {
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    function frame() {
      if (!running) return;
      frameSkip = (frameSkip + 1) % (FRAME_SKIP + 1);
      if (frameSkip === 0) paint(true);
      raf = requestAnimationFrame(frame);
    }

    function start() {
      if (running || !visible || staticOnly) return;
      running = true;
      raf = requestAnimationFrame(frame);
    }

    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    function onVisibility() {
      if (document.hidden) stop();
      else if (visible && !staticOnly) start();
    }

    build();
    paint(false);

    if (!staticOnly) {
      const w = window as Window & {
        requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
        cancelIdleCallback?: (id: number) => void;
      };
      if (typeof w.requestIdleCallback === "function") {
        idleHandle = w.requestIdleCallback(() => start(), { timeout: 1200 });
      } else {
        startTimer = setTimeout(() => start(), 400);
      }
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (!visible) stop();
        else if (!staticOnly && !document.hidden) start();
      },
      { threshold: 0.05 },
    );
    io.observe(canvas);

    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    function onResize() {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const wasRunning = running;
        stop();
        build();
        paint(false);
        if (wasRunning && !staticOnly) start();
      }, 150);
    }

    window.addEventListener("resize", onResize, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      io.disconnect();
      if (idleHandle !== null) {
        (window as Window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback?.(
          idleHandle,
        );
      }
      if (startTimer !== null) clearTimeout(startTimer);
      if (resizeTimer !== null) clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full opacity-50 md:opacity-70"
    />
  );
}
