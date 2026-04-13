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

  const copyTo = useCallback(async (label: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      setCopied(null);
    }
  }, []);

  return (
    <>
      <section
        id="contact"
        className="relative z-10 scroll-mt-40 bg-gradient-to-b from-transparent via-base/40 to-base/58 px-4 py-20 sm:px-6 sm:pb-28 sm:pt-16 md:py-24 md:scroll-mt-44"
        style={{
          paddingLeft: "max(1rem, env(safe-area-inset-left))",
          paddingRight: "max(1rem, env(safe-area-inset-right))",
          paddingBottom: "max(5rem, env(safe-area-inset-bottom))",
        }}
      >
        <SectionBackdropLayer variant="contact" />
        <div className="relative z-10 mx-auto max-w-3xl lg:max-w-4xl">
          <motion.div {...fade}>
            <div className="rounded-2xl border border-white/[0.14] bg-[#060a12]/65 p-5 shadow-[0_0_0_1px_rgba(34,211,238,0.12),0_24px_80px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:rounded-3xl sm:p-7 md:p-8">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.32em] text-sky-400/90 sm:text-[11px]">
                Get in touch
              </p>
              <h2 className="mt-3 font-condensed text-3xl font-bold uppercase tracking-[0.12em] text-white sm:text-4xl md:text-5xl">
                Contact
              </h2>
              <p className="mt-3 max-w-lg font-mono text-sm leading-relaxed text-zinc-400">
                Copy-friendly — same details as my resume header.
              </p>
              <div className="mt-8 space-y-1 font-mono text-sm md:mt-10">
                <div className="flex flex-col gap-2 border-b border-white/[0.06] py-3 sm:flex-row sm:items-center sm:gap-6">
                  <span className="shrink-0 text-meta">$ email</span>
                  <button
                    type="button"
                    onClick={() => copyTo("email", person.email)}
                    className="min-h-[44px] touch-manipulation text-left text-white transition hover:text-accent-acid sm:min-h-0"
                  >
                    {person.email}
                  </button>
                  {copied === "email" ? (
                    <span className="text-xs text-accent-acid">✓ copied</span>
                  ) : (
                    <span className="text-xs text-meta">tap to copy</span>
                  )}
                </div>
                <div className="flex flex-col gap-2 border-b border-white/[0.06] py-3 sm:flex-row sm:items-center sm:gap-6">
                  <span className="shrink-0 text-meta">$ phone</span>
                  <button
                    type="button"
                    onClick={() => copyTo("phone", person.phone.replace(/\s/g, ""))}
                    className="min-h-[44px] touch-manipulation text-left text-white transition hover:text-accent-acid sm:min-h-0"
                  >
                    {person.phone}
                  </button>
                  {copied === "phone" ? (
                    <span className="text-xs text-accent-acid">✓ copied</span>
                  ) : (
                    <span className="text-xs text-meta">tap to copy</span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-white/[0.06] py-3">
                  <span className="text-meta">$ open</span>
                  <a
                    href={person.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="min-h-[44px] touch-manipulation text-accent-violet transition hover:text-accent-acid sm:min-h-0"
                  >
                    LinkedIn ↗
                  </a>
                  <a
                    href={person.github}
                    target="_blank"
                    rel="noreferrer"
                    className="min-h-[44px] touch-manipulation text-accent-violet transition hover:text-accent-acid sm:min-h-0"
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
            </div>
          </motion.div>

          <motion.div
            {...fade}
            className="mt-14 text-center sm:mt-16"
            aria-label="Closing"
          >
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-meta">Thank you</p>
            <p className="font-signature mt-3 text-4xl text-white/95 sm:text-5xl">{person.name}</p>
          </motion.div>
        </div>
      </section>
    </>
  );
}
