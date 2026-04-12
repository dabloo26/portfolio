import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { DRACOLoader, GLTFLoader, MeshoptDecoder } from "three-stdlib";
import type { Role } from "../../data/profile";
import { useRole } from "../../hooks/useRole";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

const ROLE_ACCENT: Record<Role, string> = {
  analyst: "#38bdf8",
  scientist: "#e879f9",
  engineer: "#4ade80",
};

/** Sketchfab: Cartoon Lowpoly Earth Planet 2 — place GLB at public/models/sketchfab-earth.glb */
const EARTH_GLB = "sketchfab-earth.glb";

function earthModelUrl(): string {
  const base = import.meta.env.BASE_URL;
  const prefix = base.endsWith("/") ? base : `${base}/`;
  return `${prefix}models/${EARTH_GLB}`;
}

function extendGltfLoader(loader: GLTFLoader) {
  const draco = new DRACOLoader();
  draco.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.5/");
  loader.setDRACOLoader(draco);
  loader.setMeshoptDecoder(
    typeof MeshoptDecoder === "function" ? MeshoptDecoder() : MeshoptDecoder
  );
}

function normalizeSceneToFit(root: THREE.Object3D, targetMaxSize: number) {
  const box = new THREE.Box3().setFromObject(root);
  const size = new THREE.Vector3();
  box.getSize(size);
  const maxDim = Math.max(size.x, size.y, size.z, 1e-6);
  const scale = targetMaxSize / maxDim;
  root.scale.multiplyScalar(scale);
  box.setFromObject(root);
  const center = new THREE.Vector3();
  box.getCenter(center);
  root.position.sub(center);
}

type LoadState =
  | { kind: "loading" }
  | { kind: "ready"; scene: THREE.Group }
  | { kind: "error" };

function useSketchfabEarthScene(url: string): LoadState {
  const [state, setState] = useState<LoadState>({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;
    const loader = new GLTFLoader();
    extendGltfLoader(loader);

    loader.load(
      url,
      (gltf) => {
        if (cancelled) return;
        setState({ kind: "ready", scene: gltf.scene });
      },
      undefined,
      () => {
        if (cancelled) return;
        setState({ kind: "error" });
      }
    );

    return () => {
      cancelled = true;
    };
  }, [url]);

  return state;
}

/** Single shared texture when GLB is absent. */
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

function ProceduralPlanetBody({
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

function GltfEarthBody({
  sourceScene,
  rotationSpeed,
}: {
  sourceScene: THREE.Group;
  rotationSpeed: number;
}) {
  const root = useRef<THREE.Group>(null);

  const model = useMemo(() => {
    const g = sourceScene.clone(true);
    normalizeSceneToFit(g, 1.85);
    g.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.frustumCulled = false;
      }
    });
    return g;
  }, [sourceScene]);

  useFrame((_, delta) => {
    const r = root.current;
    if (!r) return;
    r.rotation.y += delta * rotationSpeed;
  });

  return (
    <group ref={root}>
      <primitive object={model} />
    </group>
  );
}

function PlanetWorld({
  accent,
  rotationSpeed,
  modelUrl,
}: {
  accent: string;
  rotationSpeed: number;
  modelUrl: string;
}) {
  const load = useSketchfabEarthScene(modelUrl);
  const map = useMemo(() => makePlanetTexture(), []);

  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight position={[4, 2.5, 5]} intensity={1} color="#f0f9ff" />
      <directionalLight position={[-3, -1, -2]} intensity={0.35} color="#1e293b" />
      <pointLight position={[-3, -1, 3]} intensity={0.5} color={accent} />
      <pointLight position={[2.5, -2, 4]} intensity={0.32} color="#a78bfa" />
      {load.kind === "ready" ? (
        <GltfEarthBody sourceScene={load.scene} rotationSpeed={rotationSpeed} />
      ) : load.kind === "error" ? (
        <ProceduralPlanetBody map={map} accent={accent} rotationSpeed={rotationSpeed} />
      ) : null}
    </>
  );
}

type GlobalPlanetProps = {
  accent: string;
};

/**
 * Background Earth: loads Sketchfab GLB from /models/sketchfab-earth.glb when present;
 * otherwise procedural sphere. Fixed viewport, steady spin.
 */
export function GlobalPlanet({ accent }: GlobalPlanetProps) {
  const reduced = usePrefersReducedMotion();
  const rotationSpeed = reduced ? 0 : 0.055;
  const modelUrl = useMemo(() => earthModelUrl(), []);

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
          <PlanetWorld accent={accent} rotationSpeed={rotationSpeed} modelUrl={modelUrl} />
        </Suspense>
      </Canvas>
      <div className="pointer-events-none absolute inset-[-8%] rounded-full bg-[radial-gradient(circle_at_50%_45%,transparent_32%,rgba(3,7,18,0.35)_100%)]" />
    </div>
  );
}

export function GlobalPlanetLayer() {
  const { role } = useRole();
  const accent = ROLE_ACCENT[role];
  return <GlobalPlanet accent={accent} />;
}

export function InlinePlanetMobile({ accent }: { accent: string }) {
  const reduced = usePrefersReducedMotion();
  const rotationSpeed = reduced ? 0 : 0.055;
  const modelUrl = useMemo(() => earthModelUrl(), []);

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
          <PlanetWorld accent={accent} rotationSpeed={rotationSpeed} modelUrl={modelUrl} />
        </Suspense>
      </Canvas>
    </div>
  );
}
