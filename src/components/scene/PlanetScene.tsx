import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import {
  Component,
  Suspense,
  useMemo,
  useRef,
  type CSSProperties,
  type ErrorInfo,
  type ReactNode,
} from "react";
import * as THREE from "three";
import { useLandingPlanetProgress } from "../../context/LandingPlanetContext";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

/** Brand accent for lights / fallback. */
const PLANET_ACCENT = "#34d399";

/** Place `cute_little_planet.glb` in `public/`. Must use Vite `BASE_URL` so GitHub Pages project sites resolve correctly. */
const PLANET_GLB_URL = `${import.meta.env.BASE_URL}cute_little_planet.glb`;

/** ~1.2–1.4× larger on screen: dolly camera closer (whole scene scales together). */
const PLANET_VIEW_ZOOM = 1.3;

/** Base idle factor (used with motion); slowed 1.2× vs earlier tuning. */
const PLANET_SPIN_SPEED = (0.042 * 1.4) / 1.2;

const CAM_GLOBAL = {
  position: [0, 0.1, 3.15 / PLANET_VIEW_ZOOM] as const,
  fov: 52,
};
const CAM_INLINE = {
  position: [0, 0.08, 3.25 / PLANET_VIEW_ZOOM] as const,
  fov: 50,
};

function SatelliteMesh() {
  const body = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#e2e8f0",
        roughness: 0.55,
        metalness: 0.15,
        flatShading: true,
      }),
    []
  );
  const panel = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#38bdf8",
        roughness: 0.45,
        metalness: 0.2,
        flatShading: true,
      }),
    []
  );
  return (
    <group>
      <mesh material={body}>
        <boxGeometry args={[0.07, 0.045, 0.055]} />
      </mesh>
      <mesh position={[0.1, 0, 0]} material={panel} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.14, 0.018, 0.045]} />
      </mesh>
      <mesh position={[-0.1, 0, 0]} material={panel} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.14, 0.018, 0.045]} />
      </mesh>
      <mesh position={[0, 0.04, 0]} material={body}>
        <boxGeometry args={[0.025, 0.04, 0.025]} />
      </mesh>
    </group>
  );
}

/** One satellite: orbit in XZ plane (spin on Y), radius off planet surface. */
function OrbitingSatellites({ enabled }: { enabled: boolean }) {
  const ring = useRef<THREE.Group>(null);

  useFrame((_, d) => {
    if (!enabled || !ring.current) return;
    ring.current.rotation.y += (d * 0.52) / 1.2;
  });

  return (
    <group rotation={[0.18, 0.35, 0.1]}>
      <group ref={ring}>
        <group position={[1.24, 0, 0]}>
          <SatelliteMesh />
        </group>
      </group>
    </group>
  );
}

function AirplaneMesh() {
  const white = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#f8fafc",
        roughness: 0.65,
        metalness: 0.05,
        flatShading: true,
      }),
    []
  );
  return (
    <group rotation={[0, Math.PI / 2, 0]}>
      <mesh material={white}>
        <boxGeometry args={[0.14, 0.03, 0.03]} />
      </mesh>
      <mesh material={white}>
        <boxGeometry args={[0.045, 0.02, 0.12]} />
      </mesh>
      <mesh material={white} position={[-0.07, 0.015, 0]} rotation={[0, 0, 0.5]}>
        <boxGeometry args={[0.04, 0.025, 0.02]} />
      </mesh>
    </group>
  );
}

/**
 * One plane: orbit in YZ plane (spin on X) — different axis than satellite so paths don’t overlap.
 * Slightly larger radius than satellite where rings cross.
 */
