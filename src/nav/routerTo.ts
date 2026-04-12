import type { To } from "react-router-dom";

/** Turns `/#section` strings from data into a React Router `To` so hash scrolling works with `basename`. */
export function routerToFromHref(href: string): To {
  const i = href.indexOf("#");
  if (i === -1) return href;
  const pathname = (i === 0 ? "/" : href.slice(0, i)) || "/";
  const hash = href.slice(i + 1);
  if (!hash) return pathname;
  return { pathname, hash };
}
