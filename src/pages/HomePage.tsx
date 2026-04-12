import { Hero } from "../components/Hero";
import { About } from "../components/About";
import { Experience } from "../components/Experience";
import { Skills } from "../components/Skills";
import { KeyImpact } from "../components/KeyImpact";
import { ProjectsPreview } from "../components/ProjectsPreview";
import { Contact } from "../components/Contact";

export function HomePage() {
  return (
    <main className="pointer-events-none">
      <Hero />
      <div className="pointer-events-auto">
        <About />
        <Experience />
        <Skills />
        <KeyImpact />
        <ProjectsPreview />
        <Contact />
      </div>
    </main>
  );
}
