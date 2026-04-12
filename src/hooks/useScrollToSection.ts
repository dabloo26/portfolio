import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/** Smooth-scroll to a section id on the home page and drop the URL hash so refresh restores scroll. */
export function useScrollToSection() {
  const navigate = useNavigate();
  const { pathname, search } = useLocation();

  return useCallback(
    (id: string) => {
      const onHome = pathname === "/" || pathname === "";

      if (!onHome) {
        navigate({ pathname: "/", hash: id }, { replace: false });
        return;
      }

      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      navigate(`${pathname}${search}`, { replace: true });
    },
    [navigate, pathname, search]
  );
}
