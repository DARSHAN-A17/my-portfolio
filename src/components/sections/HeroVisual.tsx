import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { gsap } from "../../animations/core";
import portraitSrc from "../../animations/d-portrait.png";

const HOVER_SCALE = 1.025;

export default function HeroVisual({ ready = true }: { ready?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const portraitWrapRef = useRef<HTMLDivElement>(null);

  // Portrait-only depth: subtle parallax + hover zoom (transform only)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const sx = useSpring(mouseX, { damping: 30, stiffness: 80, mass: 0.8 });
  const sy = useSpring(mouseY, { damping: 30, stiffness: 80, mass: 0.8 });
  const portraitX = useTransform(sx, [-0.5, 0.5], [-12, 12]);
  const portraitY = useTransform(sy, [-0.5, 0.5], [-8, 8]);
  const hoverS = useMotionValue(1);
  const hoverScale = useSpring(hoverS, { stiffness: 120, damping: 18 });
  const hoveringRef = useRef(false);

  useEffect(() => {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) return;
    const ctx = gsap.context(() => {
      const hero = document.getElementById("home");
      if (!hero || !scrollRef.current) return;
      gsap.to(scrollRef.current, {
        y: 100,
        scale: 1.04,
        opacity: 0,
        filter: "blur(10px)",
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "15% top",
          end: "bottom 10%",
          scrub: 1.2,
        },
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  // Portrait cursor depth — hero mousemove only affects portrait transform
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduced || isCoarse || window.innerWidth < 1024) return;

    const hero = document.getElementById("home");
    if (!hero) return;

    const onMove = (e: MouseEvent) => {
      const r = hero.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      mouseX.set(Math.max(-0.5, Math.min(0.5, nx)));
      mouseY.set(Math.max(-0.5, Math.min(0.5, ny)));

      const pw = portraitWrapRef.current?.getBoundingClientRect();
      if (!pw) return;
      const inside = e.clientX >= pw.left && e.clientX <= pw.right && e.clientY >= pw.top && e.clientY <= pw.bottom;
      if (inside !== hoveringRef.current) {
        hoveringRef.current = inside;
        hoverS.set(inside ? HOVER_SCALE : 1);
      }
    };

    const onLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
      hoveringRef.current = false;
      hoverS.set(1);
    };

    hero.addEventListener("mousemove", onMove);
    hero.addEventListener("mouseleave", onLeave);
    return () => {
      hero.removeEventListener("mousemove", onMove);
      hero.removeEventListener("mouseleave", onLeave);
    };
  }, [mouseX, mouseY, hoverS]);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none select-none" aria-hidden>
      {/* === PORTRAIT AMBIENT GLOW — large visible warm studio light — STATIC === */}
      <div className="absolute pointer-events-none" aria-hidden>
        <motion.div
          animate={{ scale: [1, 1.03, 1], opacity: [1, 0.9, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute rounded-full blur-[90px]"
          style={{
            left: "50%",
            bottom: "8%",
            width: "min(62vw, 760px)",
            height: "min(68vh, 620px)",
            transform: "translateX(-50%)",
            background:
              "radial-gradient(ellipse 60% 55% at 50% 45%, rgba(217,168,92,0.22) 0%, rgba(176,130,72,0.14) 28%, rgba(110,78,40,0.08) 48%, transparent 72%)",
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.04, 1], opacity: [0.7, 0.85, 0.7] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
          className="absolute rounded-full blur-[70px]"
          style={{
            left: "50%",
            bottom: "12%",
            width: "min(52vw, 640px)",
            height: "min(55vh, 520px)",
            transform: "translateX(-50%)",
            background:
              "radial-gradient(circle at 50% 45%, rgba(232,201,160,0.10) 0%, rgba(217,168,92,0.06) 30%, transparent 68%)",
          }}
        />
      </div>

      {/* Decorative rings — STATIC position, slow rotation only (no cursor parallax) */}
      <motion.div
        style={{ width: "880px", height: "880px", left: "50%", top: "46%", border: "1px solid rgba(255,255,255,0.025)", borderRadius: "50%" } as any}
        animate={{ rotate: 360 }}
        transition={{ duration: 140, repeat: Infinity, ease: "linear" }}
        className="absolute hidden lg:block pointer-events-none"
      />
      <motion.div
        style={{ width: "680px", height: "680px", left: "50%", top: "46%", border: "1px dashed rgba(201,166,107,0.07)", borderRadius: "50%" } as any}
        animate={{ rotate: -360 }}
        transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
        className="absolute hidden lg:block pointer-events-none"
      />

      {/* Ambient particles near portrait glow — 18 subtle twinkling dots — STATIC (no parallax) */}
      <div className="absolute inset-0 pointer-events-none hidden lg:block" aria-hidden>
        {Array.from({ length: 18 }).map((_, i) => {
          const left = 38 + (i * 37) % 28;
          const top = 32 + (i * 53) % 38;
          const size = i % 3 === 0 ? 2 : i % 3 === 1 ? 1.4 : 1;
          const delay = (i * 0.7) % 3;
          const dur = 3 + (i % 4) * 0.8;
          return (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${left}%`,
                top: `${top}%`,
                width: size,
                height: size,
                background: i % 4 === 0 ? "#D9A85C" : i % 4 === 1 ? "#E8C9A0" : "rgba(255,255,255,0.7)",
              }}
              animate={{ opacity: [0.15, 0.45, 0.15], scale: [1, 1.3, 1] }}
              transition={{ duration: dur, repeat: Infinity, ease: "easeInOut", delay }}
            />
          );
        })}
      </div>

      {/* === PORTRAIT — bottom-anchored, centered — only portrait reacts to cursor === */}
      <style>{`
        @media (max-width: 768px) {
          .hero-portrait-wrap {
            width: min(74vw, 380px) !important;
            height: 56vh !important;
            top: 16% !important;
            bottom: auto !important;
            --tw-translate-x: -50% !important;
            --tw-translate-y: 0 !important;
            transform: translate(-50%, 0) !important;
          }
        }
        @media (max-width: 1023px) and (min-width: 769px) {
          .hero-portrait-wrap {
            width: min(44vw, 600px) !important;
            height: 74vh !important;
          }
        }
      `}</style>
      <div
        ref={portraitWrapRef}
        className="hero-portrait-wrap absolute left-1/2 top-[54%] -translate-x-1/2 -translate-y-1/2"
        style={{
          width: "clamp(520px, 42vw, 700px)",
          height: "clamp(580px, 72vh, 760px)",
          zIndex: 4,
        }}
      >
        {/* REVEAL — clip-path wipe (preserved) */}
        <motion.div
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          animate={ready ? { clipPath: "inset(0 0% 0 0)" } : { clipPath: "inset(0 100% 0 0)" }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] as any }}
          className="absolute inset-0 overflow-hidden"
        >
          {/* ENTRANCE — cinematic reveal: blur8 scale0.96 y20 (preserved) */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96, filter: "blur(8px)" }}
            animate={ready ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" } : { opacity: 0, y: 20, scale: 0.96, filter: "blur(8px)" }}
            transition={{ duration: 1.35, delay: 0.2, ease: [0.16, 1, 0.3, 1] as any }}
            className="absolute inset-0"
            style={{ willChange: "transform, opacity, filter" } as any}
          >
            {/* SCROLL — cinematic dissolve (GSAP) */}
            <div ref={scrollRef} className="absolute inset-0" style={{ willChange: "transform, opacity, filter" } as any}>
              {/* CURSOR DEPTH — portrait-only subtle parallax + zoom (transform only) */}
              <motion.div
                className="absolute inset-0 will-change-transform"
                style={{ x: portraitX, y: portraitY, scale: hoverScale, transformOrigin: "50% 50%" } as any}
              >
                <img
                  src={portraitSrc}
                  alt="Darshan A — portrait"
                  draggable={false}
                  className="absolute inset-0 block select-none"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    objectPosition: "50% 18%",
                    filter: "saturate(1.04) contrast(1.02) brightness(1.02)",
                    maskImage:
                      "linear-gradient(to bottom, black 0%, black 78%, rgba(0,0,0,0.85) 88%, rgba(0,0,0,0.45) 94%, transparent 100%), radial-gradient(ellipse 78% 90% at 50% 45%, black 62%, transparent 84%)",
                    WebkitMaskImage:
                      "linear-gradient(to bottom, black 0%, black 78%, rgba(0,0,0,0.85) 88%, rgba(0,0,0,0.45) 94%, transparent 100%), radial-gradient(ellipse 78% 90% at 50% 45%, black 62%, transparent 84%)",
                    maskComposite: "intersect" as any,
                    WebkitMaskComposite: "source-in" as any,
                  }}
                />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Shoulder light — STATIC */}
      <div
        className="absolute pointer-events-none hidden lg:block"
        style={{
          left: "50%",
          bottom: "6%",
          transform: "translateX(-50%)",
          width: "min(52vw, 640px)",
          height: "38%",
          background: "radial-gradient(ellipse 70% 45% at 50% 0%, rgba(217,168,92,0.08) 0%, transparent 65%)",
          zIndex: 4,
        }}
      />
      {/* Bottom fade into background — STATIC */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: "50%",
          bottom: 0,
          transform: "translateX(-50%)",
          width: "min(52vw, 640px)",
          height: "22%",
          background: "linear-gradient(to top, #0B0C0D 0%, rgba(11,12,13,0.65) 45%, transparent 100%)",
          zIndex: 4,
        }}
      />
    </div>
  );
}
