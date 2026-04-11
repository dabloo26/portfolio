import { lazy, Suspense, type ReactNode } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RoleProvider } from "./context/RoleProvider";
import { ScrollProgress } from "./components/ScrollProgress";
import { ScrollToTop } from "./components/ScrollToTop";
import { Header } from "./components/Header";
import { HomePage } from "./pages/HomePage";
import { ProjectsPage } from "./pages/ProjectsPage";

const BackgroundCanvas = lazy(async () => {
  const m = await import("./components/scene/BackgroundCanvas");
  return { default: m.BackgroundCanvas };
});

function Shell({ children }: { children: ReactNode }) {
  return (
    <>
      <ScrollProgress />
      <div className="pointer-events-none fixed inset-0 z-[1] hidden min-h-screen md:block">
        <Suspense
          fallback={
            <div
              className="h-full w-full bg-[radial-gradient(ellipse_100%_70%_at_50%_0%,rgba(124,58,255,0.12),transparent),radial-gradient(ellipse_60%_50%_at_85%_35%,rgba(57,255,20,0.06),transparent)]"
              aria-hidden
            />
          }
        >
          <BackgroundCanvas />
        </Suspense>
      </div>
      <div className="relative z-[30] isolate">
        <Header />
        <ScrollToTop />
        {children}
        <footer className="border-t border-white/[0.06] bg-base px-4 py-8 text-center text-xs text-meta sm:px-6">
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
        <div className="relative min-h-screen overflow-x-hidden bg-base text-white">
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
