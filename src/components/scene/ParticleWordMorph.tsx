import { Preload } from "@react-three/drei";
import {
  Canvas,
  useFrame,
  useLoader,
  useThree,
} from "@react-three/fiber";
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as THREE from "three";
import {
  FontLoader,
  type Font as TypefaceFont,
} from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { MeshSurfaceSampler } from "three/addons/math/MeshSurfaceSampler.js";
import gsap from "gsap";
import type { Role } from "../../data/profile";

const WORDS: Record<Role, string> = {
  analyst: "ANALYST",
  scientist: "SCIENTIST",
  engineer: "ENGINEER",
};

const VIOLET = new THREE.Color("#7C3AFF");
const CYAN = new THREE.Color("#22d3ee");
const HOT_PINK = new THREE.Color("#FF2D78");
const ACID = new THREE.Color("#39FF14");

function gradientForWord(role: Role, t: number): [number, number, number] {
  const c = new THREE.Color();
  switch (role) {
    case "analyst":
      c.copy(VIOLET).lerp(CYAN, t);
      break;
    case "scientist":
      c.copy(VIOLET).lerp(HOT_PINK, t);
      break;
    case "engineer":
      c.copy(VIOLET).lerp(ACID, t);
      break;
  }
  return [c.r, c.g, c.b];
}

const wordVertexShader = `
uniform float uPixelRatio;
attribute float aSize;
attribute vec3 aColor;
varying vec3 vColor;
void main() {
  vColor = aColor;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = aSize * (350.0 / max(-mvPosition.z, 0.1)) * uPixelRatio;
  gl_Position = projectionMatrix * mvPosition;
}
`;

const wordFragmentShader = `
varying vec3 vColor;
void main() {
  vec2 p = gl_PointCoord - vec2(0.5);
  float d = length(p);
  if (d > 0.5) discard;
  float alpha = smoothstep(0.5, 0.32, d);
  gl_FragColor = vec4(vColor, alpha);
}
`;

const streamVertexShader = `
uniform float uPixelRatio;
attribute float aStreamSize;
void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = aStreamSize * (280.0 / max(-mvPosition.z, 0.1)) * uPixelRatio;
  gl_Position = projectionMatrix * mvPosition;
}
`;

const streamFragmentShader = `
void main() {
  vec2 p = gl_PointCoord - vec2(0.5);
  float d = length(p);
  if (d > 0.5) discard;
  gl_FragColor = vec4(1.0, 1.0, 1.0, 0.15);
}
`;

type CachedWord = {
  positions: Float32Array;
  colors: Float32Array;
  minY: number;
  maxY: number;
};

function sampleWordPositions(
  font: TypefaceFont,
  text: string,
  count: number
): CachedWord {
  const geo = new TextGeometry(text, {
    font,
    size: 0.42,
    depth: 0.06,
    curveSegments: 10,
    bevelEnabled: true,
    bevelThickness: 0.01,
    bevelSize: 0.008,
    bevelSegments: 2,
  });
  geo.center();
  geo.computeBoundingBox();
  const box = geo.boundingBox!;
  const mesh = new THREE.Mesh(
    geo,
    new THREE.MeshBasicMaterial({ visible: false })
  );
  const sampler = new MeshSurfaceSampler(mesh).build();
  const p = new THREE.Vector3();
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    sampler.sample(p);
    positions[i * 3] = p.x;
    positions[i * 3 + 1] = p.y;
    positions[i * 3 + 2] = p.z;
  }
  const minY = box.min.y;
  const maxY = box.max.y;
  mesh.geometry.dispose();
  (mesh.material as THREE.MeshBasicMaterial).dispose();

  return { positions, colors: new Float32Array(count * 3), minY, maxY };
}

function fillColorsForRole(
  cached: CachedWord,
  role: Role,
  out: Float32Array
): void {
  const { positions, minY, maxY } = cached;
  const span = Math.max(maxY - minY, 1e-6);
  const n = positions.length / 3;
  for (let i = 0; i < n; i++) {
    const y = positions[i * 3 + 1];
    const t = Math.max(0, Math.min(1, (y - minY) / span));
    const [r, g, b] = gradientForWord(role, t);
    out[i * 3] = r;
    out[i * 3 + 1] = g;
    out[i * 3 + 2] = b;
  }
}

function randomSpherePoints(count: number, radius: number, out: Float32Array) {
  const v = new THREE.Vector3();
  for (let i = 0; i < count; i++) {
    v.set(
      Math.random() * 2 - 1,
      Math.random() * 2 - 1,
      Math.random() * 2 - 1
    ).normalize();
    const r = radius * Math.cbrt(Math.random());
    v.multiplyScalar(r);
    out[i * 3] = v.x;
    out[i * 3 + 1] = v.y;
    out[i * 3 + 2] = v.z;
  }
}

