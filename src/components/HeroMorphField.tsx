import {
  useCallback,
  useEffect,
  useRef,
  type RefObject,
} from "react";
import type { Role } from "../data/profile";

function isInteractiveTarget(el: EventTarget | null) {
  if (!(el instanceof Element)) return false;
  return Boolean(
    el.closest(
      "a,button,input,textarea,select,label,[role='button'],[contenteditable='true']"
    )
  );
}

export function HeroMorphField({
  role,
  boundsRef,
}: {
  role: Role;
  boundsRef: RefObject<HTMLElement | null>;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0.55, y: 0.45 });
  const smooth = useRef({ x: 0.55, y: 0.45 });
  const pulse = useRef(0);
  const raf = useRef<number>(0);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      target.current.x = e.clientX / w;
      target.current.y = e.clientY / h;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const onPointerDown = useCallback(
    (e: PointerEvent) => {
      const bounds = boundsRef.current;
      if (!bounds || !bounds.contains(e.target as Node)) return;
      if (isInteractiveTarget(e.target)) return;
      pulse.current = 1;
    },
    [boundsRef]
  );

  useEffect(() => {
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [onPointerDown]);

  useEffect(() => {
    const tick = () => {
      const root = rootRef.current;
      const stage = stageRef.current;
      if (root && stage) {
        const k = 0.09;
        smooth.current.x += (target.current.x - smooth.current.x) * k;
        smooth.current.y += (target.current.y - smooth.current.y) * k;
        pulse.current *= 0.9;
        if (pulse.current < 0.02) pulse.current = 0;

        const { x: mx, y: my } = smooth.current;
        root.style.setProperty("--hero-mx", mx.toFixed(4));
        root.style.setProperty("--hero-my", my.toFixed(4));
        root.style.setProperty("--hero-pulse", pulse.current.toFixed(4));

        const rx = (my - 0.5) * -16;
        const ry = (mx - 0.5) * 22;
        const px = (mx - 0.5) * 28;
        const py = (my - 0.5) * 22;
        stage.style.transform = `translate3d(${px}px, ${py}px, 0) rotateX(${rx}deg) rotateY(${ry}deg)`;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  return (
    <div
      ref={rootRef}
      className="hero-morph pointer-events-none absolute inset-0 z-[5] block overflow-hidden"
      aria-hidden
      data-role={role}
    >
      <div className="hero-morph__glow" />
      <div className="hero-morph__perspective">
        <div ref={stageRef} className="hero-morph__stage">
          <div className="hero-morph__deep" />
          <div className="hero-morph__mid">
            {role === "analyst" && <AnalystOrnaments />}
            {role === "scientist" && <ScientistOrnaments />}
            {role === "engineer" && <EngineerOrnaments />}
          </div>
          <div className="hero-morph__fore" />
        </div>
      </div>
      <div className="hero-morph__vignette" />
    </div>
  );
}

function AnalystOrnaments() {
  const heights = [42, 68, 55, 88, 36, 72, 61, 94, 48, 77, 52, 83, 39, 66];
  return (
    <div className="hero-morph__analyst-wrap">
      <div className="hero-morph__analyst-grid" />
      <div className="hero-morph__analyst-bars">
        {heights.map((h, i) => (
          <span
            key={i}
            className="hero-morph__analyst-bar"
            style={{
              height: `${h}%`,
              animationDelay: `${i * 0.07}s`,
            }}
          />
        ))}
      </div>
      <div className="hero-morph__analyst-scan" />
    </div>
  );
}

function ScientistOrnaments() {
  return (
    <div className="hero-morph__sci-wrap">
      <div className="hero-morph__sci-blob hero-morph__sci-blob--a" />
      <div className="hero-morph__sci-blob hero-morph__sci-blob--b" />
      <div className="hero-morph__sci-blob hero-morph__sci-blob--c" />
      <div className="hero-morph__sci-ring" />
    </div>
  );
}

function EngineerOrnaments() {
  return (
    <div className="hero-morph__eng-wrap">
      <div className="hero-morph__eng-hex" />
      <div className="hero-morph__eng-beam" />
      <div className="hero-morph__eng-frame" />
      <div className="hero-morph__eng-ticks" />
    </div>
  );
}
