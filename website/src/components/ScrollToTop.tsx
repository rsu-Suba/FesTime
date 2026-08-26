"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    if (typeof document !== "undefined") {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      const scrollables = document.querySelectorAll<HTMLElement>(
        ".docs-main-content, .docs-body-container, main"
      );
      scrollables.forEach((el) => {
        el.scrollTop = 0;
      });
    }
  }, [pathname]);

  return null;
}