function WordParticles({
  font,
  role,
  particleCount,
  mouseEnabled,
}: {
  font: TypefaceFont;
  role: Role;
  particleCount: number;
  mouseEnabled: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { camera, gl } = useThree();

  const easePo3 = useMemo(() => gsap.parseEase("power3.out"), []);
  const easePo2In = useMemo(() => gsap.parseEase("power2.in"), []);

  const cached = useMemo(() => {
    const roles: Role[] = ["analyst", "scientist", "engineer"];
    const map = {} as Record<Role, CachedWord>;
    for (const r of roles) {
      const cw = sampleWordPositions(font, WORDS[r], particleCount);
      fillColorsForRole(cw, r, cw.colors);
      map[r] = cw;
    }
    return map;
  }, [font, particleCount]);

  const posAttr = useMemo(() => {
    const a = new THREE.BufferAttribute(
      new Float32Array(particleCount * 3),
      3
    );
    a.setUsage(THREE.DynamicDrawUsage);
    return a;
  }, [particleCount]);

  const colAttr = useMemo(() => {
    const a = new THREE.BufferAttribute(
      new Float32Array(particleCount * 3),
      3
    );
    a.setUsage(THREE.DynamicDrawUsage);
    return a;
  }, [particleCount]);

  const sizeAttr = useMemo(() => {
    const s = new Float32Array(particleCount);
    s.fill(0.028);
    return new THREE.BufferAttribute(s, 1);
  }, [particleCount]);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", posAttr);
    g.setAttribute("aColor", colAttr);
    g.setAttribute("aSize", sizeAttr);
    return g;
  }, [posAttr, colAttr, sizeAttr]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uPixelRatio: { value: Math.min(window.devicePixelRatio, 1.5) },
        },
        vertexShader: wordVertexShader,
        fragmentShader: wordFragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    []
  );

  const wRef = useRef({
    startPos: new Float32Array(particleCount * 3),
    endPos: new Float32Array(particleCount * 3),
    delays: new Float32Array(particleCount),
    rnd: new Float32Array(particleCount * 3),
    breatheFreq: new Float32Array(particleCount),
    breathePhase: new Float32Array(particleCount),
    basePos: new Float32Array(particleCount * 3),
    repel: new Float32Array(particleCount * 3),
    repelVel: new Float32Array(particleCount * 3),
    repelTarget: new Float32Array(particleCount * 3),
    elasticMul: 1,
    morphActive: false,
    initialDone: false,
    currentRole: "analyst" as Role,
    mouse: new THREE.Vector2(999, 999),
    plane: new THREE.Plane(new THREE.Vector3(0, 0, 1), 0),
    raycaster: new THREE.Raycaster(),
    mouse3d: new THREE.Vector3(),
    tmp: new THREE.Vector3(),
    tmp2: new THREE.Vector3(),
    explodeEnd: new Float32Array(particleCount * 3),
  });

  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const elasticTween = useRef<gsap.core.Tween | null>(null);
  const roleProp = useRef(role);
  roleProp.current = role;
  const morphToRef = useRef<(next: Role) => void>(() => {});

  const morphTo = useCallback(
    (next: Role) => {
      const w = wRef.current;
      if (!w.initialDone || w.currentRole === next) return;
      const prev = w.currentRole;
      w.morphActive = true;
      timelineRef.current?.kill();

      const startSnapshot = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount * 3; i++) {
        startSnapshot[i] = w.basePos[i] + w.repel[i];
      }
      w.repel.fill(0);
      w.repelVel.fill(0);
      w.repelTarget.fill(0);

      const explodeDirs = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount; i++) {
        const j = i * 3;
        let vx = w.rnd[j] + (Math.random() - 0.5) * 0.5;
        let vy = w.rnd[j + 1] + (Math.random() - 0.5) * 0.5;
        let vz = w.rnd[j + 2] + (Math.random() - 0.5) * 0.5;
        const len = Math.sqrt(vx * vx + vy * vy + vz * vz) || 1;
        const mag = 2.25;
        vx = (vx / len) * mag;
        vy = (vy / len) * mag;
        vz = (vz / len) * mag;
        explodeDirs[j] = vx;
        explodeDirs[j + 1] = vy;
        explodeDirs[j + 2] = vz;
      }

      const explodeEnd = w.explodeEnd;
      const nextPos = cached[next].positions;
      const nextCol = new Float32Array(particleCount * 3);
      fillColorsForRole(cached[next], next, nextCol);
      const prevColArr = new Float32Array(particleCount * 3);
      prevColArr.set(cached[prev].colors);

      const clock = { t: 0 };
      const tl = gsap.timeline({
        onComplete: () => {
          w.morphActive = false;
          w.currentRole = next;
          w.basePos.set(nextPos);
          const carr = colAttr.array as Float32Array;
          carr.set(cached[next].colors);
          colAttr.needsUpdate = true;
          const pending = roleProp.current;
          if (pending !== next) {
            morphToRef.current(pending);
          }
        },
      });
      timelineRef.current = tl;

      tl.to(clock, {
        t: 0.3,
        duration: 0.3,
        ease: "none",
        onUpdate: () => {
          const wall = clock.t;
          for (let i = 0; i < particleCount; i++) {
            const d = w.delays[i];
            const raw = Math.min(1, Math.max(0, (wall - d) / 0.3));
            const e = easePo2In(raw);
            const j = i * 3;
            explodeEnd[j] = startSnapshot[j] + explodeDirs[j] * e;
            explodeEnd[j + 1] = startSnapshot[j + 1] + explodeDirs[j + 1] * e;
            explodeEnd[j + 2] = startSnapshot[j + 2] + explodeDirs[j + 2] * e;
            w.basePos[j] = explodeEnd[j];
            w.basePos[j + 1] = explodeEnd[j + 1];
            w.basePos[j + 2] = explodeEnd[j + 2];
            const cu = easePo3(Math.min(1, raw * 1.05));
            const carr = colAttr.array as Float32Array;
            for (let c = 0; c < 3; c++) {
              const k = j + c;
              carr[k] =
                prevColArr[k] + (nextCol[k] - prevColArr[k]) * cu * 0.25;
            }
          }
          posAttr.needsUpdate = true;
          colAttr.needsUpdate = true;
        },
      }).to(clock, {
        t: 1.3,
        duration: 1.0,
        ease: "none",
        onUpdate: () => {
          const wall = clock.t - 0.3;
          for (let i = 0; i < particleCount; i++) {
            const d = w.delays[i];
            const raw = Math.min(1, Math.max(0, (wall - d) / 1.0));
            const e = easePo3(raw);
            const j = i * 3;
            w.basePos[j] = explodeEnd[j] + (nextPos[j] - explodeEnd[j]) * e;
            w.basePos[j + 1] =
              explodeEnd[j + 1] + (nextPos[j + 1] - explodeEnd[j + 1]) * e;
            w.basePos[j + 2] =
              explodeEnd[j + 2] + (nextPos[j + 2] - explodeEnd[j + 2]) * e;
            const cu = easePo3(raw);
            const carr = colAttr.array as Float32Array;
            for (let c = 0; c < 3; c++) {
              const k = j + c;
              carr[k] =
                prevColArr[k] +
                (nextCol[k] - prevColArr[k]) * (0.25 + cu * 0.75);
            }
          }
          posAttr.needsUpdate = true;
          colAttr.needsUpdate = true;
        },
      });
    },
    [cached, colAttr, easePo2In, easePo3, particleCount, posAttr]
  );

  morphToRef.current = morphTo;

  useEffect(() => {
    const w = wRef.current;
    for (let i = 0; i < particleCount; i++) {
      w.delays[i] = Math.random() * 0.15;
      w.breatheFreq[i] = 0.8 + Math.random() * 1.4;
      w.breathePhase[i] = Math.random() * Math.PI * 2;
      w.rnd[i * 3] = Math.random() * 2 - 1;
      w.rnd[i * 3 + 1] = Math.random() * 2 - 1;
      w.rnd[i * 3 + 2] = Math.random() * 2 - 1;
    }
    randomSpherePoints(particleCount, 20, w.startPos);
    w.endPos.set(cached.analyst.positions);
    w.currentRole = "analyst";
    w.basePos.set(cached.analyst.positions);
  }, [cached, particleCount]);

  const runInitial = useCallback(() => {
    const w = wRef.current;
    w.morphActive = true;
    randomSpherePoints(particleCount, 20, w.startPos);
    w.endPos.set(cached.analyst.positions);
    timelineRef.current?.kill();

    const clock = { t: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        w.morphActive = false;
        w.basePos.set(cached.analyst.positions);
        w.currentRole = "analyst";
        w.initialDone = true;
        const r = roleProp.current;
        if (r !== "analyst") {
          morphToRef.current(r);
        }
      },
    });
    timelineRef.current = tl;

    tl.to(clock, {
      t: 1.35,
      duration: 1.35,
      ease: "none",
      onUpdate: () => {
        const wall = clock.t;
        for (let i = 0; i < particleCount; i++) {
          const d = w.delays[i];
          const raw = Math.min(1, Math.max(0, (wall - d) / 1.2));
          const e = easePo3(raw);
          const j = i * 3;
          w.basePos[j] = w.startPos[j] + (w.endPos[j] - w.startPos[j]) * e;
          w.basePos[j + 1] =
            w.startPos[j + 1] + (w.endPos[j + 1] - w.startPos[j + 1]) * e;
          w.basePos[j + 2] =
            w.startPos[j + 2] + (w.endPos[j + 2] - w.startPos[j + 2]) * e;
        }
        posAttr.needsUpdate = true;
        const carr = colAttr.array as Float32Array;
        carr.set(cached.analyst.colors);
        colAttr.needsUpdate = true;
      },
    });
  }, [cached.analyst.colors, cached.analyst.positions, easePo3, particleCount, posAttr, colAttr]);

  useEffect(() => {
    runInitial();
  }, [runInitial]);

  useEffect(() => {
    const w = wRef.current;
    if (!w.initialDone || w.morphActive) return;
    if (w.currentRole !== role) {
      morphTo(role);
    }
  }, [role, morphTo]);

  const applyBreathing = useCallback(
    (elapsed: number) => {
      const w = wRef.current;
      if (w.morphActive) return;
      const tgt = cached[w.currentRole];
      for (let i = 0; i < particleCount; i++) {
        const z0 = tgt.positions[i * 3 + 2];
        const breathe =
          Math.sin(elapsed * w.breatheFreq[i] + w.breathePhase[i]) * 0.05;
        w.basePos[i * 3] = tgt.positions[i * 3];
        w.basePos[i * 3 + 1] = tgt.positions[i * 3 + 1];
        w.basePos[i * 3 + 2] = z0 + breathe;
      }
    },
    [cached, particleCount]
  );

  useFrame((state) => {
    material.uniforms.uPixelRatio.value = Math.min(
      window.devicePixelRatio,
      1.5
    );
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0003;
    }
    const w = wRef.current;
    applyBreathing(state.clock.elapsedTime);

    if (mouseEnabled && !w.morphActive && w.initialDone) {
      w.raycaster.setFromCamera(w.mouse, camera);
      const hit = new THREE.Vector3();
      w.raycaster.ray.intersectPlane(w.plane, hit);
      w.mouse3d.copy(hit);
      const falloff = 1.5;
      const push = 0.4;
      for (let i = 0; i < particleCount; i++) {
        w.tmp.set(
          w.basePos[i * 3],
          w.basePos[i * 3 + 1],
          w.basePos[i * 3 + 2]
        );
        w.tmp2.copy(w.tmp).sub(w.mouse3d);
        const d = w.tmp2.length();
        if (d < falloff && d > 1e-6) {
          w.tmp2.normalize().multiplyScalar(push * (1 - d / falloff));
          w.repelTarget[i * 3] = w.tmp2.x;
          w.repelTarget[i * 3 + 1] = w.tmp2.y;
          w.repelTarget[i * 3 + 2] = w.tmp2.z;
        } else {
          w.repelTarget[i * 3] = 0;
          w.repelTarget[i * 3 + 1] = 0;
          w.repelTarget[i * 3 + 2] = 0;
        }
      }
      const stiff = 0.28;
      const damp = 0.82;
      const em = w.elasticMul;
      for (let i = 0; i < particleCount * 3; i++) {
        const target = w.repelTarget[i] * em;
        w.repelVel[i] += (target - w.repel[i]) * stiff;
        w.repelVel[i] *= damp;
        w.repel[i] += w.repelVel[i];
      }
    } else {
      let max = 0;
      for (let i = 0; i < particleCount * 3; i++) {
        w.repelTarget[i] = 0;
        w.repelVel[i] += (0 - w.repel[i]) * 0.35;
        w.repelVel[i] *= 0.88;
        w.repel[i] += w.repelVel[i];
        max = Math.max(max, Math.abs(w.repel[i]));
      }
      if (!mouseEnabled && max < 1e-4) w.repel.fill(0);
    }

    const arr = posAttr.array as Float32Array;
    for (let i = 0; i < particleCount * 3; i++) {
      arr[i] = w.basePos[i] + w.repel[i];
    }
    posAttr.needsUpdate = true;

    if (!w.morphActive) {
      const carr = colAttr.array as Float32Array;
      carr.set(cached[w.currentRole].colors);
      colAttr.needsUpdate = true;
    }
  });

  useEffect(() => {
    const w = wRef.current;
    const onMove = (e: PointerEvent) => {
      if (!mouseEnabled) return;
      elasticTween.current?.kill();
      w.elasticMul = 1;
      const rect = gl.domElement.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      w.mouse.set(x, y);
    };
    const onLeave = () => {
      if (!mouseEnabled) return;
      elasticTween.current?.kill();
      const o = { m: w.elasticMul };
      elasticTween.current = gsap.to(o, {
        m: 0,
        duration: 0.85,
        ease: "elastic.out(1, 0.3)",
        onUpdate: () => {
          w.elasticMul = o.m;
        },
        onComplete: () => {
          w.elasticMul = 0;
          w.repel.fill(0);
          w.repelVel.fill(0);
        },
      });
    };
    const el = gl.domElement;
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      elasticTween.current?.kill();
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [gl.domElement, mouseEnabled]);

  return (
    <group ref={groupRef}>
      <points geometry={geometry} material={material} renderOrder={1} />
    </group>
  );
}

