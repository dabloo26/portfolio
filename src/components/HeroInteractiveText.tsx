import { motion } from "framer-motion";

function Word({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) {
  return (
    <motion.span
      className={`inline-block origin-bottom cursor-default ${className}`}
      whileHover={{
        y: -3,
        transition: { type: "spring", stiffness: 400, damping: 22 },
      }}
    >
      {children}
    </motion.span>
  );
}

export function HeroInteractiveHeading({
  name,
  rolesLabel,
}: {
  name: string;
  rolesLabel: string;
}) {
  const nameWords = name.split(" ");
  const roleParts = rolesLabel.split(" · ");

  return (
    <motion.h1
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="font-display text-5xl leading-[0.95] text-white sm:text-6xl md:text-7xl"
    >
      <span className="block">
        {nameWords.map((w, i) => (
          <span key={i} className="inline-block">
            <Word className="mr-[0.2em] text-white hover:text-sky-200">{w}</Word>
          </span>
        ))}
      </span>
      <span className="mt-3 block text-2xl font-sans font-medium tracking-tight text-meta sm:text-3xl md:text-4xl">
        {roleParts.map((part, i) => (
          <span key={i} className="inline-block">
            <Word className="mr-[0.35em] last:mr-0 hover:text-white/90">{part.trim()}</Word>
            {i < roleParts.length - 1 ? (
              <span className="mr-1 text-meta/80" aria-hidden>
                ·
              </span>
            ) : null}
          </span>
        ))}
      </span>
    </motion.h1>
  );
}

export function HeroInteractiveParagraph({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  const words = children.split(/(\s+)/);
  return (
    <p className={className}>
      {words.map((chunk, i) =>
        /\s+/.test(chunk) ? (
          <span key={i}>{chunk}</span>
        ) : (
          <Word key={i} className="hover:text-white">
            {chunk}
          </Word>
        )
      )}
    </p>
  );
}
