import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [active, setActive] = useState(false);
  const [hidden, setHidden] = useState(false);
  const mouse = useRef({ x: -100, y: -100 });
  const pos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 1024 || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch) {
      setHidden(true);
      return;
    }
    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      if (labelRef.current) labelRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    };
    const onEnter = (e: Event) => {
      const t = e.target as HTMLElement;
      const el = t.closest("a, button, [data-cursor]") as HTMLElement | null;
      if (!el) return;
      setActive(true);
      const custom = el.getAttribute("data-cursor");
      if (custom) setLabel(custom.toUpperCase());
      else if (el.closest("[data-project]")) setLabel("EXPLORE");
      else if ((el as HTMLAnchorElement).href && (el as HTMLAnchorElement).href.includes("github")) setLabel("VIEW");
      else if (el.closest("[data-character]")) setLabel("MOVE");
      else setLabel("");
    };
    const onLeave = (e: Event) => {
      const t = e.target as HTMLElement;
      if (t.closest("a, button, [data-cursor]")) {
        setActive(false);
        setLabel("");
      }
    };

    let raf = 0;
    const tick = () => {
      pos.current.x += (mouse.current.x - pos.current.x) * 0.14;
      pos.current.y += (mouse.current.y - pos.current.y) * 0.14;
      if (ringRef.current) ringRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
      raf = requestAnimationFrame(tick);
    };
    tick();

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onEnter);
    document.addEventListener("mouseout", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onEnter);
      document.removeEventListener("mouseout", onLeave);
    };
  }, []);

  if (hidden) return null;

  return (
    <>
      <div ref={dotRef} className="fixed left-0 top-0 w-1.5 h-1.5 -ml-[3px] -mt-[3px] bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference hidden lg:block" />
      <div
        ref={ringRef}
        className={`fixed left-0 top-0 w-7 h-7 -ml-[14px] -mt-[14px] rounded-full border border-white/40 pointer-events-none z-[9999] mix-blend-difference hidden lg:block transition-[width,height,background,border] duration-200 flex items-center justify-center ${active ? "w-14 h-14 -ml-[28px] -mt-[28px] bg-[#EDE9E0]/10 border-white" : ""}`}
      />
      <div
        ref={labelRef}
        className="fixed left-0 top-0 pointer-events-none z-[9999] hidden lg:block -ml-[28px] -mt-[42px] text-[9px] tracking-[0.16em] font-mono font-bold text-white mix-blend-difference"
        style={{ opacity: label ? 1 : 0, transition: "opacity 0.15s" }}
      >
        {label}
      </div>
    </>
  );
}


