import { useMemo } from "react";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

export function BackgroundCanvas() {
  const reduced = usePrefersReducedMotion();

  const fallback = useMemo(
    () => (
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_100%_70%_at_50%_0%,rgba(34,211,238,0.22),transparent),radial-gradient(ellipse_60%_50%_at_85%_35%,rgba(244,114,182,0.14),transparent),radial-gradient(ellipse_50%_40%_at_15%_60%,rgba(167,139,250,0.12),transparent)]"
        aria-hidden
      />
    ),
    []
  );

  if (reduced) {
    return (
      <>
        {fallback}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.09] [background-image:linear-gradient(rgba(148,163,184,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.5)_1px,transparent_1px)] [background-size:48px_48px]"
          aria-hidden
        />
      </>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0">
      {fallback}
      <div
        className="absolute inset-0 bg-gradient-to-b from-ink-950/40 via-ink-950/55 to-ink-950/95"
        aria-hidden
      />
    </div>
  );
}
