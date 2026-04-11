import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, useLayoutEffect } from "react";
import * as THREE from "three";

type Props = {
  count?: number;
};

const mouse = { x: 0, y: 0 };
const scrollY = { value: 0 };

if (typeof window !== "undefined") {
  window.addEventListener(
    "mousemove",
    (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    },
    { passive: true }
  );
  window.addEventListener(
    "scroll",
    () => {
      scrollY.value = window.scrollY;
    },
    { passive: true }
  );
}

/** Curated palette: violet / electric teal / acid / soft rose — reads “designed”, not default neon. */
const C = {
  void: new THREE.Color("#06040c"),
  violet: new THREE.Color("#7c3aff"),
  teal: new THREE.Color("#2dd4bf"),
  acid: new THREE.Color("#39ff14"),
  rose: new THREE.Color("#fb7185"),
  mist: new THREE.Color("#94a3b8"),
};

function PointsField({ count = 640 }: Props) {
  const group = useRef<THREE.Group>(null);
  const points = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const tmp = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const r = 5.5 + Math.random() * 15;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.66;
      positions[i * 3 + 2] = r * Math.cos(phi);
      const t = Math.random();
      if (t < 0.35) tmp.copy(C.violet).lerp(C.teal, Math.random());
      else if (t < 0.65) tmp.copy(C.teal).lerp(C.mist, Math.random() * 0.5);
      else tmp.copy(C.rose).lerp(C.violet, Math.random() * 0.4);
      colors[i * 3] = tmp.r;
      colors[i * 3 + 1] = tmp.g;
      colors[i * 3 + 2] = tmp.b;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return g;
  }, [count]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (group.current) {
      const sx = mouse.x * 0.28 + scrollY.value * 0.0001;
      const sy = mouse.y * 0.2;
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        sx + t * 0.038,
        0.042
      );
      group.current.rotation.x = THREE.MathUtils.lerp(
        group.current.rotation.x,
        sy * 0.12 + Math.sin(t * 0.07) * 0.035,
        0.042
      );
    }
    if (points.current) {
      const mat = points.current.material as THREE.PointsMaterial;
      mat.opacity = 0.52 + Math.sin(t * 0.55) * 0.08;
    }
  });

  return (
    <group ref={group}>
      <points ref={points} geometry={geometry}>
        <pointsMaterial
          size={0.048}
          vertexColors
          transparent
          opacity={0.58}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

function HaloStars({ count = 140 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const geom = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const tmp = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const r = 14 + Math.random() * 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.5;
      positions[i * 3 + 2] = r * Math.cos(phi);
      tmp.copy(C.acid).lerp(C.teal, Math.random()).multiplyScalar(0.85 + Math.random() * 0.35);
      colors[i * 3] = tmp.r;
      colors[i * 3 + 1] = tmp.g;
      colors[i * 3 + 2] = tmp.b;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return g;
  }, [count]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ref.current) {
      ref.current.rotation.y = -t * 0.025 + mouse.x * 0.08;
      ref.current.rotation.x = Math.sin(t * 0.12) * 0.08;
    }
  });

  return (
    <points ref={ref} geometry={geom}>
      <pointsMaterial
        size={0.065}
        vertexColors
        transparent
        opacity={0.45}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function FlowRibbons() {
  const group = useRef<THREE.Group>(null);
  const lineObjects = useMemo(() => {
    const seeds = [
      [[-9, -1, -2], [-4, 4, 3], [2, 2, 6], [8, -2, 2]],
      [[8, 3, -3], [3, -2, 4], [-3, 3, 5], [-9, 0, 1]],
      [[0, 6, -4], [-5, 2, 2], [5, -3, 5], [0, -5, 0]],
      [[-6, -4, 4], [0, 5, -2], [6, 1, 3], [-2, -6, -1]],
    ];
    const curves = seeds.map((pts) =>
      new THREE.CatmullRomCurve3(
        pts.map(([x, y, z]) => new THREE.Vector3(x, y, z)),
        true,
        "catmullrom",
        0.5
      )
    );
    return curves.map((curve, i) => {
      const pts = curve.getPoints(96);
      const g = new THREE.BufferGeometry().setFromPoints(pts);
      const colors = new Float32Array(pts.length * 3);
      const tmp = new THREE.Color();
      for (let j = 0; j < pts.length; j++) {
        tmp.copy(C.violet).lerp(C.teal, j / Math.max(1, pts.length - 1));
        colors[j * 3] = tmp.r;
        colors[j * 3 + 1] = tmp.g;
        colors[j * 3 + 2] = tmp.b;
      }
      g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      const mat = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.35 + i * 0.04,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
      });
      return new THREE.Line(g, mat);
    });
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (group.current) {
      group.current.rotation.y = t * 0.018 + mouse.x * 0.12;
      group.current.rotation.x = Math.sin(t * 0.11) * 0.06 + mouse.y * 0.05;
    }
  });

  return (
    <group ref={group}>
      {lineObjects.map((ln, i) => (
        <primitive key={i} object={ln} />
      ))}
    </group>
  );
}

