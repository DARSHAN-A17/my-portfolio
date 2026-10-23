import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap, ScrollTrigger } from "../../animations/core";
import { Cpu, ShieldCheck, Compass } from "lucide-react";
import { ease } from "../../lib/motion";

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const introWrapRef = useRef<HTMLDivElement>(null);
  const introContentRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLHeadingElement>(null);
  const para1Ref = useRef<HTMLParagraphElement>(null);
  const para2Ref = useRef<HTMLParagraphElement>(null);
  const para3Ref = useRef<HTMLParagraphElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // --- Phase 1: Big intro entrance ---
      // Whole-element block reveals (y px + opacity + blur). Deliberately NOT word-split:
      // split yPercent tweens on these nodes got stuck mid-state (opacity 1, offset intact).
      // Block reveals cannot hide text behind a partial offset and always end at opacity 1.
      const whoHeading = sectionRef.current?.querySelector<HTMLElement>("[data-about-who]");
      if (whoHeading) {
        gsap.fromTo(
          whoHeading,
          { y: 44, opacity: 0, filter: "blur(10px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1.0,
            ease: "expo.out",
            overwrite: "auto",
            scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true },
          }
        );
      }
      if (highlightRef.current) {
        gsap.fromTo(
          highlightRef.current,
          { y: 30, opacity: 0, filter: "blur(8px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.95,
            ease: "power3.out",
            overwrite: "auto",
            scrollTrigger: { trigger: sectionRef.current, start: "top 76%", once: true },
          }
        );
      }

      if (!reduced) {
        // Phase 2: intro compact on scroll — scrubbed, reverses naturally (VISIBLY noticeable: 1 → 0.78, y → -40)
        // Use separate wrapper (introWrapRef) so entrance motion on introContentRef is not overwritten
        const mm = gsap.matchMedia();
        mm.add("(min-width: 1024px)", () => {
          gsap.to(introWrapRef.current, {
            scale: 0.78,
            y: -40,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "+=640",
              scrub: 1.0,
              invalidateOnRefresh: true,
            },
          });
        });
        mm.add("(max-width: 1023px)", () => {
          // Tablet/mobile: no pin scale to keep readability, just subtle y
          gsap.to(introWrapRef.current, {
            y: -14,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "+=360",
              scrub: 1.0,
              invalidateOnRefresh: true,
            },
          });
        });

        // Phase 3: detailed content reveals — staggered, stays visible (noticeable y + blur)
        gsap.fromTo(
          ".about-stats",
          { y: 30, opacity: 0, filter: "blur(8px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            overwrite: "auto",
            scrollTrigger: { trigger: ".about-stats", start: "top 88%", once: true },
          }
        );
        // Paragraphs — block reveal with clear upward motion, staggered across the three
        const paras = [para1Ref.current, para2Ref.current, para3Ref.current].filter(Boolean);
        if (paras.length) {
          gsap.fromTo(
            paras,
            { y: 30, opacity: 0, filter: "blur(8px)" },
            {
              y: 0,
              opacity: 1,
              filter: "blur(0px)",
              duration: 0.9,
              stagger: 0.12,
              ease: "power3.out",
              overwrite: "auto",
              scrollTrigger: { trigger: para1Ref.current, start: "top 86%", once: true },
            }
          );
        }

        // Remaining elements (subline, etc.)
        gsap.fromTo(
          ".about-reveal-rest",
          { y: 26, opacity: 0, filter: "blur(7px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.75,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: { trigger: ".about-reveal-rest", start: "top 88%", once: true },
          }
        );

        // Original subtle vertical line — draws with scroll (pre-existing design element)
        if (lineRef.current) {
          gsap.fromTo(
            lineRef.current,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              scrollTrigger: { trigger: sectionRef.current, start: "top 60%", end: "bottom 60%", scrub: 1 },
            }
          );
        }
        if (glowRef.current) {
          gsap.to(glowRef.current, {
            y: -28,
            ease: "none",
            scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: 1.5 },
          });
        }
        gsap.to(".about-glow-slow", {
          y: -18,
          ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: 1.9 },
        });

        // Engineering card entrance — noticeable depth, still premium
        gsap.fromTo(
          ".about-card",
          { y: 46, opacity: 0, filter: "blur(10px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1.0,
            ease: "power3.out",
            scrollTrigger: { trigger: ".about-card", start: "top 88%", once: true },
          }
        );
      } else {
        // Reduced motion: ensure visible
        gsap.set([introWrapRef.current, ".about-stats", ".about-reveal-rest", ".about-card", "[data-about-who]"], { opacity: 1, y: 0, scale: 1, filter: "none" });
        if (highlightRef.current) gsap.set(highlightRef.current, { opacity: 1 });
      }

      ScrollTrigger.refresh();
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="relative overflow-hidden" style={{ background: "#141613", borderTop: "1px solid rgba(241,237,232,0.06)" }}>
      <div className="absolute top-0 left-0 right-0 h-12 pointer-events-none" style={{ background: "linear-gradient(to bottom, #0F0F0E, transparent)" }} />
      {/* Original subtle vertical line (pre-existing design element) */}
      <div ref={lineRef} data-about-line className="absolute left-1/2 top-0 w-px h-full origin-top hidden lg:block pointer-events-none" style={{ background: "linear-gradient(to bottom, rgba(217,168,92,0.32), rgba(217,168,92,0.06), transparent)", transformOrigin: "top" }} />
      {/* Atmospheric glows */}
      <div ref={glowRef} className="absolute -top-20 right-[2%] w-[560px] h-[560px] rounded-full blur-[120px] pointer-events-none hidden lg:block" style={{ background: "radial-gradient(ellipse 60% 55% at 50% 50%, rgba(217,168,92,0.07), transparent 70%)" }} />
      <div className="about-glow-slow absolute -bottom-10 left-[-5%] w-[520px] h-[520px] rounded-full blur-[130px] pointer-events-none hidden lg:block" style={{ background: "radial-gradient(ellipse 60% 55% at 50% 50%, rgba(22,27,42,0.16), transparent 70%)" }} />

      <div className="mx-auto max-w-[1280px] px-6 lg:px-10 py-8 lg:py-10 relative">
        {/* PHASE 1 — BIG ABOUT INTRO (uses viewport, premium entrance) */}
        <div ref={introWrapRef} data-about-intro-wrap className="will-change-transform" style={{ transformOrigin: "0 0" } as any}>
          <motion.div
            ref={introContentRef}
            initial={{ opacity: 0, y: 18, filter: "blur(8px)" } as any}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" } as any}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.85, ease: ease.out }}
            className="pt-4 lg:pt-6"
          >
            <div className="text-[11px] tracking-[0.32em] font-mono" style={{ color: "#D9A85C" }}>02 — ABOUT</div>
            <h2 data-about-who className="mt-3 text-[clamp(42px,6.2vw,80px)] font-black tracking-[-0.05em] leading-[0.85]" style={{ color: "#F1EDE8" }}>WHO I AM</h2>
            <div className="mt-4 flex items-center gap-3">
              <span className="h-px w-12" style={{ background: "rgba(241,237,232,0.12)" }} />
              <span className="text-[11px] tracking-[0.16em] font-mono" style={{ color: "#A8A39A" }}>FROM SHIKARIPURA → BENGALURU • CSE • BIT</span>
            </div>
            {/* Critical line — must always remain visible */}
            <h3
              ref={highlightRef}
              className="mt-7 text-[24px] sm:text-[27px] lg:text-[32px] leading-[1.08] tracking-[-0.03em] font-light will-change-transform max-w-[860px]"
              style={{ color: "#F1EDE8" }}
            >
              I like understanding what happens behind the screen — how data moves, why systems fail, and how clean engineering turns logic into dependable software.
            </h3>
          </motion.div>
        </div>

        {/* subtle static divider */}
        <div className="mt-8 lg:mt-10 h-px w-full" aria-hidden style={{ background: "rgba(241,237,232,0.07)" }} />

        {/* PHASE 3 — ORIGINAL DETAILED CONTENT (grid, balanced, no blank) */}
        <div className="mt-10 lg:mt-12 grid lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-14 items-start">
          <div className="space-y-5">
            <div className="space-y-4 text-[15px] leading-[1.8] max-w-[640px]" style={{ color: "rgba(241,237,232,0.62)" }}>
              <p ref={para1Ref} className="will-change-transform">My journey started with an innate curiosity about computing mechanics, leading me to complete my Diploma in Sorab with a CGPA of 9.52, and subsequently pursuing Computer Science and Engineering at Bangalore Institute of Technology (BIT Bengaluru, CGPA 8.10).</p>
              <p ref={para2Ref} className="will-change-transform">My interests center on core software engineering, distributed data, and applied machine learning. I enjoy digging into Object-Oriented Design, Data Structures &amp; Algorithms, Database Management Systems, and computer networks — not merely as theoretical subjects, but as essential tools to build architectures that remain fast and maintainable.</p>
              <p ref={para3Ref} className="will-change-transform" style={{ color: "rgba(241,237,232,0.52)" }}>My problem-solving mindset is grounded in first principles: dissect requirements thoroughly, eliminate unnecessary complexity, measure performance before optimizing, and prioritize reliability above all.</p>
            </div>
            <div className="about-stats grid grid-cols-3 gap-3 pt-2">
              {[{ v: "8.10 / 10", k: "B.E. BIT Bengaluru" },{ v: "9.52 / 10", k: "Diploma Sorab" },{ v: "88.96%", k: "SSLC Shikaripura" }].map((s) => (
                <div key={s.v} className="rounded-2xl p-4 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-[#F1EDE8]/15 about-reveal-rest" style={{ border: "1px solid rgba(241,237,232,0.09)", background: "rgba(241,237,232,0.03)" }}>
                  <div className="text-[15px] font-bold tracking-tight" style={{ color: "#F1EDE8" }}>{s.v}</div>
                  <div className="text-[10px] leading-tight font-mono tracking-[0.12em] mt-1.5" style={{ color: "#A8A39A" }}>{s.k}</div>
                </div>
              ))}
            </div>
            <div className="about-reveal-rest flex items-center gap-3 pt-2 lg:hidden">
              <span className="text-[10px] tracking-[0.24em] font-mono" style={{ color: "rgba(241,237,232,0.20)" }}>BACKGROUND &amp; PHILOSOPHY</span>
              <span className="h-px flex-1" style={{ background: "linear-gradient(to right, rgba(241,237,232,0.10), transparent)" }} />
            </div>
          </div>

          <div className="about-card relative will-change-transform">
            <div className="rounded-[24px] p-6 lg:p-8 backdrop-blur relative overflow-hidden group/card transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.35)]" style={{ border: "1px solid rgba(241,237,232,0.09)", background: "linear-gradient(135deg, rgba(241,237,232,0.05), rgba(241,237,232,0.015))" }}>
              <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full blur-3xl pointer-events-none opacity-80 group-hover/card:opacity-100 transition-opacity" style={{ background: "rgba(217,168,92,0.10)" }} />
              <div className="text-[11px] tracking-[0.24em] font-mono mb-6 flex items-center gap-2" style={{ color: "#D9A85C" }}>
                <span className="w-2 h-2 rounded-full inline-block animate-pulse" style={{ background: "#D9A85C", boxShadow: "0 0 10px rgba(217,168,92,0.6)" }} />ENGINEERING MINDSET &amp; APPROACH
              </div>
              <div className="space-y-5">
                <div className="flex gap-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl" style={{ border: "1px solid rgba(241,237,232,0.09)", background: "rgba(241,237,232,0.04)", color: "#D9A85C" }}><Cpu size={18} /></span>
                  <div><div className="text-[14px] font-semibold" style={{ color: "#F1EDE8" }}>First-Principles Architecture</div><div className="mt-1 text-[13px] leading-[1.65]" style={{ color: "#A8A39A" }}>Breaking problems down into fundamental computing concepts — memory efficiency, algorithmic complexity, and predictable data flow.</div></div>
                </div>
                <div className="flex gap-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl" style={{ border: "1px solid rgba(241,237,232,0.09)", background: "rgba(241,237,232,0.04)", color: "#D9A85C" }}><ShieldCheck size={18} /></span>
                  <div><div className="text-[14px] font-semibold" style={{ color: "#F1EDE8" }}>Reliability Over Hype</div><div className="mt-1 text-[13px] leading-[1.65]" style={{ color: "#A8A39A" }}>Prioritizing solid, tested systems that handle edge cases cleanly. Preferring robust tooling and defensive coding over unnecessary abstractions.</div></div>
                </div>
                <div className="flex gap-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl" style={{ border: "1px solid rgba(241,237,232,0.09)", background: "rgba(241,237,232,0.04)", color: "#D9A85C" }}><Compass size={18} /></span>
                  <div><div className="text-[14px] font-semibold" style={{ color: "#F1EDE8" }}>Continuous Growth &amp; Ownership</div><div className="mt-1 text-[13px] leading-[1.65]" style={{ color: "#A8A39A" }}>Constantly pushing boundaries across modern paradigms, agentic tools, and system design, with full accountability for every line written.</div></div>
                </div>
              </div>
              <div className="mt-7 rounded-xl p-4 font-mono text-[11px] relative overflow-hidden" style={{ background: "rgba(0,0,0,0.28)", border: "1px solid rgba(241,237,232,0.08)" }}>
                <div className="absolute inset-0 opacity-20" style={{ background: "linear-gradient(90deg, transparent, rgba(217,168,92,0.15), transparent)", transform: "translateX(-100%)", animation: "aboutShimmer 6s ease-in-out infinite" } as any} />
                <div style={{ color: "#A8A39A" }}>// core philosophy</div>
                <div className="mt-1 text-[12px] font-semibold" style={{ color: "#F1EDE8" }}>clarity → simplicity → reliability</div>
                <div className="mt-1" style={{ color: "#A8A39A" }}>Understand deeply. Measure before guessing. Ship with care.</div>
              </div>
            </div>
            <div className="absolute -z-10 -bottom-6 -left-6 w-60 h-60 rounded-full blur-3xl pointer-events-none about-glow-slow" style={{ background: "rgba(217,168,92,0.07)" }} />
          </div>
        </div>

        <div className="mt-10 hidden lg:flex items-center gap-3 about-reveal-rest">
          <span className="text-[10px] tracking-[0.24em] font-mono" style={{ color: "rgba(241,237,232,0.20)" }}>BACKGROUND &amp; PHILOSOPHY</span>
          <span className="h-px flex-1" style={{ background: "linear-gradient(to right, rgba(241,237,232,0.10), transparent)" }} />
          <span className="text-[10px] font-mono" style={{ color: "#A8A39A" }}>EXPLORE WORK ↓</span>
        </div>
      </div>
      <style>{`@keyframes aboutShimmer { 0%{transform:translateX(-100%)} 50%{transform:translateX(100%)} 100%{transform:translateX(100%)}}`}</style>
    </section>
  );
}














