import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

function scrollToId(id: string) {
  const el = document.getElementById(id);
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function storageKey(pathname: string) {
  return `portfolio:scrollY:${pathname}`;
}

/**
 * - Hash in URL → scroll to that section (nav, CTAs).
 * - No hash → restore last vertical scroll for this path (reload keeps you in the same section).
 * - Route change without hash (e.g. `/` → `/projects`) → scroll to top.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const prevPath = useRef<string | null>(null);

  useEffect(() => {
    if (hash) {
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
      prevPath.current = pathname;
      return () => {
        cancelled = true;
        window.clearTimeout(t);
      };
    }

    const pathChanged =
      prevPath.current !== null && prevPath.current !== pathname;
    prevPath.current = pathname;

    if (pathChanged) {
      window.scrollTo(0, 0);
      return;
    }

    const key = storageKey(pathname);
    let y: number | null = null;
    try {
      const raw = sessionStorage.getItem(key);
      if (raw != null) {
        const n = parseInt(raw, 10);
        if (!Number.isNaN(n) && n >= 0) y = n;
      }
    } catch {
      /* ignore */
    }

    if (y != null) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.scrollTo(0, y!);
        });
      });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  useEffect(() => {
    let raf = 0;
    const save = () => {
      try {
        sessionStorage.setItem(storageKey(pathname), String(Math.round(window.scrollY)));
      } catch {
        /* ignore */
      }
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(save);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pagehide", save);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pagehide", save);
      cancelAnimationFrame(raf);
      save();
    };
  }, [pathname]);

  return null;
}
