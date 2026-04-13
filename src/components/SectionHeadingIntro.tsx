import type { ReactNode } from "react";

const shell =
  "section-heading-intro relative isolate w-full max-w-full rounded-2xl border border-white/[0.09] bg-[#05060a]/93 px-4 py-4 shadow-[0_20px_60px_rgba(0,0,0,0.75)] backdrop-blur-md sm:px-5 sm:py-5";

const shellCompact =
  "section-heading-intro relative isolate w-full max-w-full rounded-xl border border-white/[0.09] bg-[#05060a]/93 px-3 py-2.5 shadow-[0_14px_44px_rgba(0,0,0,0.7)] backdrop-blur-md sm:px-4 sm:py-3";

/**
 * Dark frosted plate behind section titles + ledes so copy stays readable over
 * gradient backdrops and scroll parallax (planet / section washes).
 */
export function SectionHeadingIntro({
  children,
  className = "",
  compact = false,
}: {
  children: ReactNode;
  className?: string;
  /** Smaller padding — for secondary headings on /projects */
  compact?: boolean;
}) {
  return (
    <div className={`${compact ? shellCompact : shell} ${className}`.trim()}>{children}</div>
  );
}

/** Standard mono lede under an h2 inside {@link SectionHeadingIntro}. */
export function SectionHeadingLede({
  children,
  className = "",
  size = "md",
}: {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md";
}) {
  const sizeCls = size === "sm" ? "text-xs sm:text-sm" : "text-sm";
  return (
    <p
      className={`section-heading-intro__lede mt-2 font-mono leading-relaxed text-zinc-200 sm:mt-3 ${sizeCls} ${className}`.trim()}
    >
      {children}
    </p>
  );
}
