import { Canvas } from "@react-three/fiber";
import { Suspense, useMemo } from "react";
import { DataUniverse } from "./DataUniverse";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { useIsCoarsePointer } from "../../hooks/useIsCoarsePointer";

export function BackgroundCanvas() {
  const reduced = usePrefersReducedMotion();
  const coarse = useIsCoarsePointer();
  const count = coarse ? 380 : 720;

  const dpr = useMemo((): [number, number] => {
    if (typeof window === "undefined") return [1, 1];
    return [1, Math.min(window.devicePixelRatio, 2)];
  }, []);

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
      <Canvas
        className="h-full w-full"
        dpr={dpr}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        camera={{ position: [0, 0, 14], fov: 52, near: 0.1, far: 70 }}
      >
        <Suspense fallback={null}>
          <DataUniverse count={count} />
        </Suspense>
      </Canvas>
      {/* Lighter overlay so the scene stays vivid while text stays readable */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-ink-950/40 via-ink-950/55 to-ink-950/95"
        aria-hidden
      />
    </div>
  );
}
