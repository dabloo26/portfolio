import { useContext } from "react";
import { RoleContext } from "../context/role-context-core";

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within RoleProvider");
  return ctx;
}