function DataStreamParticles({ count }: { count: number }) {
  const geomRef = useRef<THREE.BufferGeometry | null>(null);

  const { positions, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 3;
      sz[i] = 0.015;
    }
    return { positions: pos, sizes: sz };
  }, [count]);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage)
    );
    g.setAttribute("aStreamSize", new THREE.BufferAttribute(sizes, 1));
    geomRef.current = g;
    return g;
  }, [positions, sizes]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uPixelRatio: { value: Math.min(window.devicePixelRatio, 1.5) },
        },
        vertexShader: streamVertexShader,
        fragmentShader: streamFragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    []
  );

  useFrame(() => {
    material.uniforms.uPixelRatio.value = Math.min(
      window.devicePixelRatio,
      1.5
    );
    const g = geomRef.current;
    if (!g) return;
    const attr = g.getAttribute("position") as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    const top = 5;
    const bot = -5;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += 0.003;
      if (arr[i * 3 + 1] > top) {
        arr[i * 3 + 1] = bot + Math.random() * 0.5;
        arr[i * 3] = (Math.random() - 0.5) * 8;
        arr[i * 3 + 2] = (Math.random() - 0.5) * 3;
      }
    }
    attr.needsUpdate = true;
  });

  return (
    <points geometry={geometry} material={material} renderOrder={0} />
  );
}

