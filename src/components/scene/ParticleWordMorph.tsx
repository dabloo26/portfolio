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
  gl_PointSize = aSize * (420.0 / max(-mvPosition.z, 0.12)) * uPixelRatio;
  gl_Position = projectionMatrix * mvPosition;
}
`;

const wordFragmentShader = `
varying vec3 vColor;
void main() {
  vec2 p = gl_PointCoord - vec2(0.5);
  float d = length(p);
  if (d > 0.5) discard;
  float disk = smoothstep(0.5, 0.22, d);
  float core = exp(-d * d * 14.0);
  vec3 rgb = vColor * (0.72 + 0.55 * core);
  float alpha = clamp(disk * 0.92 + core * 0.35, 0.0, 1.0);
  gl_FragColor = vec4(rgb, alpha);
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
    size: 0.5,
    depth: 0.1,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.014,
    bevelSize: 0.01,
    bevelSegments: 3,
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

function buildWordCache(
  font: TypefaceFont,
  particleCount: number
): Record<Role, CachedWord> {
  const roles: Role[] = ["analyst", "scientist", "engineer"];
  const map = {} as Record<Role, CachedWord>;
  for (const r of roles) {
    const cw = sampleWordPositions(font, WORDS[r], particleCount);
    fillColorsForRole(cw, r, cw.colors);
    map[r] = cw;
  }
  return map;
}

/** Defers ~120k MeshSurfaceSampler ops so the main thread can paint the page first. */
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
  const [cached, setCached] = useState<Record<Role, CachedWord> | null>(null);

  useEffect(() => {
    let cancelled = false;
    const id = window.setTimeout(() => {
      const map = buildWordCache(font, particleCount);
      if (!cancelled) setCached(map);
    }, 0);
    return () => {
      cancelled = true;
      window.clearTimeout(id);
    };
  }, [font, particleCount]);

  if (!cached) return null;

  return (
    <WordParticlesInner
      cached={cached}
      role={role}
      particleCount={particleCount}
      mouseEnabled={mouseEnabled}
    />
  );
}

