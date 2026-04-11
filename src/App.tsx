import { lazy, Suspense } from "react";
import { RoleProvider } from "./context/RoleProvider";

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
      <div className="relative min-h-screen overflow-x-hidden bg-ink-950 text-slate-100">
        {/* Full-viewport 3D so motion + scroll parallax stay visible site-wide */}
        <div className="pointer-events-none fixed inset-0 z-0 min-h-screen">
          <Suspense
            fallback={
              <div
                className="h-full w-full bg-[radial-gradient(ellipse_90%_60%_at_50%_-10%,rgba(34,211,238,0.14),transparent),radial-gradient(ellipse_50%_40%_at_80%_40%,rgba(167,139,250,0.1),transparent)]"
                aria-hidden
              />
            }
          >
            <BackgroundCanvas />
          </Suspense>
        </div>
        <div className="relative z-10">
          <Header />
          <main>
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Experience />
            <Contact />
          </main>
          <footer className="border-t border-white/[0.06] px-4 py-8 text-center text-[11px] text-slate-600 sm:px-6">
            © {new Date().getFullYear()} Abhyansh Anand — one URL with a Role Lens
            for analyst-, scientist-, and engineer-shaped conversations.
          </footer>
        </div>
      </div>
    </RoleProvider>
  );
}

export default App;