function OrbitingFlights({ enabled }: { enabled: boolean }) {
  const ring = useRef<THREE.Group>(null);

  useFrame((_, d) => {
    if (!enabled || !ring.current) return;
    ring.current.rotation.x += (d * -0.46) / 1.2;
  });

  return (
    <group rotation={[0, -0.25, 0.15]}>
      <group ref={ring}>
        <group position={[0, 1.34, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <AirplaneMesh />
        </group>
      </group>
    </group>
  );
}

/** Remove axis/grid/line helpers often embedded in GLB exports (shows as lines behind the globe). */
function stripEmbeddedHelpers(root: THREE.Object3D) {
  const remove: THREE.Object3D[] = [];
  root.traverse((obj) => {
    if (
      obj instanceof THREE.Line ||
      obj instanceof THREE.LineSegments ||
      obj instanceof THREE.LineLoop ||
      obj.type === "AxesHelper" ||
      obj.type === "ArrowHelper" ||
      obj.type === "GridHelper" ||
      /axis|grid|helper|gizmo|debug/i.test(obj.name)
    ) {
      remove.push(obj);
    }
  });
  for (const o of remove) {
    o.parent?.remove(o);
  }
}

/**
 * Some asset packs include a separate tree/decor mesh that ends up offset after centering — reads as “floating tree”.
 */
function stripFloatingVegetationDecor(root: THREE.Object3D) {
  const remove: THREE.Object3D[] = [];
  root.updateMatrixWorld(true);
  root.traverse((obj) => {
    if (!(obj instanceof THREE.Mesh)) return;
    const n = obj.name || "";
    if (
      /\b(tree|trees|pine|palm|plant|plants|bush|foliage|decor|ajisa|vegetation)\b/i.test(n) ||
      /^(tree|decor|plant)/i.test(n)
    ) {
      remove.push(obj);
    }
  });
  for (const o of remove) {
    o.parent?.remove(o);
  }
}

/** Visible placeholder when GLB is loading or failed — avoids an empty transparent canvas. */
function ProceduralPlanet({ motionOn }: { motionOn: boolean }) {
  const spinY = useRef<THREE.Group>(null);
  const spinXZ = useRef<THREE.Group>(null);

  useFrame((_, d) => {
    if (!motionOn || !spinY.current || !spinXZ.current) return;
    const s = 1 / 1.2;
    spinY.current.rotation.y += d * 0.024 * s;
    spinXZ.current.rotation.x += d * 0.019 * s;
    spinXZ.current.rotation.z += d * 0.017 * s;
  });

  return (
    <group ref={spinY}>
      <group ref={spinXZ}>
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[1, 48, 48]} />
          <meshStandardMaterial
            color="#0c4a6e"
            roughness={0.62}
            metalness={0.12}
            emissive="#34d399"
            emissiveIntensity={0.14}
          />
        </mesh>
      </group>
    </group>
  );
}

/** Catches GLB / loader errors inside the Canvas (React error boundary does not always catch async loader failures without this). */
class PlanetGltfErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

/**
 * Loads `public/cute_little_planet.glb`, centers it, scales to ~unit radius (max dim → 2), enables shadows.
 * Idle motion: nested spins so the globe tumbles on several axes (background only, no user controls).
 */
function PlanetFromGlb({ motionOn }: { motionOn: boolean }) {
  const { scene } = useGLTF(PLANET_GLB_URL);
  const spinY = useRef<THREE.Group>(null);
  const spinXZ = useRef<THREE.Group>(null);

  const prepared = useMemo(() => {
    const g = scene.clone(true);
    stripEmbeddedHelpers(g);
    stripFloatingVegetationDecor(g);
    g.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(g);
    const size = new THREE.Vector3();
    box.getSize(size);
    const max = Math.max(size.x, size.y, size.z, 1e-6);
    const scale = 2 / max;
    g.scale.setScalar(scale);
    g.updateMatrixWorld(true);
    const box2 = new THREE.Box3().setFromObject(g);
    const center = new THREE.Vector3();
    box2.getCenter(center);
    g.position.sub(center);
    g.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });
    return g;
  }, [scene]);

  useFrame((_, d) => {
    if (!motionOn || !spinY.current || !spinXZ.current) return;
    const s = 1 / 1.2;
    spinY.current.rotation.y += d * 0.024 * s;
    spinXZ.current.rotation.x += d * 0.019 * s;
    spinXZ.current.rotation.z += d * 0.017 * s;
  });

  return (
    <group ref={spinY}>
      <group ref={spinXZ}>
        <primitive object={prepared} />
      </group>
    </group>
  );
}

/** If GLB fails to load (404, corrupt file), show CSS globe instead of a blank canvas. */
class PlanetWebglErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn("[PlanetScene] WebGL / GLB failed, using CSS fallback:", error.message, info.componentStack);
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

function PlanetWorld({
  accent,
  rotationSpeed,
}: {
  accent: string;
  rotationSpeed: number;
}) {
  const motionOn = rotationSpeed > 0;

  return (
    <>
      <hemisphereLight args={["#bae6fd", "#14532d", 0.45]} />
      <ambientLight intensity={0.28} />
      <directionalLight
        castShadow
        position={[8, 11, 6]}
        intensity={1.05}
        color="#fffbeb"
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={32}
        shadow-camera-left={-4.5}
        shadow-camera-right={4.5}
        shadow-camera-top={4.5}
        shadow-camera-bottom={-4.5}
        shadow-bias={-0.0002}
      />
      <directionalLight position={[-3, -4, -2]} intensity={0.22} color="#1e40af" />
      <pointLight position={[-1.5, 2.5, 3]} intensity={0.18} color={accent} />

      <PlanetGltfErrorBoundary fallback={<ProceduralPlanet motionOn={motionOn} />}>
        <Suspense fallback={<ProceduralPlanet motionOn={motionOn} />}>
          <PlanetFromGlb motionOn={motionOn} />
        </Suspense>
      </PlanetGltfErrorBoundary>

      {motionOn ? (
        <>
          <OrbitingSatellites enabled />
          <OrbitingFlights enabled />
        </>
      ) : null}
    </>
  );
}

