import { motion } from "framer-motion";
import { person } from "../data/profile";

/**
 * Full-viewport boot screen while the bundle + fonts + 3D assets hydrate.
 * Matches site tokens: base, accent-violet, accent-acid, Instrument Serif + mono.
 */
export function AppLoadingScreen() {
  return (
    <motion.div
      role="status"
      aria-live="polite"
      aria-label="Loading portfolio"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[1000] flex flex-col items-center justify-center overflow-hidden bg-[#0a0a0f] px-6"
      style={{
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {/* Ambient layers */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(124,58,255,0.22),transparent_55%),radial-gradient(ellipse_60%_50%_at_80%_80%,rgba(57,255,20,0.06),transparent_50%),radial-gradient(ellipse_50%_40%_at_20%_90%,rgba(56,189,248,0.05),transparent_45%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35] mix-blend-screen"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.12'/%3E%3C/svg%3E")`,
          backgroundSize: "180px 180px",
        }}
        aria-hidden
      />

      <div className="relative z-10 flex max-w-md flex-col items-center text-center">
        {/* Orb + ring */}
        <div className="relative mb-10 h-24 w-24 sm:mb-12 sm:h-28 sm:w-28">
          <div
            className="absolute inset-0 rounded-full bg-gradient-to-br from-accent-violet/40 via-sky-400/20 to-accent-acid/25 blur-xl"
            aria-hidden
          />
          <div
            className="app-loader-ring absolute inset-0 rounded-full border-2 border-white/[0.08]"
            aria-hidden
          />
          <div className="absolute inset-[3px] rounded-full bg-gradient-to-b from-[#12151f] to-[#0a0a0f] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]" />
          <div
            className="app-loader-spin absolute inset-0 rounded-full"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0%, transparent 25%, rgba(124,58,255,0.95) 50%, rgba(57,255,20,0.5) 70%, transparent 100%)",
              mask: "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))",
              WebkitMask:
                "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))",
            }}
            aria-hidden
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.35em] text-accent-acid/90">
              ◆
            </span>
          </div>
        </div>

        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.4em] text-sky-400/90 sm:text-[11px]">
          Portfolio
        </p>
        <h1 className="mt-3 font-display text-3xl italic leading-tight text-white sm:text-4xl">
          {person.name}
        </h1>
        <p className="mt-4 font-mono text-xs text-meta sm:text-[13px]">
          Loading scene, fonts &amp; assets…
        </p>

        {/* Indeterminate bar */}
        <div className="relative mt-10 h-[3px] w-full max-w-[280px] overflow-hidden rounded-full bg-white/[0.06] sm:max-w-[320px]">
          <div className="app-loader-bar absolute left-0 top-0 h-full w-[38%] rounded-full bg-gradient-to-r from-accent-violet via-sky-400 to-accent-acid opacity-95 shadow-[0_0_12px_rgba(124,58,255,0.35)]" />
        </div>
      </div>
    </motion.div>
  );
}
