import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { journey } from "../../data/journey";
import { Rocket, GraduationCap, Compass, Zap } from "lucide-react";
import { ease } from "../../lib/motion";

gsap.registerPlugin(ScrollTrigger);

const futureNode = {
  id: "future", year: "2027+", title: "BUILDING WHAT'S NEXT",
  description: "Turning ambitious ideas into production-grade systems. Seeking opportunities to contribute to high-impact teams, learn from seasoned engineers, and tackle complex software challenges end-to-end.",
  tags: ["Open to Opportunities", "Backend / Systems", "Applied AI"], type: "goal" as const,
};

export default function Journey() {
  const ref = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const glowRef = useRef<SVGPathElement>(null);
  const pulseRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        // Ensure line visible
        if (pathRef.current) gsap.set(pathRef.current, { strokeDasharray: "none", strokeDashoffset: 0 });
        gsap.set(".journey-card", { opacity: 1, y: 0 });
        return;
      }

      // Cards stagger — only entrance, stays visible (once)
      gsap.fromTo(
        ".journey-card",
        { y: 28, opacity: 0, filter: "blur(6px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 78%", once: true },
        }
      );

      // --- Storm beam: layered energy travelling with scroll ---
      if (pathRef.current && glowRef.current && trackRef.current) {
        const len = 1000; // viewBox height
        // Layer 2 core energy line — starts hidden
        gsap.set([pathRef.current, glowRef.current], { strokeDasharray: len, strokeDashoffset: len });
        // Animate core based on scroll progress through journey
        gsap.to([pathRef.current, glowRef.current], {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 65%",
            end: "bottom 70%",
            scrub: 1.1,
            invalidateOnRefresh: true,
          },
        });

        // Layer 3 — travelling pulse (80px beam) + bright head + trailing runners follow progress
        const pulse = pulseRef.current;
        if (pulse) {
          gsap.set(pulse, { y: 0, opacity: 0 });
          ScrollTrigger.create({
            trigger: ref.current,
            start: "top 65%",
            end: "bottom 70%",
            scrub: 0.6,
            onUpdate: (self) => {
              if (!pulse || !trackRef.current) return;
              const h = trackRef.current.clientHeight;
              const y = self.progress * (h - 80);
              const live = self.progress > 0.02 && self.progress < 0.98;
              gsap.set(pulse, { y, opacity: live ? 1 : 0 });
              // bright head dot rides the pulse leading edge
              const head = trackRef.current.querySelector<HTMLElement>("[data-head]");
              if (head) gsap.set(head, { y, opacity: live ? 1 : 0 });
              // fast trailing runners — energy packets behind the main pulse
              const runners = trackRef.current.querySelectorAll<HTMLElement>("[data-runner]");
              const offs = [52, 112, 186];
              const alphas = [0.85, 0.6, 0.38];
              runners.forEach((r, i) => {
                const ry = y - (offs[i] ?? 60);
                gsap.set(r, { y: Math.max(0, ry), opacity: live && ry > -30 ? alphas[i] ?? 0.5 : 0 });
              });
              // subtle sparks flicker near pulse
              const sparks = trackRef.current.querySelectorAll<HTMLElement>("[data-spark]");
              sparks.forEach((s, i) => {
                const dist = Math.abs(y - parseFloat(s.dataset.y || "0"));
                const active = dist < 110;
                gsap.to(s, {
                  opacity: active ? 0.9 : 0,
                  scale: active ? 1 : 0.4,
                  duration: 0.35,
                  ease: "power2.out",
                  overwrite: "auto",
                  delay: i * 0.02,
                });
              });
            },
          });
        }
      }

      // Card activation — only near-active card gets glow (+ its node tick lights up)
      const cards = gsap.utils.toArray<HTMLElement>(".journey-card");
      const setActive = (card: HTMLElement, on: boolean) => {
        card.classList.toggle("journey-active", on);
        card.querySelector<HTMLElement>("[data-tick]")?.classList.toggle("tick-on", on);
      };
      cards.forEach((card) => {
        ScrollTrigger.create({
          trigger: card,
          start: "top 72%",
          end: "bottom 38%",
          onEnter: () => setActive(card, true),
          onEnterBack: () => setActive(card, true),
          onLeave: () => setActive(card, false),
          onLeaveBack: () => setActive(card, false),
        });
      });

      // Node pulse subtle
      gsap.to(".journey-node-dot", {
        scale: 1.18,
        duration: 1.6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.2,
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  const allJourney = [...journey, futureNode];
  return (
    <section ref={ref} id="journey" className="relative overflow-hidden" style={{ background: "#0F0F0E", borderTop: "1px solid rgba(241,237,232,0.06)" }}>
      <div className="pointer-events-none absolute inset-0"><div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at bottom, rgba(217,168,92,0.06), transparent 60%)" }} />
        {/* subtle drifting gold haze */}
        <div className="absolute top-1/3 -left-20 w-[680px] h-[420px] rounded-full blur-[140px] opacity-30" style={{ background: "radial-gradient(ellipse 60% 55% at 50% 50%, rgba(217,168,92,0.08), transparent 70%)" }} />
      </div>
      <div className="relative mx-auto max-w-[1280px] px-6 pt-12 pb-10 lg:pt-16 lg:pb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: ease.out }} className="mb-12">
          <div className="eyebrow mb-3">05 — JOURNEY</div>
          <h2 className="text-[clamp(32px,5.2vw,64px)] font-black tracking-[-0.05em] leading-[0.88]" style={{ color: "#F1EDE8" }}>THE PATH SO FAR</h2>
          <div className="mt-4 h-px w-full" style={{ background: "linear-gradient(to right, rgba(241,237,232,0.12), rgba(241,237,232,0.05), transparent)" }} />
        </motion.div>
        <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-14">
          <div className="lg:sticky lg:top-28 h-fit">
            <h3 className="text-[28px] sm:text-[38px] leading-[1.05] tracking-[-0.035em] font-light" style={{ color: "#F1EDE8" }}>Progress, not limits. <br /><span className="font-semibold">Curiosity without end.</span></h3>
            <p className="mt-4 text-[14.5px] leading-[1.75] max-w-[500px]" style={{ color: "#A8A39A" }}>Each academic milestone brings new skills, fresh perspectives, and opportunities to create meaningful technology.</p>
            <div className="mt-6 rounded-2xl p-4 font-mono text-[11.5px] leading-relaxed backdrop-blur" style={{ border: "1px solid rgba(241,237,232,0.09)", background: "rgba(241,237,232,0.03)" }}>
              <div className="flex items-center gap-2" style={{ color: "#A8A39A" }}><Compass size={13} style={{ color: "#D9A85C" }} /> ACADEMIC CONTINUUM</div>
              <div className="mt-1.5 font-sans" style={{ color: "rgba(241,237,232,0.80)" }}>SSLC (88.96%) → Diploma in Sorab (9.52 / 10) → B.E. BIT Bengaluru (8.10 / 10) → Next Chapter.</div>
            </div>
          </div>
          <div className="relative">
            {/* Storm beam track */}
            <div ref={trackRef} className="absolute left-[21px] top-6 bottom-8 w-[4px] hidden sm:block pointer-events-none">
              <svg className="absolute inset-0 w-[4px] h-full overflow-visible" viewBox="0 0 4 1000" preserveAspectRatio="none" style={{ height: "100%", width: "4px" }}>
                <defs>
                  <filter id="journey-progress-glow" x="-50%" y="-5%" width="200%" height="110%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur" />
                    <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.55 0" />
                  </filter>
                  <linearGradient id="journey-pulse-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#D9A85C" stopOpacity="0" />
                    <stop offset="35%" stopColor="#D9A85C" stopOpacity="1" />
                    <stop offset="65%" stopColor="#D9A85C" stopOpacity="1" />
                    <stop offset="100%" stopColor="#D9A85C" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* Layer 1 — base dark/gold */}
                <path d="M2 0 L2 1000" stroke="rgba(241,237,232,0.07)" strokeWidth={1.8} fill="none" strokeLinecap="round" />
                {/* Layer 2 — blurred glow (behind) */}
                <path ref={glowRef} d="M2 0 L2 1000" stroke="#D9A85C" strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.22} style={{ filter: "blur(6px)" } as any} />
                {/* Layer 2b — sharp energy core */}
                <path ref={pathRef} d="M2 0 L2 1000" stroke="#D9A85C" strokeWidth={2.8} fill="none" strokeLinecap="round" style={{ filter: "drop-shadow(0 0 6px rgba(217,168,92,0.65))" } as React.CSSProperties} />
              </svg>
              {/* Layer 3 — travelling pulse beam (80px) */}
              <div ref={pulseRef} className="absolute left-1/2 -translate-x-1/2 w-[4px] h-[80px] rounded-full pointer-events-none" style={{ top: 0, background: "linear-gradient(to bottom, transparent, #D9A85C, #D9A85C, transparent)", boxShadow: "0 0 14px rgba(217,168,92,0.85), 0 0 28px rgba(217,168,92,0.35)", filter: "blur(0.3px)" }} />
              {/* Bright head — active energy point riding the pulse leading edge */}
              <span data-head className="absolute left-1/2 top-0 -translate-x-1/2 w-[9px] h-[9px] rounded-full opacity-0 pointer-events-none" style={{ background: "#D9A85C", boxShadow: "0 0 12px rgba(255,243,220,0.95), 0 0 26px rgba(217,168,92,0.6)" }} />
              {/* Trailing runners — fast energy packets behind the main pulse */}
              <span data-runner className="absolute left-1/2 top-0 -translate-x-1/2 w-[3px] h-[22px] rounded-full opacity-0 pointer-events-none" style={{ background: "linear-gradient(to bottom, transparent, #D9A85C, transparent)", filter: "blur(0.4px)" }} />
              <span data-runner className="absolute left-1/2 top-0 -translate-x-1/2 w-[2px] h-[14px] rounded-full opacity-0 pointer-events-none" style={{ background: "linear-gradient(to bottom, transparent, #D9A85C, transparent)", filter: "blur(0.4px)" }} />
              <span data-runner className="absolute left-1/2 top-0 -translate-x-1/2 w-[2px] h-[10px] rounded-full opacity-0 pointer-events-none" style={{ background: "linear-gradient(to bottom, transparent, rgba(217,168,92,0.8), transparent)", filter: "blur(0.4px)" }} />
              {/* Occasional branch flickers — short diagonal discharge ticks */}
              <span className="journey-branch absolute w-[2px] h-[26px] rounded-full pointer-events-none" style={{ left: "10px", top: "30%", transform: "rotate(32deg)", background: "linear-gradient(to bottom, transparent, rgba(217,168,92,0.9), transparent)", animationDelay: "0s" }} />
              <span className="journey-branch absolute w-[2px] h-[20px] rounded-full pointer-events-none" style={{ left: "-10px", top: "62%", transform: "rotate(-30deg)", background: "linear-gradient(to bottom, transparent, rgba(217,168,92,0.9), transparent)", animationDelay: "2.6s" }} />
              {/* Layer 4 — sparks around active position */}
              <span data-spark data-y="120" className="absolute left-1/2 w-[6px] h-[6px] rounded-full -translate-x-1/2 -translate-y-1/2 opacity-0" style={{ top: "18%", background: "#D9A85C", boxShadow: "0 0 8px rgba(217,168,92,0.9)", filter: "blur(0.2px)" }} />
              <span data-spark data-y="340" className="absolute left-[10px] w-[3px] h-[3px] rounded-full opacity-0" style={{ top: "38%", background: "#D9A85C", boxShadow: "0 0 6px rgba(217,168,92,0.9)" }} />
              <span data-spark data-y="560" className="absolute left-[-6px] w-[4px] h-[4px] rounded-full opacity-0" style={{ top: "58%", background: "#D9A85C", boxShadow: "0 0 7px rgba(217,168,92,0.9)" }} />
              <span data-spark data-y="780" className="absolute left-[8px] w-[3px] h-[3px] rounded-full opacity-0" style={{ top: "78%", background: "#D9A85C", boxShadow: "0 0 6px rgba(217,168,92,0.9)" }} />
              <span data-spark data-y="900" className="absolute left-1/2 w-[5px] h-[5px] rounded-full -translate-x-1/2 opacity-0" style={{ top: "92%", background: "#D9A85C", boxShadow: "0 0 10px rgba(217,168,92,0.9)", filter: "blur(0.3px)" }} />
            </div>
            <div className="space-y-6">
              {allJourney.map((item) => {
                const isGoal = item.type === "goal";
                return (
                  <div key={item.id} className="journey-card relative flex gap-4 sm:gap-6 group">
                    {/* node tick — lights up when this milestone is active */}
                    <span data-tick aria-hidden className="absolute hidden sm:block w-[18px] h-[2px] rounded-full opacity-0" style={{ left: "13px", top: "27px", background: "linear-gradient(to right, transparent, #D9A85C, transparent)" }} />
                    <div className={`hidden sm:flex w-11 h-11 rounded-2xl shrink-0 mt-1 items-center justify-center text-[11px] font-mono font-bold shadow-lg journey-node-dot transition-all duration-500 ${isGoal ? "" : ""}`} style={isGoal ? { background: "#D9A85C", color: "#0F0F0E", boxShadow: "0 0 0 0 rgba(217,168,92,0.0)" } : { background: "#F1EDE8", color: "#0F0F0E" }}>
                      {isGoal ? <Rocket size={16} /> : <GraduationCap size={16} />}
                    </div>
                    <div className={`flex-1 rounded-[22px] p-5 sm:p-6 backdrop-blur-sm journey-card-inner transition-all duration-500 ${isGoal ? "journey-goal" : ""}`} style={isGoal ? { border: "1px solid rgba(217,168,92,0.30)", background: "linear-gradient(135deg, rgba(217,168,92,0.08), transparent)" } : { border: "1px solid rgba(241,237,232,0.09)", background: "rgba(241,237,232,0.03)" }}>
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="px-3 py-1 rounded-full text-[11px] tracking-[0.14em] font-mono font-bold" style={isGoal ? { background: "#D9A85C", color: "#0F0F0E" } : { background: "#F1EDE8", color: "#0F0F0E" }}>{item.year}</span>
                        <span className="px-2.5 py-1 rounded-full text-[10px] tracking-[0.14em] font-mono flex items-center gap-1" style={isGoal ? { border: "1px solid rgba(217,168,92,0.38)", color: "#D9A85C", background: "rgba(217,168,92,0.10)" } : { border: "1px solid rgba(241,237,232,0.14)", color: "#A8A39A" } as React.CSSProperties}>
                          {isGoal && <Zap size={11} style={{ color: "#D9A85C" }} />} {item.type.toUpperCase()}
                        </span>
                      </div>
                      <h4 className="text-[18px] sm:text-[20px] font-semibold tracking-tight" style={{ color: "#F1EDE8" }}>{item.title}</h4>
                      <p className="mt-2.5 text-[14px] leading-[1.7]" style={{ color: "#A8A39A" }}>{item.description}</p>
                      {item.tags && item.tags.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {item.tags.map((tag) => (
                            <span key={tag} className="text-[10.5px] font-mono tracking-[0.08em] px-2.5 py-1 rounded-full" style={isGoal ? { background: "rgba(217,168,92,0.10)", border: "1px solid rgba(217,168,92,0.28)", color: "#D9A85C" } : { background: "rgba(241,237,232,0.04)", border: "1px solid rgba(241,237,232,0.09)", color: "#A8A39A" } as React.CSSProperties}>{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-8 flex items-center gap-3">
              <span className="text-[10px] tracking-[0.18em] font-mono" style={{ color: "#A8A39A" }}>PATH CONTINUES → LET&apos;S CONNECT</span>
              <span className="h-px flex-1" style={{ background: "linear-gradient(to right, rgba(241,237,232,0.10), transparent)" }} />
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .journey-active .journey-card-inner {
          border-color: rgba(217,168,92,0.34) !important;
          background: linear-gradient(135deg, rgba(217,168,92,0.09), rgba(241,237,232,0.04)) !important;
          box-shadow: 0 8px 32px rgba(0,0,0,0.35), 0 0 0 1px rgba(217,168,92,0.10), 0 0 22px rgba(217,168,92,0.12);
          transform: translateY(-2px);
        }
        .journey-active .journey-node-dot {
          box-shadow: 0 0 0 6px rgba(217,168,92,0.14), 0 0 18px rgba(217,168,92,0.55) !important;
          transform: scale(1.06);
        }
        .journey-card-inner { will-change: transform, box-shadow, border-color; }
        [data-tick] { transition: opacity 0.4s ease, box-shadow 0.4s ease; }
        [data-tick].tick-on { opacity: 1 !important; box-shadow: 0 0 10px rgba(217,168,92,0.9), 0 0 22px rgba(217,168,92,0.45); }
        .journey-branch { opacity: 0; animation: journeyBranch 5.2s ease-in-out infinite; will-change: opacity; }
        @keyframes journeyBranch { 0%, 88%, 100% { opacity: 0; } 90% { opacity: 0.9; } 93% { opacity: 0.25; } 95% { opacity: 0.7; } }
      `}</style>
    </section>
  );
}












