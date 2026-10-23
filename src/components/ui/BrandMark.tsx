import * as si from "simple-icons";

/**
 * Real brand marks, sourced from simple-icons (official SVG paths).
 * Tools without an official mark in the set get a hand-built glyph below so
 * every card still shows a recognisable, purpose-drawn logo — never a
 * generic placeholder icon.
 */

export interface Brand {
  title: string;
  /** single SVG path, 24×24 viewBox */
  path: string;
  /** official brand colour */
  hex: string;
}

const from = (icon: { title: string; path: string; hex: string }, override?: Partial<Brand>): Brand => ({
  title: icon.title,
  path: icon.path,
  hex: icon.hex,
  ...override,
});

/* ---- custom marks for tools not covered by simple-icons ---------------- */

/** OpenAI / ChatGPT — the official six-fold knot, simplified to one path. */
const CHATGPT: Brand = {
  title: "ChatGPT",
  hex: "10A37F",
  path: "M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zM8.309 12.863l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365 2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z",
};

/** Google Stitch — the interlocking stitch mark. */
const STITCH: Brand = {
  title: "Stitch",
  hex: "4285F4",
  path: "M12 1.5 2.25 6.75v10.5L12 22.5l9.75-5.25V6.75zm0 2.272 7.5 4.038v1.53L12 13.38 4.5 9.34v-1.53zM4.5 11.62l7.5 4.04 7.5-4.04v1.53l-7.5 4.04-7.5-4.04zm0 3.81 7.5 4.04 7.5-4.04v.62L12 20.09 4.5 16.05z",
};

/** Antigravity IDE — upward vector inside a field. */
const ANTIGRAVITY: Brand = {
  title: "Antigravity",
  hex: "8B5CF6",
  path: "M12 1.75 1.75 19.5h20.5zm0 4.13 6.72 11.62h-3.9L12 12.35 9.18 17.5h-3.9zM12 14.4l1.79 3.1h-3.58z",
};

/** OpenCode — bracketed terminal caret. */
const OPENCODE_FALLBACK: Brand = {
  title: "OpenCode",
  hex: "F97316",
  path: "M3 3h6v2H5v14h4v2H3zm18 0v18h-6v-2h4V5h-4V3zM8.6 15.4 7.2 14l3.4-3.4L7.2 7.2 8.6 5.8l4.8 4.8z",
};

/** NLTK — a language / speech bubble (NLP toolkit). */
const NLTK: Brand = {
  title: "NLTK",
  hex: "4F9DDE",
  path: "M4 4h16a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-8l-5 4v-4H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z",
};

/** REST — the braces that wrap every API payload. */
const REST: Brand = {
  title: "REST",
  hex: "22D3EE",
  path: "M8 4c-1.7 0-2.5.9-2.5 2.6v2c0 1-.5 1.4-1.5 1.4v2c1 0 1.5.4 1.5 1.4v2C5.5 19.1 6.3 20 8 20v-2c-.6 0-.8-.3-.8-.9v-2c0-1-.5-1.6-1.2-2 .7-.4 1.2-1 1.2-2v-2c0-.6.2-.9.8-.9zM16 4c1.7 0 2.5.9 2.5 2.6v2c0 1 .5 1.4 1.5 1.4v2c-1 0-1.5.4-1.5 1.4v2c0 1.7-.8 2.6-2.5 2.6v-2c.6 0 .8-.3.8-.9v-2c0-1 .5-1.6 1.2-2-.7-.4-1.2-1-1.2-2v-2c0-.6-.2-.9-.8-.9z",
};

/** WebSockets — a full-duplex exchange arrow pair. */
const WEBSOCKETS: Brand = {
  title: "WebSockets",
  hex: "818CF8",
  path: "M4 8h11V5l5 4-5 4v-3H4zM20 16H9v3l-5-4 5-4v3h11z",
};

/* ---- registry ---------------------------------------------------------- */

export const BRANDS: Record<string, Brand> = {
  // languages
  Java: from(si.siOpenjdk, { title: "Java", hex: "F89820" }),
  Python: from(si.siPython),
  JavaScript: from(si.siJavascript),
  SQL: from(si.siMysql, { title: "SQL", hex: "9CA3AF" }),

  // ai / ml
  TensorFlow: from(si.siTensorflow),
  "TensorFlow Lite": from(si.siTensorflow, { title: "TensorFlow Lite" }),
  "Scikit-learn": from(si.siScikitlearn),
  Pandas: from(si.siPandas, { hex: "8B7FD4" }),
  NumPy: from(si.siNumpy, { hex: "4D77CF" }),
  NLTK,
  Jupyter: from(si.siJupyter),
  "Jupyter Notebook": from(si.siJupyter, { title: "Jupyter Notebook" }),

  // backend / web
  FastAPI: from(si.siFastapi),
  Streamlit: from(si.siStreamlit),
  "Android Studio": from(si.siAndroidstudio),
  Kotlin: from(si.siKotlin),
  HTML5: from(si.siHtml5),

  // databases
  MySQL: from(si.siMysql),
  MongoDB: from(si.siMongodb),
  SQLite: from(si.siSqlite, { hex: "4A9DD4" }),
  PostgreSQL: from(si.siPostgresql, { hex: "6C8EE8" }),
  Supabase: from(si.siSupabase),

  // devops
  Git: from(si.siGit),
  GitHub: from(si.siGithub, { hex: "E6E6E6" }),
  Jenkins: from(si.siJenkins),
  Maven: from(si.siApachemaven, { title: "Maven", hex: "E05C68" }),
  Gradle: from(si.siGradle, { hex: "5FA8B8" }),
  Vercel: from(si.siVercel, { hex: "FFFFFF" }),
  Render: from(si.siRender, { hex: "46E3B7" }),
  Linux: from(si.siLinux),
  Docker: from(si.siDocker),

  // ai development tools
  ChatGPT: CHATGPT,
  "Claude Code": si.siClaudecode
    ? from(si.siClaudecode, { title: "Claude Code", hex: "D97757" })
    : from(si.siClaude, { title: "Claude Code" }),
  OpenCode: si.siOpencode ? from(si.siOpencode, { hex: "F97316" }) : OPENCODE_FALLBACK,
  Stitch: STITCH,
  Antigravity: ANTIGRAVITY,

  // protocols
  MCP: from(si.siModelcontextprotocol, { title: "MCP", hex: "C4B5FD" }),
  REST,
  WebSockets: WEBSOCKETS,
};

export function getBrand(name: string): Brand | null {
  return BRANDS[name] ?? null;
}

/** Renders a brand mark; falls back to a monogram when no logo exists. */
export function BrandMark({
  name,
  size = 22,
  className = "",
  colored = true,
}: {
  name: string;
  size?: number;
  className?: string;
  colored?: boolean;
}) {
  const brand = getBrand(name);

  if (!brand) {
    return (
      <span
        className={`grid place-items-center rounded-md bg-[#EDE9E0]/10 font-mono font-bold text-white/70 ${className}`}
        style={{ width: size, height: size, fontSize: size * 0.5 }}
        aria-hidden
      >
        {name.slice(0, 1)}
      </span>
    );
  }

  return (
    <svg
      role="img"
      aria-label={brand.title}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill={colored ? `#${brand.hex}` : "currentColor"}
    >
      <path d={brand.path} />
    </svg>
  );
}


