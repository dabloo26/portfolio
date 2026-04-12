export type Role = "analyst" | "scientist" | "engineer";

export type SkillCategory = "analytics" | "ml" | "engineering";

export type Skill = {
  name: string;
  category: SkillCategory;
  analyst: number;
  scientist: number;
  engineer: number;
};

export type Project = {
  id: string;
  title: string;
  summary: string;
  impact: string;
  tech: string[];
  analyst: number;
  scientist: number;
  engineer: number;
  link?: string;
};

export type ExperienceItem = {
  id: string;
  company: string;
  /** Default title when no role-specific override. */
  title: string;
  /** Reverse-chronological rank (higher = more recent). Used for ordering only. */
  chronology: number;
  period: string;
  bullets: string[];
  /** Optional per–role lens titles (e.g. Infosys: analyst vs software). */
  titles?: Partial<Record<Role, string>>;
  /** Optional per–role bullet sets. */
  bulletsByRole?: Partial<Record<Role, string[]>>;
  /** Shown under the date range when roles overlap (e.g. concurrent with UMD). */
  timelineNote?: string;
  analyst: number;
  scientist: number;
  engineer: number;
};

export function experienceTitle(job: ExperienceItem): string {
  return job.title;
}

export function experienceBullets(job: ExperienceItem): string[] {
  return job.bullets;
}

export type EducationItem = {
  school: string;
  degree: string;
  detail: string;
};

/** Public GitHub repos to spotlight (subset of github.com/dabloo26). */
export type GithubRepoHighlight = {
  id: string;
  name: string;
  description: string;
  url: string;
  analyst: number;
  scientist: number;
  engineer: number;
};

export const person = {
  name: "Abhyansh Anand",
  rolesLabel: "Data Science · Analytics · ML · Data Platforms & Engineering",
  email: "abhyanshsri@gmail.com",
  phone: "+1 (240) 467-1567",
  linkedin: "https://www.linkedin.com/in/abhyansh-anand",
  github: "https://github.com/dabloo26",
  location: "College Park, MD",
  /** Served from `public/resume.pdf`; path respects Vite `base` (e.g. GitHub Pages project sites). */
  resumeUrl: `${import.meta.env.BASE_URL.replace(/\/?$/, "/")}resume.pdf`,
};

export const githubHighlights: GithubRepoHighlight[] = [
  {
    id: "resume-chat-fast-recovery",
    name: "resume-chat-fast-recovery",
    description:
      "UMD DATA650 — serverless resume editor on AWS (FastAPI/Lambda, React on CloudFront, DynamoDB + S3 session recovery, debounced autosave).",
    url: "https://github.com/dabloo26/resume-chat-fast-recovery",
    analyst: 55,
    scientist: 72,
    engineer: 100,
  },
  {
    id: "nmt-english-hindi",
    name: "nmt-english-hindi",
    description:
      "DATA641 capstone — English–Hindi Transformer NMT (PyTorch), BPE tokenization, evaluation harness, Streamlit demo.",
    url: "https://github.com/dabloo26/nmt-english-hindi",
    analyst: 35,
    scientist: 100,
    engineer: 50,
  },
  {
    id: "google-forms-automation",
    name: "google-forms-automation",
    description:
      "Selenium-based automation for reliable Google Forms submission workflows with structured logging and retries.",
    url: "https://github.com/dabloo26/google-forms-automation",
    analyst: 40,
    scientist: 45,
    engineer: 85,
  },
  {
    id: "ds-java",
    name: "DS-Java",
    description:
      "Java solutions for data structures & algorithms coursework — clean patterns for interviews and fundamentals.",
    url: "https://github.com/dabloo26/DS-Java",
    analyst: 30,
    scientist: 40,
    engineer: 55,
  },
];

export const education: EducationItem[] = [
  {
    school: "University of Maryland, College Park",
    degree: "M.S. Data Science (expected May 2026)",
    detail:
      "Graduate GPA 3.86 (3.855 cumulative on transcript). Coursework includes Probability & Statistics, Machine Learning, NLP, Big Data Systems, Algorithms for Data Science, Data Representation & Modeling, and Cloud Computing.",
  },
  {
    school: "Nitte Meenakshi Institute of Technology, Bangalore",
    degree: "B.E. Computer Science (2021)",
    detail:
      "GPA 3.5/4.0. Coursework includes AI & Neural Networks, Data Mining, and Big Data & Operating Systems.",
  },
];

