import { useMemo } from "react";
import { getHeroTickerText } from "../data/profile";

/** Scrolling tech-stack strip for the header (shown only while the landing hero is in view). */
export function HeroTicker() {
  const line = useMemo(() => getHeroTickerText(), []);
  const doubled = `${line} · ${line}`;

  return (
    <div className="relative w-full overflow-hidden border-t border-white/[0.07] bg-black/45 py-2 font-mono text-[11px] leading-snug text-accent-acid sm:py-2.5 sm:text-xs md:text-[13px]">
      <div className="ticker-track whitespace-nowrap">
        <span className="inline-block pr-20">{doubled}</span>
      </div>
    </div>
  );
}
