import { useEffect, useState } from "react";

export function ScrollProgress() {
  const [p, setP] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      const next = scrollable <= 0 ? 1 : window.scrollY / scrollable;
      setP(Math.min(1, Math.max(0, next)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="pointer-events-none fixed left-0 right-0 top-0 z-[100] h-0.5 md:h-[2px]"
      aria-hidden
    >
      <div
        className="h-full origin-left bg-gradient-to-r from-accent-violet via-accent-acid to-accent-violet transition-[transform] duration-150 ease-out"
        style={{
          transform: `scaleX(${p})`,
          backgroundSize: "200% 100%",
        }}
      />
    </div>
  );
}