/** Single landing narrative — analytics & data science first, with engineering depth. */
export const heroCopy = {
  headline:
    "Analytics and data science in production — trusted metrics, honest models, and platforms that stay reliable under load.",
  sub: "I work across SQL, BI, and experimentation, ML evaluation and triage UIs, plus the engineering glue many analytics projects need: warehouses, ETL/CI/CD, APIs, and cloud services. Consulting at PwC and research at UMD sharpened both stakeholder storytelling and technical rigor.",
  ctaPrimary: "See projects & impact",
  ctaSecondary: "Download resume",
  ctaSecondaryHref: person.resumeUrl,
};

export type KeyImpactMetric = {
  value: string;
  suffix: string;
  /** Factual line — tied to `projects` / `experience` copy below. */
  label: string;
  href?: string;
};

export const keyImpactTitle = "Key Impact";

export const keyImpactEyebrow = "By the numbers";

export type KeyImpactCardDisplay = {
  icon: "bars" | "ring" | "nodes" | "flask";
  value: string;
  suffix: string;
  shortLabel: string;
  href: string;
  /** Long copy for tooltips / accessibility */
  detail: string;
};

/** Header tagline (single page — no role toggles). */
export const siteTagline =
  "Analytics · ML · evaluation · warehouses · APIs · CI/CD";

export const aboutParagraphs = [
  "I am an M.S. Data Science student at UMD (expected May 2026) with a consulting background at PwC and earlier engineering work at Infosys. The through-line is the same: make data easier to trust, faster to query, and clearer to act on — whether the interface is a dashboard, a model score, or an API.",
  "At Maryland I have worked on student success analytics end-to-end: validated ingestion for 200+ student records, Tableau views for cohort and risk signals, and an early-warning classifier (logistic regression, cross-validated) that reached 82% precision with an A/B loop to study intervention impact. On the industry side I have migrated enterprise warehouses (Teradata → Snowflake), hardened ETL with CI/CD, and built ingestion layers that feed Power BI and downstream applications.",
];

/**
 * Weights are self-assessed for an M.S. Data Science student (UMD) with PwC + project experience —
 * strong where coursework + work overlap; honest where depth is still growing.
 */
export const skills: Skill[] = [
  {
    name: "SQL, stored procedures & relational modeling",
    category: "analytics",
    analyst: 88,
    scientist: 80,
    engineer: 82,
  },
  {
    name: "Power BI & DAX; Tableau storytelling",
    category: "analytics",
    analyst: 86,
    scientist: 72,
    engineer: 58,
  },
  {
    name: "Python analytics stack (pandas, NumPy, visualization)",
    category: "analytics",
    analyst: 90,
    scientist: 84,
    engineer: 70,
  },
  {
    name: "KPI design, statistical checks & A/B testing",
    category: "analytics",
    analyst: 82,
    scientist: 78,
    engineer: 52,
  },
  {
    name: "scikit-learn pipelines, tuning & debugging",
    category: "ml",
    analyst: 62,
    scientist: 78,
    engineer: 60,
  },
  {
    name: "PyTorch / TensorFlow & Transformer-style models",
    category: "ml",
    analyst: 48,
    scientist: 70,
    engineer: 58,
  },
  {
    name: "XGBoost, imbalance handling, ranking & calibration",
    category: "ml",
    analyst: 55,
    scientist: 72,
    engineer: 54,
  },
  {
    name: "NLP, Hugging Face, RAG & LLM application patterns",
    category: "ml",
    analyst: 42,
    scientist: 68,
    engineer: 58,
  },
  {
    name: "Explainability (SHAP) & investigator-facing UIs",
    category: "ml",
    analyst: 50,
    scientist: 66,
    engineer: 48,
  },
  {
    name: "Snowflake, Synapse & warehouse performance tuning",
    category: "engineering",
    analyst: 68,
    scientist: 62,
    engineer: 88,
  },
  {
    name: "Informatica IICS, ADF-style ETL & migrations",
    category: "engineering",
    analyst: 62,
    scientist: 58,
    engineer: 90,
  },
  {
    name: "AWS (Lambda, API Gateway, S3, DynamoDB, ECS)",
    category: "engineering",
    analyst: 52,
    scientist: 62,
    engineer: 68,
  },
  {
    name: "Docker, Kubernetes (HPA) & GitHub Actions CI/CD",
    category: "engineering",
    analyst: 44,
    scientist: 58,
    engineer: 66,
  },
  {
    name: "FastAPI / REST services, Redis, observability",
    category: "engineering",
    analyst: 42,
    scientist: 56,
    engineer: 64,
  },
];

