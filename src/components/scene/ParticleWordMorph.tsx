import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Suspense,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import * as THREE from "three";
import type { Role } from "../../data/profile";

export type FieldInteraction = {
  pulse: number;
  ndc: THREE.Vector2;
};

const WORDS: Record<Role, string> = {
  analyst: "ANALYST",
  scientist: "SCIENTIST",
  engineer: "ENGINEER",
};

/* ─── Analyst: cool slate + KPI strip (nothing like the other two) ─── */
const ANALYST = {
  panel: new THREE.Color("#0f172a"),
  rule: new THREE.Color("#334155"),
  barMuted: new THREE.Color("#1e293b"),
  barHi: new THREE.Color("#38bdf8"),
  ink: new THREE.Color("#64748b"),
};

/* ─── Scientist: bioluminescent specimen (organic shader sphere) ─── */
const SCIENTIST = {
  void: new THREE.Color("#1a0518"),
  membrane: new THREE.Color("#86198f"),
  core: new THREE.Color("#f472b6"),
  spark: new THREE.Color("#e879f9"),
};

const scientistVert = `
varying vec3 vN;
varying vec3 vP;
uniform float uTime;
uniform float uPulse;
uniform vec2 uPointer;

void main() {
  vec3 pos = position;
  float n =
    sin(pos.x * 7.0 + uTime * 1.1) *
    cos(pos.y * 6.0 + uTime * 0.85) *
    0.14;
  n += sin(pos.z * 8.0 + uTime * 1.35) * 0.09;
  n += sin((pos.x + pos.y) * 5.0 + uTime * 0.6) * 0.06;
  n *= 1.0 + uPulse * 1.8;
  vec3 dir = normalize(pos + vec3(0.0002));
  pos += dir * n;
  pos += dir * uPulse * 0.18;
  pos.x += uPointer.x * 0.08 * (0.5 + sin(uTime + pos.y * 3.0) * 0.5);
  pos.y += uPointer.y * 0.06 * (0.5 + cos(uTime + pos.x * 3.0) * 0.5);
  vN = normalize(normalMatrix * normal);
  vP = pos;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const scientistFrag = `
varying vec3 vN;
varying vec3 vP;
uniform vec3 uMembrane;
uniform vec3 uCore;
uniform vec3 uSpark;
uniform float uTime;

void main() {
  float f = 0.5 + 0.5 * dot(normalize(vN), normalize(vec3(0.35, 0.85, 0.4)));
  float veins = sin(vP.x * 14.0 + vP.y * 11.0 + uTime * 2.0) * 0.5 + 0.5;
  vec3 col = mix(uMembrane, uCore, f);
  col += uSpark * veins * 0.35;
  col += uCore * pow(1.0 - f, 2.5) * 0.45;
  gl_FragColor = vec4(col, 0.94);
}
`;

/* ─── Engineer: rack / terminal (instanced bricks + scan beam) ─── */
const ENGINEER = {
  chassis: new THREE.Color("#030806"),
  slot: new THREE.Color("#14532d"),
  neon: new THREE.Color("#4ade80"),
  amber: new THREE.Color("#ca8a04"),
};

const rackScanVert = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const rackScanFrag = `
varying vec2 vUv;
uniform float uTime;
uniform float uPulse;
uniform vec3 uNeon;
uniform vec3 uAmber;

