import { useInView } from "framer-motion";
import { Suspense, useRef, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

export type SectionBackdropVariant =
  | "about"
  | "experience"
  | "impact"
  | "projects"
  | "contact";

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

/** Section background tint for full-bleed vignette (matches Tailwind `bg-base` / Key Impact). */
const fullBleedTint: Record<SectionBackdropVariant, string> = {
  about: "#0a0a0f",
  experience: "#0a0a0f",
  impact: "#050a14",
  projects: "#0a0a0f",
  contact: "#0a0a0f",
};

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function rgba(hex: string, a: number) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r},${g},${b},${a})`;
}

function FloatMesh({
  hue,
  scale = 1,
  spin = 1,
  shape = "torusKnot",
}: {
  hue: string;
  scale?: number;
  spin?: number;
  shape?: "torusKnot" | "icosahedron";
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    const m = ref.current;
    if (!m) return;
    const s = spin * delta;
    m.rotation.x += s * 0.35;
    m.rotation.y += s * 0.45;
  });
  return (
    <mesh ref={ref} scale={scale}>
      {shape === "torusKnot" ? (
        <torusKnotGeometry args={[0.55, 0.16, 48, 12]} />
      ) : (
        <icosahedronGeometry args={[0.72, 1]} />
      )}
      <meshStandardMaterial
        color={hue}
        emissive={hue}
        emissiveIntensity={0.25}
        metalness={0.4}
        roughness={0.35}
        wireframe
        transparent
        opacity={shape === "icosahedron" ? 0.28 : 0.35}
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

/** Two-shape layout so wireframe fills the section behind content. */
function WideBackdropScene({ hue }: { hue: string }) {
  return (
    <>
      <ambientLight intensity={0.55} />
      <pointLight position={[4, 2.5, 5]} intensity={0.75} color={hue} />
      <pointLight position={[-3.5, 0.5, 3]} intensity={0.45} color="#a78bfa" />
      <pointLight position={[0, -2, 2]} intensity={0.35} color={hue} />
      <group position={[0.42, -0.06, 0]} scale={1.35}>
        <FloatMesh hue={hue} scale={1.05} spin={1} />
      </group>
      <group position={[-0.52, 0.1, -0.15]} scale={1.1}>
        <FloatMesh hue="#94a3b8" shape="icosahedron" scale={0.95} spin={-0.85} />
      </group>
    </>
  );
}

/** Fills unused space: CSS wash on all breakpoints; lightweight wireframe on md+ (full width by default). */
export function SectionBackdropLayer({
  variant,
  coverage = "full",
}: {
  variant: SectionBackdropVariant;
  /** `full` = wireframe across the whole section; `margin` = narrow strip on the right only. */
  coverage?: "margin" | "full";
}) {
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { amount: 0.05, margin: "0px 0px -15% 0px" });
  const hue = meshColor[variant];
  const css = cssBlob[variant];
  const full = coverage === "full";
  const tint = fullBleedTint[variant];

  return (
    <div
      ref={root}
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <div className={`absolute inset-0 opacity-100 md:opacity-95 ${css}`} />
      {inView && (
        <div
          className={
            full
              ? "absolute inset-0 hidden md:block"
              : "absolute -right-6 bottom-0 top-0 hidden w-[min(44vw,400px)] md:block"
          }
        >
          <Canvas
            className="h-full w-full"
            camera={{
              position: full ? [0, 0.05, 2.45] : [0, 0, 2.2],
              fov: full ? 48 : 42,
            }}
            dpr={[1, 1.25]}
            gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
            onCreated={({ gl }) => gl.setClearColor("#000000", 0)}
          >
            <Suspense fallback={null}>
              {full ? <WideBackdropScene hue={hue} /> : <MiniScene hue={hue} />}
            </Suspense>
          </Canvas>
          {full ? (
            <>
              <div
                className="absolute inset-0 opacity-[0.72]"
                style={{
                  background: `radial-gradient(ellipse 95% 80% at 50% 45%, transparent 0%, ${rgba(tint, 0.82)} 78%)`,
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to right, ${rgba(tint, 0.55)}, ${rgba(tint, 0.22)}, ${rgba(tint, 0.12)})`,
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to bottom, ${rgba(tint, 0.4)}, transparent, ${rgba(tint, 0.55)})`,
                }}
              />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-l from-base via-base/25 to-transparent" />
          )}
        </div>
      )}
    </div>
  );
}

export function SectionBackdropContent({ children }: { children: ReactNode }) {
  return <div className="relative z-10">{children}</div>;
}