function WordParticlesInner({
  cached,
  role,
  particleCount,
  mouseEnabled,
}: {
  cached: Record<Role, CachedWord>;
  role: Role;
  particleCount: number;
  mouseEnabled: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { camera, gl } = useThree();

  const easeOut = useMemo(() => gsap.parseEase("power4.out"), []);
  const easeIn = useMemo(() => gsap.parseEase("expo.in"), []);

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
    for (let i = 0; i < particleCount; i++) {
      s[i] = 0.024 + (i % 97) * 0.00014;
    }
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
        depthTest: true,
        blending: THREE.NormalBlending,
        premultipliedAlpha: false,
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
  const mouseSkipRef = useRef(0);
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
      const explodeEnd = w.explodeEnd;
      const nextPos = cached[next].positions;
      const nextCol = new Float32Array(particleCount * 3);
      fillColorsForRole(cached[next], next, nextCol);
      const prevColArr = new Float32Array(particleCount * 3);
      prevColArr.set(cached[prev].colors);
      {
        const carr = colAttr.array as Float32Array;
        carr.set(prevColArr);
        colAttr.needsUpdate = true;
      }

      let cx = 0;
      let cy = 0;
      let cz = 0;
      for (let i = 0; i < particleCount; i++) {
        const j = i * 3;
        cx += startSnapshot[j];
        cy += startSnapshot[j + 1];
        cz += startSnapshot[j + 2];
      }
      const invN = 1 / particleCount;
      cx *= invN;
      cy *= invN;
      cz *= invN;

      for (let i = 0; i < particleCount; i++) {
        const j = i * 3;
        let vx = w.rnd[j] + (Math.random() - 0.5) * 0.35;
        let vy = w.rnd[j + 1] + (Math.random() - 0.5) * 0.35;
        let vz = w.rnd[j + 2] + (Math.random() - 0.5) * 0.35;
        const ox = startSnapshot[j] - cx;
        const oy = startSnapshot[j + 1] - cy;
        const oz = startSnapshot[j + 2] - cz;
        const rlen = Math.sqrt(ox * ox + oy * oy + oz * oz) || 0.02;
        const br = 0.68;
        vx = (ox / rlen) * br + vx * (1 - br);
        vy = (oy / rlen) * br + vy * (1 - br);
        vz = (oz / rlen) * br + vz * (1 - br);
        const len = Math.sqrt(vx * vx + vy * vy + vz * vz) || 1;
        const mag = 3.4;
        explodeDirs[j] = (vx / len) * mag;
        explodeDirs[j + 1] = (vy / len) * mag;
        explodeDirs[j + 2] = (vz / len) * mag;
      }

      const clock = { t: 0 };
      const explodeDur = 0.34;
      const settleDur = 0.88;
      const settleEaseWindow = 0.82;

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
        t: explodeDur,
        duration: explodeDur,
        ease: "none",
        onUpdate: () => {
          const wall = clock.t;
          for (let i = 0; i < particleCount; i++) {
            const d = w.delays[i] * 0.85;
            const raw = Math.min(1, Math.max(0, (wall - d) / explodeDur));
            const e = easeIn(raw);
            const j = i * 3;
            explodeEnd[j] = startSnapshot[j] + explodeDirs[j] * e;
            explodeEnd[j + 1] = startSnapshot[j + 1] + explodeDirs[j + 1] * e;
            explodeEnd[j + 2] = startSnapshot[j + 2] + explodeDirs[j + 2] * e;
            w.basePos[j] = explodeEnd[j];
            w.basePos[j + 1] = explodeEnd[j + 1];
            w.basePos[j + 2] = explodeEnd[j + 2];
          }
          posAttr.needsUpdate = true;
        },
      }).to(
        clock,
        {
          t: explodeDur + settleDur,
          duration: settleDur,
          ease: "none",
          onUpdate: () => {
            const wall = clock.t - explodeDur;
            for (let i = 0; i < particleCount; i++) {
              const d = w.delays[i] * 0.75;
              const raw = Math.min(
                1,
                Math.max(0, (wall - d) / settleEaseWindow)
              );
              const e = easeOut(raw);
              const j = i * 3;
              w.basePos[j] =
                explodeEnd[j] + (nextPos[j] - explodeEnd[j]) * e;
              w.basePos[j + 1] =
                explodeEnd[j + 1] + (nextPos[j + 1] - explodeEnd[j + 1]) * e;
              w.basePos[j + 2] =
                explodeEnd[j + 2] + (nextPos[j + 2] - explodeEnd[j + 2]) * e;
              const carr = colAttr.array as Float32Array;
              for (let c = 0; c < 3; c++) {
                const k = j + c;
                carr[k] =
                  prevColArr[k] + (nextCol[k] - prevColArr[k]) * e;
              }
            }
            posAttr.needsUpdate = true;
            colAttr.needsUpdate = true;
          },
        },
        ">0.055"
      );
    },
    [cached, colAttr, easeIn, easeOut, particleCount, posAttr]
  );

  morphToRef.current = morphTo;

  useEffect(() => {
    const w = wRef.current;
    for (let i = 0; i < particleCount; i++) {
      w.delays[i] = Math.pow(Math.random(), 0.52) * 0.14;
      w.breatheFreq[i] = 0.65 + Math.random() * 1.1;
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

    const introEase = 1.02;
    const introDur = 1.18;
    tl.to(clock, {
      t: introDur,
      duration: introDur,
      ease: "none",
      onUpdate: () => {
        const wall = clock.t;
        for (let i = 0; i < particleCount; i++) {
          const d = w.delays[i];
          const raw = Math.min(1, Math.max(0, (wall - d) / introEase));
          const e = easeOut(raw);
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
  }, [cached.analyst.colors, cached.analyst.positions, easeOut, particleCount, posAttr, colAttr]);

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
        const x0 = tgt.positions[i * 3];
        const y0 = tgt.positions[i * 3 + 1];
        const z0 = tgt.positions[i * 3 + 2];
        const ph = w.breathePhase[i];
        const fq = w.breatheFreq[i];
        const wob = Math.sin(elapsed * fq + ph);
        const wob2 = Math.sin(elapsed * fq * 1.31 + ph * 0.7);
        w.basePos[i * 3] = x0 + wob2 * 0.012;
        w.basePos[i * 3 + 1] = y0 + wob * 0.01;
        w.basePos[i * 3 + 2] = z0 + wob * 0.042;
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
      const t = state.clock.elapsedTime;
      groupRef.current.rotation.y +=
        0.00022 + Math.sin(t * 0.09) * 0.00007;
    }
    const w = wRef.current;
    applyBreathing(state.clock.elapsedTime);

    const mouseLive =
      mouseEnabled && !w.morphActive && w.initialDone;

    if (mouseLive) {
      mouseSkipRef.current += 1;
      if (mouseSkipRef.current % 2 === 0) {
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
      }
      const stiff = 0.32;
      const damp = 0.84;
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
