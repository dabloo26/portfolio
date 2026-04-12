import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import * as THREE from "three";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

function WireSphere({ color }: { color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, d) => {
    const m = ref.current;
    if (!m) return;
    m.rotation.x += d * 0.09;
    m.rotation.y += d * 0.14;
  });
  return (
    <mesh ref={ref} scale={1.08}>
      <sphereGeometry args={[1, 36, 36]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.38}
        metalness={0.3}
        roughness={0.3}
        wireframe
        transparent
        opacity={0.52}
      />
    </mesh>
  );
}

function MiniScene({ color }: { color: string }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[3, 2.5, 4]} intensity={0.8} color={color} />
      <pointLight position={[-2.5, -1, 2]} intensity={0.32} color="#a78bfa" />
      <WireSphere color={color} />
    </>
  );
}

/** Wireframe sphere for hero / contact accents only. */
export function WireCircleAccent({
  color,
  className = "",
}: {
  color: string;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        aria-hidden
      >
        <div
          className="aspect-square w-[min(72vw,320px)] rounded-full border-2 border-dashed opacity-[0.45] md:w-[min(42vw,380px)]"
          style={{ borderColor: color, boxShadow: `0 0 48px ${color}33` }}
        />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`} aria-hidden>
      <Canvas
        className="h-full w-full"
        camera={{ position: [0, 0, 2.35], fov: 46 }}
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
          <MiniScene color={color} />
        </Suspense>
      </Canvas>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#030712]/35" />
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_50px_rgba(0,0,0,0.32)]" />
    </div>
  );
}
