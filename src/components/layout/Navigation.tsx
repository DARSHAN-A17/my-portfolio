import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { scrollToSection, ease } from "../../lib/motion";
import { profile } from "../../data/profile";

const SECTIONS = [
  { id: "about", label: "ABOUT" },
  { id: "projects", label: "PROJECTS" },
  { id: "skills", label: "SKILLS" },
  { id: "journey", label: "JOURNEY" },
];

export default function Navigation({ ready = true }: { ready?: boolean }) {
  const [active, setActive] = useState("home");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Active section: pick whichever section covers the viewport midpoint. */
  useEffect(() => {
    const ids = ["home", "about", "projects", "skills", "journey", "contact"];
    const onScroll = () => {
      const mid = window.innerHeight * 0.42;
      let current = "home";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top <= mid && r.bottom > mid) current = id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Lock body scroll while the mobile sheet is open. */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? window.scrollY / h : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id: string) => {
    setOpen(false);
    // let the sheet close before scrolling so the measurement is correct
    window.setTimeout(() => scrollToSection(id), open ? 220 : 0);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -16, opacity: 0 }}
        animate={ready ? { y: 0, opacity: 1 } : { y: -16, opacity: 0 }}
        transition={{ duration: 0.7, delay: ready ? 0.4 : 0, ease: ease.out }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? "py-3 backdrop-blur-xl" : "py-5"
        }`}
        style={scrolled ? { borderBottom: "1px solid rgba(241,237,232,0.08)", background: "rgba(15,15,14,0.85)" } : { borderBottom: "1px solid transparent" }}
      >
        <div className="absolute bottom-0 left-0 h-px bg-[#D9A85C] transition-none" style={{ width: `${progress * 100}%`, opacity: scrolled ? 1 : 0 }} aria-hidden />
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-6 lg:px-10">
            <button
            onClick={() => go("home")}
            className="group flex items-center gap-3"
            aria-label="Back to top — home"
          >
            <img
              src="/logo.png"
              alt="DARSHAN A — portfolio logo"
              draggable={false}
              className="block select-none"
              style={{ width: 56, height: 56, objectFit: "contain" }}
            />
            <span className="hidden font-mono text-[10px] tracking-[0.22em] text-[#A8A39A]/60 transition-colors group-hover:text-[#A8A39A] sm:inline">
              CSE — BENGALURU
            </span>
          </button>

          <div className="hidden items-center gap-8 md:flex">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => go(s.id)}
                className={`relative py-1 font-mono text-[12px] tracking-[0.18em] transition-colors ${
                  active === s.id ? "text-[#D9A85C]" : "text-[#A8A39A] hover:text-[#E8C9A0]"
                }`}
              >
                {s.label}
                  {active === s.id && (
                  <motion.span layoutId="nav-active" className="absolute -bottom-0.5 left-0 right-0 h-px" style={{ background: "#D9A85C" }} transition={{ duration: 0.35, ease: ease.out }} />
                )}
              </button>
            ))}
            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 py-1 font-mono text-[12px] tracking-[0.18em] text-[#A8A39A] transition-colors hover:text-[#E8C9A0]"
            >
              GITHUB <ArrowUpRight size={12} />
            </a>
          </div>

          <div className="hidden md:block">
            <button onClick={() => go("contact")} className="rounded-full px-6 py-2.5 font-mono text-[11px] font-bold tracking-[0.16em] transition-transform duration-300 hover:scale-[1.04]" style={{ background: "#F1EDE8", color: "#0F0F0E" }}>CONTACT</button>
          </div>

          <button
            className="grid h-10 w-10 place-items-center rounded-full border border-[#F1EDE8]/15 text-[#F1EDE8] md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X size={17} /> : <Menu size={17} />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: 0.55, ease: ease.inOut }}
            className="fixed inset-0 z-40 flex flex-col px-6 pb-10 pt-24 md:hidden" style={{ background: "#0F0F0E" }}
          >
            <div className="flex flex-col">
              {[...SECTIONS, { id: "contact", label: "CONTACT" }].map((s, i) => (
                <motion.button
                  key={s.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 + i * 0.06, duration: 0.5, ease: ease.out }}
                  onClick={() => go(s.id)}
                  className="flex items-baseline gap-4 border-b border-[#F1EDE8]/[0.08] py-5 text-left"
                >
                  <span className="font-mono text-[11px] tracking-[0.2em] text-[#A8A39A]/50">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[30px] font-black uppercase tracking-[-0.03em] text-[#F1EDE8]">
                    {s.label}
                  </span>
                </motion.button>
              ))}
            </div>

            <motion.a
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.48, duration: 0.5 }}
              href={profile.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-full border border-[#F1EDE8]/15 py-4 font-mono text-[12px] tracking-[0.18em] text-[#F1EDE8]"
            >
              GITHUB <ArrowUpRight size={13} />
            </motion.a>

            <div className="mt-auto pt-8 font-mono text-[10px] tracking-[0.2em] text-[#A8A39A]/50">
              {profile.email}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}









