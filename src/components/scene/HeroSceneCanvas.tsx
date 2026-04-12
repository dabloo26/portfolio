import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, type ReactNode } from "react";
import * as THREE from "three";
import type { Role } from "../../data/profile";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

/** Role accent — tuned for visibility on dark void (inspired by R3F star portfolios). */
const ROLE: Record<
  Role,
  { star: string; emissive: string; pointSize: number; spin: number }
> = {
  analyst: {
    star: "#7dd3fc",
    emissive: "#38bdf8",
    pointSize: 0.011,
    spin: 1,
  },
  scientist: {
    star: "#f9a8d4",
    emissive: "#e879f9",
    pointSize: 0.012,
    spin: 1.15,
  },
  engineer: {
    star: "#86efac",
    emissive: "#4ade80",
    pointSize: 0.011,
    spin: 0.95,
  },
};

function fillSphere(buffer: Float32Array, radius: number) {
  const n = buffer.length / 3;
  for (let i = 0; i < n; i++) {
    const ix = i * 3;
    const r = radius * Math.cbrt(Math.random());
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    buffer[ix] = r * Math.sin(phi) * Math.cos(theta);
    buffer[ix + 1] = r * Math.sin(phi) * Math.sin(theta);
    buffer[ix + 2] = r * Math.cos(phi);
  }
}

function Starfield({
  count,
  color,
  size,
  spin,
}: {
  count: number;
  color: string;
  size: number;
  spin: number;
}) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    fillSphere(p, 1.38);
    return p;
  }, [count]);

  useFrame((_, delta) => {
    const mesh = ref.current;
    if (!mesh) return;
    const s = spin * delta;
    mesh.rotation.x -= s * 0.028;
    mesh.rotation.y -= s * 0.032;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        depthWrite={false}
        size={size}
        sizeAttenuation
        color={color}
        opacity={0.92}
      />
    </Points>
  );
}

function ParallaxStage({ children }: { children: ReactNode }) {
  const rig = useRef<THREE.Group>(null);
  const ptr = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const fn = (e: PointerEvent) => {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      ptr.current.x = (e.clientX / w) * 2 - 1;
      ptr.current.y = -((e.clientY / h) * 2 - 1);
    };
    window.addEventListener("pointermove", fn, { passive: true });
    return () => window.removeEventListener("pointermove", fn);
  }, []);

  useFrame(() => {
    const g = rig.current;
    if (!g) return;
    const x = ptr.current.x;
    const y = ptr.current.y;
    const k = 0.09;
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, y * 0.2, k);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, -x * 0.15, k);
  });
  return <group ref={rig}>{children}</group>;
}

function SceneContent({
  role,
  particleCount,
}: {
  role: Role;
  particleCount: number;
}) {
  const cfg = ROLE[role];
  return (
    <ParallaxStage>
      <group position={[0, 0, 0]} scale={1.85}>
        <Starfield
          count={particleCount}
          color={cfg.star}
          size={cfg.pointSize}
          spin={cfg.spin}
        />
      </group>
    </ParallaxStage>
  );
}

function HeroSceneStatic({
  role,
  fixed,
}: {
  role: Role;
  fixed?: boolean;
}) {
  const grad =
    role === "analyst"
      ? "radial-gradient(ellipse 90% 80% at 70% 30%, rgba(56,189,248,0.22), transparent), #05060a"
      : role === "scientist"
        ? "radial-gradient(circle at 35% 30%, rgba(244,114,182,0.2), transparent 50%), #08040c"
        : "radial-gradient(ellipse 100% 70% at 55% 100%, rgba(74,222,128,0.2), transparent 55%), #030806";
  return (
    <div
      className={`pointer-events-none z-[5] min-h-[100dvh] min-h-[100svh] w-full opacity-95 ${
        fixed ? "fixed inset-0" : "absolute inset-0"
      }`}
      style={{ background: grad, minHeight: "max(100dvh, 100%)" }}
      aria-hidden
    />
  );
}

export function HeroSceneCanvas({
  role,
  mobile,
  /** Full-viewport layer behind scrolling content (one continuous landing look). */
  fixed = false,
}: {
  role: Role;
  mobile: boolean;
  fixed?: boolean;
}) {
  const reduced = usePrefersReducedMotion();
  const particleCount = mobile ? 1400 : 3000;

  if (reduced) {
    return <HeroSceneStatic role={role} fixed={fixed} />;
  }

  const shell =
    fixed ?
      "pointer-events-none fixed inset-0 z-[5] w-full overflow-hidden min-h-[100dvh] min-h-[100svh]"
    : "pointer-events-none absolute inset-0 z-[5] min-h-[100dvh] min-h-[100svh] w-full overflow-hidden";

  const maxDpr = mobile ? 1.35 : fixed ? 1.5 : 1.75;

  return (
    <div className={shell} style={{ minHeight: "-webkit-fill-available" }}>
      {/* Solid layer so starfield never reads as “empty” if WebGL throttles or fails on mobile */}
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[#05060a]"
        aria-hidden
      />
      <Canvas
        className="!absolute inset-0 z-[1] h-full min-h-[100dvh] w-full"
        camera={{ position: [0, 0, 2.65], fov: 48, near: 0.1, far: 100 }}
        dpr={[1, maxDpr]}
        gl={{
          alpha: true,
          antialias: !mobile,
          powerPreference: mobile ? "default" : "high-performance",
          stencil: false,
          preserveDrawingBuffer: false,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor("#000000", 0);
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1;
        }}
      >
        <Suspense fallback={null}>
          <SceneContent role={role} particleCount={particleCount} />
        </Suspense>
      </Canvas>
      {fixed ?
        <>
          <div
            className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-r from-[#030712]/28 via-transparent to-[#030712]/18"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[min(28vh,220px)] bg-gradient-to-t from-base/25 via-transparent to-transparent"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 z-[2] shadow-[inset_0_0_90px_rgba(0,0,0,0.22)]"
            aria-hidden
          />
        </>
      : <>
          <div
            className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-r from-[#030712]/88 via-[#030712]/35 to-transparent md:from-[#030712]/72 md:via-transparent md:to-transparent"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[min(28vh,240px)] bg-gradient-to-t from-base via-base/65 to-transparent md:from-base/90"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 z-[2] shadow-[inset_0_0_120px_rgba(0,0,0,0.45)]"
            aria-hidden
          />
        </>
      }
    </div>
  );
}
