import { useEffect, useState } from "react";

type State = "unknown" | "yes" | "no";

/**
 * Avoid loading useGLTF when `public/cute_little_planet.glb` is missing (404 on GitHub Pages
 * otherwise crashes the canvas). HEAD first; some static hosts only allow GET.
 */
export function usePlanetGlbAvailable(url: string): State {
  const [state, setState] = useState<State>("unknown");

  useEffect(() => {
    let cancelled = false;

    async function probe() {
      try {
        let res = await fetch(url, { method: "HEAD", cache: "no-store" });
        if (cancelled) return;
        if (res.ok) {
          setState("yes");
          return;
        }
        if (res.status === 405 || res.status === 501) {
          res = await fetch(url, {
            headers: { Range: "bytes=0-0" },
            cache: "force-cache",
          });
          if (cancelled) return;
          setState(res.ok || res.status === 206 ? "yes" : "no");
          return;
        }
        setState("no");
      } catch {
        if (!cancelled) setState("no");
      }
    }

    void probe();
    return () => {
      cancelled = true;
    };
  }, [url]);

  return state;
}
