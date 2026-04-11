import { lazy, Suspense, useEffect, useState } from "react";
import type { Role } from "../data/profile";
import { useRole } from "../hooks/useRole";

const HeroSceneCanvas = lazy(() =>
  import("./scene/HeroSceneCanvas").then((m) => ({
    default: m.HeroSceneCanvas,
  }))
);

function HeroSceneFallback({ role }: { role: Role }) {
  const grad =
    role === "analyst"
      ? "radial-gradient(ellipse 90% 80% at 70% 30%, rgba(56,189,248,0.18), transparent), #05060a"
      : role === "scientist"
        ? "radial-gradient(circle at 35% 30%, rgba(244,114,182,0.16), transparent 50%), #08040c"
        : "radial-gradient(ellipse 100% 70% at 55% 100%, rgba(74,222,128,0.16), transparent 55%), #030806";
  return (
    <div
      className="pointer-events-none absolute inset-0 z-[5] min-h-[90vh] bg-transparent"
      style={{ background: grad }}
      aria-hidden
    />
  );
}

export function HeroScene() {
  const { role } = useRole();
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const fn = () => setMobile(mq.matches);
    fn();
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  return (
    <Suspense fallback={<HeroSceneFallback role={role} />}>
      <HeroSceneCanvas role={role} mobile={mobile} />
    </Suspense>
  );
}
