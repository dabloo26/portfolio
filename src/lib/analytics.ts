import { useEffect } from "react";
import { useLocation } from "react-router-dom";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const GA_ID = import.meta.env.VITE_GA_ID as string | undefined;

function canTrack(): boolean {
  if (!GA_ID) return false;
  if (typeof window === "undefined") return false;
  // Respect explicit do-not-track preference.
  if (navigator.doNotTrack === "1") return false;
  return true;
}

export function initGoogleAnalytics(): void {
  if (!canTrack()) return;
  if (window.gtag) return;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer?.push(args);
  };

  window.gtag("js", new Date());
  // In SPA mode we send page_view manually on route changes.
  window.gtag("config", GA_ID, { send_page_view: false });
}

export function GoogleAnalyticsPageTracker() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    if (!canTrack() || !window.gtag) return;
    const pagePath = `${pathname}${search}`;
    window.gtag("event", "page_view", {
      page_title: document.title,
      page_path: pagePath,
      page_location: window.location.href,
    });
  }, [pathname, search]);

  return null;
}
