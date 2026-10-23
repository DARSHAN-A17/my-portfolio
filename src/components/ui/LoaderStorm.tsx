import { useEffect, useRef } from "react";

/**
 * LoaderStorm — isolated canvas layer for the loader ONLY.
 *
 * Layers drawn here (all palette-restricted, no rainbow):
 *  1. Inflow signals: small dots emitted near each visible logo,
 *     travelling on slightly curved paths toward the center.
 *  2. Central vortex/storm: compact orbiting + inward-spiralling dots,
 *     2–3 faint rotating arc lines, soft radial glow.
 *  3. Identity compression: when `forming` is true the storm compresses,
 *     brightens, and spreads a horizontal energy streak behind DARSHAN A.
 *
 * Performance: single canvas, ≤ ~110 live particles, DPR capped at 1.5,
 * no shadowBlur, no DOM churn. Respects prefers-reduced-motion (static frame).
 */

export type StormTech = { angle: number; order: number };

type Props = {
  techs: StormTech[];
  rx: number;
  ry: number;
  stageW: number;
  stageH: number;
  loaded: number;
  merged: number;
  phase: number;
  forming: boolean;
  reduced: boolean;
};

/* Portfolio palette only. */
const COLORS = ["#22d3ee", "#22d3ee", "#D9A85C", "#D9A85C", "#F1EDE8"];

type Inflow = {
  active: boolean;
  logo: number;
  t: number;
  dur: number;
  curve: number;
  size: number;
  color: string;
  alpha: number;
};

type Vortex = {
  ang: number;
  rad: number;
  speed: number;
  inward: number;
  size: number;
  color: string;
  alpha: number;
};

