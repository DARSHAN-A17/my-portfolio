import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { skillGroups } from "../../data/skills";
import { BrandMark } from "../ui/BrandMark";
import { ease } from "../../lib/motion";
import type { SkillGroup } from "../../types";

/* ------------------------------------------------------------------ */
/*  TECHNICAL EXPERTISE — engineering specification interface.         */
/*  5 domains derived from the real skill data (all 36 skills kept).   */
/*  Focus system: hover/tap a domain → accent bar follows, others dim. */
/*  Cool palette only (cyan/blue/violet/teal/indigo).                  */
/* ------------------------------------------------------------------ */

type Domain = {
  id: string;
  no: string;
  title: string;
  description: string;
  spec: string;
  accent: string;
  skills: { name: string; description?: string }[];
};

function buildDomains(): Domain[] {
  const byId = (id: string): SkillGroup | undefined => skillGroups.find((g) => g.id === id);
  const langs = byId("languages")!;
  const ai = byId("ai-ml")!;
  const backend = byId("backend")!;
  const db = byId("database")!;
  const devops = byId("devops")!;
  const tools = byId("ai-tools")!;
  const proto = byId("protocols")!;
  const named = (...names: string[]) =>
    [...devops.skills, ...proto.skills].filter((s) => names.includes(s.name));
  return [
    {
      id: "languages",
      no: "01",
      title: "PROGRAMMING & DSA",
      description: langs.description,
      spec: "MOD.LANG // CORE",
      accent: "#D9A85C",
      skills: langs.skills,
    },
    {
      id: "backend",
      no: "02",
      title: "BACKEND ENGINEERING",
      description: "APIs & applications — async, realtime & mobile",
      spec: "MOD.API // SERVER",
      accent: "#D9A85C",
      skills: [...backend.skills, ...named("REST", "WebSockets")],
    },
    {
      id: "ai",
      no: "03",
      title: "AI / MACHINE LEARNING",
      description: ai.description,
      spec: "MOD.AI // MODELS",
      accent: "#D9A85C",
      skills: ai.skills,
    },
    {
      id: "data",
      no: "04",
      title: "DATABASES & CLOUD",
      description: "Where the data lives — plus cloud deploys",
      spec: "MOD.DATA // STORE",
      accent: "#D9A85C",
      skills: [...db.skills, ...named("Vercel", "Render")],
    },
    {
      id: "tools",
      no: "05",
      title: "TOOLS & DEVELOPMENT",
      description: "Ship reliably, build faster — pipelines & agents",
      spec: "MOD.TOOL // SHIP",
      accent: "#D9A85C",
      skills: [
        ...named("Git", "GitHub", "Jenkins", "Maven", "Gradle", "Linux"),
        ...tools.skills,
        ...named("MCP"),
      ],
    },
  ];
}

