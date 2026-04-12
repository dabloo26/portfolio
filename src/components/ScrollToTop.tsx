import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function scrollToId(id: string) {
  const el = document.getElementById(id);
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/**
 * - Path change without hash → scroll to top (e.g. open `/projects`).
 * - Hash present → scroll to `#id` (nav, hero CTA, Key Impact links).
 * Retries briefly so targets exist after route transitions (e.g. `/projects` → `/#about`).
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }

    const id = hash.replace(/^#/, "");
    let tries = 0;
    let cancelled = false;
    const tick = () => {
      if (cancelled) return;
      const el = document.getElementById(id);
      if (el) {
        scrollToId(id);
        return;
      }
      tries += 1;
      if (tries < 25) {
        window.requestAnimationFrame(tick);
      }
    };

    const t = window.setTimeout(tick, 0);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, [pathname, hash]);

  return null;
}
