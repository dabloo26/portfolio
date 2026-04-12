import { motion } from "framer-motion";
import { useCallback, useState } from "react";
import { person } from "../data/profile";
import { SectionBackdropLayer } from "./ambient/SectionBackdrop";
import { sectionViewport } from "../motion/section";

const githubHandle = (() => {
  try {
    const path = new URL(person.github).pathname.replace(/\/$/, "");
    return path.split("/").filter(Boolean).pop() ?? "GitHub";
  } catch {
    return "GitHub";
  }
})();

const fade = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: sectionViewport,
  transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
};

export function Contact() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = useCallback(async (label: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      setCopied(null);
    }
  }, []);

  return (
    <section
      id="contact"
      className="relative z-10 scroll-mt-32 border-t border-white/[0.05] bg-base/58 px-4 py-24 sm:px-6 sm:pb-32 sm:pt-20"
    >
      <SectionBackdropLayer variant="contact" />
      <div className="relative z-10 mx-auto max-w-6xl">
        <motion.div {...fade}>
          <h2 className="font-condensed text-4xl font-bold uppercase tracking-[0.12em] text-white sm:text-5xl">
            Contact
          </h2>
          <p className="mt-3 max-w-lg font-mono text-sm text-meta">
            Copy-friendly — same details as my resume header.
          </p>
          <div className="mt-10 space-y-3 font-mono text-sm">
            <div className="flex flex-col gap-1 border-b border-white/[0.06] py-3 sm:flex-row sm:items-center sm:gap-6">
              <span className="shrink-0 text-meta">$ email</span>
              <button
                type="button"
                onClick={() => copy("email", person.email)}
                className="text-left text-white transition hover:text-accent-acid"
              >
                {person.email}
              </button>
              {copied === "email" ? (
                <span className="text-xs text-accent-acid">✓ copied</span>
              ) : (
                <span className="text-xs text-meta">click to copy</span>
              )}
            </div>
            <div className="flex flex-col gap-1 border-b border-white/[0.06] py-3 sm:flex-row sm:items-center sm:gap-6">
              <span className="shrink-0 text-meta">$ phone</span>
              <button
                type="button"
                onClick={() => copy("phone", person.phone.replace(/\s/g, ""))}
                className="text-left text-white transition hover:text-accent-acid"
              >
                {person.phone}
              </button>
              {copied === "phone" ? (
                <span className="text-xs text-accent-acid">✓ copied</span>
              ) : (
                <span className="text-xs text-meta">click to copy</span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-white/[0.06] py-3">
              <span className="text-meta">$ open</span>
              <a
                href={person.linkedin}
                target="_blank"
                rel="noreferrer"
                className="text-accent-violet transition hover:text-accent-acid"
              >
                LinkedIn ↗
              </a>
              <a
                href={person.github}
                target="_blank"
                rel="noreferrer"
                className="text-accent-violet transition hover:text-accent-acid"
              >
                GitHub (@{githubHandle}) ↗
              </a>
            </div>
            <div className="py-3">
              <span className="text-meta">$ cat </span>
              <a
                href={person.resumeUrl}
                className="text-accent-acid underline decoration-accent-acid/40 underline-offset-4 hover:decoration-accent-acid"
                download="Abhyansh_Anand_Resume.pdf"
              >
                resume.pdf
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
