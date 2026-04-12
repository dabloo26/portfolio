import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppLoadingScreen } from "./components/AppLoadingScreen";
import { LandingPlanetProvider } from "./context/LandingPlanetContext";
import { RoleProvider } from "./context/RoleProvider";
import { GlobalHeroBackdrop } from "./components/HeroScene";
import { GlobalPlanetLayer } from "./components/scene/PlanetScene";
import { ScrollProgress } from "./components/ScrollProgress";
import { ScrollToTop } from "./components/ScrollToTop";
import { Header } from "./components/Header";
import { HomePage } from "./pages/HomePage";
import { ProjectsPage } from "./pages/ProjectsPage";

function Shell({ children }: { children: ReactNode }) {
  return (
    <>
      <ScrollProgress />
      <GlobalHeroBackdrop />
      <div className="relative z-[30] isolate">
        {/* Planet above starfield (z-5), below page copy (z-20) — was z-8 outside shell and effectively hidden */}
        <GlobalPlanetLayer />
        <Header />
        <ScrollToTop />
        <div className="relative z-20">{children}</div>
        <footer className="relative z-20 bg-gradient-to-t from-base/70 via-base/45 to-transparent px-4 py-10 pb-[max(2rem,env(safe-area-inset-bottom))] pt-12 text-center text-xs text-meta sm:px-6">
          © 2026 Abhyansh Anand
        </footer>
      </div>
    </>
  );
}

/** Match React Router to Vite `base` so subpath deploys (e.g. GitHub Pages) don’t render a blank tree. */
function routerBasename(): string | undefined {
  const base = import.meta.env.BASE_URL;
  if (!base || base === "/") return undefined;
  return base.replace(/\/$/, "") || undefined;
}

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay for demo; replace with real asset/model loading if needed
    const timer = setTimeout(() => setLoading(false), 1800); // 1.8s
    return () => clearTimeout(timer);
  }, []);

  return (
    <RoleProvider>
      <BrowserRouter basename={routerBasename()}>
        <LandingPlanetProvider>
          <div className="relative min-h-[100dvh] min-h-[100svh] bg-base text-white">
            <AnimatePresence mode="wait">
              {loading && <AppLoadingScreen key="app-loader" />}
            </AnimatePresence>
            <div style={{ opacity: loading ? 0 : 1, transition: 'opacity 0.5s' }}>
              <Routes>
                <Route
                  path="/"
                  element={
                    <Shell>
                      <HomePage />
                    </Shell>
                  }
                />
                <Route
                  path="/projects"
                  element={
                    <Shell>
                      <ProjectsPage />
                    </Shell>
                  }
                />
              </Routes>
            </div>
          </div>
        </LandingPlanetProvider>
      </BrowserRouter>
    </RoleProvider>
  );
}

export default App;
