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
  title: string;
  period: string;
  bullets: string[];
  analyst: number;
  scientist: number;
  engineer: number;
};

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
  rolesLabel: "Data Science · Analytics · ML Engineering · Data Platforms",
  email: "abhyanshsri@gmail.com",
  phone: "+1 (240) 467-1567",
  linkedin: "https://www.linkedin.com/in/abhyansh-anand",
  github: "https://github.com/dabloo26",
  location: "College Park, MD",
  /** Served from /public — swap PDF anytime. */
  resumeUrl: "/resume.pdf",
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

export const heroCopy: Record<
  Role,
  {
    headline: string;
    sub: string;
    ctaPrimary: string;
    ctaSecondary: string;
    ctaSecondaryHref: string;
  }
> = {
  analyst: {
    headline:
      "From messy operational data to clear KPIs, dashboards, and decisions people actually use.",
    sub: "I like owning the full analytics loop: validation, SQL modeling, Tableau / Power BI storytelling, and the stakeholder conversations that make metrics trustworthy.",
    ctaPrimary: "See analytics & BI work",
    ctaSecondary: "Download resume",
    ctaSecondaryHref: person.resumeUrl,
  },
  scientist: {
    headline:
      "Models that are measurable in the real world — not just accurate in a notebook.",
    sub: "My sweet spot is careful feature work, honest evaluation (precision/recall, PR-AUC, error analysis), and lightweight experimentation so teams know what changed when they ship.",
    ctaPrimary: "See ML & DS projects",
    ctaSecondary: "Email me",
    ctaSecondaryHref: `mailto:${person.email}`,
  },
  engineer: {
    headline:
      "Pipelines and platforms that stay boring under pressure — because reliability is a feature.",
    sub: "I have shipped migrations and ingestion on Snowflake / Synapse / AWS, tightened CI/CD for data releases, and built services that stay fast when traffic spikes.",
    ctaPrimary: "See systems & backend work",
    ctaSecondary: "LinkedIn",
    ctaSecondaryHref: person.linkedin,
  },
};

export const aboutParagraphs = [
  "I am an M.S. Data Science student at UMD (expected May 2026) with a consulting background at PwC and earlier engineering work at Infosys. The through-line is the same: make data easier to trust, faster to query, and clearer to act on — whether the interface is a dashboard, a model score, or an API.",
  "At Maryland I have worked on student success analytics end-to-end: validated ingestion for 200+ student records, Tableau views for cohort and risk signals, and an early-warning classifier (logistic regression, cross-validated) that reached 82% precision with an A/B loop to study intervention impact. On the industry side I have migrated enterprise warehouses (Teradata → Snowflake), hardened ETL with CI/CD, and built ingestion layers that feed Power BI and downstream applications.",
  "This portfolio is intentionally one URL. Use the Role Lens (or add ?lens=analyst | scientist | engineer to the link) to emphasize the slice of my work that best matches the job — without maintaining three separate sites.",
];