function rand(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function pick<T>(arr: T[]): T {
  return arr[(Math.random() * arr.length) | 0];
}

export default function LoaderStorm({
  techs,
  rx,
  ry,
  stageW,
  stageH,
  loaded,
  merged,
  phase,
  forming,
  reduced,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  /* Live props for the rAF loop without re-subscribing. */
  const live = useRef({ loaded, merged, phase, forming, rx, ry, stageW, stageH });
  live.current = { loaded, merged, phase, forming, rx, ry, stageW, stageH };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0;
    let h = 0;
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
    };
    resize();
    window.addEventListener("resize", resize);

    const logoPos = (order: number) => {
      const t = techs.find((x) => x.order === order) ?? techs[order % techs.length];
      const a = ((t?.angle ?? 0) * Math.PI) / 180;
      const { rx: RX, ry: RY } = live.current;
      return { x: w / 2 + Math.cos(a) * RX, y: h / 2 + Math.sin(a) * RY };
    };

    /* ---- particle pools (bounded) ---- */
    const inflow: Inflow[] = Array.from({ length: 44 }, () => ({
      active: false, logo: 0, t: 0, dur: 1, curve: 0, size: 1.5, color: COLORS[0], alpha: 0.8,
    }));
    const vortex: Vortex[] = Array.from({ length: 72 }, () => ({
      ang: rand(0, Math.PI * 2), rad: rand(10, 78), speed: rand(0.6, 1.6),
      inward: rand(4, 12), size: rand(1, 2.4), color: pick(COLORS), alpha: rand(0.35, 0.85),
    }));

    let lastMerged = 0;
    let trickle = 0;
    let compress = 0; // 0 → 1 when forming
    let streak = 0; // horizontal spread 0 → 1 when forming

    const spawnInflow = (logoOrder: number, burst = false) => {
      const count = burst ? 3 : 1;
      let made = 0;
      for (const p of inflow) {
        if (made >= count) break;
        if (p.active) continue;
        p.active = true;
        p.logo = logoOrder;
        p.t = burst ? rand(-0.12, 0.05) : rand(-0.25, 0);
        p.dur = rand(0.85, 1.35);
        p.curve = rand(-46, 46);
        p.size = rand(1.1, 2.4);
        p.color = pick(COLORS);
        p.alpha = rand(0.45, 0.9);
        made++;
      }
    };

    const energyOf = () => {
      const { loaded: L, merged: M, phase: P } = live.current;
      let e = Math.min(1, (L / 9) * 0.5 + (M / 9) * 0.55);
      if (P >= 2) e = Math.max(e, 0.35);
      if (P >= 3) e = Math.max(e, 0.55);
      if (P >= 4) e = 1;
      return Math.min(1, e);
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, w, h);
      const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, 60);
      g.addColorStop(0, "rgba(34,211,238,0.20)");
      g.addColorStop(1, "rgba(34,211,238,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 60, 0, Math.PI * 2);
      ctx.fill();
    };

    if (reduced) {
      drawStatic();
      return () => window.removeEventListener("resize", resize);
    }

    let raf = 0;
    let last = performance.now();
    let ringA = 0;
    let ringB = Math.PI / 2;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const S = live.current;
      const energy = energyOf();

      /* React to each merge with a small burst from that logo. */
      if (S.merged > lastMerged) {
        for (let m = lastMerged; m < S.merged; m++) spawnInflow(m % 9, true);
        lastMerged = S.merged;
      }
      /* Ambient trickle from random visible logos — staggered, never all at once. */
      trickle -= dt;
      if (trickle <= 0 && S.loaded > 0 && S.phase < 4) {
        trickle = rand(0.12, 0.34) * (1.4 - energy * 0.8);
        const visibleOrder = (Math.random() * Math.min(9, S.loaded)) | 0;
        spawnInflow(visibleOrder, false);
      }

      compress += ((S.forming ? 1 : 0) - compress) * Math.min(1, dt * 2.2);
      streak += ((S.forming ? 1 : 0) - streak) * Math.min(1, dt * 2.6);

      ctx.clearRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h / 2;
      const cScale = 1 - compress * 0.42;

      ctx.globalCompositeOperation = "lighter";

      /* ---- soft central glow ---- */
      const glowR = (30 + energy * 52) * cScale + 18;
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR);
      const boost = 1 + compress * 0.9;
      glow.addColorStop(0, `rgba(34,211,238,${0.16 * boost})`);
      glow.addColorStop(0.55, `rgba(167,139,250,${0.08 * boost})`);
      glow.addColorStop(1, "rgba(34,211,238,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, glowR, 0, Math.PI * 2);
      ctx.fill();

      /* ---- rotating energy rings (faint, controlled) ---- */
      const ringSpeed = 0.35 + energy * 1.5;
      ringA += dt * ringSpeed;
      ringB -= dt * ringSpeed * 0.8;
      const rings: Array<{ r: number; a0: number; len: number; col: string; al: number; lw: number }> = [
        { r: 30 * cScale + 6, a0: ringA, len: 2.1, col: "#22d3ee", al: 0.10 + energy * 0.20, lw: 1.2 },
        { r: 50 * cScale + 8, a0: ringB, len: 1.6, col: "#D9A85C", al: 0.08 + energy * 0.16, lw: 1.1 },
        { r: 70 * cScale + 8, a0: ringA * 0.6, len: 1.1, col: "#D9A85C", al: 0.05 + energy * 0.12, lw: 1 },
      ];
      for (const rg of rings) {
        if (rg.al <= 0.02) continue;
        ctx.globalAlpha = Math.min(0.5, rg.al * (1 + compress * 0.6));
        ctx.strokeStyle = rg.col;
        ctx.lineWidth = rg.lw;
        ctx.beginPath();
        ctx.arc(cx, cy, rg.r, rg.a0, rg.a0 + rg.len);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx, cy, rg.r, rg.a0 + Math.PI, rg.a0 + Math.PI + rg.len * 0.7);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      /* ---- inflow signals: logo → center on curved paths ---- */
      for (const p of inflow) {
        if (!p.active) continue;
        p.t += dt / p.dur;
        if (p.t < 0) continue; // staggered delay
        if (p.t >= 1) {
          p.active = false;
          continue;
        }
        const lp = logoPos(p.logo);
        const sx = lp.x;
        const sy = lp.y;
        /* control point: midpoint pushed perpendicular for a gentle curve */
        const mx = (sx + cx) / 2;
        const my = (sy + cy) / 2;
        const dx = cx - sx;
        const dy = cy - sy;
        const len = Math.hypot(dx, dy) || 1;
        const nx = -dy / len;
        const ny = dx / len;
        const qx = mx + nx * p.curve;
        const qy = my + ny * p.curve;
        const t = p.t;
        const e = t * t * (3 - 2 * t); // smoothstep — eases into the core
        const ix = (1 - e) * (1 - e) * sx + 2 * (1 - e) * e * qx + e * e * cx;
        const iy = (1 - e) * (1 - e) * sy + 2 * (1 - e) * e * qy + e * e * cy;
        const fade = t < 0.15 ? t / 0.15 : 1 - Math.max(0, (t - 0.7) / 0.3);
        ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha * fade));
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(ix, iy, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      /* ---- vortex storm: compact orbiting + inward spiral ---- */
      const activeN = Math.round(14 + energy * 52);
      const spin = 0.5 + energy * 2.1 + compress * 1.2;
      for (let i = 0; i < vortex.length; i++) {
        const v = vortex[i];
        if (i >= activeN) continue;
        v.ang += dt * v.speed * spin;
        v.rad -= dt * v.inward * (0.5 + energy * 1.6);
        const outer = (58 + ((i * 37) % 34)) * cScale + 6;
        if (v.rad < 5) {
          v.rad = outer;
          v.ang = rand(0, Math.PI * 2);
        }
        const px = cx + Math.cos(v.ang) * v.rad;
        const py = cy + Math.sin(v.ang) * v.rad * 0.82;
        const tw = 0.65 + 0.35 * Math.sin(now / 260 + i * 1.7);
        ctx.globalAlpha = Math.min(1, v.alpha * tw * (0.45 + energy * 0.75));
        ctx.fillStyle = v.color;
        ctx.beginPath();
        ctx.arc(px, py, v.size * (0.8 + energy * 0.5), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      /* ---- identity compression streak (behind the name) ---- */
      if (streak > 0.02) {
        const sw = Math.min(w * 0.7, 560) * streak;
        const grad = ctx.createLinearGradient(cx - sw / 2, 0, cx + sw / 2, 0);
        grad.addColorStop(0, "rgba(34,211,238,0)");
        grad.addColorStop(0.5, `rgba(180,240,255,${0.5 * streak})`);
        grad.addColorStop(1, "rgba(167,139,250,0)");
        ctx.globalAlpha = Math.min(1, streak);
        ctx.fillStyle = grad;
        ctx.fillRect(cx - sw / 2, cy - 1.2, sw, 2.4);
        ctx.globalAlpha = 1;
      }

      ctx.globalCompositeOperation = "source-over";
    };

    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[4]"
    />
  );
}


