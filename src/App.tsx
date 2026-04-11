import { lazy, Suspense } from "react";
import { RoleProvider } from "./context/RoleProvider";
import { ScrollProgress } from "./components/ScrollProgress";

const BackgroundCanvas = lazy(async () => {
  const m = await import("./components/scene/BackgroundCanvas");
  return { default: m.BackgroundCanvas };
});
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Skills } from "./components/Skills";
import { Projects } from "./components/Projects";
import { Experience } from "./components/Experience";
import { Contact } from "./components/Contact";

function App() {
  return (
    <RoleProvider>
      <div className="relative min-h-screen overflow-x-hidden bg-base text-white">
        <ScrollProgress />
        {/* Decoration only: sits under all content (see z-index + section solids). Hidden on small screens. */}
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
          <main>
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Experience />
            <Contact />
          </main>
          <footer className="border-t border-white/[0.06] bg-base px-4 py-8 text-center text-xs text-meta sm:px-6">
            © 2026 Abhyansh Anand
          </footer>
        </div>
      </div>
    </RoleProvider>
  );
}

export default App;
