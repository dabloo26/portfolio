import { motion } from "framer-motion";
import { heroLandingQuote, person } from "../data/profile";
import { HeroInteractiveHeading } from "./HeroInteractiveText";
import { HeroTicker } from "./HeroTicker";
import { InlinePlanetMobile } from "./scene/PlanetScene";
const ACCENT_ORB = "#34d399";

const memeSrc = `${import.meta.env.BASE_URL.replace(/\/?$/, "/")}meme-ai.png`;

export function Hero() {
  return (
    <>
      <section
        id="top"
        className="relative z-10 flex min-h-[100dvh] flex-col justify-center overflow-visible bg-transparent px-4 pb-24 pt-[max(8.5rem,env(safe-area-inset-top,0px))] sm:px-6 sm:pb-32 sm:pt-[9rem] md:px-8 md:pb-28"
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

        <div className="relative z-20 mx-auto w-full max-w-6xl">
          <div className="flex flex-col gap-8">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-auto relative w-full max-w-2xl sm:max-w-none"
            >
              <div className="relative overflow-hidden rounded-2xl border border-white/[0.14] bg-[#060a12]/55 p-5 shadow-[0_0_0_1px_rgba(124,58,255,0.18),0_28px_100px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:rounded-3xl sm:p-7 md:p-8 lg:max-w-xl xl:max-w-2xl">
                <div
                  className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent-violet/15 blur-3xl"
                  aria-hidden
                />

                <div className="relative mt-1">
                  <HeroInteractiveHeading name={person.name} />
                </div>

                <HeroTicker />

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.12 }}
                  className="relative mt-6 max-w-lg text-base italic leading-relaxed text-white/90 sm:text-lg"
                >
                  {heroLandingQuote}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.18 }}
                  className="relative mt-6 overflow-hidden rounded-xl border border-white/[0.1] bg-black/30"
                >
                  <img
                    src={memeSrc}
                    alt=""
                    width={500}
                    height={375}
                    className="mx-auto h-auto w-full max-w-[280px] object-contain sm:max-w-[320px]"
                    loading="eager"
                    decoding="async"
                  />
                </motion.div>

              </div>
            </motion.div>

            <div className="relative z-[15] flex w-full justify-center md:hidden">
              <InlinePlanetMobile accent={ACCENT_ORB} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