function IcosphereShell() {
  const mesh = useRef<THREE.Mesh>(null);
  const geo = useMemo(() => new THREE.IcosahedronGeometry(4.2, 1), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (!mesh.current) return;
    mesh.current.rotation.x = t * 0.06 + mouse.y * 0.18;
    mesh.current.rotation.y = t * 0.04 + mouse.x * 0.22 + scrollY.value * 0.00006;
  });

  return (
    <mesh ref={mesh} geometry={geo} position={[0, 0, -3]}>
      <meshBasicMaterial
        color="#7c3aff"
        wireframe
        transparent
        opacity={0.12}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function ConstellationEdges() {
  const ref = useRef<THREE.LineSegments>(null);
  const geom = useMemo(() => {
    const n = 28;
    const pts: THREE.Vector3[] = [];
    const sphere: THREE.Vector3[] = [];
    for (let i = 0; i < n; i++) {
      const r = 9 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      sphere.push(
        new THREE.Vector3(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta) * 0.7,
          r * Math.cos(phi)
        )
      );
    }
    for (let i = 0; i < n; i++) {
      const a = sphere[i]!;
      const b = sphere[(i + 3 + Math.floor(Math.random() * 4)) % n]!;
      pts.push(a, b);
    }
    const g = new THREE.BufferGeometry().setFromPoints(pts);
    return g;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ref.current) {
      ref.current.rotation.y = t * 0.015;
    }
  });

  return (
    <lineSegments ref={ref} geometry={geom}>
      <lineBasicMaterial color="#2dd4bf" transparent opacity={0.14} blending={THREE.AdditiveBlending} />
    </lineSegments>
  );
}

function OrbitRings() {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (!ref.current) return;
    ref.current.rotation.z = t * 0.028;
    ref.current.rotation.x = 0.26 + mouse.y * 0.1;
    ref.current.rotation.y = mouse.x * 0.12 + t * 0.022 + scrollY.value * 0.00006;
  });

  const curve = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 200; i++) {
      const a = (i / 200) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * 10.5, Math.sin(a) * 10.5, 0));
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, []);

  return (
    <group ref={ref}>
      <lineLoop geometry={curve}>
        <lineBasicMaterial color="#7c3aff" transparent opacity={0.28} blending={THREE.AdditiveBlending} />
      </lineLoop>
      <lineLoop geometry={curve} rotation={[1.08, 0.44, 0.2]}>
        <lineBasicMaterial color="#2dd4bf" transparent opacity={0.22} blending={THREE.AdditiveBlending} />
      </lineLoop>
      <lineLoop geometry={curve} rotation={[0.48, 1.05, 0.55]}>
        <lineBasicMaterial color="#39ff14" transparent opacity={0.12} blending={THREE.AdditiveBlending} />
      </lineLoop>
    </group>
  );
}

function DataGridFloor() {
  const ref = useRef<THREE.GridHelper>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ref.current) {
      ref.current.position.y = -6.4 + Math.sin(t * 0.22) * 0.12;
      ref.current.rotation.y = t * 0.018;
    }
  });
  const grid = useMemo(() => {
    const g = new THREE.GridHelper(32, 32, 0x7c3aff, 0x1e1b2e);
    const mat = g.material;
    const mats = Array.isArray(mat) ? mat : [mat];
    mats.forEach((m) => {
      const line = m as THREE.LineBasicMaterial;
      line.transparent = true;
      line.opacity = 0.1;
    });
    return g;
  }, []);

  return <primitive ref={ref} object={grid} position={[0, -6.4, -4]} />;
}

export function DataUniverse({ count = 640 }: Props) {
  const { camera } = useThree();
  useLayoutEffect(() => {
    camera.position.set(0, 0.35, 14.5);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return (
    <>
      <color attach="background" args={["#06040c"]} />
      <fog attach="fog" args={["#06040c", 16, 48]} />
      <ambientLight intensity={0.22} color="#c4b5fd" />
      <hemisphereLight args={["#7c3aff", "#0f172a", 0.35]} />
      <pointLight position={[10, 8, 12]} intensity={0.9} color="#7c3aff" distance={60} decay={2} />
      <pointLight position={[-12, -6, 8]} intensity={0.65} color="#2dd4bf" distance={55} decay={2} />
      <pointLight position={[0, -8, -10]} intensity={0.35} color="#39ff14" distance={40} decay={2} />
      <IcosphereShell />
      <ConstellationEdges />
      <FlowRibbons />
      <PointsField count={count} />
      <HaloStars count={120} />
      <OrbitRings />
      <DataGridFloor />
    </>
  );
}