export const projects: Project[] = [
  {
    id: "resume-chat",
    title: "Resume Chat with fast session recovery",
    summary:
      "Serverless full-stack app on AWS: FastAPI on Lambda, React/TypeScript on CloudFront, DynamoDB for hot state with S3 JSON snapshots as a cold fallback.",
    impact:
      "Debounced autosave, sub-200ms session rehydration on cache miss, and stress-tested parity across cloud vs. local latency — built to survive crashes and device switches without losing work.",
    tech: ["AWS Lambda", "API Gateway", "DynamoDB", "S3", "FastAPI", "React", "TypeScript"],
    analyst: 55,
    scientist: 70,
    engineer: 100,
    link: "https://github.com/dabloo26/resume-chat-fast-recovery",
  },
  {
    id: "rate-limit",
    title: "Distributed rate limiting service",
    summary:
      "Multi-algorithm limiter (token bucket, sliding window, fixed window) on AWS ECS behind API Gateway with atomic Lua scripts in Redis and DynamoDB fallback.",
    impact:
      "Sustained ~10K req/s at sub-5ms p99 in Locust tests; Kubernetes HPA reduced degradation ~60% during spikes; GitHub Actions CI/CD cut release steps from 8 to 1.",
    tech: ["AWS ECS", "Redis", "DynamoDB", "Docker", "Kubernetes", "Locust", "GitHub Actions"],
    analyst: 35,
    scientist: 50,
    engineer: 100,
  },
  {
    id: "ecom",
    title: "E-commerce sales analytics platform",
    summary:
      "Star-schema design in Snowflake with a Python ETL pipeline ingesting 1M+ transactions; analytical SQL with window functions and CTEs for revenue, retention, and margin views.",
    impact:
      "Power BI dashboard with DAX across 12 KPIs (AOV, CLV, MoM growth) with executive-to-SKU drill paths for finance and merchandising conversations.",
    tech: ["Snowflake", "Python", "SQL", "Power BI", "DAX"],
    analyst: 100,
    scientist: 55,
    engineer: 85,
  },
  {
    id: "kpi-anomaly",
    title: "Automated KPI monitoring & anomaly detection",
    summary:
      "Python pipeline pulling daily metrics from PostgreSQL with z-score and IQR detectors, automated summaries, and Tableau views with baselines and confidence bands.",
    impact:
      "Surfaced outliers in context so analysts could triage data-quality issues quickly instead of discovering them late in monthly closes.",
    tech: ["Python", "PostgreSQL", "Tableau", "Statistics"],
    analyst: 100,
    scientist: 80,
    engineer: 70,
  },
  {
    id: "nmt",
    title: "English–Hindi neural machine translation",
    summary:
      "Transformer (4 layers, 256-dim, 8 heads) on 310K IIT Bombay sentence pairs with BPE tokenization (8K vocab) and SVO→SOV reordering; evaluated by length and complexity buckets.",
    impact:
      "Achieved BLEU 16.48 and chrF 38.96; packaged as an interactive Streamlit app for qualitative review and demos.",
    tech: ["PyTorch", "Transformers", "Streamlit", "NLP"],
    analyst: 30,
    scientist: 100,
    engineer: 45,
    link: "https://github.com/dabloo26/nmt-english-hindi",
  },
  {
    id: "fraud",
    title: "Healthcare fraud detection & risk triage",
    summary:
      "XGBoost + Isolation Forest on CMS-style Medicare claims with provider-level behavioral features; cost-sensitive learning under ~6% fraud prevalence.",
    impact:
      "SHAP-backed claim rankings and a Streamlit triage UI ordered by estimated fraud-dollar exposure; cost-sensitive training under ~6% prevalence with held-out validation.",
    tech: ["Python", "XGBoost", "SHAP", "Streamlit", "scikit-learn"],
    analyst: 60,
    scientist: 100,
    engineer: 50,
  },
];

