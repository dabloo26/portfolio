import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Role } from "../data/profile";
import { RoleContext } from "./role-context-core";

function readStoredRole(): Role | null {
  try {
    const v = localStorage.getItem("portfolio-role");
    if (v === "analyst" || v === "scientist" || v === "engineer") return v;
  } catch {
    /* ignore */
  }
  return null;
}

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>("analyst");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const lens = params.get("lens");
    if (lens === "analyst" || lens === "scientist" || lens === "engineer") {
      setRoleState(lens);
      try {
        localStorage.setItem("portfolio-role", lens);
      } catch {
        /* ignore */
      }
      return;
    }
    const stored = readStoredRole();
    if (stored) setRoleState(stored);
  }, []);

  const setRole = useCallback((r: Role) => {
    setRoleState(r);
    try {
      localStorage.setItem("portfolio-role", r);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo(() => ({ role, setRole }), [role, setRole]);

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}
