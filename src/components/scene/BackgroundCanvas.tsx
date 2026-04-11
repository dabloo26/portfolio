import { Canvas } from "@react-three/fiber";
import { Suspense, useMemo } from "react";
import { DataUniverse } from "./DataUniverse";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { useIsCoarsePointer } from "../../hooks/useIsCoarsePointer";

export function BackgroundCanvas() {
  const reduced = usePrefersReducedMotion();
  const coarse = useIsCoarsePointer();
  const count = coarse ? 280 : 560;

  const dpr = useMemo((): [number, number] => {
    if (typeof window === "undefined") return [1, 1];
    return [1, Math.min(window.devicePixelRatio, 1.75)];
  }, []);

  const fallback = useMemo(
    () => (
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_-10%,rgba(34,211,238,0.14),transparent),radial-gradient(ellipse_50%_40%_at_80%_40%,rgba(167,139,250,0.1),transparent)]"
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
          className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(148,163,184,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.5)_1px,transparent_1px)] [background-size:48px_48px]"
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
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        camera={{ position: [0, 0, 13], fov: 50, near: 0.1, far: 60 }}
      >
        <Suspense fallback={null}>
          <DataUniverse count={count} />
        </Suspense>
      </Canvas>
      <div
        className="absolute inset-0 bg-gradient-to-b from-ink-950/25 via-transparent to-ink-950"
        aria-hidden
      />
    </div>
  );
}
