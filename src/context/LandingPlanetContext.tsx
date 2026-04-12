import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";

/**
 * 0 = landing “hero” phase (planet biased right); 1 = scrolled (planet drifted toward center).
 * Only meaningful on `/`; other routes stay at 1.
 */
const LandingPlanetContext = createContext(1);

export function LandingPlanetProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (pathname !== "/" && pathname !== "") {
      setProgress(1);
      return;
    }

    const update = () => {
      const hero = document.getElementById("top");
      if (!hero) {
        setProgress(1);
        return;
      }
      const range = Math.max(320, hero.offsetHeight * 0.52);
      const p = Math.min(1, window.scrollY / range);
      setProgress(p);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [pathname]);

  return <LandingPlanetContext.Provider value={progress}>{children}</LandingPlanetContext.Provider>;
}

/** @see LandingPlanetProvider — hook lives here so the context stays private. */
// eslint-disable-next-line react-refresh/only-export-components -- hook paired with provider
export function useLandingPlanetProgress() {
  return useContext(LandingPlanetContext);
}
