import { useInView } from "framer-motion";
import { Suspense, useRef, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const cssBlob: Record<string, string> = {
  about:
    "bg-[radial-gradient(ellipse_80%_60%_at_90%_40%,rgba(124,58,255,0.12),transparent),radial-gradient(ellipse_60%_50%_at_10%_80%,rgba(56,189,248,0.06),transparent)]",
  experience:
    "bg-[radial-gradient(ellipse_70%_50%_at_85%_30%,rgba(57,255,20,0.07),transparent),radial-gradient(ellipse_50%_40%_at_20%_70%,rgba(124,58,255,0.08),transparent)]",
  impact:
    "bg-[radial-gradient(ellipse_75%_55%_at_95%_50%,rgba(56,189,248,0.1),transparent),radial-gradient(ellipse_45%_40%_at_5%_60%,rgba(167,139,250,0.06),transparent)]",
  projects:
    "bg-[radial-gradient(ellipse_80%_55%_at_88%_45%,rgba(124,58,255,0.1),transparent),radial-gradient(ellipse_55%_45%_at_15%_75%,rgba(57,255,20,0.05),transparent)]",
  contact:
    "bg-[radial-gradient(ellipse_85%_60%_at_92%_35%,rgba(56,189,248,0.11),transparent),radial-gradient(ellipse_50%_45%_at_8%_65%,rgba(244,114,182,0.06),transparent)]",
};

const meshColor: Record<string, string> = {
  about: "#a78bfa",
  experience: "#39ff14",
  impact: "#38bdf8",
  projects: "#7c3aff",
  contact: "#22d3ee",
};

export type SectionBackdropVariant =
  | "about"
  | "experience"
  | "impact"
  | "projects"
  | "contact";

function FloatMesh({ hue }: { hue: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    const m = ref.current;
    if (!m) return;
    m.rotation.x += delta * 0.35;
    m.rotation.y += delta * 0.45;
  });
  return (
    <mesh ref={ref}>
      <torusKnotGeometry args={[0.55, 0.16, 48, 12]} />
      <meshStandardMaterial
        color={hue}
        emissive={hue}
        emissiveIntensity={0.25}
        metalness={0.4}
        roughness={0.35}
        wireframe
        transparent
        opacity={0.35}
      />
    </mesh>
  );
}

function MiniScene({ hue }: { hue: string }) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[3, 2, 4]} intensity={0.8} color={hue} />
      <FloatMesh hue={hue} />
    </>
  );
}

/** Fills unused margin space: CSS wash on all breakpoints; lightweight wireframe on md+. */
export function SectionBackdropLayer({
  variant,
}: {
  variant: SectionBackdropVariant;
}) {
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { amount: 0.05, margin: "0px 0px -15% 0px" });
  const hue = meshColor[variant];
  const css = cssBlob[variant];

  return (
    <div
      ref={root}
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <div className={`absolute inset-0 opacity-100 md:opacity-95 ${css}`} />
      {inView && (
        <div className="absolute -right-6 bottom-0 top-0 hidden w-[min(44vw,400px)] md:block">
          <Canvas
            className="h-full w-full"
            camera={{ position: [0, 0, 2.2], fov: 42 }}
            dpr={[1, 1.25]}
            gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
            onCreated={({ gl }) => gl.setClearColor("#000000", 0)}
          >
            <Suspense fallback={null}>
              <MiniScene hue={hue} />
            </Suspense>
          </Canvas>
          <div className="absolute inset-0 bg-gradient-to-l from-base via-base/25 to-transparent" />
        </div>
      )}
    </div>
  );
}

export function SectionBackdropContent({ children }: { children: ReactNode }) {
  return <div className="relative z-10">{children}</div>;
}
