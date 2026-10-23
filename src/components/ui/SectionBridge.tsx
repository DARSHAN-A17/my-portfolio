/**
 * SectionBridge — subtle atmospheric handoff between sections.
 * Blends the two background tones, carries a drifting glow + one slow
 * travelling pulse across the boundary so the page feels connected.
 * Pure CSS motion (one blurred layer + one 2px pulse), pointer-transparent.
 */
export default function SectionBridge({ from, to }: { from: string; to: string }) {
  return (
    <div className="relative h-[56px] overflow-hidden" aria-hidden style={{ background: `linear-gradient(to bottom, ${from}, ${to})` }}>
      <div className="bridge-drift absolute -top-10 left-[8%] h-[140px] w-[420px] rounded-full blur-[90px]" style={{ background: "radial-gradient(ellipse 60% 55% at 50% 50%, rgba(217,168,92,0.10), transparent 70%)" }} />
      <div className="bridge-drift absolute -bottom-12 right-[10%] h-[130px] w-[380px] rounded-full blur-[90px]" style={{ background: "radial-gradient(ellipse 60% 55% at 50% 50%, rgba(15,15,14,0.14), transparent 70%)", animationDelay: "3.2s" }} />
      <div className="absolute inset-x-0 top-1/2 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(241,237,232,0.08) 30%, rgba(241,237,232,0.08) 70%, transparent)" }} />
      <span className="bridge-pulse" />
      <style>{`
        .bridge-drift{animation:bridgeDrift 9s ease-in-out infinite;will-change:transform,opacity}
        @keyframes bridgeDrift{0%,100%{transform:translateX(-24px);opacity:0.7}50%{transform:translateX(24px);opacity:1}}
        .bridge-pulse{position:absolute;top:50%;left:0;margin-top:-1px;width:90px;height:2px;border-radius:9999px;background:linear-gradient(90deg,transparent,#D9A85C,transparent);box-shadow:0 0 12px rgba(217,168,92,0.7);filter:blur(0.3px);animation:bridgePulse 7s linear infinite}
        @keyframes bridgePulse{from{left:-100px;opacity:0}10%{opacity:1}90%{opacity:1}to{left:calc(100% + 10px);opacity:0}}
      `}</style>
    </div>
  );
}







