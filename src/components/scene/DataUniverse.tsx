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

function PointsField({ count = 560 }: Props) {
  const group = useRef<THREE.Group>(null);
  const points = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const c1 = new THREE.Color("#22d3ee");
    const c2 = new THREE.Color("#a78bfa");
    const tmp = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const r = 7 + Math.random() * 15;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.72;
      positions[i * 3 + 2] = r * Math.cos(phi);
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
      const sx = mouse.x * 0.24 + scrollY.value * 0.00014;
      const sy = mouse.y * 0.18;
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        sx + t * 0.035,
        0.045
      );
      group.current.rotation.x = THREE.MathUtils.lerp(
        group.current.rotation.x,
        sy * 0.11 + Math.sin(t * 0.07) * 0.018,
        0.045
      );
    }
    if (points.current) {
      const mat = points.current.material as THREE.PointsMaterial;
      mat.opacity = 0.42 + Math.sin(t * 0.5) * 0.06;
    }
  });

  return (
    <group ref={group}>
      <points ref={points} geometry={geometry}>
        <pointsMaterial
          size={0.038}
          vertexColors
          transparent
          opacity={0.45}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

function OrbitRings() {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (!ref.current) return;
    ref.current.rotation.z = t * 0.028;
    ref.current.rotation.x = 0.32 + mouse.y * 0.07;
    ref.current.rotation.y = mouse.x * 0.1 + t * 0.018;
  });

  const curve = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 160; i++) {
      const a = (i / 160) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * 9.4, Math.sin(a) * 9.4, 0));
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, []);

  return (
    <group ref={ref}>
      <lineLoop geometry={curve}>
        <lineBasicMaterial color="#22d3ee" transparent opacity={0.11} />
      </lineLoop>
      <lineLoop geometry={curve} rotation={[1.05, 0.42, 0.18]}>
        <lineBasicMaterial color="#a78bfa" transparent opacity={0.09} />
      </lineLoop>
    </group>
  );
}

export function DataUniverse({ count = 560 }: Props) {
  const { camera } = useThree();
  useLayoutEffect(() => {
    camera.position.set(0, 0.15, 13);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return (
    <>
      <color attach="background" args={["#05060a"]} />
      <fog attach="fog" args={["#05060a", 11, 36]} />
      <ambientLight intensity={0.2} />
      <PointsField count={count} />
      <OrbitRings />
    </>
  );
}