type GlobalPlanetProps = {
  accent: string;
  /** 0 = biased right (landing); 1 = drifted toward center while scrolling. */
  centerProgress: number;
};

const PLANET_SHELL_CLS =
  "pointer-events-none fixed left-0 right-[-30%] top-[8vh] z-[12] hidden h-[min(72vh,520px)] max-h-[600px] md:right-[-22%] md:top-[6vh] md:block md:h-[min(92vh,900px)] md:max-h-[940px] lg:right-[-14%]";

function planetDriftStyle(centerProgress: number): CSSProperties {
  const p = Math.min(1, Math.max(0, centerProgress));
  const tx = (1 - p) * 28;
  return {
    transform: `translate3d(${tx}vw, 0, 0)`,
    willChange: "transform",
  };
}

function GlobalPlanetCss({ accent, centerProgress }: { accent: string; centerProgress: number }) {
  return (
    <div
      className={PLANET_SHELL_CLS}
      style={planetDriftStyle(centerProgress)}
      aria-hidden
    >
      <div
        className="h-full w-full rounded-full bg-[radial-gradient(circle_at_30%_25%,rgba(147,197,253,0.5),transparent_50%),radial-gradient(circle_at_70%_60%,rgba(22,101,52,0.38),transparent_48%),#0c4a6e]"
        style={{ boxShadow: `0 0 80px ${accent}40` }}
      />
    </div>
  );
}

export function GlobalPlanet({ accent, centerProgress }: GlobalPlanetProps) {
  const reduced = usePrefersReducedMotion();
  const rotationSpeed = reduced ? 0 : PLANET_SPIN_SPEED;

  if (reduced) {
    return <GlobalPlanetCss accent={accent} centerProgress={centerProgress} />;
  }

  const shell = `${PLANET_SHELL_CLS} overflow-visible`;

  return (
    <PlanetWebglErrorBoundary
      fallback={<GlobalPlanetCss accent={accent} centerProgress={centerProgress} />}
    >
      <div className={shell} style={planetDriftStyle(centerProgress)} aria-hidden>
        <Canvas
          className="pointer-events-none !h-full !w-full min-h-0 overflow-visible"
          style={{ display: "block" }}
          shadows
          camera={{
            position: CAM_GLOBAL.position,
            fov: CAM_GLOBAL.fov,
            near: 0.08,
            far: 120,
          }}
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
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1;
            gl.shadowMap.enabled = true;
            gl.shadowMap.type = THREE.PCFSoftShadowMap;
          }}
        >
          <PlanetWorld accent={accent} rotationSpeed={rotationSpeed} />
        </Canvas>
      </div>
    </PlanetWebglErrorBoundary>
  );
}

export function GlobalPlanetLayer() {
  const centerProgress = useLandingPlanetProgress();
  return <GlobalPlanet accent={PLANET_ACCENT} centerProgress={centerProgress} />;
}

function InlinePlanetCss({ accent }: { accent: string }) {
  return (
    <div
      className="mx-auto h-[min(56vw,300px)] w-[min(92vw,380px)] rounded-full bg-[radial-gradient(circle_at_30%_25%,rgba(52,211,153,0.4),transparent_50%),#052e16] md:hidden"
      style={{ boxShadow: `0 0 48px ${accent}28` }}
      aria-hidden
    />
  );
}

export function InlinePlanetMobile({ accent }: { accent: string }) {
  const reduced = usePrefersReducedMotion();
  const rotationSpeed = reduced ? 0 : PLANET_SPIN_SPEED;

  if (reduced) {
    return <InlinePlanetCss accent={accent} />;
  }

  return (
    <PlanetWebglErrorBoundary fallback={<InlinePlanetCss accent={accent} />}>
      <div
        className="relative mx-auto h-[min(56vw,300px)] w-[min(92vw,380px)] overflow-visible md:hidden"
        aria-hidden
      >
        <Canvas
          className="pointer-events-none !h-full !w-full overflow-visible"
          style={{ display: "block" }}
          shadows
          camera={{
            position: CAM_INLINE.position,
            fov: CAM_INLINE.fov,
            near: 0.08,
            far: 120,
          }}
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
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1;
            gl.shadowMap.enabled = true;
            gl.shadowMap.type = THREE.PCFSoftShadowMap;
          }}
        >
          <PlanetWorld accent={accent} rotationSpeed={rotationSpeed} />
        </Canvas>
      </div>
    </PlanetWebglErrorBoundary>
  );
}
