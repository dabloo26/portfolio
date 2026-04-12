import { motion } from "framer-motion";
import { heroLandingCopy, person } from "../data/profile";
import { HeroInteractiveHeading } from "./HeroInteractiveText";
import { InlinePlanetMobile } from "./scene/PlanetScene";

const ACCENT_ORB = "#34d399";

export function Hero() {
  const { quote, quip, focus } = heroLandingCopy;

  return (
    <>
      <section
        id="top"
        className="relative z-10 min-h-[100dvh] bg-transparent px-4 pb-24 pt-[max(8.5rem,env(safe-area-inset-top,0px))] sm:px-6 sm:pb-32 sm:pt-[9rem] md:px-8 md:pb-28"
        style={{
          paddingLeft: "max(1rem, env(safe-area-inset-left))",
          paddingRight: "max(1rem, env(safe-area-inset-right))",
          paddingBottom: "max(6rem, env(safe-area-inset-bottom))",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_0%,rgba(124,58,255,0.14),transparent_58%),radial-gradient(ellipse_60%_50%_at_80%_60%,rgba(57,255,20,0.06),transparent)]"
          aria-hidden
        />

        <div className="relative z-20 mx-auto grid min-h-[min(100dvh,1200px)] w-full max-w-6xl grid-cols-1 content-center gap-10 lg:grid-cols-2 lg:items-center lg:gap-12 xl:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto w-full max-w-[min(100%,560px)] lg:justify-self-start xl:max-w-[600px]"
          >
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.14] bg-[#060a12]/55 p-6 shadow-[0_0_0_1px_rgba(124,58,255,0.18),0_28px_100px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:rounded-3xl sm:p-8 md:p-10">
              <div
                className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent-violet/15 blur-3xl"
                aria-hidden
              />

              <div className="relative mt-1">
                <HeroInteractiveHeading name={person.name} variant="landing" />
              </div>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.08 }}
                className="relative mt-6 font-display text-[clamp(1.15rem,calc(2.2vw+0.65rem),1.85rem)] italic leading-snug tracking-wide text-sky-100/95 sm:mt-7 md:text-2xl"
              >
                {quote}
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.14 }}
                className="relative mt-6 text-base italic leading-relaxed text-white/88 sm:mt-7 sm:text-lg"
              >
                {quip}
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.2 }}
                className="relative mt-6 text-[15px] font-medium leading-relaxed text-white sm:mt-7 sm:text-base"
              >
                {focus}
              </motion.p>
            </div>
          </motion.div>

          {/* Reserve horizontal space on large screens so the fixed WebGL planet reads as the “right column”. */}
          <div
            className="pointer-events-none hidden min-h-[min(68vh,720px)] lg:block"
            aria-hidden
          />

          <div className="relative z-[15] flex w-full justify-center lg:col-span-2 lg:hidden">
            <InlinePlanetMobile accent={ACCENT_ORB} />
          </div>
        </div>
      </section>
    </>
  );
}
