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
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

/** Brand accent for lights / fallback. */
const PLANET_ACCENT = "#34d399";

/** Place `cute_little_planet.glb` in `public/`. Must use Vite `BASE_URL` so GitHub Pages project sites resolve correctly. */
const PLANET_GLB_URL = `${import.meta.env.BASE_URL}cute_little_planet.glb`;

/** ~1.2–1.4× larger on screen: dolly camera closer (whole scene scales together). */
const PLANET_VIEW_ZOOM = 1.3;

/** Base idle factor (used with motion); slowed 1.2× vs earlier tuning. */
const PLANET_SPIN_SPEED = (0.042 * 1.4) / 1.2;

/** Slightly farther + wider FOV so orbit paths (satellites / planes) stay inside the canvas without clipping. */
const CAM_GLOBAL = {
  position: [0, 0.1, 3.45 / PLANET_VIEW_ZOOM] as const,
  fov: 56,
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

/** Orbit radius in scene units (~planet radius 1). Kept tighter so craft hug the globe. */
const ORBIT_SAT = 1.08;

/** Two satellites, opposite sides of the same ring (XZ plane via Y spin). */
function OrbitingSatellites({ enabled }: { enabled: boolean }) {
  const ring = useRef<THREE.Group>(null);

  useFrame((_, d) => {
    if (!enabled || !ring.current) return;
    ring.current.rotation.y += (d * 0.52) / 1.2;
  });

  return (
    <group rotation={[0.18, 0.35, 0.1]}>
      <group ref={ring}>
        <group position={[ORBIT_SAT, 0, 0]}>
          <SatelliteMesh />
        </group>
        <group position={[-ORBIT_SAT, 0, 0]}>
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

const ORBIT_PLANE = 1.14;

/**
 * Two planes on one ring (YZ plane via X spin) — opposite phases so paths stay separated from sats.
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
        <group position={[0, ORBIT_PLANE, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <AirplaneMesh />
        </group>
        <group position={[0, -ORBIT_PLANE, 0]} rotation={[0, 0, Math.PI / 2]}>
          <AirplaneMesh />
        </group>
      </group>
    </group>
  );
}

function ProbeMesh() {
  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#fcd34d",
        emissive: "#f59e0b",
        emissiveIntensity: 0.35,
        roughness: 0.45,
        metalness: 0.25,
        flatShading: true,
      }),
    []
  );
  return (
    <mesh material={mat}>
      <icosahedronGeometry args={[0.052, 0]} />
    </mesh>
  );
}

const ORBIT_PROBE = 1.05;

/** Small probe on a tilted ring (rolls on Z) — reads as a third lane of traffic. */
function OrbitingProbe({ enabled }: { enabled: boolean }) {
  const ring = useRef<THREE.Group>(null);

  useFrame((_, d) => {
    if (!enabled || !ring.current) return;
    ring.current.rotation.z += (d * 0.41) / 1.2;
  });

  return (
    <group rotation={[0.35, -0.28, 0.22]}>
      <group ref={ring}>
        <group position={[ORBIT_PROBE, 0, 0]}>
          <ProbeMesh />
        </group>
      </group>
    </group>
  );
}

/** Compact comms buoy — slow retrograde loop for variety. */
function OrbitingBuoy({ enabled }: { enabled: boolean }) {
  const ring = useRef<THREE.Group>(null);

  useFrame((_, d) => {
    if (!enabled || !ring.current) return;
    ring.current.rotation.y += (d * -0.28) / 1.2;
  });

  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#a78bfa",
        emissive: "#7c3aed",
        emissiveIntensity: 0.25,
        roughness: 0.5,
        metalness: 0.2,
        flatShading: true,
      }),
    []
  );

  const r = 1.02;
  return (
    <group rotation={[-0.25, 0.55, -0.15]}>
      <group ref={ring}>
        <group position={[r, 0, 0]}>
          <mesh material={mat} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.028, 0.038, 0.09, 6]} />
          </mesh>
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
          <OrbitingProbe enabled />
          <OrbitingBuoy enabled />
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

/**
 * Fixed square viewport for the globe so we can center it in the window.
 * (Old layout used `left-0` + negative `right`, which kept the sphere off-center even at “rest”.)
 */
/** Mobile: smaller, centered behind hero; desktop: large, drift with scroll. */
const PLANET_SHELL_CLS =
  "pointer-events-none fixed z-[8] block h-[min(44vh,320px)] w-[min(86vw,320px)] max-w-[100vw] overflow-visible md:z-[12] md:h-[min(96vh,980px)] md:w-[min(96vh,980px)] md:max-h-[min(96vh,980px)] md:max-w-[min(100vw,980px)]";

/**
 * Planet anchor: landing = right column (center ~72% from left); scrolled = viewport center (50%).
 * `left` is the horizontal center of the planet box; `translateX(-50%)` centers the box on that point.
 */
function planetDriftStyle(centerProgress: number): CSSProperties {
  const p = Math.min(1, Math.max(0, centerProgress));
  const centerXPct = 50 + (1 - p) * 22;
  return {
    left: `${centerXPct}%`,
    right: "auto",
    transform: "translateX(-50%)",
    willChange: "left, transform",
  };
}

function mobilePlanetStyle(): CSSProperties {
  return {
    left: "50%",
    right: "auto",
    top: "max(12vh, 5.75rem)",
    transform: "translateX(-50%)",
  };
}

function planetShellStyle(isDesktop: boolean, centerProgress: number): CSSProperties {
  if (isDesktop) {
    return { ...planetDriftStyle(centerProgress), overflow: "visible" };
  }
  return { ...mobilePlanetStyle(), overflow: "visible" };
}

function GlobalPlanetCss({ accent, centerProgress }: { accent: string; centerProgress: number }) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  return (
    <div
      className={PLANET_SHELL_CLS}
      style={planetShellStyle(isDesktop, centerProgress)}
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
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (reduced) {
    return <GlobalPlanetCss accent={accent} centerProgress={centerProgress} />;
  }

  const shell = `${PLANET_SHELL_CLS} overflow-visible`;

  return (
    <PlanetWebglErrorBoundary
      fallback={<GlobalPlanetCss accent={accent} centerProgress={centerProgress} />}
    >
      <div className={shell} style={planetShellStyle(isDesktop, centerProgress)} aria-hidden>
        <Canvas
          className="pointer-events-none !h-full !w-full min-h-0 !overflow-visible"
          style={{ display: "block", overflow: "visible" }}
          shadows
          camera={{
            position: CAM_GLOBAL.position,
            fov: CAM_GLOBAL.fov,
            near: 0.08,
            far: 120,
          }}
          dpr={isDesktop ? [1, 1.5] : [1, 1]}
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
