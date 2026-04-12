import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { person, roleLensKeywords } from "../data/profile";
import { useRole } from "../hooks/useRole";
import { RoleLens } from "./RoleLens";

const links = [
  ["ABOUT", "about"],
  ["EXPERIENCE", "experience"],
  ["SKILLS", "skills"],
  ["IMPACT", "impact"],
  ["PROJECTS", "projects"],
  ["CONTACT", "contact"],
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
      className={`fixed inset-x-0 top-0 z-[60] border-b transition-[background,border-color,backdrop-filter] duration-300 ${
        scrolled
          ? "border-white/[0.06] bg-base/25 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-2xl supports-[backdrop-filter]:bg-base/20"
          : "border-white/[0.04] bg-base/20 backdrop-blur-xl supports-[backdrop-filter]:bg-base/15"
      }`}
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-2.5 px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-3">
        <Link
          to="/"
          className="group flex items-center gap-1.5 font-mono text-sm font-medium tracking-tight text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.65)]"
        >
          <span className="inline-block w-2 animate-cursor-blink text-accent-acid" aria-hidden>
            █
          </span>
          <span className="font-display text-lg italic text-white transition group-hover:text-accent-violet">
            {person.name}
          </span>
        </Link>
        <nav
          className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-wider text-white/85 drop-shadow-[0_1px_6px_rgba(0,0,0,0.55)] sm:gap-x-4 sm:text-xs"
          aria-label="Primary"
        >
          {links.map(([label, hash]) => (
            <Link
              key={hash}
              to={{ pathname: "/", hash }}
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
      <div className="border-t border-white/[0.04] bg-base/15 px-4 py-2 backdrop-blur-xl supports-[backdrop-filter]:bg-base/10 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-end gap-1.5">
          <RoleLens />
          <p
            key={role}
            className="max-w-full text-right font-mono text-[10px] text-white/75 drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)] sm:text-[11px]"
          >
            {roleLensKeywords[role]}
          </p>
        </div>
      </div>
    </motion.header>
  );
}