/**
 * Timeline top-to-bottom: most recent *start* among overlapping roles first (Cornell TA began May 2025
 * while UMD continued from Dec 2024), then UMD, then earlier roles.
 */
export const experience: ExperienceItem[] = [
  {
    id: "cornell",
    company: "Cornell University",
    title: "Teaching assistant — data science & machine learning",
    chronology: 5,
    period: "May 2025 — Aug 2025",
    timelineNote: "Concurrent with UMD (graduate program ongoing).",
    bullets: [
      "Designed labs and coursework for introductory data science and ML engineering tracks (100+ students), emphasizing reproducible workflows, EDA, and scikit-learn pipelines.",
      "Coached debugging using bias–variance framing and proper evaluation metrics, helping lift assessment scores by ~18%.",
    ],
    analyst: 85,
    scientist: 100,
    engineer: 72,
  },
  {
    id: "umd",
    company: "University of Maryland, College Park",
    title: "Graduate researcher — analytics, ML & student success",
    chronology: 4,
    period: "Dec 2024 — Present",
    bullets: [
      "Built an automated Python pipeline for 200+ student records with schema validation, deduplication, and anomaly checks, improving record accuracy ~10%, cutting prep overhead ~40%, and creating a structured foundation for dashboards and model training.",
      "Shipped Tableau dashboards for cohort trends and at-risk course signals, shortening identification cycles ~15% and supporting accessibility-focused reporting with faculty and department leadership.",
      "Trained a cross-validated logistic regression early-warning model on grade and attendance features (82% precision) with an advisor-facing scoring interface and an A/B framework that logs intervention outcomes for policy iteration.",
    ],
    analyst: 100,
    scientist: 98,
    engineer: 88,
  },
  {
    id: "pwc2",
    company: "PwC",
    title: "Technology consultant (Associate 2)",
    chronology: 3,
    period: "Aug 2022 — Nov 2023",
    bullets: [
      "Owned a standardized SQL-based profiling and ingestion layer across financial source systems for PepsiCo North America, reducing downstream transformation failures ~30%.",
      "Built a modular Python ingestion service on Azure with pluggable connectors, schema validation, and fault-tolerant handling; landed curated Synapse tables powering Power BI and a Java chatbot.",
      "Engineered NLP parsers for unstructured fields where needed, unlocking ~20% more feature-eligible data and instrumented observability in Power BI that cut manual monitoring effort ~35%.",
    ],
    analyst: 88,
    scientist: 82,
    engineer: 100,
  },
  {
    id: "pwc1",
    company: "PwC",
    title: "Technology consultant (Associate 1)",
    chronology: 2,
    period: "Sep 2021 — Aug 2022",
    bullets: [
      "Led Teradata → Snowflake migration for ConocoPhillips Canada with parameterized Informatica IICS mappings and full schema reconciliation, with zero critical errors and under 2 hours downtime.",
      "Tuned warehouse sizing and clustering to raise ETL throughput ~35% and cut query latency ~50–60%; introduced CI/CD for IICS releases, shrinking release cycles from days to hours.",
      "Enabled self-serve analytics on Snowflake, reducing ad-hoc data request turnaround from days to under an hour.",
    ],
    analyst: 80,
    scientist: 70,
    engineer: 100,
  },
  {
    id: "infosys",
    company: "Infosys",
    title: "Software engineering intern — full-stack & data quality",
    chronology: 1,
    period: "Jan 2021 — May 2021",
    bullets: [
      "Developed Angular modules with reactive forms and RxJS (lazy loading, OnPush), improving perceived performance ~30% on a large enterprise portal.",
      "Shipped ASP.NET Core REST APIs with Entity Framework and SQL Server using repository + DI patterns, reducing average API latency ~25%.",
      "Profiled multi-source datasets with Python and SQL; isolated drivers of reporting inaccuracy and cut error rates ~15% with targeted fixes and stakeholder-facing scorecards.",
    ],
    analyst: 70,
    scientist: 65,
    engineer: 95,
  },
];

