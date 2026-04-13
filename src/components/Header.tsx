import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { person } from "../data/profile";
import { useScrollToSection } from "../hooks/useScrollToSection";
import { HeroTicker } from "./HeroTicker";

const links = [
  ["ABOUT", "about"],
  ["EXPERIENCE", "experience"],
  ["SKILLS", "skills"],
  ["IMPACT", "impact"],
  ["PROJECTS", "projects"],
  ["CONTACT", "contact"],
] as const;

function useLandingTickerVisible() {
  const { pathname } = useLocation();
  const isHome = pathname === "/" || pathname === "";
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!isHome) {
      setVisible(false);
      return;
    }

    const update = () => {
      const hero = document.getElementById("top");
      if (!hero) {
        setVisible(false);
        return;
      }
      const { bottom } = hero.getBoundingClientRect();
      setVisible(bottom > 72);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    const t = window.setTimeout(update, 50);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.clearTimeout(t);
    };
  }, [isHome, pathname]);

  return { showLandingTicker: isHome && visible };
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const scrollToSection = useScrollToSection();
  const { showLandingTicker } = useLandingTickerVisible();

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
      className={`fixed inset-x-0 top-0 z-[60] w-full border-b transition-[background,border-color,backdrop-filter] duration-300 ${
        scrolled
          ? "border-white/[0.06] bg-base/25 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-2xl supports-[backdrop-filter]:bg-base/20"
          : "border-white/[0.04] bg-base/20 backdrop-blur-xl supports-[backdrop-filter]:bg-base/15"
      }`}
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      {/* Full viewport width — no max-w-* so logo and links sit at true left/right (with padding). */}
      <div className="box-border flex w-full max-w-none flex-row items-center justify-between gap-x-3 gap-y-2 px-4 py-2.5 sm:px-6 md:px-8 lg:px-10 xl:px-12 sm:py-3">
        <Link
          to="/"
          className="group flex min-w-0 shrink-0 items-center gap-1.5 font-mono text-sm font-medium tracking-tight text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.65)]"
        >
          <span className="inline-block w-2 shrink-0 animate-cursor-blink text-accent-acid" aria-hidden>
            █
          </span>
          <span className="truncate font-display text-lg italic text-white transition group-hover:text-accent-violet">
            {person.name}
          </span>
        </Link>
        <a
          href={person.resumeViewUrl}
          target="_blank"
          rel="noreferrer"
          className="shrink-0 rounded-sm border border-accent-violet/55 bg-[#111118]/80 px-3 py-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-accent-violet transition hover:border-accent-acid hover:text-accent-acid md:hidden"
        >
          Résumé
        </a>
        <nav
          className="hidden shrink-0 flex-wrap items-center justify-end gap-x-2 gap-y-1 font-mono text-[10px] uppercase tracking-wider text-white/85 drop-shadow-[0_1px_6px_rgba(0,0,0,0.55)] md:flex md:gap-x-3 md:text-xs"
          aria-label="Primary"
        >
          {links.map(([label, id]) => (
            <button
              key={id}
              type="button"
              onClick={() => scrollToSection(id)}
              className="cursor-pointer bg-transparent font-[inherit] uppercase transition-colors duration-150 hover:text-accent-acid hover:underline"
            >
              {label}
            </button>
          ))}
          <a
            href={person.resumeViewUrl}
            target="_blank"
            rel="noreferrer"
            className="transition-colors duration-150 hover:text-accent-acid hover:underline"
          >
            RESUME
          </a>
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

      <div
        className={`hidden min-h-0 transition-[grid-template-rows] duration-300 ease-out md:grid ${
          showLandingTicker ? "md:grid-rows-[1fr]" : "md:grid-rows-[0fr]"
        }`}
        aria-hidden={!showLandingTicker}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            className={`transition-opacity duration-300 ease-out ${
              showLandingTicker ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="box-border w-full max-w-none px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
              <HeroTicker />
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
