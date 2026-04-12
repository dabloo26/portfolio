import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import type { Role } from "../../data/profile";
import { useRole } from "../../hooks/useRole";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

const ROLE_ACCENT: Record<Role, string> = {
  analyst: "#38bdf8",
  scientist: "#e879f9",
  engineer: "#4ade80",
};

/** Single shared texture so role changes never swap the globe — only lighting can shift slightly. */
function makePlanetTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;
  if (!ctx) throw new Error("2d context");

  const base = ctx.createRadialGradient(512, 256, 40, 512, 256, 480);
  base.addColorStop(0, "#0c4a6e");
  base.addColorStop(0.35, "#082f49");
  base.addColorStop(0.65, "#0f172a");
  base.addColorStop(1, "#020617");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, 1024, 512);

  for (let i = 0; i < 14; i++) {
    const y = (i / 14) * 512;
    ctx.fillStyle = `rgba(56, 189, 248, ${0.04 + (i % 3) * 0.02})`;
    ctx.fillRect(0, y, 1024, 28 + (i % 5) * 6);
  }

  for (let n = 0; n < 220; n++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 512;
    const rw = 20 + Math.random() * 100;
    const rh = 6 + Math.random() * 18;
    ctx.fillStyle = `rgba(34, 211, 238, ${0.05 + Math.random() * 0.1})`;
    ctx.beginPath();
    ctx.ellipse(x, y, rw, rh, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }

  for (let n = 0; n < 35; n++) {
    const cx = Math.random() * 1024;
    const cy = Math.random() * 512;
    const r = 40 + Math.random() * 90;
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0, "rgba(124, 58, 255, 0.22)");
    g.addColorStop(0.5, "rgba(56, 189, 248, 0.08)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function PlanetBody({
  map,
  accent,
  rotationSpeed,
}: {
  map: THREE.CanvasTexture;
  accent: string;
  rotationSpeed: number;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    g.rotation.y += delta * rotationSpeed;
  });

  const emissive = useMemo(() => new THREE.Color(accent), [accent]);

  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[1, 72, 72]} />
        <meshStandardMaterial
          map={map}
          roughness={0.88}
          metalness={0.12}
          emissive={emissive}
          emissiveIntensity={0.14}
        />
      </mesh>
      <mesh scale={1.055}>
        <sphereGeometry args={[1, 48, 48]} />
        <meshBasicMaterial
          color={accent}
          transparent
          opacity={0.14}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

function PlanetWorld({
  accent,
  rotationSpeed,
}: {
  accent: string;
  rotationSpeed: number;
}) {
  const map = useMemo(() => makePlanetTexture(), []);
  return (
    <>
      <ambientLight intensity={0.38} />
      <directionalLight position={[4, 2.5, 5]} intensity={0.9} color="#e0f2fe" />
      <pointLight position={[-3, -1, 3]} intensity={0.55} color={accent} />
      <pointLight position={[2.5, -2, 4]} intensity={0.35} color="#a78bfa" />
      <PlanetBody map={map} accent={accent} rotationSpeed={rotationSpeed} />
    </>
  );
}

type GlobalPlanetProps = {
  /** Accent for rim lights / atmosphere tint (e.g. role-based). */
  accent: string;
};

/**
 * One WebGL planet for the whole site: fixed in the viewport, same steady spin everywhere
 * (no section mount/unmount, no scroll-based hide, no contact in-view toggle).
 */
export function GlobalPlanet({ accent }: GlobalPlanetProps) {
  const reduced = usePrefersReducedMotion();
  const rotationSpeed = reduced ? 0 : 0.055;

  if (reduced) {
    return (
      <div
        className="pointer-events-none fixed left-[18%] right-[-22%] top-[10vh] z-[8] hidden h-[min(68vh,480px)] max-h-[560px] md:left-[26%] md:right-[-16%] md:top-[7vh] md:block md:h-[min(90vh,880px)] md:max-h-[920px] lg:left-[32%] lg:right-[-10%]"
        aria-hidden
      >
        <div
          className="h-full w-full rounded-full bg-[radial-gradient(circle_at_35%_30%,rgba(56,189,248,0.35),transparent_55%),radial-gradient(circle_at_70%_60%,rgba(124,58,255,0.2),transparent_50%),#0f172a]"
          style={{ boxShadow: `0 0 80px ${accent}33` }}
        />
      </div>
    );
  }

  return (
    <div
      className="pointer-events-none fixed left-[18%] right-[-22%] top-[10vh] z-[8] hidden h-[min(68vh,480px)] max-h-[560px] md:left-[26%] md:right-[-16%] md:top-[7vh] md:block md:h-[min(90vh,880px)] md:max-h-[920px] lg:left-[32%] lg:right-[-10%]"
      aria-hidden
    >
      <Canvas
        className="h-full w-full"
        camera={{ position: [0, 0.15, 2.45], fov: 48 }}
        dpr={[1, 1.5]}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "low-power",
          stencil: false,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor("#000000", 0);
          gl.outputColorSpace = THREE.SRGBColorSpace;
        }}
      >
        <Suspense fallback={null}>
          <PlanetWorld accent={accent} rotationSpeed={rotationSpeed} />
        </Suspense>
      </Canvas>
      <div className="pointer-events-none absolute inset-[-8%] rounded-full bg-[radial-gradient(circle_at_50%_45%,transparent_32%,rgba(3,7,18,0.35)_100%)]" />
    </div>
  );
}

/** Desktop + tablet: one globe, whole scroll — no mount/unmount by section. */
export function GlobalPlanetLayer() {
  const { role } = useRole();
  const accent = ROLE_ACCENT[role];
  return <GlobalPlanet accent={accent} />;
}

/** In-flow planet for small screens (same scene params; separate canvas is acceptable on mobile for layout). */
export function InlinePlanetMobile({ accent }: { accent: string }) {
  const reduced = usePrefersReducedMotion();
  const rotationSpeed = reduced ? 0 : 0.055;

  if (reduced) {
    return (
      <div
        className="mx-auto h-[min(56vw,280px)] w-[min(88vw,360px)] rounded-full bg-[radial-gradient(circle_at_35%_30%,rgba(56,189,248,0.3),transparent_55%),#0f172a] md:hidden"
        style={{ boxShadow: `0 0 48px ${accent}28` }}
        aria-hidden
      />
    );
  }

  return (
    <div className="relative mx-auto h-[min(56vw,280px)] w-[min(88vw,360px)] md:hidden" aria-hidden>
      <Canvas
        className="h-full w-full"
        camera={{ position: [0, 0.12, 2.5], fov: 46 }}
        dpr={[1, 1.25]}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "low-power",
          stencil: false,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor("#000000", 0);
          gl.outputColorSpace = THREE.SRGBColorSpace;
        }}
      >
        <Suspense fallback={null}>
          <PlanetWorld accent={accent} rotationSpeed={rotationSpeed} />
        </Suspense>
      </Canvas>
    </div>
  );
}
