"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SIDEBAR_SECTIONS } from "./sidebarData";
import { useMobileMenu } from "@/contexts/MobileMenuContext";

function isPathMatch(currentPath?: string, targetSlug?: string) {
  if (!currentPath || !targetSlug) return false;
  const normCurrent = currentPath.replace(/\/$/, "");
  const normTarget = targetSlug.replace(/\/$/, "");
  return normCurrent === normTarget;
}

export function ComponentSidebar() {
  const pathname = usePathname();
  const { isOpen: isMobileMenuOpen, close: closeMobileMenu } = useMobileMenu();

  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(() => {
    const state: Record<string, boolean> = {};
    const hasAnyActive = SIDEBAR_SECTIONS.some((cat) =>
      cat.items.some((item) => isPathMatch(pathname, item.slug))
    );

    SIDEBAR_SECTIONS.forEach((cat, index) => {
      const hasActive = cat.items.some((item) => isPathMatch(pathname, item.slug));
      if (hasAnyActive) {
        state[cat.id] = hasActive;
      } else {
        state[cat.id] = cat.id === "components" || index === 0;
      }
    });
    return state;
  });

  useEffect(() => {
    if (!pathname) return;
    SIDEBAR_SECTIONS.forEach((cat) => {
      const hasActive = cat.items.some((item) => isPathMatch(pathname, item.slug));
      if (hasActive) {
        setOpenCategories((prev) => ({
          ...prev,
          [cat.id]: true,
        }));
      }
    });
  }, [pathname]);

  const toggleCategory = (id: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <>
      <div
        className={`mobile-sidebar-overlay mobile-only-block ${isMobileMenuOpen ? "is-open" : ""}`}
        onClick={closeMobileMenu}
      />

      <aside className={`docs-sidebar ${isMobileMenuOpen ? "is-open" : ""}`}>
        <div className="mobile-only-block" style={{ padding: "16px", borderBottom: "1px solid var(--ft-border)", marginBottom: "12px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <Link href="/guide/getting-started" className="nav-link-item" style={{ display: "block" }}>
              ガイド
            </Link>
            <Link href="/components/booth" className="nav-link-item active" style={{ display: "block" }}>
              コンポーネント
            </Link>
            <a href="https://rsu-suba.github.io/FesTime/demo" target="_blank" rel="noopener noreferrer" className="nav-link-item" style={{ display: "block" }}>
              ライブデモ ↗
            </a>
          </div>
        </div>

        {SIDEBAR_SECTIONS.map((cat) => {
          const isOpen = openCategories[cat.id] ?? false;
          const hasActiveItem = cat.items.some((item) => isPathMatch(pathname, item.slug));

          return (
            <div key={cat.id} className="sidebar-accordion-group">
              <button
                type="button"
                onClick={() => toggleCategory(cat.id)}
                className={`sidebar-accordion-header ${hasActiveItem ? "contains-active" : ""}`}
                aria-expanded={isOpen}
              >
                <span className="sidebar-category-title">{cat.category}</span>
                <svg
                  className={`sidebar-chevron-icon ${isOpen ? "open" : ""}`}
                  viewBox="0 0 24 24"
                  width="14"
                  height="14"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>

              {isOpen && (
                <ul className="sidebar-tree-list">
                  {cat.items.map((item) => {
                    const isActive = isPathMatch(pathname, item.slug);
                    return (
                      <li key={item.slug} className="sidebar-tree-item">
                        <Link
                          href={item.slug}
                          className={`sidebar-item ${isActive ? "active" : ""}`}
                        >
                          <div className="sidebar-item-header">
                            <span>{item.label}</span>
                          </div>
                          {item.desc && <span className="sidebar-desc">{item.desc}</span>}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </aside>
    </>
  );
}
