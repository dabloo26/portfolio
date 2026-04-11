import { motion } from "framer-motion";
import { person } from "../data/profile";
import { RoleLens } from "./RoleLens";

const links = [
  ["About", "#about"],
  ["Skills", "#skills"],
  ["Projects", "#projects"],
  ["Experience", "#experience"],
  ["Contact", "#contact"],
] as const;

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-ink-950/70 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <a
          href="#top"
          className="group flex items-baseline gap-2 text-sm font-medium tracking-tight text-slate-100"
        >
          <span className="font-display text-lg italic text-white/90 transition group-hover:text-glow-cyan">
            {person.name}
          </span>
          <span className="hidden text-slate-500 sm:inline">/</span>
          <span className="hidden text-xs font-normal text-slate-500 sm:inline">
            portfolio
          </span>
        </a>
        <nav
          className="flex flex-wrap items-center gap-1 text-xs text-slate-400 sm:gap-2 sm:text-[13px]"
          aria-label="Primary"
        >
          {links.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="rounded-full px-2.5 py-1 transition hover:bg-white/[0.06] hover:text-slate-100"
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
      <div className="border-t border-white/[0.04] bg-ink-950/40 px-4 py-2 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] leading-snug text-slate-500 sm:text-xs">
            <span className="text-slate-400">Role lens:</span> one site, three
            interview angles — reorder emphasis without maintaining three
            websites.
          </p>
          <RoleLens />
        </div>
      </div>
    </motion.header>
  );
}