export const skills: Skill[] = [
  {
    name: "SQL, stored procedures & relational modeling",
    category: "analytics",
    analyst: 100,
    scientist: 85,
    engineer: 88,
  },
  {
    name: "Power BI & DAX; Tableau storytelling",
    category: "analytics",
    analyst: 100,
    scientist: 70,
    engineer: 55,
  },
  {
    name: "Python analytics stack (pandas, NumPy, visualization)",
    category: "analytics",
    analyst: 98,
    scientist: 92,
    engineer: 78,
  },
  {
    name: "KPI design, statistical checks & A/B testing",
    category: "analytics",
    analyst: 95,
    scientist: 90,
    engineer: 50,
  },
  {
    name: "scikit-learn pipelines, tuning & debugging",
    category: "ml",
    analyst: 65,
    scientist: 100,
    engineer: 72,
  },
  {
    name: "PyTorch / TensorFlow & Transformer-style models",
    category: "ml",
    analyst: 45,
    scientist: 100,
    engineer: 62,
  },
  {
    name: "XGBoost, imbalance handling, PR-AUC / ranking",
    category: "ml",
    analyst: 55,
    scientist: 100,
    engineer: 58,
  },
  {
    name: "NLP, Hugging Face, RAG & LLM application patterns",
    category: "ml",
    analyst: 40,
    scientist: 98,
    engineer: 70,
  },
  {
    name: "Explainability (SHAP) & investigator-facing UIs",
    category: "ml",
    analyst: 50,
    scientist: 95,
    engineer: 45,
  },
  {
    name: "Snowflake, Synapse & warehouse performance tuning",
    category: "engineering",
    analyst: 72,
    scientist: 68,
    engineer: 100,
  },
  {
    name: "Informatica IICS, ADF-style ETL & migrations",
    category: "engineering",
    analyst: 70,
    scientist: 65,
    engineer: 100,
  },
  {
    name: "AWS (Lambda, API Gateway, S3, DynamoDB, ECS)",
    category: "engineering",
    analyst: 55,
    scientist: 75,
    engineer: 100,
  },
  {
    name: "Docker, Kubernetes (HPA) & GitHub Actions CI/CD",
    category: "engineering",
    analyst: 45,
    scientist: 70,
    engineer: 100,
  },
  {
    name: "FastAPI / REST services, Redis, observability",
    category: "engineering",
    analyst: 40,
    scientist: 65,
    engineer: 98,
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
      "0.93 PR-AUC with SHAP-backed narratives and a Streamlit triage UI ranked by estimated fraud-dollar exposure for investigators.",
    tech: ["Python", "XGBoost", "SHAP", "Streamlit", "scikit-learn"],
    analyst: 60,
    scientist: 100,
    engineer: 50,
  },
];

export const experience: ExperienceItem[] = [
  {
    id: "umd",
    company: "University of Maryland, College Park",
    title: "Graduate researcher — student success analytics & ML",
    period: "Dec 2024 — Present",
    bullets: [
      "Built an automated Python pipeline for 200+ student records with schema validation, deduplication, and anomaly checks — improving record accuracy ~10%, cutting prep overhead ~40%, and creating a structured foundation for dashboards and model training.",
      "Shipped Tableau dashboards for cohort trends and at-risk course signals, shortening identification cycles ~15% and supporting accessibility-focused reporting with faculty and department leadership.",
      "Trained a cross-validated logistic regression early-warning model on grade and attendance features (82% precision) with an advisor-facing scoring interface and an A/B framework that logs intervention outcomes for policy iteration.",
    ],
    analyst: 100,
    scientist: 98,
    engineer: 88,
  },
  {
    id: "cornell",
    company: "Cornell University",
    title: "Teaching assistant — data science & machine learning",
    period: "May 2025 — Aug 2025",
    bullets: [
      "Designed labs and coursework for introductory data science and ML engineering tracks (100+ students), emphasizing reproducible workflows, EDA, and scikit-learn pipelines.",
      "Coached debugging using bias–variance framing and proper evaluation metrics, helping lift assessment scores by ~18%.",
    ],
    analyst: 85,
    scientist: 100,
    engineer: 72,
  },
  {
    id: "pwc2",
    company: "PwC",
    title: "Technology consultant (Associate 2)",
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
    period: "Sep 2021 — Aug 2022",
    bullets: [
      "Led Teradata → Snowflake migration for ConocoPhillips Canada with parameterized Informatica IICS mappings and full schema reconciliation — zero critical errors and under 2 hours downtime.",
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
    title: "Software engineering intern",
    period: "Jan 2021 — May 2021",
    bullets: [
      "Developed Angular modules with reactive forms and RxJS (lazy loading, OnPush), improving perceived performance ~30% on a large enterprise portal.",
      "Shipped ASP.NET Core REST APIs with Entity Framework and SQL Server using repository + DI patterns, reducing average API latency ~25%.",
      "Profiled multi-source datasets with Python and SQL, isolating top drivers of reporting inaccuracy and cutting error rates ~15% via targeted fixes and scorecards.",
    ],
    analyst: 70,
    scientist: 65,
    engineer: 95,
  },
];

export function scoreForRole<T extends { analyst: number; scientist: number; engineer: number }>(
  item: T,
  role: Role
): number {
  return item[role];
}

export function sortByRole<T extends { analyst: number; scientist: number; engineer: number }>(
  items: T[],
  role: Role
): T[] {
  return [...items].sort((a, b) => scoreForRole(b, role) - scoreForRole(a, role));
}
