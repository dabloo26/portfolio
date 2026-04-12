import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import * as THREE from "three";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

function WireSphere({ color, scale = 1.08 }: { color: string; scale?: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, d) => {
    const m = ref.current;
    if (!m) return;
    m.rotation.x += d * 0.09;
    m.rotation.y += d * 0.14;
  });
  return (
    <mesh ref={ref} scale={scale}>
      <sphereGeometry args={[1, 40, 40]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.42}
        metalness={0.28}
        roughness={0.28}
        wireframe
        transparent
        opacity={0.55}
      />
    </mesh>
  );
}

function MiniScene({ color, immersive }: { color: string; immersive: boolean }) {
  const s = immersive ? 1.22 : 1.08;
  return (
    <>
      <ambientLight intensity={0.52} />
      <pointLight position={[3, 2.5, 4]} intensity={0.85} color={color} />
      <pointLight position={[-2.5, -1, 2]} intensity={0.35} color="#a78bfa" />
      <WireSphere color={color} scale={s} />
    </>
  );
}

type Props = {
  color: string;
  className?: string;
  /** Larger sphere, no clipping overlays — use for hero / contact “float”. */
  immersive?: boolean;
};

export function WireCircleAccent({ color, className = "", immersive = false }: Props) {
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        aria-hidden
      >
        <div
          className={`rounded-full border-2 border-dashed opacity-[0.5] ${
            immersive
              ? "h-[min(88vw,520px)] w-[min(88vw,520px)] max-w-none md:h-[min(52vw,560px)] md:w-[min(52vw,560px)]"
              : "aspect-square w-[min(72vw,320px)] md:w-[min(42vw,380px)]"
          }`}
          style={{ borderColor: color, boxShadow: `0 0 64px ${color}40` }}
        />
      </div>
    );
  }

  return (
    <div
      className={`relative ${immersive ? "overflow-visible" : "overflow-hidden"} ${className}`}
      aria-hidden
    >
      <Canvas
        className="h-full w-full min-h-[inherit]"
        camera={{ position: [0, 0, immersive ? 2.15 : 2.35], fov: immersive ? 48 : 46 }}
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
          <MiniScene color={color} immersive={immersive} />
        </Suspense>
      </Canvas>
      {!immersive ? (
        <>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#030712]/35" />
          <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_50px_rgba(0,0,0,0.32)]" />
        </>
      ) : (
        <div className="pointer-events-none absolute inset-[-12%] rounded-full bg-[radial-gradient(circle_at_50%_50%,transparent_35%,rgba(3,7,18,0.25)_100%)]" />
      )}
    </div>
  );
}
