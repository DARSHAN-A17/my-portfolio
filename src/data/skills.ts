import type { SkillGroup } from "../types";

/**
 * Skills grouped into the categories the portfolio presents on-page — every
 * category is shown at once (no tabs). `name` values match the BrandMark
 * registry so each tool renders its real logo.
 */
export const skillGroups: SkillGroup[] = [
  {
    id: "languages",
    title: "Languages",
    description: "The core I build in",
    accent: "#B87333",
    skills: [
      { name: "Java", description: "OOP • DSA • Android" },
      { name: "Python", description: "ML • backend • automation" },
      { name: "JavaScript", description: "Web • interactivity" },
      { name: "Kotlin", description: "Modern Android" },
      { name: "SQL", description: "Modeling • queries" },
    ],
  },
  {
    id: "ai-ml",
    title: "AI / ML",
    description: "Models & data",
    accent: "#B87333",
    skills: [
      { name: "TensorFlow", description: "Deep learning" },
      { name: "TensorFlow Lite", description: "On-device inference" },
      { name: "Scikit-learn", description: "Classical ML" },
      { name: "Pandas", description: "Data wrangling" },
      { name: "NumPy", description: "Numerics" },
      { name: "NLTK", description: "NLP toolkit" },
    ],
  },
  {
    id: "backend",
    title: "Backend",
    description: "APIs & applications",
    accent: "#B87333",
    skills: [
      { name: "FastAPI", description: "Async Python APIs" },
      { name: "Streamlit", description: "Data-driven apps" },
      { name: "Android Studio", description: "Native Android" },
      { name: "Jupyter", description: "Experiments" },
    ],
  },
  {
    id: "database",
    title: "Database",
    description: "Where the data lives",
    accent: "#34d399",
    skills: [
      { name: "MySQL", description: "Relational" },
      { name: "PostgreSQL", description: "Advanced SQL" },
      { name: "MongoDB", description: "Document store" },
      { name: "SQLite", description: "Embedded • mobile" },
      { name: "Supabase", description: "Postgres + auth" },
    ],
  },
  {
    id: "devops",
    title: "DevOps / Deployment",
    description: "Ship it reliably",
    accent: "#fbbf24",
    skills: [
      { name: "Git", description: "Version control" },
      { name: "GitHub", description: "Source + CI" },
      { name: "Jenkins", description: "CI/CD pipelines" },
      { name: "Maven", description: "Java builds" },
      { name: "Gradle", description: "Build automation" },
      { name: "Vercel", description: "Edge deploys" },
      { name: "Render", description: "Cloud hosting" },
      { name: "Linux", description: "Systems fundamentals" },
    ],
  },
  {
    id: "ai-tools",
    title: "AI Development Tools",
    description: "How I build faster",
    accent: "#f472b6",
    skills: [
      { name: "ChatGPT", description: "Reasoning • drafts" },
      { name: "Claude Code", description: "Agentic coding" },
      { name: "OpenCode", description: "Terminal agent" },
      { name: "Stitch", description: "UI generation" },
      { name: "Antigravity", description: "Agentic IDE" },
    ],
  },
  {
    id: "protocols",
    title: "Protocols",
    description: "How systems talk",
    accent: "#B87333",
    skills: [
      { name: "MCP", description: "Model Context Protocol" },
      { name: "REST", description: "HTTP APIs" },
      { name: "WebSockets", description: "Realtime streams" },
    ],
  },
];





