import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight, ArrowLeft, ArrowRight, MessageCircle, Leaf, Shield, Workflow } from "lucide-react";
import { projects } from "../../data/projects";
import type { Project } from "../../types";
import { BrandMark, getBrand } from "../ui/BrandMark";
import { ease } from "../../lib/motion";
import type { LucideIcon } from "lucide-react";

/* ---- per-project identity ----------------------------- */
const meta: Record<string, { accent: string; Icon: LucideIcon }> = {
  "ai-chatbot": { accent: "#D9A85C", Icon: MessageCircle },
  "ai-agri-assistant": { accent: "#D9A85C", Icon: Leaf },
  nids: { accent: "#D9A85C", Icon: Shield },
  "cicd-automation": { accent: "#D9A85C", Icon: Workflow },
};

/* ---- visuals — realistic, clearly visible when active ---- */
interface VisualProps { projectId: string; isActive: boolean; }

function ChatbotVisual({ isActive }: VisualProps) {
  return (
    <div className={`absolute inset-0 transition-opacity duration-500 ${isActive ? "opacity-100" : "opacity-50"}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-fuchsia-500/06 to-cyan-500/06" />
      <motion.div className="absolute inset-0" animate={{ y: isActive ? [0, -2, 0] : 0 }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}>
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300" fill="none">
          <rect x={32} y={38} width={162} height={46} rx={13} fill="rgba(241,237,232,0.07)" stroke="rgba(241,237,232,0.12)" />
          <text x={44} y={58} fontSize={7.5} fontFamily="monospace" fill="rgba(241,237,232,0.72)">User: How to use NLTK?</text>
          <text x={44} y={72} fontSize={6.5} fontFamily="monospace" fill="rgba(241,237,232,0.38)">intent: definition • 0.96</text>
          <rect x={206} y={96} width={162} height={52} rx={13} fill="white" />
          <text x={218} y={114} fontSize={7.2} fontFamily="monospace" fill="black">Bot: NLTK is a Python</text>
          <text x={218} y={126} fontSize={7.2} fontFamily="monospace" fill="rgba(0,0,0,0.60)">library for NLP tasks.</text>
          <text x={218} y={138} fontSize={6.2} fontFamily="monospace" fill="rgba(0,0,0,0.38)">Streamlit • FastAPI • SQLite</text>
          <rect x={32} y={162} width={162} height={34} rx={13} fill="rgba(241,237,232,0.07)" stroke="rgba(241,237,232,0.12)" />
          <text x={44} y={182} fontSize={7.5} fontFamily="monospace" fill="rgba(241,237,232,0.68)">User: Thanks!</text>
        </svg>
      </motion.div>
      {isActive && (
        <motion.div className="absolute bottom-[18%] left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 backdrop-blur border border-white/10" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.2 }}>
          <span className="h-1.5 w-1.5 rounded-full bg-white" style={{ animation: "chatDot 1.0s infinite" }} />
          <span className="h-1.5 w-1.5 rounded-full bg-white" style={{ animation: "chatDot 1.0s infinite 0.15s" }} />
          <span className="h-1.5 w-1.5 rounded-full bg-white" style={{ animation: "chatDot 1.0s infinite 0.3s" }} />
          <span className="ml-1 font-mono text-[9px] tracking-[0.12em] text-white/70">AI is typing…</span>
        </motion.div>
      )}
      <div className="absolute bottom-2.5 left-3 right-3 rounded-lg bg-black/40 border border-white/10 px-2.5 py-1.5 font-mono text-[10px] leading-relaxed text-white/55">
        <div className="text-white/80">● Real conversation • SQLite history</div>
      </div>
      <style>{`@keyframes chatDot{0%,80%,100%{opacity:0.35;transform:translateY(0)}40%{opacity:1;transform:translateY(-2px)}}`}</style>
    </div>
  );
}
function AgriVisual({ isActive }: VisualProps) {
  return (
    <div className={`absolute inset-0 transition-opacity duration-500 ${isActive ? "opacity-100" : "opacity-50"}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/12 via-teal-500/06 to-transparent" />
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300" fill="none">
        <rect x={24} y={22} width={352} height={34} rx={10} fill="rgba(241,237,232,0.06)" stroke="rgba(241,237,232,0.10)" />
        <text x={200} y={42} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="rgba(241,237,232,0.82)">AI Agri Assistant • Offline</text>
        <rect x={28} y={68} width={148} height={110} rx={12} fill="rgba(241,237,232,0.04)" stroke="rgba(241,237,232,0.10)" />
        <text x={102} y={88} textAnchor="middle" fontSize={7} fontFamily="monospace" fill="rgba(241,237,232,0.42)">CAMERA INPUT</text>
        <g>
          <path d="M102 118 C 88 102, 96 88, 112 84 C 128 88, 136 102, 122 118 C 136 132, 128 146, 112 150 C 96 146, 88 132, 102 118 Z" fill="rgba(16,185,129,0.18)" stroke="rgba(16,185,129,0.38)" strokeWidth="1.1" />
          <path d="M102 84 C 102 98, 102 118, 102 150" stroke="rgba(16,185,129,0.32)" strokeWidth="0.9" />
          <path d="M102 104 C 96 108, 92 115, 90 122" stroke="rgba(16,185,129,0.22)" strokeWidth="0.7" />
          <path d="M102 104 C 108 108, 112 115, 114 122" stroke="rgba(16,185,129,0.22)" strokeWidth="0.7" />
        </g>
        <circle cx={102} cy={135} r={1.8} fill="#10b981" />
        <rect x={190} y={68} width={182} height={110} rx={12} fill="white" />
        <text x={281} y={92} textAnchor="middle" fontSize={8} fontFamily="monospace" fill="black" fontWeight={700}>Healthy • 94%</text>
        <text x={281} y={108} textAnchor="middle" fontSize={6.5} fontFamily="monospace" fill="rgba(0,0,0,0.52)">Tomato — Late blight</text>
        <rect x={210} y={120} width={142} height={7} rx={3.5} fill="rgba(0,0,0,0.08)" />
        <rect x={210} y={120} width={isActive ? 134 : 90} height={7} rx={3.5} fill="#10b981" />
        <text x={281} y={142} textAnchor="middle" fontSize={6} fontFamily="monospace" fill="rgba(0,0,0,0.42)">Soil: Loamy • Report → SQLite</text>
        <rect x={28} y={190} width={344} height={26} rx={8} fill="rgba(16,185,129,0.10)" stroke="rgba(16,185,129,0.18)" />
        <text x={200} y={206} textAnchor="middle" fontSize={7.5} fontFamily="monospace" fill="rgba(241,237,232,0.78)">TFLite • Random Forest • Multilingual</text>
      </svg>
      {isActive && <motion.div className="absolute left-[12%] right-[58%] h-[1.5px]" style={{ top: "41%", background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.85), transparent)", boxShadow: "0 0 10px rgba(16,185,129,0.6)" }} initial={{ y: 0 }} animate={{ y: [0, 38, 0] }} transition={{ duration: 3.0, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.7 }} />}
    </div>
  );
}
function NidsVisual({ isActive }: VisualProps) {
  return (
    <div className={`absolute inset-0 transition-opacity duration-500 ${isActive ? "opacity-100" : "opacity-50"}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 via-violet-500/06 to-transparent" />
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300" fill="none">
        <rect x={22} y={20} width={356} height={36} rx={10} fill="rgba(241,237,232,0.05)" stroke="rgba(241,237,232,0.08)" />
        <text x={200} y={34} textAnchor="middle" fontSize={7.5} fontFamily="monospace" fill="rgba(241,237,232,0.62)">NSL-KDD • Streamlit Dashboard</text>
        <text x={200} y={48} textAnchor="middle" fontSize={6.5} fontFamily="monospace" fill="rgba(241,237,232,0.32)">14 nodes • 3 layers • Real-time</text>
        {Array.from({ length: 10 }).map((_, i) => {
          const x = 44 + (i % 5) * 72;
          const y = 76 + Math.floor(i / 5) * 62;
          const threat = i === 6;
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={9} fill={threat ? "#ef4444" : "#0ea5e9"} fillOpacity={threat ? (isActive ? 0.92 : 0.60) : 0.70} />
              <circle cx={x} cy={y} r={13.5} stroke={threat ? "#ef4444" : "#38bdf8"} strokeOpacity={isActive ? 0.16 : 0.07} fill="none" />
              {isActive && threat && <circle cx={x} cy={y} r={17} stroke="#ef4444" strokeOpacity={0.22} fill="none"><animate attributeName="r" values="17;20;17" dur="1.5s" repeatCount="indefinite" /></circle>}
            </g>
          );
        })}
        <g opacity={0.9}>
          <rect x={28} y={188} width={110} height={22} rx={8} fill="rgba(241,237,232,0.06)" stroke="rgba(241,237,232,0.10)" />
          <text x={83} y={202} textAnchor="middle" fontSize={6.5} fontFamily="monospace" fill="rgba(241,237,232,0.72)">Accuracy 0.97</text>
          <rect x={146} y={188} width={110} height={22} rx={8} fill="rgba(241,237,232,0.06)" stroke="rgba(241,237,232,0.10)" />
          <text x={201} y={202} textAnchor="middle" fontSize={6.5} fontFamily="monospace" fill="rgba(241,237,232,0.72)">F1 0.96</text>
          <rect x={264} y={188} width={110} height={22} rx={8} fill="#ef4444" />
          <text x={319} y={202} textAnchor="middle" fontSize={6.5} fontFamily="monospace" fill="white">ATTACK • Node 7</text>
        </g>
      </svg>
      {isActive && <motion.div className="absolute h-[6px] w-[18px] rounded-full" style={{ top: "51%", background: "#38bdf8", boxShadow: "0 0 8px rgba(56,189,248,0.85)" }} animate={{ left: ["16%", "54%", "16%"] }} transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.5 }} />}
    </div>
  );
}
function CicdVisual({ isActive }: VisualProps) {
  const steps = ["CODE", "BUILD", "TEST", "PIPE", "DEPLOY"];
  return (
    <div className={`absolute inset-0 transition-opacity duration-500 ${isActive ? "opacity-100" : "opacity-50"}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-orange-500/06 to-transparent" />
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300" fill="none">
        {steps.map((l, i) => (
          <g key={l}>
            <rect x={28 + i * 71} y={116} width={60} height={46} rx={11} fill={i === 4 ? "#f59e0b" : "rgba(241,237,232,0.05)"} stroke={isActive && i === 2 ? "#f59e0b" : "rgba(241,237,232,0.12)"} strokeWidth={isActive && i === 2 ? 1.2 : 1} />
            <text x={58 + i * 71} y={138} textAnchor="middle" fontSize={7.2} fontFamily="monospace" fill={i === 4 ? "black" : "white"} fontWeight={700}>{l}</text>
            <text x={58 + i * 71} y={152} textAnchor="middle" fontSize={5.5} fontFamily="monospace" fill={i === 4 ? "rgba(0,0,0,0.55)" : "rgba(241,237,232,0.38)"}>{["Git", "Maven", "JUnit", "Jenkins", "Live"][i]}</text>
          </g>
        ))}
        <line x1={88} y1={139} x2={99} y2={139} stroke="white" strokeOpacity={0.22} strokeWidth={1.2} />
        <line x1={159} y1={139} x2={170} y2={139} stroke="white" strokeOpacity={0.22} strokeWidth={1.2} />
        <line x1={230} y1={139} x2={241} y2={139} stroke="white" strokeOpacity={0.22} strokeWidth={1.2} />
        <line x1={301} y1={139} x2={312} y2={139} stroke="white" strokeOpacity={0.22} strokeWidth={1.2} />
        {isActive && <motion.circle r={3.2} fill="#f59e0b" style={{ filter: "drop-shadow(0 0 6px #f59e0b)" }} animate={{ cx: [58, 129, 200, 271, 342], opacity: [1, 1, 1, 1, 1] }} transition={{ duration: 4.0, repeat: Infinity, ease: "easeInOut", times: [0, 0.24, 0.48, 0.72, 0.94], repeatDelay: 0.9 }} cy={139} />}
        {isActive && steps.map((_, i) => (
          <motion.rect key={`h-${i}`} x={28 + i * 71} y={116} width={60} height={46} rx={11} fill="none" stroke="#f59e0b" strokeOpacity={0} animate={{ strokeOpacity: [0, 0.52, 0] }} transition={{ duration: 4.0, repeat: Infinity, delay: i * 0.80, ease: "easeInOut" }} />
        ))}
      </svg>
      <div className="absolute bottom-2.5 left-3 right-3 rounded-lg bg-black/45 border border-white/10 px-2.5 py-1.5 font-mono text-[10px] text-white/55">
        <div className="flex items-center justify-between"><span>Maven → Gradle • Jenkins</span><span className="text-amber-300">{isActive ? "● Deploying" : "○ Idle"}</span></div>
      </div>
    </div>
  );
}
const visuals: Record<string, (p: VisualProps) => React.ReactElement> = {
  "ai-chatbot": ChatbotVisual,
  "ai-agri-assistant": AgriVisual,
  nids: NidsVisual,
  "cicd-automation": CicdVisual,
};

/* ---- ProjectCard — premium, NO gold border, restored content ---- */
function ProjectCard({ project, index, isActive }: { project: Project; index: number; isActive: boolean }) {
  const { accent, Icon } = meta[project.id] ?? { accent: "#D9A85C", Icon: Workflow };
  const Visual = visuals[project.id];
  const num = String(index + 1).padStart(2, "0");
  const total = String(projects.length).padStart(2, "0");
  const [mx, setMx] = useState({ x: 0, y: 0 });
  const onMove = (e: React.MouseEvent) => {
    if (!isActive) return;
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setMx({ x: ((e.clientX - r.left) / r.width - 0.5) * 5, y: ((e.clientY - r.top) / r.height - 0.5) * -3 });
  };
  const onLeave = () => setMx({ x: 0, y: 0 });
  return (
    <div
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative flex h-full min-h-[380px] flex-col overflow-hidden rounded-[28px] border-0 lg:min-h-[400px] lg:flex-row"
      style={{
        border: "none",
        outline: "none",
        background: "#1C1E1B",
        boxShadow: "none",
      } as React.CSSProperties}
    >
      <div className="flex flex-1 flex-col p-6 lg:w-[46%] lg:p-7">
        <div className="mb-3 flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-xl border border-[#F1EDE8]/10 bg-[#0F0F0E]/[0.04]" style={{ color: accent }}><Icon size={15} /></span>
          <span className="rounded-full border border-[#F1EDE8]/10 bg-[#0F0F0E]/[0.04] px-2.5 py-1 font-mono text-[10px] tracking-[0.13em] text-[#A8A39A]">{project.category.toUpperCase()}</span>
          <span className="ml-auto font-mono text-[11px] tracking-[0.14em] text-[#A8A39A]/60">{num} / {total}</span>
        </div>
        <h3 className="text-[22px] font-semibold leading-[1.05] tracking-[-0.02em] text-[#F1EDE8] lg:text-[24px]">{project.title}</h3>
        <p className="mt-2.5 text-[13.5px] leading-[1.6] text-[#A8A39A]">{project.shortDescription}</p>
        <p className="mt-2 text-[13px] leading-[1.55] text-[#A8A39A]/80 line-clamp-2">{(project.longDescription ?? project.shortDescription).slice(0, 165)}…</p>
        <div className="mt-3.5">
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.map((t) => (
              <span key={t} className="inline-flex items-center gap-1.5 rounded-full border border-[#F1EDE8]/10 bg-[#0F0F0E]/[0.04] px-2.5 py-1 font-mono text-[11px] tracking-[0.06em] text-[#A8A39A]">
                {getBrand(t) && <BrandMark name={t} size={11} />}{t}
              </span>
            ))}
          </div>
          <div className="mt-2.5 flex items-center gap-2 text-[11px] font-mono tracking-[0.14em] text-[#A8A39A]/70"><span className="h-px w-5 bg-[#0F0F0E]/15" /> {project.year} • {(project.status ?? "completed").toUpperCase()} • {project.technologies.length} stacks</div>
        </div>
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            className="group inline-flex items-center gap-2 rounded-full bg-[#D9A85C] px-5 py-2.5 font-mono text-[11px] font-bold tracking-[0.14em] text-white transition hover:bg-[#E8C9A0]"
          >
            <BrandMark name="GitHub" size={13} colored={false} /> VIEW SOURCE <ArrowUpRight size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" onPointerDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()} className="rounded-full border border-[#F1EDE8]/10 bg-[#0F0F0E]/[0.03] px-4 py-2.5 font-mono text-[11px] tracking-[0.14em] text-[#A8A39A] hover:bg-[#0F0F0E]/10 hover:text-[#F1EDE8]">LIVE DEMO</a>
          )}
        </div>
      </div>
      <div className="relative h-[220px] overflow-hidden border-t border-[#F1EDE8]/[0.06] bg-[#0F0F0E] lg:h-auto lg:w-[54%] lg:border-l lg:border-t-0">
        <motion.div className="absolute inset-0" animate={{ x: isActive ? mx.x : 0, y: isActive ? mx.y : 0 }} transition={{ type: "spring", stiffness: 140, damping: 18 }} style={{ willChange: "transform" }}>
          {Visual && <Visual projectId={project.id} isActive={isActive} />}
        </motion.div>
        <div className="pointer-events-none absolute inset-0 ring-1 ring-[#F1EDE8]/[0.04]" />
        <div className="absolute left-3 top-3 rounded-full bg-white px-2 py-1 font-mono text-[10px] font-bold tracking-[0.12em] text-black">0{index + 1}</div>
      </div>
    </div>
  );
}

export default function Projects() {
  const [active, setActive] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const x = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 440, damping: 38, mass: 0.9 });
  const [cardW, setCardW] = useState(760);
  const gap = 20;
  const [dragging, setDragging] = useState(false);
  const isTransitioningRef = useRef(false);
  const inViewRef = useRef(false);

  useEffect(() => {
    const upd = () => {
      const w = window.innerWidth;
      if (w < 640) setCardW(Math.min(w * 0.90, 360));
      else if (w < 1024) setCardW(Math.min(w * 0.78, 580));
      else setCardW(760);
    };
    upd();
    window.addEventListener("resize", upd);
    return () => window.removeEventListener("resize", upd);
  }, []);

  useEffect(() => {
    const cw = containerRef.current?.clientWidth ?? 1200;
    const offset = (cw - cardW) / 2;
    const target = -active * (cardW + gap) + offset;
    x.set(target);
    springX.set(target);
  }, [active, cardW, gap, x, springX]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { inViewRef.current = e.isIntersecting; }, { threshold: 0.22 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const go = useCallback((i: number) => {
    if (isTransitioningRef.current) return;
    const n = (i + projects.length) % projects.length;
    if (n === active) return;
    isTransitioningRef.current = true;
    setActive(n);
    window.setTimeout(() => { isTransitioningRef.current = false; }, 620);
  }, [active]);

  const onDragEnd = useCallback((_: any, info: { offset: { x: number }; velocity: { x: number } }) => {
    setDragging(false);
    if (window.getSelection) window.getSelection()?.removeAllRanges();
    const thresh = cardW * 0.14;
    const vThresh = 360;
    if (info.offset.x < -thresh || info.velocity.x < -vThresh) go(active + 1);
    else if (info.offset.x > thresh || info.velocity.x > vThresh) go(active - 1);
    else {
      const cw = containerRef.current?.clientWidth ?? 1200;
      const off = (cw - cardW) / 2;
      springX.set(-active * (cardW + gap) + off);
    }
  }, [active, cardW, gap, go, springX]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      const ae = document.activeElement as HTMLElement | null;
      const isTyping = ae && (ae.tagName === "INPUT" || ae.tagName === "TEXTAREA" || ae.isContentEditable);
      if (isTyping) return;
      if (!inViewRef.current) return;
      if (isTransitioningRef.current) return;
      e.preventDefault();
      if (e.key === "ArrowLeft") go(active - 1);
      else go(active + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, go]);

  return (
    <section ref={sectionRef} id="projects" className="relative overflow-hidden" style={{ borderTop: "1px solid rgba(241,237,232,0.06)", background: "#0F0F0E" }}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 left-[12%] h-[360px] w-[360px] rounded-full blur-[120px]" style={{ background: "rgba(217,168,92,0.05)" }} />
        <div className="absolute bottom-0 right-[10%] h-[320px] w-[320px] rounded-full blur-[120px]" style={{ background: "rgba(217,168,92,0.04)" }} />
      </div>

      <div className="relative mx-auto max-w-[1440px] px-6 py-8 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-[720px] text-center">
          <div className="eyebrow justify-center">03 — Selected Work</div>
          <h2 className="section-title">THINGS I&apos;VE BUILT</h2>
          <p className="mx-auto mt-3 max-w-[560px] text-[14.5px] leading-[1.65] text-[#A8A39A]">A selection of systems I designed and built across artificial intelligence, machine learning, cybersecurity, and automation — focused on solving real problems and turning ideas into working products.</p>
        </div>

        <div ref={containerRef} className="relative mt-8 overflow-hidden py-2 lg:mt-9" style={{ perspective: 1200 }}>
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-[4%] bg-gradient-to-r from-[#0F0F0E] to-transparent lg:w-[6%]" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-[4%] bg-gradient-to-l from-[#0F0F0E] to-transparent lg:w-[6%]" />

          <motion.div
            className="flex cursor-grab select-none active:cursor-grabbing"
            style={{ gap, x: springX, userSelect: dragging ? "none" as any : "auto" }}
            drag="x"
            dragElastic={0.16}
            dragMomentum={false}
            dragConstraints={{ left: -(projects.length - 1) * (cardW + gap) - 80, right: 80 }}
            onDragStart={() => setDragging(true)}
            onDragEnd={onDragEnd}
            onPointerDown={(e) => (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)}
          >
            {projects.map((p, i) => {
              const offset = i - active;
              const abs = Math.abs(offset);
              const isActive = i === active;
              const isSide = abs === 1;
              const scale = isActive ? 1 : isSide ? 0.92 : 0.87;
              const opacity = isActive ? 1 : isSide ? 0.58 : 0.34;
              const y = isActive ? 0 : 6;
              const rotateY = isActive ? 0 : offset * -1.8;
              return (
                <motion.div
                  key={p.id}
                  className="shrink-0"
                  style={{ width: cardW }}
                  animate={{ scale, opacity, y, rotateY }}
                  transition={{ duration: 0.52, ease: ease.out }}
                >
                  <div
                    onClick={() => !dragging && isSide && go(i)}
                    role={isSide ? "button" : undefined}
                    tabIndex={isSide ? 0 : -1}
                    onKeyDown={(e) => { if (isSide && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); go(i); } }}
                    className={isSide ? "cursor-pointer" : undefined}
                    aria-label={isSide ? `View ${p.title}` : undefined}
                  >
                    <ProjectCard project={p} index={i} isActive={isActive} />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* single clean navigation — no duplicate indicators */}
        <div className="mx-auto mt-6 flex max-w-[760px] flex-col items-center gap-4">
          <div className="flex w-full items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button onClick={() => go(active - 1)} aria-label="Previous project" className="grid h-9 w-9 place-items-center rounded-full border border-[#F1EDE8]/10 bg-[#0F0F0E]/[0.03] text-[#A8A39A] hover:border-white/20 hover:bg-[#0F0F0E]/10 hover:text-[#F1EDE8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F1EDE8]/20">
                <ArrowLeft size={15} />
              </button>
              <button onClick={() => go(active + 1)} aria-label="Next project" className="grid h-9 w-9 place-items-center rounded-full border border-[#F1EDE8]/10 bg-[#0F0F0E]/[0.03] text-[#A8A39A] hover:border-white/20 hover:bg-[#0F0F0E]/10 hover:text-[#F1EDE8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F1EDE8]/20">
                <ArrowRight size={15} />
              </button>
              <span className="ml-2 hidden font-mono text-[10px] tracking-[0.16em] text-[#A8A39A]/60 sm:inline">DRAG · SWIPE · ARROWS · CLICK SIDE</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] tracking-[0.16em] text-[#A8A39A]">{String(active + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</span>
            </div>
          </div>

          <div className="h-[2px] w-full overflow-hidden rounded-full bg-[#0F0F0E]/10">
            <motion.div className="h-full rounded-full" style={{ background: meta[projects[active].id]?.accent ?? "#D9A85C" }} initial={false} animate={{ width: `${((active + 1) / projects.length) * 100}%` }} transition={{ duration: 0.48, ease: ease.out }} />
          </div>
        </div>
      </div>
    </section>
  );
}














