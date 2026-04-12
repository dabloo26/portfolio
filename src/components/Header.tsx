import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { person, roleLensKeywords } from "../data/profile";
import { useRole } from "../hooks/useRole";
import { RoleLens } from "./RoleLens";

const links = [
  ["ABOUT", "/#about"],
  ["EXPERIENCE", "/#experience"],
  ["IMPACT", "/#impact"],
  ["PROJECTS", "/#projects"],
  ["CONTACT", "/#contact"],
] as const;

export function Header() {
  const { role } = useRole();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-[2px] z-50 border-b transition-colors duration-300 md:top-[2px] ${
        scrolled
          ? "border-b border-accent-acid/40 bg-base/88"
          : "border-b border-white/[0.07] bg-base/55"
      }`}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Link
          to="/"
          className="group flex items-center gap-1.5 font-mono text-sm font-medium tracking-tight text-white"
        >
          <span className="inline-block w-2 animate-cursor-blink text-accent-acid" aria-hidden>
            █
          </span>
          <span className="font-display text-lg italic text-white transition group-hover:text-accent-violet">
            {person.name}
          </span>
        </Link>
        <nav
          className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-wider text-meta sm:gap-x-4 sm:text-xs"
          aria-label="Primary"
        >
          {links.map(([label, to]) => (
            <Link
              key={to}
              to={to}
              className="transition-colors duration-150 hover:text-accent-acid hover:underline"
            >
              {label}
            </Link>
          ))}
          <a
            href={person.github}
            target="_blank"
            rel="noreferrer"
            className="transition-colors duration-150 hover:text-accent-acid hover:underline"
          >
            GITHUB
          </a>
        </nav>
      </div>
      <div className="border-t border-white/[0.05] bg-base/50 px-4 py-2 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-end gap-1.5">
          <RoleLens />
          <p
            key={role}
            className="max-w-full text-right font-mono text-[10px] text-meta sm:text-[11px]"
          >
            {roleLensKeywords[role]}
          </p>
        </div>
      </div>
    </motion.header>
  );
}
