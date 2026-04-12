const ITEMS =
  "GPA 3.86 · 200+ student records · 82% precision · 10K req/s · BLEU 16.48 · ~30% transformation failures reduced · ~35% monitoring effort cut · 0.93 PR-AUC · ETL +35% throughput";

export function HeroTicker() {
  const doubled = `${ITEMS} · ${ITEMS}`;
  return (
    <div className="relative mt-6 w-full overflow-hidden rounded-md border border-white/[0.06] bg-black/40 py-2 font-mono text-[11px] text-accent-acid sm:text-xs md:mt-8">
      <div className="ticker-track whitespace-nowrap">
        <span className="inline-block pr-20">{doubled}</span>
      </div>
    </div>
  );
}