export default function Skills() {
  const totalTech = skillGroups.reduce((acc, g) => acc + g.skills.length, 0);
  const domains = useMemo(() => buildDomains(), []);
  const [focus, setFocus] = useState<string | null>(null);
  const [reduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  return (
    <section
      id="skills"
      className="relative overflow-hidden"
      style={{ borderTop: "1px solid rgba(241,237,232,0.06)", background: "#141613" }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 right-[6%] h-[440px] w-[440px] rounded-full blur-[130px]" style={{ background: "rgba(217,168,92,0.04)" }} />
        <div className="absolute bottom-[-6rem] left-[4%] h-[400px] w-[400px] rounded-full blur-[130px]" style={{ background: "rgba(217,168,92,0.04)" }} />
        <div className="absolute inset-0 bg-grid opacity-[0.25]" />
      </div>

      <div className="relative mx-auto max-w-[1280px] px-6 py-10 lg:px-10 lg:py-12">
        {/* Section Header */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: ease.out }}
          className="mb-8 max-w-[920px]"
        >
          <div className="eyebrow mb-4">04 — CAPABILITIES &amp; TECHNICAL SKILLS</div>
          <h2 className="section-title">TECHNICAL EXPERTISE</h2>
          <p className="mt-5 max-w-[620px] text-[15px] leading-[1.75] sm:text-[16px]" style={{ color: "#A8A39A" }}>
            Systems I design, build, and ship with — organized by engineering domain.
            Every technology listed represents hands-on work and real deployment.
          </p>
        </motion.div>

        {/* Domain panels */}
        <div onMouseLeave={() => setFocus(null)}>
          {domains.map((d, i) => {
            const on = focus === null || focus === d.id;
            const lit = focus === d.id;
            return (
              <div key={d.id}>
                {/* animated technical divider */}
                <motion.div
                  initial={reduced ? false : { scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.9, delay: i * 0.06, ease: ease.out }}
                  className="h-px origin-left"
                  style={{ background: `linear-gradient(to right, ${d.accent}44, rgba(241,237,232,0.08) 40%, transparent)` }}
                />
                <motion.article
                  initial={reduced ? false : { opacity: 0, y: 28, filter: "blur(6px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.7, delay: i * 0.09, ease: ease.out }}
                  onMouseEnter={() => setFocus(d.id)}
                  onClick={() => setFocus((f) => (f === d.id ? null : d.id))}
                  className="relative"
                >
                  <div
                    className="relative grid cursor-default gap-4 py-6 md:grid-cols-[76px_minmax(210px,270px)_1fr_auto] md:items-start md:gap-6 lg:py-7"
                    style={{
                      opacity: on ? 1 : 0.55,
                      transition: "opacity 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease, transform 0.35s ease, background 0.35s ease",
                      transform: lit ? "translateY(-2px)" : "translateY(0)",
                      borderRadius: "16px",
                      border: "1px solid transparent",
                      borderColor: lit ? `${d.accent}44` : "transparent",
                      background: lit ? `${d.accent}08` : "transparent",
                      boxShadow: lit ? `0 12px 40px rgba(0,0,0,0.35), 0 0 24px ${d.accent}18` : "none",
                    }}
                  >
                  {/* travelling accent bar */}
                  {lit && (
                    <motion.span
                      layoutId="skill-focus-bar"
                      className="absolute left-0 top-5 bottom-5 w-[3px] rounded-full"
                      style={{ background: d.accent, boxShadow: `0 0 14px ${d.accent}` }}
                      transition={{ duration: 0.4, ease: ease.out }}
                    />
                  )}
                  {/* number + status */}
                  <div className="flex items-center gap-3 pl-4 md:pl-5">
                    <span className="font-mono text-[26px] font-black tracking-tight" style={{ color: lit ? d.accent : "#A8A39A", transition: "color 0.3s ease" }}>
                      {d.no}
                    </span>
                    <span
                      className="h-2 w-2 rounded-full"
                      style={lit
                        ? { background: d.accent, boxShadow: `0 0 10px ${d.accent}`, animation: "skillPulse 1.8s ease-in-out infinite" }
                        : { background: "rgba(241,237,232,0.18)" }}
                    />
                  </div>
                  {/* title + meta */}
                  <div className="pl-4 md:pl-0">
                    <h3 className="font-mono text-[14px] font-bold tracking-[0.12em] text-[#F1EDE8]">{d.title}</h3>
                    <p className="mt-1.5 text-[12.5px] leading-relaxed text-[#A8A39A]">{d.description}</p>
                    <p className="mt-2 font-mono text-[10px] tracking-[0.18em]" style={{ color: lit ? d.accent : "#A8A39A", transition: "color 0.3s ease" }}>
                      {d.spec} — {d.skills.length} TECHNOLOGIES
                    </p>
                  </div>
                  {/* skills */}
                  <div className="flex flex-wrap gap-2 pl-4 md:pl-0">
                    {d.skills.map((s) => (
                      <span
                        key={s.name}
                        title={s.description ?? s.name}
                        className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 transition-all duration-300 hover:-translate-y-0.5"
                        style={{
                          border: `1px solid ${lit ? `${d.accent}55` : "rgba(241,237,232,0.10)"}`,
                          background: lit ? `${d.accent}10` : "rgba(241,237,232,0.03)",
                        }}
                      >
                        <BrandMark name={s.name} size={13} />
                        <span className="text-[12px] font-medium tracking-[0.02em] text-[#F1EDE8]/85">{s.name}</span>
                        {s.description && (
                          <span className="hidden font-mono text-[10px] text-[#A8A39A]/70 xl:inline">
                            {s.description.split("•")[0].trim()}
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                  {/* coordinate label */}
                  <div className="hidden pl-0 pr-1 pt-1 text-right md:block">
                    <div className="font-mono text-[10px] tracking-[0.2em] text-[#A8A39A]/50">SEC.{d.no}</div>
                    <div className="mt-1 font-mono text-[10px] tracking-[0.2em]" style={{ color: lit ? d.accent : "rgba(241,237,232,0.18)", transition: "color 0.3s ease" }}>
                      {lit ? "● FOCUS" : "○ IDLE"}
                    </div>
                  </div>
                  </div>
                </motion.article>
              </div>
            );
          })}
          {/* closing divider */}
          <motion.div
            initial={reduced ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.9, ease: ease.out }}
            className="h-px origin-left"
            style={{ background: "linear-gradient(to right, rgba(241,237,232,0.10), transparent)" }}
          />
        </div>

        {/* footer meta */}
        <motion.div
          initial={reduced ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-[#F1EDE8]/[0.08] pt-6 font-mono text-[11px] tracking-[0.14em] text-[#A8A39A]"
        >
          <span><span className="font-semibold" style={{ color: "rgba(241,237,232,0.75)" }}>{domains.length}</span> DOMAINS</span>
          <span><span className="font-semibold" style={{ color: "rgba(241,237,232,0.75)" }}>{totalTech}</span> TECHNOLOGIES</span>
          <span style={{ color: "#A8A39A" }}>PRACTICED &amp; DEPLOYED</span>
        </motion.div>
      </div>

      <style>{`
        @keyframes skillPulse { 0%,100% { opacity: 1; } 50% { opacity: 0.35; } }
      `}</style>
    </section>
  );
}