void main() {
  float scan = smoothstep(0.0, 0.04, abs(vUv.y - fract(uTime * 0.22)));
  float grid = step(0.92, fract(vUv.x * 24.0)) + step(0.94, fract(vUv.y * 18.0));
  vec3 col = uNeon * 0.08;
  col += uNeon * scan * (0.55 + uPulse * 0.9);
  col += uAmber * grid * 0.12 * (1.0 + uPulse);
  float v = 1.0 - length(vUv - vec2(0.5)) * 1.1;
  col *= 0.35 + 0.65 * smoothstep(0.0, 1.0, v);
  gl_FragColor = vec4(col, 0.55);
}
`;

const RIG: Record<
  Role,
  { tx: number; ty: number; smooth: number; yaw: number; pulseDecay: number }
> = {
  analyst: { tx: 0.22, ty: 0.26, smooth: 6.5, yaw: 0.018, pulseDecay: 4.2 },
  scientist: { tx: 0.42, ty: 0.38, smooth: 10, yaw: 0.055, pulseDecay: 5.5 },
  engineer: { tx: 0.18, ty: 0.2, smooth: 5.5, yaw: 0.032, pulseDecay: 6 },
};

function InteractiveRig({
  children,
  interaction,
  role,
}: {
  children: ReactNode;
  interaction: FieldInteraction;
  role: Role;
}) {
  const rig = useRef<THREE.Group>(null);
  const tiltX = useRef(0);
  const tiltY = useRef(0);
  const roleRef = useRef(role);
  roleRef.current = role;
  const { gl } = useThree();

  useEffect(() => {
    const el = gl.domElement;
    const down = () => {
      interaction.pulse = 1;
    };
    el.addEventListener("pointerdown", down);
    return () => el.removeEventListener("pointerdown", down);
  }, [gl, interaction]);

  useFrame((state, delta) => {
    const cfg = RIG[roleRef.current];
    const px = state.pointer.x;
    const py = state.pointer.y;
    const k = 1 - Math.exp(-cfg.smooth * delta);
    tiltX.current = THREE.MathUtils.lerp(tiltX.current, -py * cfg.tx, k);
    tiltY.current = THREE.MathUtils.lerp(tiltY.current, px * cfg.ty, k);
    interaction.ndc.set(px, py);
    interaction.pulse *= Math.exp(-delta * cfg.pulseDecay);
    if (interaction.pulse < 0.02) interaction.pulse = 0;
    if (!rig.current) return;
    const t = state.clock.elapsedTime;
    rig.current.rotation.x = tiltX.current;
    rig.current.rotation.y = tiltY.current + t * cfg.yaw;
    rig.current.rotation.z =
      roleRef.current === "scientist"
        ? Math.sin(t * 0.4 + px * 2) * 0.06
        : roleRef.current === "engineer"
          ? Math.sin(t * 0.9) * 0.025
          : 0;
  });

  return <group ref={rig}>{children}</group>;
}

/** Personal: calm KPI strip + ruled field — slate / cyan, no glow orbs. */
function AnalystChartRoom({ interaction }: { interaction: FieldInteraction }) {
  const root = useRef<THREE.Group>(null);
  const bars = useMemo(() => {
    const rows: { x: number; h: number; warm: boolean }[] = [];
    for (let i = 0; i < 22; i++) {
      const t = i * 0.41;
      const h = 0.28 + (Math.sin(t) * 0.5 + 0.5) * 0.62;
      rows.push({
        x: (i - 11) * 0.168,
        h,
        warm: (i * 7) % 11 < 4,
      });
    }
    return rows;
  }, []);

  const ruleGeoms = useMemo(() => {
    const geoms: THREE.BufferGeometry[] = [];
    for (let i = 0; i < 14; i++) {
      const y = -0.85 + i * 0.12;
      const g = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-2.35, y, 0.02),
        new THREE.Vector3(2.35, y, 0.02),
      ]);
      geoms.push(g);
    }
    return geoms;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const g = root.current;
    if (!g) return;
    const lean = interaction.ndc.x * 0.14;
    const breathe = interaction.pulse * 0.09;
    let bi = 0;
    g.children.forEach((ch) => {
      if (!(ch instanceof THREE.Mesh)) return;
      if (ch.userData.barIndex === undefined) return;
      ch.rotation.z = lean * (0.55 + (bi % 4) * 0.04);
      const base = ch.userData.baseH as number;
      ch.scale.y = 1 + breathe * (0.6 + (bi % 3) * 0.15);
      ch.position.y = (base * ch.scale.y) / 2 - 0.42;
      bi++;
    });
    g.position.x = Math.sin(t * 0.11) * 0.04;
  });

  return (
    <group ref={root}>
      <mesh position={[0, -0.05, -0.55]} receiveShadow>
        <planeGeometry args={[4.8, 3.2]} />
        <meshStandardMaterial
          color={ANALYST.panel}
          roughness={0.92}
          metalness={0.05}
        />
      </mesh>
      {ruleGeoms.map((geo, i) => (
        <lineSegments key={`r-${i}`} geometry={geo}>
          <lineBasicMaterial color={ANALYST.rule} transparent opacity={0.35} />
        </lineSegments>
      ))}
      {bars.map((b, i) => (
        <mesh
          key={i}
          userData={{ barIndex: i, baseH: b.h }}
          position={[b.x, b.h / 2 - 0.42, 0.04]}
        >
          <boxGeometry args={[0.065, b.h, 0.065]} />
          <meshStandardMaterial
            color={b.warm ? ANALYST.barHi : ANALYST.barMuted}
            emissive={b.warm ? ANALYST.barHi : ANALYST.ink}
            emissiveIntensity={b.warm ? 0.22 : 0.04}
            roughness={0.45}
            metalness={0.12}
          />
        </mesh>
      ))}
      <mesh position={[1.55, 0.75, 0.06]}>
        <planeGeometry args={[0.9, 0.34]} />
        <meshBasicMaterial color={ANALYST.barMuted} transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

/** Personal: living membrane — shader displacement, magenta / rose. */
function ScientistBioSphere({ interaction }: { interaction: FieldInteraction }) {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uPulse: { value: 0 },
          uPointer: { value: new THREE.Vector2(0, 0) },
          uMembrane: { value: SCIENTIST.membrane.clone() },
          uCore: { value: SCIENTIST.core.clone() },
          uSpark: { value: SCIENTIST.spark.clone() },
        },
        vertexShader: scientistVert,
        fragmentShader: scientistFrag,
        transparent: true,
      }),
    []
  );

  useFrame((state) => {
    mat.uniforms.uTime.value = state.clock.elapsedTime;
    mat.uniforms.uPulse.value = interaction.pulse;
    mat.uniforms.uPointer.value.copy(interaction.ndc);
  });

  return (
    <group position={[0, 0.05, 0]}>
      <mesh material={mat}>
        <sphereGeometry args={[0.92, 64, 64]} />
      </mesh>
      <mesh position={[0, 0, -0.35]}>
        <planeGeometry args={[5, 4]} />
        <meshBasicMaterial color={SCIENTIST.void} />
      </mesh>
    </group>
  );
}

/** Personal: server rack instancing + scan card — terminal greens + amber. */
function EngineerRackField({ interaction }: { interaction: FieldInteraction }) {
  const inst = useRef<THREE.InstancedMesh>(null);
  const count = 56;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const boxGeo = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);

  useLayoutEffect(() => {
    const mesh = inst.current;
    if (!mesh) return;
    let i = 0;
    for (let row = 0; row < 7; row++) {
      for (let col = 0; col < 8; col++) {
        dummy.position.set(
          col * 0.21 - 0.73,
          row * 0.18 - 0.52,
          (Math.sin(col * 1.2 + row) * 0.5 + 0.5) * 0.06
        );
        const s = 0.82 + (row % 3) * 0.06;
        dummy.scale.set(0.16 * s, 0.12 * s, 0.09 * s);
        dummy.rotation.set(0, 0, (col % 2 === 0 ? 1 : -1) * 0.04);
        dummy.updateMatrix();
        mesh.setMatrixAt(i++, dummy.matrix);
      }
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, [dummy]);

  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: ENGINEER.slot,
        emissive: ENGINEER.neon,
        emissiveIntensity: 0.35,
        metalness: 0.55,
        roughness: 0.35,
      }),
    []
  );

  useFrame(() => {
    if (!mat) return;
    mat.emissiveIntensity = 0.28 + interaction.pulse * 2.4;
  });

  const scanMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uPulse: { value: 0 },
          uNeon: { value: ENGINEER.neon.clone() },
          uAmber: { value: ENGINEER.amber.clone() },
        },
        vertexShader: rackScanVert,
        fragmentShader: rackScanFrag,
        transparent: true,
        depthWrite: false,
      }),
    []
  );

  useFrame((state) => {
    scanMat.uniforms.uTime.value = state.clock.elapsedTime;
    scanMat.uniforms.uPulse.value = interaction.pulse;
  });

  return (
    <group position={[0, 0.02, 0.12]}>
      <mesh position={[0, 0, -0.45]}>
        <planeGeometry args={[4.2, 3]} />
        <meshBasicMaterial color={ENGINEER.chassis} />
      </mesh>
      <instancedMesh ref={inst} args={[boxGeo, mat, count]} />
      <mesh position={[0, 0.05, 0.18]} material={scanMat}>
        <planeGeometry args={[2.6, 1.85]} />
      </mesh>
    </group>
  );
}

function RolePersonalScene({
  role,
  interaction,
}: {
  role: Role;
  interaction: FieldInteraction;
}) {
  if (role === "analyst") {
    return (
      <>
        <ambientLight intensity={0.45} />
        <directionalLight
          position={[2, 3, 4]}
          intensity={0.85}
          color={ANALYST.barHi}
        />
        <AnalystChartRoom interaction={interaction} />
      </>
    );
  }
  if (role === "scientist") {
    return (
      <>
        <ambientLight intensity={0.08} />
        <pointLight
          position={[1.2, 1.5, 2.2]}
          intensity={1.6}
          color={SCIENTIST.spark}
        />
        <pointLight
          position={[-1.5, -0.8, 1.5]}
          intensity={0.7}
          color={SCIENTIST.membrane}
        />
        <ScientistBioSphere interaction={interaction} />
      </>
    );
  }
  return (
    <>
      <ambientLight intensity={0.06} />
      <pointLight position={[0, 2, 2]} intensity={0.9} color={ENGINEER.neon} />
      <pointLight
        position={[-2, -1, 1]}
        intensity={0.35}
        color={ENGINEER.amber}
      />
      <EngineerRackField interaction={interaction} />
    </>
  );
}

const canvasFallback = (
  <div className="absolute inset-0 bg-[#0A0A0F]" aria-hidden />
);

export function ParticleWordMorphCanvas({ role }: { role: Role }) {
  const interaction = useMemo<FieldInteraction>(
    () => ({
      pulse: 0,
      ndc: new THREE.Vector2(0, 0),
    }),
    []
  );

  const [wide, setWide] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= 768 : true
  );

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const fn = () => setWide(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  const camZ = role === "scientist" ? 3.15 : role === "engineer" ? 3.55 : 3.85;

  if (!wide) {
    return <MobileRoleGradient role={role} />;
  }

  return (
    <div
      className="pointer-events-auto absolute inset-y-0 right-0 z-[5] hidden min-h-[90vh] w-1/2 min-w-0 cursor-grab touch-manipulation active:cursor-grabbing md:block"
      title="Each role has its own scene — move and click to play"
    >
      <Suspense fallback={canvasFallback}>
        <Canvas
          key={role}
          className="h-full w-full"
          dpr={[1, 1.5]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            stencil: false,
            depth: true,
          }}
          camera={{ position: [0, 0.05, camZ], fov: 44, near: 0.1, far: 100 }}
          onCreated={({ gl, scene }) => {
            gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
            scene.background = null;
          }}
        >
          <InteractiveRig interaction={interaction} role={role}>
            <RolePersonalScene role={role} interaction={interaction} />
          </InteractiveRig>
        </Canvas>
      </Suspense>
    </div>
  );
}

function MobileRoleGradient({ role }: { role: Role }) {
  const word = WORDS[role];
  const gradientClass =
    role === "analyst"
      ? "from-[#0f172a] via-[#1e293b] to-[#38bdf8]"
      : role === "scientist"
        ? "from-[#3b0764] via-[#86198f] to-[#fb7185]"
        : "from-[#022c22] via-[#14532d] to-[#4ade80]";

  return (
    <div className="mt-8 flex justify-center md:hidden">
      <span
        className={`bg-gradient-to-br ${gradientClass} bg-clip-text font-display text-4xl font-bold tracking-tight text-transparent`}
        aria-hidden
      >
        {word}
      </span>
    </div>
  );
}
