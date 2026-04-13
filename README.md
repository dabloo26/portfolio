# Abhyansh Anand — Portfolio

Personal portfolio site for my M.S. Data Science profile: projects, experience, skills, and ways to get in touch.

Live site: `https://dabloo26.github.io/portfolio/`

## What this repo is

This is a single-page portfolio built with React + Vite and styled with Tailwind.  
It is designed to highlight both analytics/ML work and data platform engineering work in one place.

Main sections:
- Hero + animated visual backdrop
- About
- Experience timeline
- Skills grouped by Analytics / ML / Engineering
- Key impact metrics
- Project showcase + full projects page
- Contact

## Tech stack

- React 18 + TypeScript
- Vite 5
- Tailwind CSS
- Framer Motion
- React Router
- Three.js / React Three Fiber (`@react-three/fiber`, `@react-three/drei`)

## Run locally

```bash
npm install
npm run dev
```

Local dev server starts on Vite default (usually `http://localhost:5173`).

## Build

```bash
npm run build
npm run preview
```

Notes:
- `npm run build` runs `tsc --noEmit` first.
- The build script also copies `dist/index.html` to `dist/404.html` for static-host routing fallback.

## Project highlights included

- Resume chat app with fast session recovery (AWS Lambda + DynamoDB + S3, React frontend)
- English-Hindi NMT (Transformer-based, PyTorch)
- E-commerce analytics platform (Snowflake + Python ETL + Power BI)
- KPI anomaly monitoring pipeline
- Healthcare fraud triage workflow

## Deploy

Currently set up for static deployment (GitHub Pages style pathing is used in the app).  
`vercel.json` is also present for alternate hosting workflows.

## Contact

- LinkedIn: `https://www.linkedin.com/in/abhyansh/`
- GitHub: `https://github.com/dabloo26`
- Resume (view): `https://drive.google.com/file/d/1hGrSMSyIVpUUVCgJqpe1qjtwA86YiJS8/view?usp=sharing`

---

If you are a recruiter, hiring manager, or collaborator and want a walkthrough of any project here, feel free to reach out.
