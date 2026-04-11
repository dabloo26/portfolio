import { Hero } from "../components/Hero";
import { About } from "../components/About";
import { Experience } from "../components/Experience";
import { KeyImpact } from "../components/KeyImpact";
import { ProjectsPreview } from "../components/ProjectsPreview";
import { Contact } from "../components/Contact";

export function HomePage() {
  return (
    <main>
      <Hero />
      <About />
      <Experience />
      <KeyImpact />
      <ProjectsPreview />
      <Contact />
    </main>
  );
}
