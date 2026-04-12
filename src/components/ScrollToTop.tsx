import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function scrollToId(id: string) {
  const el = document.getElementById(id);
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function storageKey(pathname: string) {
  return `portfolio:scrollY:${pathname}`;
}

/**
 * - Hash in URL → scroll to that section once, then clear the hash so reload restores vertical scroll.
 * - No hash → restore last vertical scroll for this path (reload keeps you in the same section).
 * - Route change without hash (e.g. `/` → `/projects`) → scroll to top.
 */
export function ScrollToTop() {
  const { pathname, hash, search } = useLocation();
  const navigate = useNavigate();
  const prevPath = useRef<string | null>(null);
  const skipRestoreRef = useRef(false);

  useEffect(() => {
    if (hash) {
      const id = hash.replace(/^#/, "");
      let tries = 0;
      let cancelled = false;
      let stripTimer: number | undefined;
      const tick = () => {
        if (cancelled) return;
        const el = document.getElementById(id);
        if (el) {
          scrollToId(id);
          stripTimer = window.setTimeout(() => {
            skipRestoreRef.current = true;
            navigate(`${pathname}${search}`, { replace: true });
          }, 550);
          return;
        }
        tries += 1;
        if (tries < 25) {
          window.requestAnimationFrame(tick);
        } else {
          skipRestoreRef.current = true;
          navigate(`${pathname}${search}`, { replace: true });
        }
      };
      const t = window.setTimeout(tick, 0);
      prevPath.current = pathname;
      return () => {
        cancelled = true;
        window.clearTimeout(t);
        if (stripTimer !== undefined) window.clearTimeout(stripTimer);
      };
    }

    if (skipRestoreRef.current) {
      skipRestoreRef.current = false;
      prevPath.current = pathname;
      return;
    }

    const pathChanged = prevPath.current !== null && prevPath.current !== pathname;
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
  }, [pathname, hash, search, navigate]);

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
