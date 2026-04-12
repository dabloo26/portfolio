import type { ReactNode } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RoleProvider } from "./context/RoleProvider";
import { GlobalHeroBackdrop } from "./components/HeroScene";
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
        <Header />
        <ScrollToTop />
        {children}
        <footer className="border-t border-white/[0.06] bg-base/80 px-4 py-8 text-center text-xs text-meta backdrop-blur-md sm:px-6">
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
  return (
    <RoleProvider>
      <BrowserRouter basename={routerBasename()}>
        <div className="relative min-h-screen overflow-x-hidden bg-transparent text-white">
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
      </BrowserRouter>
    </RoleProvider>
  );
}

export default App;
