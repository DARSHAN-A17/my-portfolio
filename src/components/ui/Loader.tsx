import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ease } from "../../lib/motion";
import { BrandMark, getBrand } from "./BrandMark";
import { HoverButton } from "./hover-glow-button";

/**
 * DIGITAL CREATION CHAMBER — premium cinematic loading experience.
 *
 * Visual story: A futuristic digital creation environment awaits activation.
 * After clicking ENTER MY WORLD, technology logos enter ONE BY ONE with cinematic zoom,
 * build a creation device, glow, then continue orbital motion while the website reveals.
 *
 * Sequence: idle → activation → lockon → portal → logoSequence → formationComplete →
 *           hold → energy → rotStart → accel → heroBreakout → energyBuild → climax →
 *           reveal → exit
 */

type Phase =
  | "idle" | "activation" | "lockon" | "portal"
  | "logoSequence" | "formationComplete"
  | "hold" | "energy" | "rotStart" | "accel"
  | "heroBreakout" | "energyBuild" | "climax"
  | "reveal" | "exit";

type Tech = { name: string; label: string };

const TECHS: Tech[] = [
  { name: "Java",        label: "JAVA" },
  { name: "Python",      label: "PYTHON" },
  { name: "JavaScript",  label: "JAVASCRIPT" },
  { name: "TensorFlow",  label: "TENSORFLOW" },
  { name: "FastAPI",     label: "FASTAPI" },
  { name: "PostgreSQL",  label: "POSTGRESQL" },
  { name: "Docker",      label: "DOCKER" },
  { name: "Git",         label: "GIT" },
  { name: "Linux",       label: "LINUX" },
  { name: "MongoDB",     label: "MONGODB" },
  { name: "Supabase",    label: "SUPABASE" },
  { name: "Streamlit",   label: "STREAMLIT" },
  { name: "ChatGPT",     label: "CHATGPT" },
  { name: "Claude Code", label: "CLAUDE" },
];

/* ─── MODULE POSITIONS — ring around the creation device (larger radius for powerful feel) ─── */
const MODULE_POSITIONS: Array<{ angle: number; radius: number }> =
  Array.from({ length: 14 }, (_, i) => ({
    angle: (i / 14) * Math.PI * 2 - Math.PI / 2,
    radius: 0.72, /* Slightly larger than previous 0.68 for premium visibility */
  }));

/* ─── ENTRY DIRECTIONS — varied cinematic entrances from outside viewport ─── */
type EntryDirection = "left" | "right" | "top" | "bottom" | "topLeft" | "topRight" | "bottomLeft" | "bottomRight";

/* ─── CHOREOGRAPHY — per-logo timing (sequential, one by one, staggered — FAST) ─── */
type ChoreoEntry = { entryDelay: number; entryDuration: number; direction: EntryDirection };
const CHOREO: ChoreoEntry[] = [
  /* Java      */ { entryDelay: 0.00, entryDuration: 0.55, direction: "left" },
  /* Python    */ { entryDelay: 0.28, entryDuration: 0.55, direction: "right" },
  /* JS        */ { entryDelay: 0.56, entryDuration: 0.55, direction: "top" },
  /* TF        */ { entryDelay: 0.84, entryDuration: 0.55, direction: "bottom" },
  /* FastAPI   */ { entryDelay: 1.12, entryDuration: 0.55, direction: "topLeft" },
  /* Postgres  */ { entryDelay: 1.40, entryDuration: 0.55, direction: "topRight" },
  /* Docker    */ { entryDelay: 1.68, entryDuration: 0.55, direction: "bottomLeft" },
  /* Git       */ { entryDelay: 1.96, entryDuration: 0.55, direction: "bottomRight" },
  /* Linux     */ { entryDelay: 2.24, entryDuration: 0.55, direction: "left" },
  /* MongoDB   */ { entryDelay: 2.52, entryDuration: 0.55, direction: "right" },
  /* Supabase  */ { entryDelay: 2.80, entryDuration: 0.55, direction: "top" },
  /* Streamlit */ { entryDelay: 3.08, entryDuration: 0.55, direction: "bottom" },
  /* ChatGPT   */ { entryDelay: 3.36, entryDuration: 0.55, direction: "topLeft" },
  /* Claude    */ { entryDelay: 3.64, entryDuration: 0.55, direction: "bottomRight" },
];

/* ─── TIMELINE (seconds after click) — FAST & CLEAN ─── */
const TL = {
  /* Pre-logo cinematic portal (click-relative seconds). */
  lockonStart:    0.35,
  lockonEnd:      1.0,
  portalStart:    1.0,
  portalEnd:      1.55,

  /* Logo sequence — clock resets at portalEnd. Each logo enters one by one. FAST */
  logoSequenceStart: 0.15,
  logoSequenceEnd:   4.35,

  /* Formation complete — brief pause after all logos positioned. */
  formationCompleteStart: 4.35,
  formationCompleteEnd:   4.75,

  /* Cinematic hold — no rotation, formation locked, brief pause. */
  holdStart:      4.75,
  holdEnd:        5.20,

  /* Energy build — core charges, particles surge inward. */
  energyStart:    5.20,
  energyPeak:     5.55,
  energyEnd:      5.70,

  /* Rotation begins — FASTER, clearly visible. */
  rotStart:       5.70,
  rotRamp:        6.00,

  /* Smooth acceleration — faster continuous rotation. */
  accelStart:     6.00,
  accelPeak:      7.00,

  /* Hero logo breakout — DISABLED (kept for phase compat, never visible). */
  heroBreakoutStart: 999,
  heroBreakoutEnd:   999,

  /* Energy build-up — shortened. */
  energyBuildStart: 7.00,
  energyBuildPeak:  7.60,
  energyBuildEnd:   7.80,

  /* Cinematic climax — shortened. */
  climaxStart: 7.80,
  climaxPeak:  8.30,
  climaxEnd:   8.50,

  /* Hero reveal — energy dissolves into hero. */
  revealStart:    8.50,
  revealEnd:      9.30,

  exitAt:         9.30,

  activationEnd:  0.35,
};

/* ─── MATH ─── */
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;
const _easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
void _easeInOutCubic;

