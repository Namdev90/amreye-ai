"use client";

import { useEffect, useState } from "react";
import { Pause, Play } from "lucide-react";

export default function MotionExperience() {
  const [paused, setPaused] = useState(true);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setPaused(preference.matches);
    sync();
    preference.addEventListener("change", sync);
    return () => preference.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.motion = paused ? "off" : "on";
    if (paused) return;
    let frame = 0;
    let pointerFrame = 0;
    let current: HTMLElement | null = null;
    const reset = () => {
      if (!current) return;
      current.style.removeProperty("--tilt-x");
      current.style.removeProperty("--tilt-y");
      current.style.removeProperty("--light-x");
      current.style.removeProperty("--light-y");
      current = null;
    };
    const updateScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const total = Math.max(1, root.scrollHeight - innerHeight);
        root.style.setProperty("--page-progress", String(Math.min(1, scrollY / total)));
        root.style.setProperty("--hero-drift", `${Math.min(scrollY * .13, 90)}px`);
      });
    };
    const pointer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const surface = (event.target as Element).closest<HTMLElement>("[data-tilt], .glass-card, .topic-card, .console-card");
      cancelAnimationFrame(pointerFrame);
      pointerFrame = requestAnimationFrame(() => {
        if (surface !== current) reset();
        if (!surface) return;
        current = surface;
        const bounds = surface.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
        const y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
        surface.style.setProperty("--light-x", `${x * 100}%`);
        surface.style.setProperty("--light-y", `${y * 100}%`);
        if (surface.hasAttribute("data-tilt")) {
          surface.style.setProperty("--tilt-x", `${(0.5 - y) * 5}deg`);
          surface.style.setProperty("--tilt-y", `${(x - 0.5) * 7}deg`);
        }
      });
    };
    const reveal = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).dataset.revealed = "true";
          reveal.unobserve(entry.target);
        }
      }
    }, { threshold: .08 });
    document.querySelectorAll<HTMLElement>(".section-heading, .apex-heading, .glass-card, .quad-architecture article, .hardware-layout, .hardware-intro").forEach((element, index) => {
      element.style.setProperty("--reveal-delay", `${index % 3 * 65}ms`);
      reveal.observe(element);
    });
    const visibility = new IntersectionObserver(entries => {
      entries.forEach(entry => (entry.target as HTMLElement).dataset.inViewport = String(entry.isIntersecting));
    });
    document.querySelectorAll("main > section").forEach(element => visibility.observe(element));
    updateScroll();
    addEventListener("scroll", updateScroll, { passive: true });
    addEventListener("resize", updateScroll, { passive: true });
    document.addEventListener("pointermove", pointer, { passive: true });
    document.addEventListener("pointerleave", reset);
    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(pointerFrame);
      removeEventListener("scroll", updateScroll);
      removeEventListener("resize", updateScroll);
      document.removeEventListener("pointermove", pointer);
      document.removeEventListener("pointerleave", reset);
      reveal.disconnect();
      visibility.disconnect();
      reset();
      root.style.removeProperty("--hero-drift");
    };
  }, [paused]);

  return <>
    <div className="reading-progress" aria-hidden="true" />
    <button className="motion-toggle" type="button" onClick={() => setPaused(value => !value)} aria-pressed={!paused} aria-label={paused ? "Enable decorative motion" : "Pause decorative motion"}>
      {paused ? <Play size={14} /> : <Pause size={14} />}<span>{paused ? "Motion off" : "Motion on"}</span>
    </button>
  </>;
}
