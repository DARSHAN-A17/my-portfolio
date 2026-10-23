import { useState, useEffect, useRef } from "react";
import Navigation from "./components/layout/Navigation";
import Footer from "./components/layout/Footer";
import Loader from "./components/ui/Loader";
import CustomCursor from "./components/ui/CustomCursor";
import TechCursor from "./components/ui/tech-cursor";
import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import Projects from "./components/sections/Projects";
import Skills from "./components/sections/Skills";
import Journey from "./components/sections/Journey";
import Contact from "./components/sections/Contact";
import { useLenis, getLenis } from "./hooks/useLenis";
import { gsap, ScrollTrigger } from "./animations/core";
import { prefersReduced } from "./lib/motion";
import SectionBridge from "./components/ui/SectionBridge";

/** Ambient — premium dark + gold composition: near-black ↔ charcoal */
const AMBIENT: Record<string, string> = {
  home: "#0F0F0E",
  about: "#141613",
  projects: "#0F0F0E",
  skills: "#141613",
  journey: "#0F0F0E",
  contact: "#141613",
};

export default function App() {
  /* The portfolio stays fully hidden until the storm sequence completes. */
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useLenis();

  /* Scroll lock — nothing scrolls while the loader owns the viewport. */
  useEffect(() => {
    if (done) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);
    getLenis()?.stop();
    return () => {
      document.body.style.overflow = prev;
      getLenis()?.start();
    };
  }, [done]);

  /* Failsafe — the portfolio must never stay behind the loader overlay. */
  useEffect(() => {
    if (!started || done) return;
    const t = window.setTimeout(() => setDone(true), 30000);
    return () => window.clearTimeout(t);
  }, [started, done]);

  /* Ambient background shifts + a global refresh once content is mounted. */
  useEffect(() => {
    if (!done) return;
    const reduced = prefersReduced();
    const ctx = gsap.context(() => {
      if (!reduced) {
        Object.entries(AMBIENT).forEach(([id, color]) => {
          const el = document.getElementById(id);
          if (!el || !rootRef.current) return;
          ScrollTrigger.create({
            trigger: el,
            start: "top 65%",
            end: "bottom 35%",
            onEnter: () =>
              gsap.to(rootRef.current, { backgroundColor: color, duration: 1.2, ease: "power2.out" }),
            onEnterBack: () =>
              gsap.to(rootRef.current, { backgroundColor: color, duration: 1.2, ease: "power2.out" }),
          });
        });
      }
      ScrollTrigger.refresh();
    }, rootRef);
    return () => ctx.revert();
  }, [done]);

  return (
    <div
      ref={rootRef}
      className="relative min-h-screen bg-[#0F0F0E] text-[#F1EDE8] selection:bg-[#D9A85C]/20 selection:text-[#0F0F0E]"
    >
      {/* Website behind loader — mounted once started so white streak can reveal complete composition at once */}
      {(started || done) && (
        <>
          <CustomCursor />
          <TechCursor />
          <Navigation ready={true} />

          <main>
            <Hero ready={true} />
            <About />
            <SectionBridge from="#141613" to="#0F0F0E" />
            <Projects />
            <SectionBridge from="#0F0F0E" to="#141613" />
            <Skills />
            <SectionBridge from="#141613" to="#0F0F0E" />
            <Journey />
            <Contact />
          </main>

          <Footer />
        </>
      )}
      {!done && <Loader onStart={() => setStarted(true)} onDone={() => setDone(true)} />}

      {/* global grain */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[60] opacity-[0.028] mix-blend-soft-light"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}