function Scene({
  role,
  particleCount,
  mouseEnabled,
}: {
  role: Role;
  particleCount: number;
  mouseEnabled: boolean;
}) {
  const font = useLoader(FontLoader, "/fonts/inter_bold.typeface.json");
  return (
    <>
      <DataStreamParticles count={8000} />
      <WordParticles
        font={font}
        role={role}
        particleCount={particleCount}
        mouseEnabled={mouseEnabled}
      />
    </>
  );
}

const canvasFallback = (
  <div className="absolute inset-0 bg-[#0A0A0F]" aria-hidden />
);

export function ParticleWordMorphCanvas({ role }: { role: Role }) {
  const [wide, setWide] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= 768 : true
  );

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const fn = () => setWide(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  const particleCount = wide ? 40_000 : 15_000;
  const mouseEnabled = wide;

  if (!wide) {
    return <MobileRoleGradient role={role} />;
  }

  return (
    <div className="pointer-events-auto absolute inset-y-0 right-0 z-[5] hidden min-h-[90vh] w-1/2 min-w-0 md:block">
      <Suspense fallback={canvasFallback}>
        <Canvas
          className="h-full w-full touch-none"
          dpr={[1, 1.5]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            stencil: false,
            depth: true,
          }}
          camera={{ position: [0, 0, 5], fov: 50, near: 0.1, far: 100 }}
          onCreated={({ gl }) => {
            gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
          }}
        >
          <Scene
            role={role}
            particleCount={particleCount}
            mouseEnabled={mouseEnabled}
          />
          <Preload all />
        </Canvas>
      </Suspense>
    </div>
  );
}

function MobileRoleGradient({ role }: { role: Role }) {
  const word = WORDS[role];
  const gradientClass =
    role === "analyst"
      ? "from-[#7C3AFF] to-[#22d3ee]"
      : role === "scientist"
        ? "from-[#7C3AFF] to-[#FF2D78]"
        : "from-[#7C3AFF] to-[#39FF14]";

  return (
    <div className="mt-8 flex justify-center md:hidden">
      <span
        className={`bg-gradient-to-r ${gradientClass} bg-clip-text font-display text-4xl font-bold tracking-tight text-transparent`}
        aria-hidden
      >
        {word}
      </span>
    </div>
  );
}
