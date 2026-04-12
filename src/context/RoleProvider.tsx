import { useCallback, useMemo, type ReactNode } from "react";
import type { Role } from "../data/profile";
import { RoleContext } from "./role-context-core";

/** Single-page portfolio: lens toggles removed; role stays fixed for any legacy hooks. */
const DEFAULT_ROLE: Role = "analyst";

export function RoleProvider({ children }: { children: ReactNode }) {
  const setRole = useCallback((r: Role) => {
    void r;
    /* role switching disabled */
  }, []);

  const value = useMemo(
    () => ({ role: DEFAULT_ROLE, setRole }),
    [setRole]
  );

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}
