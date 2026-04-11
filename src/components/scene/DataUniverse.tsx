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

const PALETTE = [
  new THREE.Color("#22d3ee"),
  new THREE.Color("#a78bfa"),
  new THREE.Color("#f472b6"),
  new THREE.Color("#34d399"),
];

function PointsField({ count = 720 }: Props) {
  const group = useRef<THREE.Group>(null);
  const points = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const tmp = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const r = 6 + Math.random() * 16;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.68;
      positions[i * 3 + 2] = r * Math.cos(phi);
      const c1 = PALETTE[i % PALETTE.length];
      const c2 = PALETTE[(i + 1) % PALETTE.length];
      tmp.copy(c1).lerp(c2, Math.random());
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
      const sx = mouse.x * 0.32 + scrollY.value * 0.00012;
      const sy = mouse.y * 0.22;
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        sx + t * 0.042,
        0.05
      );
      group.current.rotation.x = THREE.MathUtils.lerp(
        group.current.rotation.x,
        sy * 0.14 + Math.sin(t * 0.09) * 0.04,
        0.05
      );
    }
    if (points.current) {
      const mat = points.current.material as THREE.PointsMaterial;
      mat.opacity = 0.58 + Math.sin(t * 0.65) * 0.1;
    }
  });

  return (
    <group ref={group}>
      <points ref={points} geometry={geometry}>
        <pointsMaterial
          size={0.055}
          vertexColors
          transparent
          opacity={0.62}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

function SparkBurst({ count = 220 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const geom = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const tmp = new THREE.Color();
    const cPink = new THREE.Color("#f472b6");
    const cCyan = new THREE.Color("#22d3ee");
    for (let i = 0; i < count; i++) {
      const r = 2.5 + Math.random() * 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      tmp.copy(cPink).lerp(cCyan, Math.random());
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
      ref.current.rotation.y = t * 0.11 + mouse.x * 0.2;
      ref.current.rotation.x = Math.sin(t * 0.2) * 0.15 + mouse.y * 0.12;
    }
  });

  return (
    <points ref={ref} geometry={geom} position={[0, 0.4, 2]}>
      <pointsMaterial
        size={0.09}
        vertexColors
        transparent
        opacity={0.72}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function WireTorusKnot() {
  const mesh = useRef<THREE.Mesh>(null);
  const geo = useMemo(
    () => new THREE.TorusKnotGeometry(2.4, 0.72, 200, 32),
    []
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (!mesh.current) return;
    mesh.current.rotation.x = t * 0.09 + mouse.y * 0.25;
    mesh.current.rotation.y = t * 0.12 + mouse.x * 0.35 + scrollY.value * 0.0001;
    mesh.current.rotation.z = Math.sin(t * 0.15) * 0.12;
  });

  return (
    <mesh ref={mesh} geometry={geo} position={[1.2, -0.3, -2]}>
      <meshBasicMaterial
        color="#22d3ee"
        wireframe
        transparent
        opacity={0.45}
      />
    </mesh>
  );
}

function OrbitRings() {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (!ref.current) return;
    ref.current.rotation.z = t * 0.035;
    ref.current.rotation.x = 0.28 + mouse.y * 0.12;
    ref.current.rotation.y = mouse.x * 0.15 + t * 0.025 + scrollY.value * 0.00008;
  });

  const curve = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 180; i++) {
      const a = (i / 180) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * 10.2, Math.sin(a) * 10.2, 0));
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, []);

  return (
    <group ref={ref}>
      <lineLoop geometry={curve}>
        <lineBasicMaterial color="#22d3ee" transparent opacity={0.22} />
      </lineLoop>
      <lineLoop geometry={curve} rotation={[1.12, 0.48, 0.22]}>
        <lineBasicMaterial color="#f472b6" transparent opacity={0.18} />
      </lineLoop>
      <lineLoop geometry={curve} rotation={[0.5, 1.1, 0.6]}>
        <lineBasicMaterial color="#a78bfa" transparent opacity={0.16} />
      </lineLoop>
    </group>
  );
}

function DataGridFloor() {
  const ref = useRef<THREE.GridHelper>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ref.current) {
      ref.current.position.y = -6.2 + Math.sin(t * 0.25) * 0.15;
      ref.current.rotation.y = t * 0.02;
    }
  });
  const grid = useMemo(() => {
    const g = new THREE.GridHelper(28, 28, 0x22d3ee, 0x334155);
    const mat = g.material;
    const mats = Array.isArray(mat) ? mat : [mat];
    mats.forEach((m) => {
      const line = m as THREE.LineBasicMaterial;
      line.transparent = true;
      line.opacity = 0.14;
    });
    return g;
  }, []);

  return <primitive ref={ref} object={grid} position={[0, -6.2, -4]} />;
}

export function DataUniverse({ count = 720 }: Props) {
  const { camera } = useThree();
  useLayoutEffect(() => {
    camera.position.set(0, 0.2, 14);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return (
    <>
      <color attach="background" args={["#03040a"]} />
      <fog attach="fog" args={["#03040a", 14, 42]} />
      <ambientLight intensity={0.35} />
      <pointLight position={[8, 6, 10]} intensity={1.1} color="#22d3ee" />
      <pointLight position={[-10, -4, 6]} intensity={0.75} color="#f472b6" />
      <pointLight position={[0, 8, -6]} intensity={0.45} color="#a78bfa" />
      <PointsField count={count} />
      <SparkBurst count={200} />
      <WireTorusKnot />
      <OrbitRings />
      <DataGridFloor />
    </>
  );
}
