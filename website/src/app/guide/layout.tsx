"use client";

import React, { useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { GuideSidebar } from "@/components/docs/GuideSidebar";
import { SiteHeader } from "@/components/docs/SiteHeader";
import { SiteFooter } from "@/components/docs/SiteFooter";

export default function GuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, [pathname]);

  return (
    <div className="docs-page-layout">
      <SiteHeader />

      <div className="docs-body-container">
        <GuideSidebar />
        <main ref={mainRef} className="docs-main-content">
          <div className="docs-content-inner">
            {children}
          </div>
          <SiteFooter />
        </main>
      </div>
    </div>
  );
}
