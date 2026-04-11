import { useEffect, useRef } from "react";

const TARGETS = ["DATA ANALYST", "DATA SCIENTIST", "DATA ENGINEER"];
const WIDTH = 16;

export function HeroRoleMorph() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio, 2);
    const w = 340;
    const h = 200;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.scale(dpr, dpr);

    const buf = Array.from({ length: WIDTH }, () => " ");
    let targetIdx = 0;
    let col = 0;
    let pause = 0;
    let raf = 0;
    let frame = 0;

    const tick = () => {
      frame++;
      const tgt = TARGETS[targetIdx] ?? TARGETS[0];
      const padded = tgt.padEnd(WIDTH, " ");

      if (pause > 0) {
        pause--;
      } else if (col < padded.length) {
        buf[col] = padded[col] ?? " ";
        col++;
        if (col >= padded.length) pause = 85;
      } else {
        targetIdx = (targetIdx + 1) % TARGETS.length;
        col = 0;
        for (let i = 0; i < WIDTH; i++) buf[i] = " ";
      }

      // Matrix flicker on trailing columns
      for (let i = col; i < WIDTH; i++) {
        if (Math.random() < 0.08) {
          buf[i] = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[(Math.random() * 26) | 0] ?? "X";
        }
      }

      ctx.fillStyle = "#0a0a0f";
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(124, 58, 255, 0.4)";
      ctx.strokeRect(0.5, 0.5, w - 1, h - 1);

      ctx.font = "600 13px JetBrains Mono, ui-monospace, monospace";
      ctx.fillStyle = "#7C3AFF";
      ctx.fillText("> ROLE_KEYWORDS — stream()", 14, 26);
      ctx.fillStyle = "#888888";
      ctx.font = "500 11px JetBrains Mono, ui-monospace, monospace";
      ctx.fillText("// ANALYST → SCIENTIST → ENGINEER", 14, 46);

      const line = buf.join("");
      ctx.font = "600 17px JetBrains Mono, ui-monospace, monospace";
      const glow = 0.65 + Math.sin(frame * 0.06) * 0.35;
      ctx.fillStyle = `rgba(57, 255, 20, ${glow})`;
      ctx.fillText(line, 14, 88);

      ctx.fillStyle = "#39FF14";
      const cx = Math.min(col, WIDTH - 1);
      ctx.fillRect(14 + cx * 9.5, 108, 8, 2);

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-[340px] lg:mx-0">
      <canvas
        ref={ref}
        className="rounded-md shadow-[0_0_48px_-12px_rgba(124,58,255,0.55)]"
        aria-hidden
      />
    </div>
  );
}