export function getKeyImpactMetrics(): KeyImpactMetric[] {
  const titles = projects.map((p) => p.title);
  const ecom = projects.find((p) => p.id === "ecom");
  const rateLimit = projects.find((p) => p.id === "rate-limit");
  const kpi = projects.find((p) => p.id === "kpi-anomaly");
  const umd = experience.find((e) => e.id === "umd");
  const pwc2 = experience.find((e) => e.id === "pwc2");
  const pwc1 = experience.find((e) => e.id === "pwc1");

  const pipelineMilestones = [
    umd?.bullets[0],
    pwc2?.bullets[0],
    pwc2?.bullets[1],
    pwc1?.bullets[0],
    kpi?.summary,
  ].filter((s): s is string => Boolean(s));

  const pipelineCount = pipelineMilestones.length;

  return [
    {
      value: String(projects.length),
      suffix: "",
      label: titles.join(" · "),
      href: "/#projects",
    },
    {
      value: "1M",
      suffix: "+",
      label: ecom ? `${ecom.summary} ${ecom.impact}` : "",
      href: "/#project-ecom",
    },
    {
      value: String(pipelineCount),
      suffix: "",
      label: pipelineMilestones.join(" · "),
      href: "/#experience",
    },
    {
      value: "10",
      suffix: "K+",
      label: rateLimit ? rateLimit.impact : "",
      href: "/#project-rate-limit",
    },
  ];
}

/** Compact tiles for the Key Impact strip; numbers + links stay tied to `getKeyImpactMetrics()`. */
export function getKeyImpactDisplayCards(): KeyImpactCardDisplay[] {
  const m = getKeyImpactMetrics();
  return [
    {
      icon: "bars",
      value: m[0].value,
      suffix: "+",
      shortLabel: "End-to-end shipped builds",
      href: m[0].href ?? "/#projects",
      detail: "Full-stack and analytics projects across AWS, Snowflake, ML, and more",
    },
    {
      icon: "ring",
      value: m[1].value,
      suffix: m[1].suffix,
      shortLabel: "Rows modeled (warehouse)",
      href: m[1].href ?? "/#project-ecom",
      detail: "Snowflake star schema, Python ETL, Power BI executive KPIs",
    },
    {
      icon: "nodes",
      value: m[2].value,
      suffix: "+",
      shortLabel: "Data programs owned",
      href: m[2].href ?? "/#experience",
      detail: "Ingestion, validation, and ETL across UMD, PwC, and KPI automation",
    },
    {
      icon: "flask",
      value: m[3].value,
      suffix: m[3].suffix,
      shortLabel: "Peak sustained load (tested)",
      href: m[3].href ?? "/#project-rate-limit",
      detail: "Distributed limiter on ECS — Locust, Redis, HPA",
    },
  ];
}

/** Emphasizes analytics & data science while keeping some engineering weight. */
export function primaryFocusScore<T extends { analyst: number; scientist: number; engineer: number }>(
  item: T
): number {
  return Math.round(0.5 * item.analyst + 0.35 * item.scientist + 0.15 * item.engineer);
}

export function sortByPrimaryFocus<T extends { analyst: number; scientist: number; engineer: number }>(
  items: T[]
): T[] {
  return [...items].sort((a, b) => primaryFocusScore(b) - primaryFocusScore(a));
}

/** @deprecated use primaryFocusScore */
export function scoreForRole<T extends { analyst: number; scientist: number; engineer: number }>(
  item: T,
  _role: Role
): number {
  void _role;
  return primaryFocusScore(item);
}

/** @deprecated use sortByPrimaryFocus */
export function sortByRole<T extends { analyst: number; scientist: number; engineer: number }>(
  items: T[],
  _role?: Role
): T[] {
  void _role;
  return sortByPrimaryFocus(items);
}

/** Short label for hero marquee — first clause of skill name, role-ranked. */
function shortenSkillLabel(name: string): string {
  const first = name.split(";")[0]?.trim() ?? name;
  const chunk = first.split(",")[0]?.trim() ?? first;
  return chunk.length > 48 ? `${chunk.slice(0, 46)}…` : chunk;
}

/** Skill strip for the landing ticker — ranked for analytics / DS + platforms. */
export function getHeroTickerText(): string {
  const top = sortByPrimaryFocus(skills).slice(0, 11);
  return top.map((s) => shortenSkillLabel(s.name)).join(" · ");
}
