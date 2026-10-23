import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Mail } from "lucide-react";
import { gsap } from "../../animations/core";
import HeroVisual from "./HeroVisual";
import { BrandMark } from "../ui/BrandMark";
import { profile } from "../../data/profile";
import { ease } from "../../lib/motion";

const ACCENT = "#C9A66B";
const ACCENT_SOFT = "#D8C6A5";

export default function Hero({ ready = true }: { ready?: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const hugeNameRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;
      if (hugeNameRef.current) {
        gsap.to(hugeNameRef.current, { y: -36, ease: "none", scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: 1.6 } });
      }
      if (topRef.current) {
        gsap.to(topRef.current, { y: -16, ease: "none", scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: 1 } });
      }
      if (roleRef.current) {
        gsap.to(roleRef.current, { y: -20, ease: "none", scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: 1 } });
      }
      if (descRef.current) {
        gsap.to(descRef.current, { y: -10, ease: "none", scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: 1.2 } });
      }
      if (btnRef.current) {
        gsap.to(btnRef.current, { y: -6, ease: "none", scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: 1.4 } });
      }
      if (bgRef.current) {
        gsap.to(bgRef.current, { y: -8, ease: "none", scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: 1.8 } });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const seq = (delay: number) => ({
    initial: { opacity: 0, y: 18 },
    animate: ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 },
    transition: { duration: 0.7, delay, ease: ease.out },
  });

  return (
    <section
      ref={sectionRef}
      id="home"
      className="hero relative h-[100svh] min-h-[680px] overflow-hidden"
      style={{ background: "#0B0C0D" }}
    >
      {/* === CINEMATIC BACKGROUND LAYERS — STATIC (no cursor parallax) === */}
      <div ref={bgRef} className="hero-background absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        {/* Layer 1 — base gradient */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #090A0B 0%, #101112 45%, #0B0C0D 100%)" }} />
        {/* Layer 2 — warm glow behind portrait (STATIC) */}
        <div className="absolute inset-0">
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(176,130,72,0.18) 0%, rgba(110,78,40,0.10) 32%, rgba(20,18,16,0.02) 58%, transparent 75%)" }} />
          <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% 45%, rgba(217,168,92,0.20) 0%, rgba(125,92,45,0.12) 25%, rgba(30,28,25,0.06) 48%, transparent 72%)" }} />
        </div>
        {/* Layer 3 — left text illumination */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 20% 45%, rgba(217,168,92,0.06) 0%, transparent 45%)" }} />
        {/* Layer 4 — right cool depth + subtle blue edge */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 85% 45%, rgba(70,80,90,0.06) 0%, transparent 52%)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 92% 50%, rgba(59,130,246,0.08) 0%, rgba(59,130,246,0.03) 28%, transparent 60%)" }} />
        {/* Vignette — darker edges */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 85% 75% at 50% 50%, transparent 55%, rgba(0,0,0,0.38) 100%)" }} />
        {/* Subtle grain */}
        <div className="absolute inset-0 opacity-[0.035]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")` }} />
        {/* Decorative technical lines — arcs / circles */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[980px] h-[980px] rounded-full border border-white/[0.03] hidden lg:block" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[760px] h-[760px] rounded-full border border-dashed border-[#C9A66B]/[0.06] hidden lg:block" />
        <div className="absolute left-[18%] top-[42%] w-[180px] h-[180px] rounded-full border border-white/[0.02] hidden xl:block" />
        {/* Thin gold arc accent */}
        <div className="absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2 w-[620px] h-[620px] rounded-full border-t border-[#C9A66B]/[0.06] border-x-transparent border-b-transparent hidden lg:block" style={{ transform: "translate(-50%,-50%) rotate(-18deg)" }} />
      </div>

      {/* hero-huge-word — BILLIONAIRE ambition statement behind portrait — STATIC */}
      <motion.div
        ref={hugeNameRef}
        style={{ zIndex: 2, left: "50%", top: "52%", translateX: "-50%", translateY: "-50%" } as any}
        initial={{ opacity: 0, filter: "blur(14px)" }}
        animate={ready ? { opacity: 1, filter: "blur(0px)" } : { opacity: 0, filter: "blur(14px)" }}
        transition={{ duration: 1.4, delay: 0.08, ease: ease.out }}
        className="hero-huge-name absolute pointer-events-none flex items-center justify-center"
        aria-hidden
      >
        <span
          className="font-black select-none whitespace-nowrap text-center"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(5rem, 12vw, 15rem)",
            letterSpacing: "-0.05em",
            lineHeight: 0.9,
            color: "rgba(217,168,92,0.13)",
            fontWeight: 800,
            opacity: 1,
            maxWidth: "98vw",
            display: "block",
            textShadow: "0 0 80px rgba(217,168,92,0.12), 0 0 160px rgba(217,168,92,0.06)",
          }}
        >
          BILLIONAIRE
        </span>
      </motion.div>

      {/* hero-portrait — center */}
      <div className="hero-portrait absolute inset-0 pointer-events-none" style={{ zIndex: 3 }}>
        <HeroVisual ready={ready} />
      </div>

      {/* LEFT CONTENT — editorial block */}
      <div className="hero-left-content absolute left-[5%] z-10 pointer-events-none lg:top-[18%] lg:left-[5%] lg:max-w-[380px] top-auto bottom-[12%] left-[5%] right-[5%] max-w-none">
        <style>{`
          @media (max-width: 1023px) {
            .hero-left-content {
              position: absolute !important;
              bottom: 10% !important;
              left: 5% !important;
              right: auto !important;
              max-width: 340px !important;
              top: auto !important;
            }
          }
        `}</style>
        {/* Title group — editorial stacked greeting + name, never overlapping */}
        <div className="hero-title-group flex flex-col" style={{ gap: "clamp(12px, 1.4vw, 20px)" }}>
          <motion.div ref={topRef} {...seq(0.18)} className="flex items-center gap-3 shrink-0">
            <span className="w-8 h-px shrink-0" style={{ background: ACCENT }} />
            <span className="font-mono text-[11px] tracking-[0.3em] leading-none" style={{ color: ACCENT }}>HELLO, I&apos;M</span>
          </motion.div>
          <motion.h1 {...seq(0.3)} className="font-black tracking-[-0.04em] leading-[0.88] m-0 p-0" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 4.2vw, 3.2rem)", color: "#F2EEE8" }}>
            DARSHAN <span style={{ color: ACCENT_SOFT, fontWeight: 300 }}>A</span>
          </motion.h1>
        </div>

        {/* Roles */}
        <motion.div ref={roleRef} {...seq(0.44)} className="flex flex-col gap-2.5 mt-5">
          {profile.roles.map((role, i) => (
            <div key={role} className="flex items-center gap-3">
              <span className="font-mono text-[11px] w-6" style={{ color: ACCENT }}>0{i + 1}</span>
              <span className="font-mono text-[12px] tracking-[0.15em] uppercase font-medium" style={{ color: "rgba(230,230,225,0.68)" }}>{role}</span>
            </div>
          ))}
        </motion.div>

        {/* Description */}
        <motion.div ref={descRef} {...seq(0.58)} className="mt-5">
          <p className="text-[13px] sm:text-[14px] leading-[1.7] font-light" style={{ color: "rgba(230,230,225,0.52)", maxWidth: "310px" }}>
            {profile.tagline}
          </p>
        </motion.div>

        {/* Buttons */}
        <motion.div ref={btnRef} {...seq(0.72)} className="mt-5 flex flex-wrap items-center gap-3 pointer-events-auto">
          <a
            href="#projects"
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById("projects");
              if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 76, behavior: "smooth" });
            }}
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#F2EEE8] text-[#0B0C0D] text-[12px] tracking-[0.16em] font-mono font-bold hover:bg-[#C9A66B] transition-colors duration-300 shadow-md pointer-events-auto"
            style={{ pointerEvents: "auto" }}
            data-cursor="VIEW WORK"
          >
            VIEW WORK <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
          <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-5 py-3 rounded-full border text-[12px] tracking-[0.16em] font-mono transition-colors duration-300 hover:bg-[#F2EEE8] hover:text-[#0B0C0D] hover:border-[#F2EEE8] pointer-events-auto" style={{ borderColor: "rgba(242,238,232,0.14)", background: "rgba(242,238,232,0.04)", color: "#F2EEE8", pointerEvents: "auto" }} data-cursor="GITHUB">
            <BrandMark name="GitHub" size={15} colored={false} /> GITHUB
          </a>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById("contact");
              if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 76, behavior: "smooth" });
            }}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full border text-[12px] tracking-[0.16em] font-mono transition-colors duration-300 hover:bg-[#F2EEE8] hover:text-[#0B0C0D] hover:border-[#F2EEE8] pointer-events-auto"
            style={{ borderColor: "rgba(242,238,232,0.14)", background: "rgba(242,238,232,0.04)", color: "#F2EEE8", pointerEvents: "auto" }}
            data-cursor="CONTACT"
          >
            <Mail size={15} /> CONTACT
          </a>
        </motion.div>
      </div>

      {/* bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0B0C0D] via-[#0B0C0D]/60 to-transparent pointer-events-none z-[5]" />

      {/* premium marquee stripe — gold → blue premium divider */}
      <div className="hero-marquee absolute bottom-0 left-0 right-0 z-[12] flex h-[58px] items-center overflow-hidden pointer-events-none select-none" style={{ background: "rgba(8,9,10,0.94)" }} aria-hidden>
        <style>{`
          @keyframes hero-marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
          .hero-marquee-track { animation: hero-marquee 30s linear infinite; will-change: transform; }
          @media (prefers-reduced-motion: reduce) { .hero-marquee-track { animation-duration: 60s; } }
        `}</style>
        {/* gold → blue glowing borders */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(90deg, rgba(217,168,92,0.55) 0%, rgba(217,168,92,0.20) 22%, rgba(217,168,92,0.06) 38%, rgba(120,130,150,0.04) 52%, rgba(59,130,246,0.10) 72%, rgba(59,130,246,0.45) 100%)", boxShadow: "0 0 14px rgba(217,168,92,0.18), 0 0 14px rgba(59,130,246,0.14)" }} />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px" style={{ background: "linear-gradient(90deg, rgba(217,168,92,0.45) 0%, rgba(217,168,92,0.16) 24%, rgba(217,168,92,0.05) 40%, rgba(70,85,120,0.06) 62%, rgba(59,130,246,0.16) 78%, rgba(59,130,246,0.40) 100%)", boxShadow: "0 0 12px rgba(217,168,92,0.14), 0 0 12px rgba(59,130,246,0.12)" }} />
        {/* subtle inner glow */}
        <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(217,168,92,0.04) 0%, transparent 28%, transparent 72%, rgba(59,130,246,0.035) 100%)" }} />
        <div className="hero-marquee-track flex shrink-0 items-center gap-10">
          {[0,1].map((dup) => (
            <div key={dup} className="flex shrink-0 items-center gap-10 pr-10" aria-hidden={dup===1}>
              <span className="font-mono text-[11px] font-medium tracking-[0.24em] text-[#EDE9E6]/75 whitespace-nowrap">BUILD <span style={{ color: "#D9A85C", margin: "0 0.35em" }}>✦</span> LEARN <span style={{ color: "#D9A85C", margin: "0 0.35em" }}>✦</span> SOLVE <span style={{ color: "#D9A85C", margin: "0 0.35em" }}>✦</span> CREATE <span style={{ color: "#D9A85C", margin: "0 0.35em" }}>✦</span> REPEAT</span>
              <span className="font-mono text-[11px] tracking-[0.18em] text-[#D9A85C]/45 whitespace-nowrap">//</span>
              <span className="font-mono text-[11px] font-medium tracking-[0.22em] text-[#EDE9E6]/70 whitespace-nowrap">GOOD CODE <span style={{ color: "#D9A85C" }}>BETTER FUTURE</span></span>
              <span className="font-mono text-[11px] tracking-[0.18em] text-[#D9A85C]/45 whitespace-nowrap">//</span>
              <span className="font-mono text-[11px] font-medium tracking-[0.20em] text-[#EDE9E6]/75 whitespace-nowrap">CSE <span style={{ color: "#60A5FA" }}>→</span> AI <span style={{ color: "#60A5FA" }}>→</span> SYSTEMS <span style={{ color: "#60A5FA" }}>→</span> IMPACT</span>
              <span className="font-mono text-[11px] tracking-[0.18em] text-[#60A5FA]/45 whitespace-nowrap">//</span>
            </div>
          ))}
        </div>
      </div>

      {/* mobile scroll hint — above marquee */}
      <motion.div initial={{ opacity: 0 }} animate={ready ? { opacity: 1 } : { opacity: 0 }} transition={{ delay: 1.3, duration: 0.6 }} className="absolute bottom-[72px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[10px] font-mono tracking-[0.24em] pointer-events-none lg:hidden" style={{ color: "rgba(242,238,232,0.3)" }}>
        <span>SCROLL</span>
        <motion.span animate={{ y: [0, 6, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }} className="w-px h-6 bg-gradient-to-b to-transparent" style={{ backgroundImage: `linear-gradient(to bottom, ${ACCENT}, transparent)` }} />
      </motion.div>
    </section>
  );
}
