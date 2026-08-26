"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const ROUTE_TITLES: Record<string, string> = {
  "/": "FesTime - Realtime Event Framework",
  "/guide": "Guide",
  "/guide/getting-started": "Start",
  "/guide/customization": "Custom",
  "/guide/supabase": "Supabase",
  "/guide/on-premise": "On-Premise",
  "/guide/developer": "Developer",
  "/guide/i18n": "Language/i18n",
  "/guide/faq": "FAQ",
  "/guide/design": "Design",
  "/guide/security": "Security",
  "/guide/operations": "Operations",
  "/guide/deploy": "Deploy",
  "/components": "Components",
  "/components/booth": "Booth",
  "/components/vote": "Vote",
  "/components/map": "Map&Spots",
  "/components/event": "Event",
  "/components/bus": "Bus",
  "/components/news": "News",
  "/components/lost": "Lost!",
  "/components/qa": "Q&A",
};

export function DocsTitleManager() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    const cleanPath = pathname === "/" ? "/" : pathname.replace(/\/$/, "");
    const title = ROUTE_TITLES[cleanPath];
    if (cleanPath === "/" || !title) {
      document.title = title || "FesTime - Realtime Event Framework";
    } else {
      document.title = `${title} | FesTime`;
    }
  }, [pathname]);

  return null;
}
