import { createContext } from "react";
import type { Role } from "../data/profile";

export type RoleContextValue = {
  role: Role;
  setRole: (r: Role) => void;
};

export const RoleContext = createContext<RoleContextValue | null>(null);
