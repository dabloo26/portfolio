import type { ReactNode } from "react";

export type SectionBackdropVariant =
  | "about"
  | "experience"
  | "impact"
  | "projects"
  | "contact";

/** Soft color washes that blend with the global starfield (no extra WebGL). */
const cssBlob: Record<SectionBackdropVariant, string> = {
  about:
    "bg-[radial-gradient(ellipse_80%_60%_at_90%_40%,rgba(124,58,255,0.14),transparent),radial-gradient(ellipse_60%_50%_at_10%_80%,rgba(56,189,248,0.07),transparent)]",
  experience:
    "bg-[radial-gradient(ellipse_70%_50%_at_85%_30%,rgba(57,255,20,0.08),transparent),radial-gradient(ellipse_50%_40%_at_20%_70%,rgba(124,58,255,0.09),transparent)]",
  impact:
    "bg-[radial-gradient(ellipse_75%_55%_at_95%_50%,rgba(56,189,248,0.11),transparent),radial-gradient(ellipse_45%_40%_at_5%_60%,rgba(167,139,250,0.07),transparent)]",
  projects:
    "bg-[radial-gradient(ellipse_80%_55%_at_88%_45%,rgba(124,58,255,0.1),transparent),radial-gradient(ellipse_55%_45%_at_15%_75%,rgba(57,255,20,0.06),transparent)]",
  contact:
    "bg-[radial-gradient(ellipse_85%_60%_at_92%_35%,rgba(56,189,248,0.12),transparent),radial-gradient(ellipse_50%_45%_at_8%_65%,rgba(244,114,182,0.07),transparent)]",
};

export function SectionBackdropLayer({ variant }: { variant: SectionBackdropVariant }) {
  const css = cssBlob[variant];
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <div className={`absolute inset-0 opacity-[0.34] md:opacity-[0.42] ${css}`} />
    </div>
  );
}

export function SectionBackdropContent({ children }: { children: ReactNode }) {
  return <div className="relative z-10">{children}</div>;
}
