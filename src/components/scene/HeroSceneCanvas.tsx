import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { Suspense, useMemo, useRef, type ReactNode } from "react";
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

function WireAccent({ emissive }: { emissive: string }) {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((state, delta) => {
    const m = mesh.current;
    if (!m) return;
    m.rotation.x += delta * 0.11;
    m.rotation.y += delta * 0.16;
    const t = state.clock.elapsedTime;
    m.position.y = Math.sin(t * 0.55) * 0.06;
  });

  return (
    <mesh ref={mesh} position={[0.2, 0, 0.1]} scale={0.38}>
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial
        color={emissive}
        emissive={emissive}
        emissiveIntensity={0.45}
        metalness={0.35}
        roughness={0.25}
        wireframe
        transparent
        opacity={0.42}
      />
    </mesh>
  );
}

function ParallaxStage({ children }: { children: ReactNode }) {
  const rig = useRef<THREE.Group>(null);
  useFrame((state) => {
    const g = rig.current;
    if (!g) return;
    const x = state.pointer.x;
    const y = state.pointer.y;
    const k = 0.06;
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, y * 0.14, k);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, -x * 0.1, k);
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
      <group position={[0.95, 0.02, 0]} scale={1.62}>
        <ambientLight intensity={0.22} />
        <pointLight
          position={[4, 2.5, 5]}
          intensity={0.85}
          color={cfg.emissive}
        />
        <pointLight
          position={[-3, -1.5, 2]}
          intensity={0.35}
          color="#a78bfa"
        />
        <Starfield
          count={particleCount}
          color={cfg.star}
          size={cfg.pointSize}
          spin={cfg.spin}
        />
        <WireAccent emissive={cfg.emissive} />
      </group>
    </ParallaxStage>
  );
}

function HeroSceneStatic({ role }: { role: Role }) {
  const grad =
    role === "analyst"
      ? "radial-gradient(ellipse 90% 80% at 70% 30%, rgba(56,189,248,0.22), transparent), #05060a"
      : role === "scientist"
        ? "radial-gradient(circle at 35% 30%, rgba(244,114,182,0.2), transparent 50%), #08040c"
        : "radial-gradient(ellipse 100% 70% at 55% 100%, rgba(74,222,128,0.2), transparent 55%), #030806";
  return (
    <div
      className="pointer-events-none absolute inset-0 z-[5] min-h-[90vh] opacity-95"
      style={{ background: grad }}
      aria-hidden
    />
  );
}

export function HeroSceneCanvas({
  role,
  mobile,
}: {
  role: Role;
  mobile: boolean;
}) {
  const reduced = usePrefersReducedMotion();
  const particleCount = mobile ? 1400 : 3000;

  if (reduced) {
    return <HeroSceneStatic role={role} />;
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-[5] min-h-[90vh] w-full overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 2.35], fov: 42, near: 0.1, far: 100 }}
        dpr={[1, 1.75]}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
          stencil: false,
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
      <div
        className="absolute inset-0 bg-gradient-to-r from-[#05060a] via-[#05060a]/55 to-transparent md:from-[#05060a]/98 md:via-[#05060a]/35 md:to-transparent"
        aria-hidden
      />
      <div
        className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.6)]"
        aria-hidden
      />
    </div>
  );
}