function hx(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function mix(hex: string, target: [number, number, number], amt: number) {
  const [r, g, b] = hx(hex);
  const m = (v: number, t: number) => Math.max(0, Math.min(255, Math.round(v + (t - v) * amt)));
  return `rgb(${m(r, target[0])},${m(g, target[1])},${m(b, target[2])})`;
}
function luminance(hex: string) {
  const [r, g, b] = hx(hex);
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

export default function Loader({ onStart, onDone }: { onStart: () => void; onDone: () => void }) {
  const [visible, setVisible] = useState(true);
  const [phase, setPhase] = useState<Phase>("idle");
  const [ctaReady, setCtaReady] = useState(false);
  const doneRef = useRef(false);
  const startedRef = useRef(false);
  const timers = useRef<number[]>([]);
  const phaseRef = useRef<Phase>("idle");
  const mountRef = useRef(0);
  const T0 = useRef({ click: 0 });
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const outerRefs = useRef<Array<HTMLDivElement | null>>([]);
  const innerRefs = useRef<Array<HTMLDivElement | null>>([]);
  const accelRef = useRef(0);
  const boxRef = useRef({ w: 1280, h: 720 });
  const mouseRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const [box, setBox] = useState({ w: 0, h: 0 });
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const go = (p: Phase) => { phaseRef.current = p; setPhase(p); };
  const later = (fn: () => void, s: number) => { timers.current.push(window.setTimeout(fn, s * 1000)); };
  const finish = () => { if (doneRef.current) return; doneRef.current = true; onDone(); };

  const beginExit = () => {
    if (phaseRef.current === "exit") return;
    go("exit");
    later(() => setVisible(false), reduced ? 0.3 : 0.8);
    later(finish, reduced ? 0.6 : 1.4);
    window.setTimeout(() => { if (!doneRef.current) { setVisible(false); finish(); } }, 3000);
  };

  const start = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    onStart();
    T0.current.click = performance.now();
    if (reduced) {
      go("activation");
      later(() => go("logoSequence"), 0.2);
      later(() => go("formationComplete"), 1.2);
      later(() => go("hold"), 1.6);
      later(() => go("energy"), 2.0);
      later(() => go("rotStart"), 2.3);
      later(() => go("accel"), 2.6);
      later(() => go("energyBuild"), 3.0);
      later(() => go("climax"), 3.4);
      later(() => go("reveal"), 3.7);
      later(beginExit, 4.2);
      window.setTimeout(() => { if (!doneRef.current) { setVisible(false); finish(); } }, 9000);
      return;
    }
    go("activation");
    later(() => go("lockon"), TL.lockonStart);
    later(() => go("portal"), TL.portalStart);
    later(() => {
      /* Portal cover is opaque: reset the clock + zoom behind it, then run
         the logo choreography. */
      T0.current.click = performance.now();
      go("logoSequence");
      later(() => go("formationComplete"), TL.formationCompleteStart);
      later(() => go("hold"), TL.holdStart);
      later(() => go("energy"), TL.energyStart);
      later(() => go("rotStart"), TL.rotStart);
      later(() => go("accel"), TL.accelStart);
      later(() => go("energyBuild"), TL.energyBuildStart);
      later(() => go("climax"), TL.climaxStart);
      later(() => go("reveal"), TL.revealStart);
      later(beginExit, TL.exitAt);
    }, TL.portalEnd);
    window.setTimeout(() => { if (!doneRef.current) beginExit(); }, 30000);
  }, [onStart, reduced]);

  useEffect(() => {
    const measure = () => {
      const el = stageRef.current;
      if (el) { const r = el.getBoundingClientRect(); const b = { w: Math.max(1, r.width), h: Math.max(1, r.height) }; boxRef.current = b; setBox(b); }
    };
    measure();
    window.addEventListener("resize", measure);
    if (reduced) setCtaReady(true);
    else timers.current.push(window.setTimeout(() => setCtaReady(true), 1200));
    return () => { window.removeEventListener("resize", measure); timers.current.forEach((t) => window.clearTimeout(t)); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (reduced) return;
    const el = stageRef.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => { const r = el.getBoundingClientRect(); mouseRef.current.tx = (e.clientX - r.left) / r.width - 0.5; mouseRef.current.ty = (e.clientY - r.top) / r.height - 0.5; };
    const onLeave = () => { mouseRef.current.tx = 0; mouseRef.current.ty = 0; };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => { el.removeEventListener("pointermove", onMove); el.removeEventListener("pointerleave", onLeave); };
  }, [reduced]);

  /* ─── rAF LOOP ─── */
  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0, h = 0;
    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const r = parent.getBoundingClientRect();
      w = Math.max(1, Math.round(r.width));
      h = Math.max(1, Math.round(r.height));
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      boxRef.current = { w, h };
    };
    resize();
    window.addEventListener("resize", resize);

    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    /* Particles — cinematic dust, richer for idle. */
    type Particle = { x: number; y: number; vx: number; vy: number; life: number; max: number; size: number; alpha: number; color: string };
    const particles: Particle[] = [];
    const particleColors = ["#E8C9A0", "#D9A85C", "#94a3b8", "#22d3ee", "#D9A85C"];
    for (let i = 0; i < 35; i++) {
      particles.push({
        x: rand(0, 1), y: rand(0, 1),
        vx: rand(-0.006, 0.006), vy: rand(-0.005, -0.001),
        life: rand(0, 10), max: rand(10, 22), size: rand(0.5, 1.3),
        alpha: rand(0.05, 0.12), color: particleColors[Math.floor(rand(0, particleColors.length))],
      });
    }
    const spawnParticle = () => {
      if (particles.length > 45) return;
      particles.push({
        x: rand(0, 1), y: rand(0.9, 1.1),
        vx: rand(-0.006, 0.006), vy: rand(-0.005, -0.001),
        life: 0, max: rand(10, 22), size: rand(0.5, 1.3),
        alpha: rand(0.05, 0.12), color: particleColors[Math.floor(rand(0, particleColors.length))],
      });
    };

    /* Sparks. */
    type Spark = { x: number; y: number; vx: number; vy: number; life: number; max: number; size: number; color: string };
    const sparks: Spark[] = [];
    const emitSpark = (x: number, y: number, color: string) => {
      if (sparks.length > 40) return;
      const a = rand(0, Math.PI * 2);
      const sp = rand(15, 35);
      sparks.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 0, max: rand(0.4, 0.8), size: rand(0.4, 1.2), color });
    };

    /* Energy ring particles for cinematic depth during rotation. */
    type EnergyRing = { angle: number; radius: number; speed: number; color: string; alpha: number; size: number };
    const energyRings: EnergyRing[] = [];
    const spawnEnergyRing = () => {
      if (energyRings.length > 24) return;
      const colors = ["#D9A85C", "#22d3ee", "#E8C9A0", "#F89820", "#4ade80"];
      energyRings.push({
        angle: rand(0, Math.PI * 2),
        radius: rand(0.3, 0.7),
        speed: rand(0.02, 0.06),
        color: colors[Math.floor(rand(0, colors.length))],
        alpha: rand(0.08, 0.18),
        size: rand(1.5, 3.5),
      });
    };

    let deviceRot = 0;
    let ambientRot = 0;
    let orbitAngle = 0;
    let frameNo = 0;
    let raf = 0;
    let last = performance.now();

    /* Smooth rotation velocity — interpolates toward target each frame. */
    let orbitVel = 0;

    /* Boom / reveal progress — disabled for premium dissolve (kept var for compat) */
    let boomProg = 0;
    void boomProg;

    /* Hero breakout — removed (kept vars to avoid phase type churn). */
    const heroBreakoutProg = 0;
    const heroBreakoutIndex = 5;
    void heroBreakoutProg; void heroBreakoutIndex;

    const frame = (now: number) => {
      if (!ctx) return;
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      frameNo++;
      const ph = phaseRef.current;
      const t = (now - (T0.current.click || now)) / 1000;
      const mt = now / 1000;
      const ms = mouseRef.current;
      const parW = ph === "idle" ? 1 : Math.max(0, 1 - t / 2.5);
      ms.x += (ms.tx * parW - ms.x) * Math.min(1, dt * 2.5);
      ms.y += (ms.ty * parW - ms.y) * Math.min(1, dt * 2.5);
      const cx = w / 2 + ms.x * 8;
      const cy = h / 2 + ms.y * 5;
      if (!mountRef.current) mountRef.current = now;
      const idleProg = ph === "idle" ? clamp01((now - mountRef.current) / 3500) : 1;

      /* Energy. */
      const energyOf = (p: Phase) =>
        p === "idle" ? 0.12 : p === "activation" ? 0.3 : p === "lockon" ? 0.38
        : p === "portal" ? 0.55 : p === "logoSequence" ? 0.4
        : p === "formationComplete" ? 0.65
        : p === "hold" ? 0.7 : p === "energy" ? 0.95
        : p === "rotStart" ? 0.85 : p === "accel" ? 0.9
        : p === "heroBreakout" ? 0.88 : p === "energyBuild" ? 0.92
        : p === "climax" ? 1.0 : p === "reveal" ? 0.5 : 0.12;
      const energy = energyOf(ph) + (ph === "idle" ? idleProg * 0.04 : 0);

      /* Rotation — FAST, smooth, clearly visible (no breakout). */
      const rotTarget =
        ph === "idle" ? 0.008
        : ph === "hold" ? 0.0
        : ph === "energy" ? 0.0
        : ph === "rotStart" ? 0.14
        : ph === "accel" ? 0.38
        : ph === "heroBreakout" ? 0.38
        : ph === "energyBuild" ? 0.32
        : ph === "climax" ? 0.32
        : ph === "reveal" ? 0.0
        : ph === "exit" ? 0.0
        : 0.02;
      /* Smoother interpolation with phase-specific acceleration curves */
      const accelFactor = ph === "climax" || ph === "reveal" ? 14 : ph === "accel" ? 6 : 5;
      orbitVel += (rotTarget - orbitVel) * Math.min(1, dt * accelFactor);
      orbitAngle += dt * orbitVel;
      deviceRot += dt * (ph === "idle" ? 0.008 : ph === "hold" ? 0.04 : ph === "energy" ? 0.06 : ph === "rotStart" ? 0.10 : ph === "accel" ? 0.16 : ph === "heroBreakout" ? 0.16 : ph === "energyBuild" ? 0.14 : ph === "climax" ? 0.14 : ph === "reveal" ? 0.0 : ph === "exit" ? 0.0 : 0.02);
      ambientRot += dt * 0.005;

      /* Boom progress — removed for premium dissolve */

      /* Hero breakout progress — removed (no breakout). */

      /* Lock-on acceleration reservoir — warps idle-reactor time only. */
      if (ph === "lockon" || ph === "portal") {
        accelRef.current += dt * (ph === "lockon" ? 1.2 : 3.2);
      }
      const bt = mt + accelRef.current;

      const isIdle = ph === "idle";
      const reactorOn = isIdle || ph === "activation" || ph === "lockon" || ph === "portal";
      const lockK = ph === "lockon" ? clamp01((t - TL.lockonStart) / (TL.lockonEnd - TL.lockonStart)) : 0;
      const portalK = ph === "portal" ? clamp01((t - TL.portalStart) / (TL.portalEnd - TL.portalStart)) : 0;

      /* ═══ CANVAS ═══ */
      ctx.clearRect(0, 0, w, h);

      /* ═══ BACKGROUND ═══ */
      /* Deep cinematic void — layered for depth. */
      const bg1 = ctx.createRadialGradient(cx * 0.85, cy * 0.75, 0, w / 2, h / 2, Math.max(w, h) * 0.85);
      bg1.addColorStop(0, "rgba(18,16,14,1)");
      bg1.addColorStop(0.3, "rgba(13,12,11,1)");
      bg1.addColorStop(0.6, "rgba(9,9,8,1)");
      bg1.addColorStop(1, "rgba(5,5,4,1)");
      ctx.fillStyle = bg1;
      ctx.fillRect(0, 0, w, h);

      /* Warm mid-tone — creates depth around center. */
      const bg2 = ctx.createRadialGradient(cx, cy * 0.9, 0, cx, cy, Math.max(w, h) * 0.5);
      bg2.addColorStop(0, `rgba(28,24,18,${isIdle ? 0.22 : 0.12 + energy * 0.06})`);
      bg2.addColorStop(0.5, `rgba(16,14,12,${isIdle ? 0.12 : 0.06 + energy * 0.03})`);
      bg2.addColorStop(1, "rgba(8,8,7,0)");
      ctx.fillStyle = bg2;
      ctx.fillRect(0, 0, w, h);

      /* Focus pull — background dims as the machine takes over. */
      if (ph === "activation" || ph === "lockon" || ph === "portal") {
        const dk = ph === "activation"
          ? 0.15 * clamp01(t / 0.4)
          : ph === "lockon" ? 0.15 + 0.20 * lockK : 0.35 + 0.25 * portalK;
        ctx.fillStyle = `rgba(0,0,0,${Math.min(0.6, dk)})`;
        ctx.fillRect(0, 0, w, h);
      }

      /* ═══ ATMOSPHERIC COLOR LIGHTING ═══ */
      ctx.globalCompositeOperation = "lighter";

      /* Deep blue — left. */
      const bX = w * (isIdle ? 0.16 : 0.5) + Math.sin(mt * 0.025) * 18;
      const bY = h * 0.35 + Math.cos(mt * 0.02) * 12;
      const bR = Math.min(w, h) * (isIdle ? 0.42 : 0.22);
      const bG = ctx.createRadialGradient(bX, bY, 0, bX, bY, bR);
      const bA = isIdle ? 0.11 : 0.012;
      bG.addColorStop(0, `rgba(25,65,180,${bA})`);
      bG.addColorStop(0.4, `rgba(20,50,140,${bA * 0.5})`);
      bG.addColorStop(1, "rgba(15,35,100,0)");
      ctx.fillStyle = bG;
      ctx.beginPath(); ctx.arc(bX, bY, bR, 0, Math.PI * 2); ctx.fill();

      /* Violet — upper right. */
      const vX = w * 0.78 + Math.sin(mt * 0.02) * 15;
      const vY = h * 0.2 + Math.cos(mt * 0.018) * 10;
      const vR = Math.min(w, h) * (isIdle ? 0.34 : 0.16);
      const vG = ctx.createRadialGradient(vX, vY, 0, vX, vY, vR);
      const vA = isIdle ? 0.075 : 0.008;
      vG.addColorStop(0, `rgba(110,45,170,${vA})`);
      vG.addColorStop(0.5, `rgba(80,35,130,${vA * 0.4})`);
      vG.addColorStop(1, "rgba(50,25,90,0)");
      ctx.fillStyle = vG;
      ctx.beginPath(); ctx.arc(vX, vY, vR, 0, Math.PI * 2); ctx.fill();

      /* Amber — center. */
      const aR = Math.min(w, h) * 0.32;
      const aG = ctx.createRadialGradient(cx, cy, 0, cx, cy, aR);
      const aA = isIdle ? 0.085 : 0.022 + energy * 0.018;
      aG.addColorStop(0, `rgba(217,168,92,${aA})`);
      aG.addColorStop(0.4, `rgba(200,150,70,${aA * 0.4})`);
      aG.addColorStop(1, "rgba(180,130,50,0)");
      ctx.fillStyle = aG;
      ctx.beginPath(); ctx.arc(cx, cy, aR, 0, Math.PI * 2); ctx.fill();

      /* Teal — bottom right. */
      const tX = w * 0.82 + Math.sin(mt * 0.018) * 12;
      const tY = h * 0.72 + Math.cos(mt * 0.015) * 8;
      const tR = Math.min(w, h) * (isIdle ? 0.3 : 0.13);
      const tG2 = ctx.createRadialGradient(tX, tY, 0, tX, tY, tR);
      const tA = isIdle ? 0.065 : 0.006;
      tG2.addColorStop(0, `rgba(25,170,160,${tA})`);
      tG2.addColorStop(0.5, `rgba(20,130,120,${tA * 0.4})`);
      tG2.addColorStop(1, "rgba(15,90,80,0)");
      ctx.fillStyle = tG2;
      ctx.beginPath(); ctx.arc(tX, tY, tR, 0, Math.PI * 2); ctx.fill();

      /* Slow sweep — warm light drift. */
      const swA = mt * 0.04;
      const swX = cx + Math.cos(swA) * Math.min(w, h) * 0.1;
      const swY = cy + Math.sin(swA * 0.7) * Math.min(w, h) * 0.06;
      const swR = Math.min(w, h) * 0.22;
      const swG = ctx.createRadialGradient(swX, swY, 0, swX, swY, swR);
      swG.addColorStop(0, `rgba(232,201,160,${isIdle ? 0.045 : 0.01 + energy * 0.006})`);
      swG.addColorStop(1, "rgba(232,201,160,0)");
      ctx.fillStyle = swG;
      ctx.beginPath(); ctx.arc(swX, swY, swR, 0, Math.PI * 2); ctx.fill();
      ctx.globalCompositeOperation = "source-over";

      /* ═══ ARCHITECTURAL ELEMENTS ═══ */
      /* Grid lines — REMOVED (radial/starburst lines disabled per request) */
      const gridDrift = mt * 0.003;
      const gridR = Math.min(w, h) * 0.44;
      void gridDrift; void gridR;
      // Grid rings — hidden during logo orbit to keep circle path invisible
      if (isIdle) {
        for (let r = 0; r < 5; r++) {
          const ringR = gridR * (0.2 + r * 0.16);
          ctx.globalAlpha = 0.035;
          ctx.beginPath(); ctx.arc(cx, cy, ringR, 0, Math.PI * 2); ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;

      /* Edge framing — hidden during logo sequence (reveals no circular guides) */
      if (isIdle) {
        ctx.globalAlpha = 0.05;
        ctx.strokeStyle = "#E8C9A0";
        ctx.lineWidth = 0.4;
        ctx.beginPath(); ctx.arc(w * 0.28, h * 1.6, Math.min(w, h) * 0.72, -Math.PI * 0.4, -Math.PI * 0.14); ctx.stroke();
        ctx.beginPath(); ctx.arc(w * 0.72, h * -0.6, Math.min(w, h) * 0.68, Math.PI * 0.12, Math.PI * 0.38); ctx.stroke();
        ctx.beginPath(); ctx.arc(w * -0.1, cy * 0.9, Math.min(w, h) * 0.48, -Math.PI * 0.28, Math.PI * 0.28); ctx.stroke();
        ctx.beginPath(); ctx.arc(w * 1.1, h * 0.55, Math.min(w, h) * 0.42, Math.PI * 0.62, Math.PI * 1.38); ctx.stroke();
        /* Colored accent arcs. */
        ctx.strokeStyle = "#22d3ee"; ctx.globalAlpha = 0.025;
        ctx.beginPath(); ctx.arc(cx, cy, Math.min(w, h) * 0.36, -Math.PI * 0.55, -Math.PI * 0.12); ctx.stroke();
        ctx.strokeStyle = "#D9A85C";
        ctx.beginPath(); ctx.arc(cx, cy, Math.min(w, h) * 0.33, Math.PI * 0.18, Math.PI * 0.52); ctx.stroke();
      }
      ctx.globalAlpha = 1;

      /* Vignette — darkens edges for cinematic depth. */
      if (isIdle) {
        const vigR = Math.max(w, h) * 0.75;
        const vigGrad = ctx.createRadialGradient(cx, cy, vigR * 0.3, cx, cy, vigR);
        vigGrad.addColorStop(0, "rgba(0,0,0,0)");
        vigGrad.addColorStop(0.6, "rgba(0,0,0,0)");
        vigGrad.addColorStop(1, "rgba(0,0,0,0.35)");
        ctx.globalAlpha = 1;
        ctx.fillStyle = vigGrad;
        ctx.fillRect(0, 0, w, h);
      }

      /* ═══ PARTICLES ═══ */
      if (frameNo % 4 === 0) spawnParticle();
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += dt;
        if (p.life >= p.max) { particles.splice(i, 1); continue; }
        const prog = p.life / p.max;
        const fadeIn = Math.min(1, prog * 3);
        const fadeOut = prog > 0.75 ? 1 - (prog - 0.75) / 0.25 : 1;
        const a = p.alpha * fadeIn * fadeOut;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (p.y < -0.05) { p.y = 1.05; p.x = rand(0, 1); }
        ctx.globalAlpha = a;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      /* ═══ CREATION DEVICE ═══ */
      const deviceR = Math.min(w, h) * 0.3;

      /* Phase progress. */
      const assembleK = (ph === "formationComplete" || ph === "hold" || ph === "energy" || ph === "rotStart" || ph === "accel" || ph === "heroBreakout" || ph === "energyBuild" || ph === "climax" || ph === "reveal")
        ? easeOutCubic(clamp01((t - TL.formationCompleteStart) / (TL.formationCompleteEnd - TL.formationCompleteStart))) : 0;
      const holdProgress = (ph === "hold" || ph === "energy" || ph === "rotStart" || ph === "accel" || ph === "heroBreakout" || ph === "energyBuild" || ph === "climax" || ph === "reveal")
        ? easeOutCubic(clamp01((t - TL.holdStart) / (TL.holdEnd - TL.holdStart))) : 0;
      const energyBuildK = (ph === "energy" || ph === "rotStart" || ph === "accel" || ph === "heroBreakout" || ph === "energyBuild" || ph === "climax" || ph === "reveal")
        ? easeOutExpo(clamp01((t - TL.energyStart) / (TL.energyPeak - TL.energyStart))) : 0;
      const orbiting = ph === "hold" || ph === "energy" || ph === "rotStart" || ph === "accel" || ph === "heroBreakout" || ph === "energyBuild" || ph === "climax" || ph === "reveal" || ph === "exit";

      /* --- REACTOR: idle + activation + lock-on + portal (time-warped) --- */
      if (reactorOn) {
        const cOffX = Math.sin(mt * 0.06) * 5;
        const cOffY = Math.cos(mt * 0.045) * 3 - Math.min(w, h) * 0.03;
        const cCx = cx + cOffX;
        const cCy = cy + cOffY;
        const baseR = deviceR * 0.42;

        /* ── LAYER 1 · OUTER ENERGY ARCS: slow clockwise, each own speed + fade ── */
        const outerArcs = [
          { r: baseR * 1.75, speed: 0.26, a0: 0, len: 1.2, col: "#D9A85C", al: 0.13, lw: 1.2, fade: 0.0 },
          { r: baseR * 1.75, speed: 0.31, a0: Math.PI, len: 0.9, col: "#D9A85C", al: 0.09, lw: 1.0, fade: 1.3 },
          { r: baseR * 1.55, speed: 0.36, a0: 0.5, len: 1.0, col: "#E8C9A0", al: 0.11, lw: 1.1, fade: 2.1 },
          { r: baseR * 1.55, speed: 0.42, a0: Math.PI + 0.3, len: 0.7, col: "#E8C9A0", al: 0.08, lw: 0.9, fade: 0.7 },
          { r: baseR * 1.9, speed: 0.47, a0: 1.2, len: 0.5, col: "#22d3ee", al: 0.06, lw: 0.8, fade: 2.8 },
          { r: baseR * 1.9, speed: 0.52, a0: Math.PI + 1.8, len: 0.4, col: "#22d3ee", al: 0.05, lw: 0.7, fade: 1.9 },
        ];
        for (const a of outerArcs) {
          const rot = bt * a.speed;
          const breathe = 0.55 + 0.45 * Math.sin(mt * 0.22 + a.fade);
          ctx.globalAlpha = a.al * breathe;
          ctx.strokeStyle = a.col;
          ctx.lineWidth = a.lw;
          ctx.beginPath();
          ctx.arc(cCx, cCy, a.r, a.a0 + rot, a.a0 + rot + a.len);
          ctx.stroke();
        }

        /* ── LAYER 2 · SECONDARY RINGS: counter-clockwise accents + CW fill ── */
        const midRings = [
          { r: baseR * 1.3, speed: 0.40, segs: 8, segLen: 0.55, col: "#D9A85C", al: 0.12, lw: 1.0 },
          { r: baseR * 1.1, speed: -0.55, segs: 6, segLen: 0.6, col: "#E8C9A0", al: 0.10, lw: 0.9 },
          { r: baseR * 0.9, speed: -0.68, segs: 10, segLen: 0.4, col: "#22d3ee", al: 0.08, lw: 0.8 },
        ];
        for (const ring of midRings) {
          const rot = bt * ring.speed;
          const step = (Math.PI * 2) / ring.segs;
          const gap = step * (1 - ring.segLen);
          for (let s = 0; s < ring.segs; s++) {
            const sAng = s * step + rot;
            ctx.globalAlpha = ring.al * (0.7 + 0.3 * Math.sin(s * 1.3 + mt * 0.1));
            ctx.strokeStyle = ring.col;
            ctx.lineWidth = ring.lw;
            ctx.beginPath();
            ctx.arc(cCx, cCy, ring.r, sAng + gap / 2, sAng + step - gap / 2);
            ctx.stroke();
          }
        }

        /* ── INNER SYSTEM: Technical rings with dash patterns ── */
        const innerRings = [
          { r: baseR * 0.7, speed: 0.78, col: "#D9A85C", al: 0.10, lw: 0.9, dash: [2, 6] },
          { r: baseR * 0.55, speed: -0.88, col: "#E8C9A0", al: 0.09, lw: 0.8, dash: [4, 10] },
          { r: baseR * 0.4, speed: 0.97, col: "#22d3ee", al: 0.07, lw: 0.7, dash: [1, 8] },
        ];
        for (const ring of innerRings) {
          ctx.globalAlpha = ring.al;
          ctx.strokeStyle = ring.col;
          ctx.lineWidth = ring.lw;
          ctx.setLineDash(ring.dash);
          ctx.beginPath();
          ctx.arc(cCx, cCy, ring.r, bt * ring.speed, bt * ring.speed + Math.PI * 1.8);
          ctx.stroke();
        }
        ctx.setLineDash([]);

        /* ── ABSTRACT CONNECTIONS: Lines between nodes ── */
        const nodeCount = 8;
        const nodes: Array<{ x: number; y: number; pulse: number }> = [];
        for (let n = 0; n < nodeCount; n++) {
          const nAng = (n / nodeCount) * Math.PI * 2 + bt * 0.06;
          const nR = baseR * (0.6 + (n % 3) * 0.3);
          nodes.push({
            x: cCx + Math.cos(nAng) * nR,
            y: cCy + Math.sin(nAng) * nR,
            pulse: Math.sin(mt * 0.8 + n * 0.9),
          });
        }
        /* Draw connection lines between adjacent nodes. */
        ctx.globalAlpha = 0.05;
        ctx.strokeStyle = "#D9A85C";
        ctx.lineWidth = 0.6;
        for (let n = 0; n < nodes.length; n++) {
          const next = nodes[(n + 1) % nodes.length];
          ctx.beginPath();
          ctx.moveTo(nodes[n].x, nodes[n].y);
          ctx.lineTo(next.x, next.y);
          ctx.stroke();
        }
        /* Draw nodes — small pulsing dots. */
        for (const node of nodes) {
          const sz = 1.6 + node.pulse * 0.7;
          ctx.globalAlpha = 0.10 + node.pulse * 0.04;
          ctx.fillStyle = node.pulse > 0 ? "#D9A85C" : "#22d3ee";
          ctx.beginPath();
          ctx.arc(node.x, node.y, sz, 0, Math.PI * 2);
          ctx.fill();
        }

        /* ── LAYER 5 · OCCASIONAL ENERGY SCAN: thin arc sweeps, then fades ── */
        const scanPeriod = 9 + 3 * Math.sin(mt * 0.043);
        const scanT = mt % scanPeriod;
        const scanDur = 1.8;
        if (scanT < scanDur) {
          const scanK = scanT / scanDur;
          const scanEnv = Math.sin(scanK * Math.PI);
          const scanAng = -0.9 + scanK * 2.4;
          ctx.globalAlpha = 0.10 * scanEnv;
          ctx.strokeStyle = "#E8C9A0";
          ctx.lineWidth = 1.0;
          ctx.beginPath();
          ctx.arc(cCx, cCy, baseR * 1.42, scanAng, scanAng + 0.7);
          ctx.stroke();
          ctx.globalAlpha = 0.05 * scanEnv;
          ctx.strokeStyle = "#22d3ee";
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.arc(cCx, cCy, baseR * 1.5, scanAng - 0.15, scanAng + 0.55);
          ctx.stroke();
        }

        /* ── LAYER 2b · RING TRAVELERS: markers orbiting at own speeds ── */
        for (let m = 0; m < 10; m++) {
          const mDir = m % 2 === 0 ? 1 : -1;
          const mSpd = 0.32 + (m % 4) * 0.11;
          const mAng = (m / 10) * Math.PI * 2 + bt * mDir * mSpd;
          const mR = baseR * (0.5 + (m % 4) * 0.35);
          const mX = cCx + Math.cos(mAng) * mR;
          const mY = cCy + Math.sin(mAng) * mR;
          const mPulse = Math.sin(mt * 0.5 + m * 0.7);
          ctx.globalAlpha = 0.07 + mPulse * 0.03;
          ctx.fillStyle = m % 3 === 0 ? "#D9A85C" : m % 3 === 1 ? "#22d3ee" : "#E8C9A0";
          if (m % 2 === 0) {
            /* Small diamond. */
            ctx.beginPath();
            ctx.moveTo(mX, mY - 1.5);
            ctx.lineTo(mX + 1.5, mY);
            ctx.lineTo(mX, mY + 1.5);
            ctx.lineTo(mX - 1.5, mY);
            ctx.closePath();
            ctx.fill();
          } else {
            /* Small circle. */
            ctx.beginPath();
            ctx.arc(mX, mY, 1, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        /* ── LAYER 3 · DATA PARTICLE FLOW: dots traveling orbital paths ── */
        const flowCols = ["#D9A85C", "#22d3ee", "#F1EDE8", "#D9A85C", "#22d3ee"];
        for (let f = 0; f < 14; f++) {
          const fDir = f % 3 === 0 ? -1 : 1;
          const fSpd = 0.35 + (f % 5) * 0.13;
          const fR = baseR * (0.55 + (f % 5) * 0.22);
          const fAng = f * 2.39996 + bt * fDir * fSpd;
          const fX = cCx + Math.cos(fAng) * fR;
          const fY = cCy + Math.sin(fAng) * fR;
          const fFade = 0.5 + 0.5 * Math.sin(mt * 0.7 + f * 1.7);
          /* Short trail behind the particle. */
          ctx.globalAlpha = 0.05 * fFade;
          ctx.strokeStyle = flowCols[f % flowCols.length];
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.arc(cCx, cCy, fR, fAng - fDir * 0.16, fAng);
          ctx.stroke();
          /* Particle head. */
          ctx.globalAlpha = 0.10 * fFade + 0.02;
          ctx.fillStyle = flowCols[f % flowCols.length];
          ctx.beginPath();
          ctx.arc(fX, fY, 0.9 + (f % 3) * 0.3, 0, Math.PI * 2);
          ctx.fill();
        }

        /* ── DIGITAL COORDINATES: faint cross-hairs at key points ── */
        for (let c = 0; c < 4; c++) {
          const cAng = (c / 4) * Math.PI * 2 + Math.PI * 0.25;
          const cR = baseR * (0.8 + (c % 2) * 0.5);
          const cX = cCx + Math.cos(cAng) * cR;
          const cY = cCy + Math.sin(cAng) * cR;
          const cLen = 4 + Math.sin(mt * 0.3 + c) * 2;
          ctx.globalAlpha = 0.05;
          ctx.strokeStyle = "#D9A85C";
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(cX - cLen, cY);
          ctx.lineTo(cX + cLen, cY);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(cX, cY - cLen);
          ctx.lineTo(cX, cY + cLen);
          ctx.stroke();
        }

        /* ── TECHNICAL BRACKETS: corner framing around core ── */
        const bracketSize = baseR * 0.35;
        const bracketOffset = baseR * 0.25;
        ctx.globalAlpha = 0.055;
        ctx.strokeStyle = "#D9A85C";
        ctx.lineWidth = 0.7;
        /* Top-left bracket. */
        ctx.beginPath();
        ctx.moveTo(cCx - bracketOffset, cCy - bracketOffset - bracketSize);
        ctx.lineTo(cCx - bracketOffset, cCy - bracketOffset);
        ctx.lineTo(cCx - bracketOffset + bracketSize, cCy - bracketOffset);
        ctx.stroke();
        /* Top-right bracket. */
        ctx.beginPath();
        ctx.moveTo(cCx + bracketOffset, cCy - bracketOffset - bracketSize);
        ctx.lineTo(cCx + bracketOffset, cCy - bracketOffset);
        ctx.lineTo(cCx + bracketOffset - bracketSize, cCy - bracketOffset);
        ctx.stroke();
        /* Bottom-left bracket. */
        ctx.beginPath();
        ctx.moveTo(cCx - bracketOffset, cCy + bracketOffset + bracketSize);
        ctx.lineTo(cCx - bracketOffset, cCy + bracketOffset);
        ctx.lineTo(cCx - bracketOffset + bracketSize, cCy + bracketOffset);
        ctx.stroke();
        /* Bottom-right bracket. */
        ctx.beginPath();
        ctx.moveTo(cCx + bracketOffset, cCy + bracketOffset + bracketSize);
        ctx.lineTo(cCx + bracketOffset, cCy + bracketOffset);
        ctx.lineTo(cCx + bracketOffset - bracketSize, cCy + bracketOffset);
        ctx.stroke();

        /* ── LAYER 4 · ENERGY CORE: breathing glow + expanding ripples ── */
        const corePulse = 1 + 0.04 * Math.sin(mt * 1.5);
        const coreR = deviceR * 0.1 * corePulse;
        for (let rp = 0; rp < 2; rp++) {
          const rpT = (mt + rp * 2.1) % 4.2;
          const rpK = rpT / 4.2;
          if (rpK < 0.55) {
            const rpEnv = Math.sin((rpK / 0.55) * Math.PI);
            ctx.globalAlpha = 0.07 * rpEnv;
            ctx.strokeStyle = rp === 0 ? "#E8C9A0" : "#22d3ee";
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.arc(cCx, cCy, coreR * (1 + rpK * 5.5), 0, Math.PI * 2);
            ctx.stroke();
          }
        }

        /* Ambient outer glow. */
        const ambR = coreR * 3.5;
        const ambGrad = ctx.createRadialGradient(cCx, cCy, 0, cCx, cCy, ambR);
        const coreBoost = 1 + lockK * 0.8 + portalK * 1.6 + energyBuildK * 1.8;
        ambGrad.addColorStop(0, `rgba(217,168,92,${0.16 * coreBoost})`);
        ambGrad.addColorStop(0.3, `rgba(217,168,92,${0.07 * coreBoost})`);
        ambGrad.addColorStop(1, "rgba(217,168,92,0)");
        ctx.globalAlpha = 1;
        ctx.fillStyle = ambGrad;
        ctx.beginPath(); ctx.arc(cCx, cCy, ambR, 0, Math.PI * 2); ctx.fill();

        /* Teal energy fragment — offset slightly. */
        const tealOff = Math.sin(mt * 0.7) * baseR * 0.08;
        const tealR = coreR * 0.6;
        const tealGrad = ctx.createRadialGradient(cCx + tealOff, cCy - tealOff * 0.5, 0, cCx + tealOff, cCy - tealOff * 0.5, tealR);
        tealGrad.addColorStop(0, `rgba(34,211,238,${0.10 * coreBoost})`);
        tealGrad.addColorStop(1, "rgba(34,211,238,0)");
        ctx.fillStyle = tealGrad;
        ctx.beginPath(); ctx.arc(cCx + tealOff, cCy - tealOff * 0.5, tealR, 0, Math.PI * 2); ctx.fill();

        /* Main core gradient. */
        const coreGrad = ctx.createRadialGradient(cCx, cCy, 0, cCx, cCy, coreR);
        coreGrad.addColorStop(0, `rgba(255,243,220,${Math.min(0.85, 0.32 * coreBoost)})`);
        coreGrad.addColorStop(0.3, `rgba(232,201,160,${Math.min(0.6, 0.18 * coreBoost)})`);
        coreGrad.addColorStop(0.7, `rgba(217,168,92,${Math.min(0.4, 0.08 * coreBoost)})`);
        coreGrad.addColorStop(1, "rgba(217,168,92,0)");
        ctx.fillStyle = coreGrad;
        ctx.beginPath(); ctx.arc(cCx, cCy, coreR, 0, Math.PI * 2); ctx.fill();

        /* Core center dot. */
        ctx.fillStyle = "#FFF3DC";
        ctx.globalAlpha = 0.5 + Math.sin(mt * 2) * 0.1;
        ctx.beginPath(); ctx.arc(cCx, cCy, 1.8, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;
      }

      /* --- POST-CLICK: Device rings — circular strokes hidden during logo orbit (logos only) --- */
      if (!isIdle) {
        // Hide circular guides while logos are forming/rotating/blurring — rotation logic stays active
        const hideCircularGuides = ph === "logoSequence" || ph === "formationComplete" || ph === "hold" || ph === "energy" || ph === "rotStart" || ph === "accel" || ph === "energyBuild" || ph === "climax" || ph === "reveal" || ph === "exit";
        const outerR = deviceR * 1.16;
        const ring2R = deviceR * 1.0;
        const midR = deviceR * 0.7;
        const innerR = deviceR * 0.36;
        const coreFrameR = deviceR * 0.2;
        if (!hideCircularGuides) {
          const segCount = 8;
          for (let s = 0; s < segCount; s++) {
            const segAng = (s / segCount) * Math.PI * 2 + deviceRot;
            const segLen = (Math.PI * 2) / segCount * 0.62;
            const gap = (Math.PI * 2) / segCount * 0.38;
            ctx.globalAlpha = Math.min(0.18, 0.035 + energy * 0.05);
            ctx.strokeStyle = s % 4 === 0 ? "#D9A85C" : s % 4 === 1 ? "#E8C9A0" : s % 4 === 2 ? "#c4a882" : "#22d3ee";
            ctx.lineWidth = assembleK > 0.5 ? 0.9 : 0.55;
            ctx.beginPath();
            ctx.arc(cx, cy, outerR, segAng + gap / 2, segAng + gap / 2 + segLen);
            ctx.stroke();
          }

          const ring2Rot = -deviceRot * 0.55;
          for (let s = 0; s < 6; s++) {
            const segAng = (s / 6) * Math.PI * 2 + ring2Rot;
            const segLen = (Math.PI * 2) / 6 * 0.5;
            const gap = (Math.PI * 2) / 6 * 0.5;
            ctx.globalAlpha = Math.min(0.1, 0.025 + energy * 0.035);
            ctx.strokeStyle = "#D9A85C";
            ctx.lineWidth = 0.45;
            ctx.beginPath();
            ctx.arc(cx, cy, ring2R, segAng + gap / 2, segAng + gap / 2 + segLen);
            ctx.stroke();
          }

          ctx.globalAlpha = Math.min(0.1, 0.025 + energy * 0.04);
          ctx.strokeStyle = "#E8C9A0";
          ctx.lineWidth = 0.45;
          ctx.beginPath(); ctx.arc(cx, cy, midR, 0, Math.PI * 2); ctx.stroke();

          ctx.globalAlpha = Math.min(0.08, 0.02 + energy * 0.03);
          ctx.strokeStyle = "#D9A85C";
          ctx.lineWidth = 0.35;
          ctx.beginPath(); ctx.arc(cx, cy, innerR, 0, Math.PI * 2); ctx.stroke();

          ctx.globalAlpha = Math.min(0.06, 0.015 + energy * 0.025);
          ctx.strokeStyle = "#E8C9A0";
          ctx.lineWidth = 0.3;
          ctx.beginPath(); ctx.arc(cx, cy, coreFrameR, 0, Math.PI * 2); ctx.stroke();
        }

        const corePulse = 1 + 0.025 * Math.sin(mt * 2.0);
        const coreR = deviceR * 0.09 * corePulse;
        const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR);
        coreGrad.addColorStop(0, `rgba(232,201,160,${0.1 + energy * 0.16})`);
        coreGrad.addColorStop(0.5, `rgba(217,168,92,${0.05 + energy * 0.07})`);
        coreGrad.addColorStop(1, "rgba(217,168,92,0)");
        ctx.globalAlpha = 1;
        ctx.fillStyle = coreGrad;
        ctx.beginPath(); ctx.arc(cx, cy, coreR, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = "#FFF3DC";
        ctx.globalAlpha = Math.min(1, 0.2 + energy * 0.3);
        ctx.beginPath(); ctx.arc(cx, cy, 1 + energy * 0.5, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;

        const arcSpeed = orbiting ? 0.25 : 0.08 + energy * 0.12;
        const arcA = mt * arcSpeed;
        const arcs = [
          { r: outerR * 0.86, a0: arcA, len: 0.9, col: "#D9A85C", al: 0.025 + energy * 0.025 },
          { r: outerR * 1.06, a0: -arcA * 0.45, len: 0.65, col: "#22d3ee", al: 0.018 + energy * 0.02 },
          { r: ring2R * 0.9, a0: arcA * 0.25, len: 0.45, col: "#E8C9A0", al: 0.012 + energy * 0.015 },
        ];
        if (!hideCircularGuides) {
          for (const a of arcs) {
            ctx.globalAlpha = Math.min(0.12, a.al);
            ctx.strokeStyle = a.col;
            ctx.lineWidth = 0.45;
            ctx.beginPath();
            ctx.arc(cx, cy, a.r, a.a0, a.a0 + a.len);
            ctx.stroke();
          }
        }
        ctx.globalAlpha = 1;

        // Assemble radial lines — REMOVED (no starburst/spokes per request)
        void assembleK; void innerR; void midR;

        /* Post-alignment glow — intensifies through hold → energy. */
        const postGlowK = orbiting ? Math.min(1, holdProgress + energyBuildK * 0.5) : 0;
        if (postGlowK > 0.05) {
          const glowPulse = 1 + 0.08 * Math.sin(mt * 4);
          const glowR = deviceR * 0.55 * glowPulse;
          const glowGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR);
          glowGrad.addColorStop(0, `rgba(232,201,160,${postGlowK * 0.08})`);
          glowGrad.addColorStop(0.3, `rgba(217,168,92,${postGlowK * 0.05})`);
          glowGrad.addColorStop(1, "rgba(217,168,92,0)");
          ctx.globalCompositeOperation = "lighter";
          ctx.fillStyle = glowGrad;
          ctx.beginPath(); ctx.arc(cx, cy, glowR, 0, Math.PI * 2); ctx.fill();
          ctx.globalCompositeOperation = "source-over";
          ctx.globalAlpha = 1;
        }

        // Orbiting small arcs — REMOVED (no visible circular path during logo rotation)

        if ((ph === "formationComplete" || ph === "hold" || ph === "energy") && frameNo % 5 === 0) {
          const sAng = rand(0, Math.PI * 2);
          const sR = rand(innerR, outerR);
          emitSpark(cx + Math.cos(sAng) * sR, cy + Math.sin(sAng) * sR, "#D9A85C");
        }

        for (let i = sparks.length - 1; i >= 0; i--) {
          const p = sparks[i];
          p.life += dt;
          if (p.life >= p.max) { sparks.splice(i, 1); continue; }
          const prog = p.life / p.max;
          p.x += p.vx * dt; p.y += p.vy * dt;
          p.vx *= 0.97; p.vy *= 0.97;
          const dx = cx - p.x, dy = cy - p.y;
          const d = Math.hypot(dx, dy) || 1;
          p.x += (dx / d) * 12 * dt;
          p.y += (dy / d) * 12 * dt;
          ctx.globalAlpha = Math.max(0, 1 - prog) * 0.35;
          ctx.fillStyle = p.color;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size * (1 - prog * 0.25), 0, Math.PI * 2); ctx.fill();
        }
        ctx.globalAlpha = 1;
      }

      // Cinematic energy rings — removed (no circular trails, logos only)
      void orbiting; void energyRings; void spawnEnergyRing;

      /* ── PUSH: removed for premium dissolve — no wash (simple fade only) ── */
      // no wash during reveal — loader fades as whole

      /* ── ENERGY BOOM — removed for premium dissolve — no wash ── */
      // no boom wash — loader fades as whole

      ctx.globalCompositeOperation = "source-over";

      /* ─── LOGOS (DOM) — cinematic one-by-one entry; hidden until the portal opens ─── */
      const showLogos = ph !== "idle" && ph !== "exit" && ph !== "activation" && ph !== "lockon" && ph !== "portal";
      for (let i = 0; i < TECHS.length; i++) {
        const outer = outerRefs.current[i];
        const inner = innerRefs.current[i];
        if (!outer || !inner) continue;

        if (!showLogos) {
          outer.style.visibility = "hidden";
          outer.style.opacity = "0";
          continue;
        }

        const ch = CHOREO[i];
        const mod = MODULE_POSITIONS[i];
        const brand = getBrand(TECHS[i].name);
        const col = brand ? `#${brand.hex}` : "#D9A85C";

        /* Sequential entry progress — each logo enters ONE BY ONE. */
        const entryRaw = clamp01((t - TL.logoSequenceStart - ch.entryDelay) / ch.entryDuration);
        const entryK = easeOutExpo(entryRaw);

        /* Build progress — movement to final position. */
        const buildRaw = clamp01((t - TL.logoSequenceStart - ch.entryDelay - ch.entryDuration * 0.3) / (ch.entryDuration * 1.2));
        const buildK = easeInOutSine(buildRaw);

        /* Entry position — from outside viewport based on direction. */
        const entryOffset = Math.max(w, h) * 0.8;
        let entryX = cx, entryY = cy;
        switch (ch.direction) {
          case "left": entryX = -entryOffset; entryY = cy; break;
          case "right": entryX = w + entryOffset; entryY = cy; break;
          case "top": entryX = cx; entryY = -entryOffset; break;
          case "bottom": entryX = cx; entryY = h + entryOffset; break;
          case "topLeft": entryX = -entryOffset * 0.7; entryY = -entryOffset * 0.7; break;
          case "topRight": entryX = w + entryOffset * 0.7; entryY = -entryOffset * 0.7; break;
          case "bottomLeft": entryX = -entryOffset * 0.7; entryY = h + entryOffset * 0.7; break;
          case "bottomRight": entryX = w + entryOffset * 0.7; entryY = h + entryOffset * 0.7; break;
        }

        /* Module position. */
        const modR = deviceR * mod.radius;
        const modAngle = mod.angle + (orbiting ? orbitAngle : deviceRot * 0.25);
        const modX = cx + Math.cos(modAngle) * modR;
        const modY = cy + Math.sin(modAngle) * modR;

        /* Position — cinematic zoom toward camera then settle into position. */
        let x: number, y: number;
        if (entryK <= 0) {
          x = entryX; y = entryY;
        } else if (entryK < 0.5) {
          /* Phase 1: Zoom toward camera (center of screen). */
          const zoomK = entryK * 2;
          const zoomX = entryX + (cx - entryX) * zoomK;
          const zoomY = entryY + (cy - entryY) * zoomK;
          x = zoomX; y = zoomY;
        } else if (buildK <= 0) {
          /* Phase 2: Hold at center briefly. */
          x = cx; y = cy;
        } else {
          /* Phase 3: Move to final position with smooth bezier curve. */
          const startX = cx;
          const startY = cy;
          const midX = (startX + modX) / 2;
          const midY = (startY + modY) / 2;
          const perpX = -(modY - startY) * 0.1;
          const perpY = (modX - startX) * 0.1;
          const cpX = midX + perpX;
          const cpY = midY + perpY;
          const u = buildK;
          x = (1 - u) * (1 - u) * startX + 2 * (1 - u) * u * cpX + u * u * modX;
          y = (1 - u) * (1 - u) * startY + 2 * (1 - u) * u * cpY + u * u * modY;
        }

        /* Scale — zoom toward camera effect (+ subtle orbital depth once formed). */
        let sc: number;
        if (entryK < 0.5) {
          /* Zoom toward camera — becomes larger. */
          const zoomK = entryK * 2;
          sc = 0.3 + easeOutCubic(zoomK) * 1.2;
        } else if (entryK < 0.7) {
          /* Hold large briefly. */
          sc = 1.5;
        } else {
          /* Settle into final size. */
          const settleK = easeOutCubic((entryK - 0.7) / 0.3);
          sc = 1.5 - settleK * 0.55;
        }
        const depthK = orbiting ? 1 + 0.05 * Math.cos(modAngle) : 1;
        sc *= depthK;

        /* Hero breakout — REMOVED per request (keep circle clean, no zoom/breakout). */
        // if (ph === "heroBreakout" && i === heroBreakoutIndex) { /* disabled */ }

        /* Opacity — entry fade, dissolve handles exit fade. */
        const opacity = entryK;

        /* Dissolve — quick fade as center split begins (reveal only; exit hides via showLogos). */
        const dissolveK = ph === "reveal" ? clamp01((t - TL.revealStart) / 0.32) : 0;
        if (dissolveK > 0) {
          const dx = x - cx, dy = y - cy;
          x = cx + dx * (1 + dissolveK * 0.06);
          y = cy + dy * (1 + dissolveK * 0.06);
        }
        const dissolveOpacity = dissolveK > 0 ? (1 - dissolveK * 0.92) : 1;

        /* Depth & rotation. */
        const zLayer = (1 - entryK) * -30 + (1 - buildK) * 8;
        const rot = Math.sin(mt * 0.2 + i * 1.6) * 1.2 * (1 - buildK);
        // Visible professional glow — each logo glows in its own color, sharp core stays visible
        const baseGlow = (ph === "formationComplete" || ph === "hold" || ph === "energy" || ph === "rotStart" || ph === "accel" || ph === "energyBuild" || ph === "climax") ? 0.42 : orbiting ? 0.32 : 0;
        const pulse = 0.06 * Math.sin(mt * 1.8 + i * 1.1);
        let glowStrength = baseGlow > 0 ? baseGlow + pulse : 0;
        if (dissolveK > 0) glowStrength *= (1 - dissolveK * 0.65);
        // keep subtle assembly ramp
        if (ph === "formationComplete") glowStrength *= 0.5 + 0.5 * assembleK;

        const finalOpacity = opacity * dissolveOpacity;
        outer.style.visibility = finalOpacity > 0.01 ? "visible" : "hidden";
        outer.style.opacity = String(finalOpacity);
        outer.style.transform = `translate(-50%,-50%) translate(${x - cx}px,${y - cy}px) translateZ(${zLayer}px) scale(${sc}) rotate(${rot}deg)`;
        outer.style.zIndex = buildK > 0.5 ? "5" : "4";
        inner.style.opacity = "1";
        inner.style.filter = glowStrength > 0.08
          ? `brightness(${1 + glowStrength * 0.45}) drop-shadow(0 0 ${8 + glowStrength * 10}px ${col}9a) drop-shadow(0 0 ${16 + glowStrength * 6}px ${col}3a)`
          : "blur(0px)";
      }

      /* ── PORTAL COVER: opaque at portal peak, dissolves as logos emerge ── */
      const portalCover = ph === "portal"
        ? easeOutCubic(clamp01((t - TL.portalStart) / (TL.portalEnd - TL.portalStart)))
        : ph === "logoSequence" ? Math.max(0, 1 - t / 0.7) : 0;
      if (portalCover > 0.01) {
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = `rgba(8,6,5,${0.94 * portalCover})`;
        ctx.fillRect(0, 0, w, h);
        ctx.globalCompositeOperation = "lighter";
        const pcR = Math.max(w, h) * (0.25 + portalCover * 0.5);
        const pcG = ctx.createRadialGradient(cx, cy, 0, cx, cy, pcR);
        pcG.addColorStop(0, `rgba(255,240,210,${0.85 * portalCover})`);
        pcG.addColorStop(0.45, `rgba(217,168,92,${0.5 * portalCover})`);
        pcG.addColorStop(1, "rgba(217,168,92,0)");
        ctx.fillStyle = pcG;
        ctx.fillRect(0, 0, w, h);
        ctx.globalCompositeOperation = "source-over";
        ctx.globalAlpha = 1;
      }

      // Final dissolve — hold 0.52s after tagline, then premium smooth dissolve (ease-in-out, no zoom/blur/lines)
      const revealK = ph === "reveal" ? clamp01((t - TL.revealStart) / (TL.revealEnd - TL.revealStart)) : ph === "exit" ? 1 : 0;
      const holdDur = 0.52;
      const rawFadeK = ph === "reveal" ? clamp01((t - TL.revealStart - holdDur) / Math.max(0.01, TL.revealEnd - TL.revealStart - holdDur)) : ph === "exit" ? 1 : 0;
      const fadeK = easeInOutSine(rawFadeK);
      if (maskRef.current) {
        if (revealK > 0.005) {
          const darken = revealK < 0.28 ? revealK * 0.07 : 0.0196 - (revealK - 0.28) * 0.012;
          maskRef.current.style.filter = `brightness(${1 - darken})`;
          maskRef.current.style.opacity = String(1 - fadeK * 0.985);
        } else {
          maskRef.current.style.filter = "";
          maskRef.current.style.opacity = "1";
        }
        (maskRef.current as unknown as { style: Record<string, string> }).style["webkitMaskImage" as string] = "";
        maskRef.current.style.maskImage = "";
        (maskRef.current as unknown as { style: Record<string, string> }).style["backgroundColor" as string] = "";
        (maskRef.current as unknown as { style: Record<string, string> }).style["background" as string] = "";
      }
      void revealK; void fadeK;
      if (portalRef.current) {
        portalRef.current.style.opacity = "0";
        portalRef.current.style.visibility = "hidden";
      }

      ctx.globalCompositeOperation = "source-over";
    };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  const W = box.w || 1280;
  const H = box.h || 720;
  const compact = W < 640;
  const mid = W < 1024;
  const short = H > 0 && H < 560;
  const sizeFor = () => {
    const base = !mid && !compact ? 50 : mid && !compact ? 40 : 30;
    return base * (short ? 0.85 : 1) * Math.min(1, Math.max(0.8, Math.min(W / 1500, H / 900)));
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={maskRef as unknown as React.RefObject<HTMLDivElement>}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.85, ease: ease.inOut }}
          className="fixed inset-0 z-[100] flex flex-col overflow-hidden bg-[#0F0F0E] text-[#F1EDE8]"
          role="dialog"
          aria-label="Portfolio creation experience"
          style={phase === "exit" ? { pointerEvents: "none" } : undefined}
        >
          <div ref={stageRef} className="relative flex flex-1 items-center justify-center">
            {/* cinematic portal stage — the zoom layer scales ONLY the formation
                scene (canvas + logos). Tagline / sweep / flash stay unscaled. */}
            <div
              className="portal-zoom-layer absolute inset-0 will-change-transform"
              style={{
                transformOrigin: "center center",
                transition: phase === "lockon" || phase === "portal"
                  ? "transform 0.85s cubic-bezier(0.3,0.1,0.3,1)"
                  : "none",
                transform:
                  phase === "portal" ? "scale(2.6)"
                  : phase === "lockon" ? "scale(1.7)"
                  : "scale(1)",
              }}
            >
            <div className="pointer-events-none absolute inset-0">
              <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0" />
            </div>

            {/* Portal glow — soft white iris glow, feathered, cool-white */}
            <div
              ref={portalRef}
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 z-[4] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                width: Math.min(W, H) * 0.52,
                height: Math.min(W, H) * 0.52,
                background: "radial-gradient(circle, rgba(255,255,255,0.14) 0%, rgba(232,235,255,0.07) 34%, rgba(255,255,255,0.02) 60%, transparent 74%)",
                border: "1px solid rgba(255,255,255,0.09)",
                boxShadow: "0 0 28px rgba(255,255,255,0.16), 0 0 64px rgba(220,228,255,0.11), inset 0 0 18px rgba(255,255,255,0.05)",
                filter: "blur(0.5px)",
                opacity: 0,
                visibility: "hidden",
                willChange: "transform, opacity",
              }}
            />

            {!reduced && <span aria-hidden className="scene-sheen" />}

            {/* ═══ IDLE: Central experience only ═══ */}
            {phase === "idle" && (
              <>
                {/* Central title area — above creation core. */}
                <div className="pointer-events-none absolute left-1/2 top-1/2 z-[6] -translate-x-1/2 -translate-y-[230px] text-center">
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 2.5, delay: 1.0, ease: ease.out }}
                    className="font-mono text-[11px] tracking-[0.5em] text-[#D9A85C]/80"
                  >
                    DIGITAL CREATION CHAMBER
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 2.0, delay: 2.2, ease: ease.out }}
                    className="mt-4 font-mono text-[9px] tracking-[0.35em] text-[#F1EDE8]/40"
                  >
                    AWAITING ACTIVATION
                  </motion.div>
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1.5, delay: 2.8, ease: ease.out }}
                    className="mx-auto mt-3 h-px w-[90px]"
                    style={{ background: "linear-gradient(90deg, transparent, rgba(217,168,92,0.35), transparent)" }}
                  />
                </div>

              </>
            )}

            {/* logos */}
            {TECHS.map((t, i) => {
              const brand = getBrand(t.name);
              const hex = brand ? `#${brand.hex}` : "#D9A85C";
              const size = sizeFor();
              const light = mix(hex, [255, 255, 255], 0.32);
              const dark = mix(hex, [8, 8, 10], 0.5);
              const edge = mix(hex, [5, 5, 7], 0.68);
              const ink = luminance(hex) > 0.55 ? "#101114" : "#F5F2EA";
              const logo = (
                <span className="dev-mod" style={{ width: size + 16, height: size + 16 }}>
                  <span
                    className="dev-mod-face"
                    style={{
                      width: "100%", height: "100%",
                      ["--tint" as string]: `${hex}2e`,
                      ["--edge" as string]: `${hex}59`,
                      ["--face" as string]: `linear-gradient(150deg, ${light}, ${hex} 48%, ${dark})`,
                      ["--side" as string]: edge,
                    } as React.CSSProperties}
                  >
                    <span style={{ display: "inline-flex", color: ink }}>
                      <BrandMark name={t.name} size={Math.round(size * 0.4)} colored={false} />
                    </span>
                  </span>
                </span>
              );
              const label = (
                <span className="mt-1.5 font-mono text-[7px] tracking-[0.22em] text-white/40">{t.label}</span>
              );

              if (reduced) {
                const gone = phase === "climax" || phase === "reveal" || phase === "exit";
                return (
                  <div
                    key={t.name}
                    className="absolute z-[3]"
                    style={{ left: "50%", top: "50%", transform: `translate(-50%,-50%) translate(${Math.cos(MODULE_POSITIONS[i].angle) * 170}px,${Math.sin(MODULE_POSITIONS[i].angle) * 170}px)` }}
                  >
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: gone ? 0 : 1 }}
                      transition={{ duration: 0.5, delay: i * 0.06, ease: ease.out }}
                      className="flex flex-col items-center"
                    >
                      {logo}{label}
                    </motion.div>
                  </div>
                );
              }
              return (
                <div key={t.name} className="absolute left-1/2 top-1/2 z-[3]">
                  <div ref={(el) => { outerRefs.current[i] = el; }} className="will-change-transform" style={{ opacity: 0, visibility: "hidden" }}>
                    <div ref={(el) => { innerRefs.current[i] = el; }} className="flex flex-col items-center">
                      {logo}{label}
                    </div>
                  </div>
                </div>
              );
            })}
            </div>{/* /portal-zoom-layer */}

            {/* MARQUEE 1 — header, right → left; fades as the machine takes focus. */}
            {!reduced && (phase === "idle" || phase === "activation" || phase === "lockon") && (
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-[9%] z-[2] overflow-hidden"
                style={{ maskImage: "linear-gradient(90deg, transparent, black 18%, black 82%, transparent)", WebkitMaskImage: "linear-gradient(90deg, transparent, black 18%, black 82%, transparent)", opacity: phase === "idle" ? 1 : 0, transition: "opacity 0.6s ease" }}
              >
                <div className="flex w-max marquee-l font-mono text-[11px] font-medium tracking-[0.5em] text-[#E8C9A0]/40">
                  {[0, 1].map((copy) => (
                    <span key={copy} className="whitespace-nowrap pr-8">
                      DESIGNING SYSTEMS — <span className="marquee-hl-a">BUILDING IDEAS</span> — CREATING INTELLIGENCE — <span className="marquee-hl-c">ENGINEERING EXPERIENCES</span> — DESIGNING SYSTEMS — BUILDING IDEAS — <span className="marquee-hl-b">CREATING INTELLIGENCE</span> — ENGINEERING EXPERIENCES —&nbsp;
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* MARQUEE 2 — footer, left → right; fades as the machine takes focus. */}
            {!reduced && (phase === "idle" || phase === "activation" || phase === "lockon") && (
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-[4%] z-[2] overflow-hidden"
                style={{ maskImage: "linear-gradient(90deg, transparent, black 18%, black 82%, transparent)", WebkitMaskImage: "linear-gradient(90deg, transparent, black 18%, black 82%, transparent)", opacity: phase === "idle" ? 1 : 0, transition: "opacity 0.6s ease" }}
              >
                <div className="flex w-max marquee-r font-mono text-[11px] font-medium tracking-[0.5em] text-[#7fd4cc]/[.38]">
                  {[0, 1].map((copy) => (
                    <span key={copy} className="whitespace-nowrap pr-8">
                      CODE • CREATE • <span className="marquee-hl-b">INNOVATE</span> • BUILD • <span className="marquee-hl-c">LEARN</span> • EVOLVE • CODE • CREATE • INNOVATE • <span className="marquee-hl-a">BUILD</span> • LEARN • EVOLVE •&nbsp;
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* tagline — post-click (reveal completes to stable final state, holds until loader dissolve) */}
            {(phase === "hold" || phase === "energy" || phase === "rotStart" || phase === "accel" || phase === "heroBreakout" || phase === "energyBuild" || phase === "climax" || phase === "reveal" || phase === "exit") && (
              <motion.div
                animate={{ opacity: phase === "exit" ? 0 : 1 }}
                transition={{ duration: 0.45, ease: ease.out }}
                className="pointer-events-none absolute left-1/2 top-1/2 z-[7] w-full max-w-[820px] -translate-x-1/2 -translate-y-1/2 px-6 text-center"
              >
                <div className="overflow-hidden py-1">
                  <motion.div
                    initial={reduced ? { opacity: 0 } : { y: "110%", opacity: 0, filter: "blur(8px)" }}
                    animate={reduced ? { opacity: 1 } : { y: "0%", opacity: 1, filter: "blur(0px)" }}
                    transition={{ duration: reduced ? 0.5 : 0.65, ease: ease.expo }}
                    className="text-[clamp(1.3rem,3.8vw,2.4rem)] font-light tracking-[-0.012em] text-white/75"
                  >
                    BUILDING TODAY.
                  </motion.div>
                </div>
                <div className="overflow-hidden py-1">
                  <motion.div
                    initial={reduced ? { opacity: 0 } : { y: "110%", opacity: 0, filter: "blur(8px)" }}
                    animate={reduced ? { opacity: 1 } : { y: "0%", opacity: 1, filter: "blur(0px)" }}
                    transition={{ duration: reduced ? 0.5 : 0.65, delay: reduced ? 0.12 : 0.45, ease: ease.expo }}
                    className="relative inline-block text-[clamp(1.5rem,4.6vw,2.8rem)] font-black tracking-[-0.022em] text-[#F1EDE8]"
                    style={{ textShadow: "0 0 30px rgba(217,168,92,0.25)" }}
                  >
                    IMPACTING TOMORROW.
                    {!reduced && phase !== "reveal" && phase !== "exit" && (
                      <motion.span aria-hidden className="pointer-events-none absolute inset-0"
                        style={{ background: "linear-gradient(100deg, transparent 30%, rgba(232,201,160,0.18) 50%, transparent 70%)" }}
                        initial={{ x: "-120%" }} animate={{ x: "120%" }}
                        transition={{ duration: 1.3, delay: 0.9, ease: "easeInOut" }}
                      />
                    )}
                  </motion.div>
                </div>
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: reduced ? 0.25 : 0.8 }}
                  className="mx-auto mt-4 h-px w-[min(260px,45vw)]"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(217,168,92,0.55), transparent)" }}
                />
              </motion.div>
            )}

            {/* Final transition — simple premium dissolve (no split, no lines) — handled by loader fade */}

            {/* CTA — ENTER MY WORLD */}
            <AnimatePresence>
              {phase === "idle" && ctaReady && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 16, scale: 0.95, filter: "blur(8px)" }}
                  transition={{ duration: 0.7, ease: ease.out }}
                  className="absolute inset-x-0 bottom-[12%] flex justify-center"
                >
                  <HoverButton
                    onClick={start}
                    glowColor="#D9A85C"
                    backgroundColor="#0B0B0B"
                    textColor="#F1EDE8"
                    hoverTextColor="#E8C9A0"
                  >
                    CLICK HERE
                  </HoverButton>
                </motion.div>
              )}
            </AnimatePresence>

            {/* exit sweep — REMOVED (replaced by soft dissolve) */}
            {/* hero reveal bloom — REMOVED (replaced by soft crossfade dissolve) */}
            {(phase === "reveal" || phase === "exit") && (
              <motion.div aria-hidden className="pointer-events-none absolute inset-0 z-[8]"
                style={{ background: "rgba(15,15,14,0.0)" }}
                initial={{ opacity: 0 }} animate={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </div>

          <style>{`
            .scene-sheen {
              position: absolute; inset: -20%; pointer-events: none;
              background: linear-gradient(105deg, transparent 42%, rgba(241,237,232,0.018) 50%, transparent 58%);
              animation: sheenMove 14s ease-in-out infinite;
              will-change: transform, opacity;
            }
            @keyframes sheenMove {
              0%, 82% { transform: translateX(-35%); opacity: 0; }
              86% { opacity: 1; }
              94% { transform: translateX(35%); opacity: 0; }
              100% { transform: translateX(35%); opacity: 0; }
            }
            .marquee-l { animation: marqueeL 30s linear infinite; will-change: transform; }
            .marquee-r { animation: marqueeR 26s linear infinite; will-change: transform; }
            @keyframes marqueeL {
              from { transform: translateX(0); }
              to { transform: translateX(-50%); }
            }
            @keyframes marqueeR {
              from { transform: translateX(-50%); }
              to { transform: translateX(0); }
            }
            .marquee-hl-a { animation: wordAmber 30s linear infinite; }
            .marquee-hl-b { animation: wordTeal 30s linear infinite; }
            .marquee-hl-c { animation: wordWhite 30s linear infinite; }
            @keyframes wordAmber {
              0%, 40%, 46%, 100% { color: inherit; }
              43% { color: rgba(232,201,160,0.8); }
            }
            @keyframes wordTeal {
              0%, 62%, 68%, 100% { color: inherit; }
              65% { color: rgba(103,232,222,0.8); }
            }
            @keyframes wordWhite {
              0%, 81%, 87%, 100% { color: inherit; }
              84% { color: rgba(241,237,232,0.75); }
            }

            .dev-mod { position: relative; display: block; transition: transform 0.4s ease, filter 0.4s ease; }
            .dev-mod-face {
              position: relative; display: grid; place-items: center; overflow: hidden;
              border-radius: 22%;
              border: 1px solid rgba(255,255,255,0.14);
              background: linear-gradient(150deg, rgba(255,255,255,0.2), transparent 40%), var(--face);
              transform: perspective(700px) rotateX(3deg) rotateY(-4deg);
              box-shadow: inset 0 1px 1px rgba(255,255,255,0.28), inset 0 -8px 14px rgba(0,0,0,0.42), 5px 5px 0 var(--side), 7px 7px 0 rgba(255,255,255,0.05), 12px 14px 26px rgba(0,0,0,0.5), 0 0 16px var(--edge);
              transition: filter 0.4s ease, border-color 0.4s ease;
            }
            .dev-mod-face svg { display: block; }
            .dev-mod-face::before {
              content: ""; position: absolute; left: 10%; top: 6%; width: 54%; height: 14%;
              border-radius: 999px; pointer-events: none;
              background: linear-gradient(to bottom, rgba(255,255,255,0.26), transparent); filter: blur(2px);
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


