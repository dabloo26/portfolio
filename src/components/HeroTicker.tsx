import { useMemo } from "react";
import { getHeroTickerText } from "../data/profile";

export function HeroTicker() {
  const line = useMemo(() => getHeroTickerText(), []);
  const doubled = `${line} · ${line}`;

  return (
    <div className="relative mt-6 w-full overflow-hidden rounded-md border border-white/[0.08] bg-black/35 py-2 font-mono text-[11px] text-accent-acid sm:text-xs md:mt-8">
      <div className="ticker-track whitespace-nowrap">
        <span className="inline-block pr-20">{doubled}</span>
      </div>
    </div>
  );
}
