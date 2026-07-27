"use client";

import { useEffect, useRef } from "react";

/**
 * Signature visuelle : maillage de points (face-mesh / embeddings).
 * Optimisé : démarrage différé, pause hors viewport / onglet caché,
 * densité adaptative, DPR plafonné.
 */
export default function NeuralMesh() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let visible = true;
    let running = false;
    let raf = 0;
    let startTimer: ReturnType<typeof setTimeout> | null = null;
    let idleHandle: number | null = null;

    type Node = { x: number; y: number; vx: number; vy: number; r: number };
    let nodes: Node[] = [];
    const mouse = { x: -9999, y: -9999 };

    const LINK = isMobile ? 100 : 120;

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
        ? Math.min(28, Math.floor(area / 28000))
        : Math.min(48, Math.floor(area / 22000));

      nodes = Array.from({ length: Math.max(12, density) }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.4 + 0.7,
      }));
    }

    function paint() {
      ctx!.clearRect(0, 0, width, height);

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
      }

      const linkSq = LINK * LINK;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < linkSq) {
            const dist = Math.sqrt(distSq);
            const alpha = (1 - dist / LINK) * 0.35;
            ctx!.strokeStyle = `rgba(34, 197, 94, ${alpha})`;
            ctx!.lineWidth = 0.6;
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.stroke();
          }
        }
      }

      for (const n of nodes) {
        const dm = Math.hypot(n.x - mouse.x, n.y - mouse.y);
        const near = !isMobile && dm < 110;
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, near ? n.r + 1.2 : n.r, 0, Math.PI * 2);
        ctx!.fillStyle = near
          ? "rgba(134, 239, 172, 0.95)"
          : "rgba(34, 197, 94, 0.55)";
        ctx!.fill();
        if (near) {
          ctx!.beginPath();
          ctx!.arc(n.x, n.y, 9, 0, Math.PI * 2);
          ctx!.strokeStyle = "rgba(34, 197, 94, 0.22)";
          ctx!.lineWidth = 1;
          ctx!.stroke();
        }
      }
    }

    function frame() {
      if (!running) return;
      paint();
      raf = requestAnimationFrame(frame);
    }

    function start() {
      if (running || !visible) return;
      running = true;
      raf = requestAnimationFrame(frame);
    }

    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    function onMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }
    function onLeave() {
      mouse.x = -9999;
      mouse.y = -9999;
    }
    function onVisibility() {
      if (document.hidden) stop();
      else if (visible) start();
    }

    build();

    // Dessin statique immédiat si reduced-motion ; sinon idle puis anime
    if (reduced) {
      paint();
    } else {
      const w = window as Window & {
        requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
        cancelIdleCallback?: (id: number) => void;
      };
      if (typeof w.requestIdleCallback === "function") {
        idleHandle = w.requestIdleCallback(() => start(), { timeout: 900 });
      } else {
        startTimer = setTimeout(() => start(), 200);
      }
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (!visible) stop();
        else if (!reduced && !document.hidden) start();
      },
      { threshold: 0.05 },
    );
    io.observe(canvas);

    window.addEventListener("resize", build, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    if (!isMobile) {
      window.addEventListener("mousemove", onMove, { passive: true });
      window.addEventListener("mouseleave", onLeave);
    }

    return () => {
      stop();
      io.disconnect();
      if (idleHandle !== null) {
        (window as Window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback?.(idleHandle);
      }
      if (startTimer !== null) clearTimeout(startTimer);
      window.removeEventListener("resize", build);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full opacity-70"
    />
  );
}
