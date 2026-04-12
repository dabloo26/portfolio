import { lazy, Suspense, useEffect, useState } from "react";
import type { Role } from "../data/profile";

const HeroSceneCanvas = lazy(() =>
  import("./scene/HeroSceneCanvas").then((m) => ({
    default: m.HeroSceneCanvas,
  }))
);

function HeroSceneFallback({ role, fixed }: { role: Role; fixed?: boolean }) {
  const grad =
    role === "analyst"
      ? "radial-gradient(ellipse 90% 80% at 70% 30%, rgba(56,189,248,0.18), transparent), #05060a"
      : role === "scientist"
        ? "radial-gradient(circle at 35% 30%, rgba(244,114,182,0.16), transparent 50%), #08040c"
        : "radial-gradient(ellipse 100% 70% at 55% 100%, rgba(74,222,128,0.16), transparent 55%), #030806";
  return (
    <div
      className={`pointer-events-none z-[5] w-full bg-transparent ${
        fixed
          ? "fixed inset-0 min-h-[100dvh]"
          : "absolute inset-0 min-h-[90vh]"
      }`}
      style={{ background: grad }}
      aria-hidden
    />
  );
}

/** Fixed starfield behind the whole scroll (home + projects). Planet is `GlobalPlanetLayer` in App. */
const STARFIELD_ROLE: Role = "analyst";

export function GlobalHeroBackdrop() {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const fn = () => setMobile(mq.matches);
    fn();
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  return (
    <Suspense fallback={<HeroSceneFallback role={STARFIELD_ROLE} fixed />}>
      <HeroSceneCanvas role={STARFIELD_ROLE} mobile={mobile} fixed />
    </Suspense>
  );
}
