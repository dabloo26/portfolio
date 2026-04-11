import { motion } from "framer-motion";
import { useRole } from "../hooks/useRole";
import type { Role } from "../data/profile";

const options: { id: Role; label: string }[] = [
  { id: "analyst", label: "Data Analyst" },
  { id: "scientist", label: "Data Scientist" },
  { id: "engineer", label: "Data Engineer" },
];

export function RoleLens() {
  const { role, setRole } = useRole();

  return (
    <div
      className="inline-flex rounded-md border border-white/[0.12] bg-[#111118] p-0.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
      role="tablist"
      aria-label="Profile emphasis"
    >
      {options.map((opt) => {
        const active = role === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            role="tab"
            onClick={() => setRole(opt.id)}
            className={`relative min-w-[7.5rem] rounded px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-wide transition-colors sm:min-w-[8.5rem] sm:text-[11px] ${
              active ? "text-white" : "text-meta hover:text-white/80"
            }`}
            aria-selected={active}
          >
            {active && (
              <motion.span
                layoutId="role-segment"
                className="absolute inset-0 rounded bg-gradient-to-b from-white/[0.12] to-white/[0.04] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <span className="relative z-10">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
