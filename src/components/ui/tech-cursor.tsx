import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  image: HTMLImageElement | null;
  size: number;
  scale: number;
  rot: number;
  rotSpd: number;
  life: number;
  maxLife: number;
  fallback: boolean;
  label: string;
}

const ICONS: { name: string; short: string; src: string }[] = [
  { name: "JavaScript", short: "JS", src: "https://cdn.21st.dev/assets/mirror/c1/c16e56a3018fdec5e1a5f81b8c9c78916461f27d3cacb9bdf01c5db6dd987bc0.png" },
  { name: "TypeScript", short: "TS", src: "https://cdn.21st.dev/assets/mirror/54/543879830b5fbeb29965638f83f6e8ddfbe5e2b56f4305d3461ab4f564570ef5.png" },
  { name: "React", short: "RE", src: "https://cdn.21st.dev/assets/mirror/08/08fe52f4ff4229461a6bd00e48e3da81d5b952ccb15d2ad80c01027d3813738f.svg" },
  { name: "Python", short: "PY", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
  { name: "Java", short: "JV", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
  { name: "Node.js", short: "ND", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
];

const MAX_PARTICLES = 22;
const THROTTLE_MS = 26;
const LIFE_MIN = 0.52;
const LIFE_MAX = 0.78;

export default function TechCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const particlesRef = useRef<Particle[]>([]);
  const imagesRef = useRef<{ img: HTMLImageElement; short: string }[]>([]);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    let alive = true;
    const loadOne = (entry: { name: string; short: string; src: string }) =>
      new Promise<{ img: HTMLImageElement; short: string } | null>((resolve) => {
        const img = new Image();
        const timer = window.setTimeout(() => resolve(null), 4000);
        img.onload = () => {
          clearTimeout(timer);
          if (img.naturalWidth > 0) resolve({ img, short: entry.short });
          else resolve(null);
        };
        img.onerror = () => { clearTimeout(timer); resolve(null); };
        img.src = entry.src;
      });

    Promise.all(ICONS.map(loadOne)).then((results) => {
      if (!alive) return;
      imagesRef.current = results.filter((r): r is { img: HTMLImageElement; short: string } => r !== null);
    });

    let lastSpawn = 0;
    const spawn = (x: number, y: number) => {
      if (particlesRef.current.length >= MAX_PARTICLES) particlesRef.current.shift();
      const pool = imagesRef.current;
      const life = LIFE_MIN + Math.random() * (LIFE_MAX - LIFE_MIN);
      const size = 16 + Math.random() * 10; // 16-26
      const vx = (Math.random() - 0.5) * 0.5; // -0.25 to +0.25
      const vy = -(0.7 + Math.random() * 0.5); // -0.7 to -1.2
      if (pool.length > 0) {
        const pick = pool[Math.floor(Math.random() * pool.length)];
        particlesRef.current.push({
          x: x + (Math.random() - 0.5) * 6,
          y: y + (Math.random() - 0.5) * 6,
          vx, vy,
          alpha: 1,
          image: pick.img,
          size,
          scale: 1,
          rot: (Math.random() - 0.5) * 0.2,
          rotSpd: (Math.random() - 0.5) * 0.03,
          life, maxLife: life,
          fallback: false,
          label: pick.short,
        });
      } else {
        particlesRef.current.push({
          x: x + (Math.random() - 0.5) * 6,
          y: y + (Math.random() - 0.5) * 6,
          vx, vy,
          alpha: 1,
          image: null,
          size,
          scale: 1,
          rot: 0, rotSpd: 0,
          life, maxLife: life,
          fallback: true,
          label: ICONS[Math.floor(Math.random() * ICONS.length)].short,
        });
      }
    };

    const onMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastSpawn < THROTTLE_MS) return;
      lastSpawn = now;
      spawn(e.clientX, e.clientY);
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const tick = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);
      const dt = 1 / 60;
      particlesRef.current = particlesRef.current.filter((p) => {
        p.life -= dt;
        if (p.life <= 0) return false;
        p.x += p.vx;
        p.y += p.vy;
        // scale 1 → 0.65 over lifetime
        p.scale = 0.65 + 0.35 * (p.life / p.maxLife);
        // opacity 1 → 0 smooth
        p.alpha = p.life / p.maxLife;
        // slight ease: fade faster at end
        const a = p.alpha * 0.85;
        p.rot += p.rotSpd;
        if (p.fallback || !p.image) {
          const r = p.size * 0.42 * p.scale;
          ctx.save();
          ctx.globalAlpha = a;
          ctx.fillStyle = "#C9A66B";
          ctx.beginPath();
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "rgba(11,12,13,0.92)";
          ctx.font = `700 ${Math.round(p.size * 0.38 * p.scale)}px JetBrains Mono, monospace`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(p.label.slice(0, 2), p.x, p.y + 0.5);
          ctx.restore();
        } else {
          const s = p.size * p.scale;
          ctx.save();
          ctx.globalAlpha = a;
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.shadowColor = "rgba(0,0,0,0.28)";
          ctx.shadowBlur = 5;
          ctx.drawImage(p.image, -s / 2, -s / 2, s, s);
          ctx.restore();
        }
        return true;
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      alive = false;
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="fixed inset-0 pointer-events-none hidden md:block"
      style={{ zIndex: 9997, width: "100vw", height: "100vh" }}
    />
  );
}
