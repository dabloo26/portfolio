import { motion } from "framer-motion";
import { useRole } from "../hooks/useRole";
import type { Role } from "../data/profile";

const options: { id: Role; label: string; hint: string }[] = [
  { id: "analyst", label: "Data Analyst", hint: "Metrics · storytelling · SQL" },
  { id: "scientist", label: "Data Scientist", hint: "Modeling · inference · lift" },
  { id: "engineer", label: "Data Engineer", hint: "Pipelines · reliability · scale" },
];

export function RoleLens() {
  const { role, setRole } = useRole();

  return (
    <div
      className="flex w-full flex-col gap-1 sm:w-auto sm:items-end"
      role="group"
      aria-label="Optimize portfolio emphasis for role type"
    >
      <div className="flex rounded-full border border-white/[0.08] bg-white/[0.03] p-0.5 sm:p-1">
        {options.map((opt) => {
          const active = role === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setRole(opt.id)}
              className="relative flex-1 rounded-full px-2.5 py-1.5 text-[11px] font-medium text-slate-400 transition hover:text-slate-200 sm:flex-none sm:px-3 sm:text-xs"
              aria-pressed={active}
            >
              {active && (
                <motion.span
                  layoutId="role-pill"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/20 to-violet-500/20 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative z-10">{opt.label}</span>
            </button>
          );
        })}
      </div>
      <span className="hidden text-[10px] text-slate-600 sm:block">
        {options.find((o) => o.id === role)?.hint}
      </span>
    </div>
  );
}
