"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/docs/ThemeToggle";
import { SearchModal } from "@/components/docs/SearchModal";
import { useMobileMenu } from "@/contexts/MobileMenuContext";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import CallMadeIcon from '@mui/icons-material/CallMade';

export function SiteHeader() {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMac, setIsMac] = useState(true);
  const { isOpen: isMobileMenuOpen, toggle: toggleMobileMenu } = useMobileMenu();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMac(/(Mac|iPhone|iPod|iPad)/i.test(navigator.platform || navigator.userAgent));
    }
  }, []);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      const isInput = activeTag === "input" || activeTag === "textarea";

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if (e.key === "/" && !isInput) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  const isHome = pathname === "/";
  const isGuideActive = pathname?.startsWith("/guide");
  const isComponentsActive = pathname?.startsWith("/components");
  const isStudioActive = pathname?.startsWith("/studio");

  return (
    <>
      <header className="nav-header">
        <div className={`nav-container ${isHome ? "nav-container-home" : "nav-container-docs"}`}>
          <div className="nav-left-group">
            {!isHome && (
              <button
                className="nav-icon-btn mobile-only-flex"
                onClick={toggleMobileMenu}
                aria-label="Toggle Menu"
                style={{ border: "none", background: "transparent" }}
              >
                {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
              </button>
            )}

            <div className="nav-brand">
              <Link href="/" className="nav-brand-link" aria-label="FesTime Home">
                <Image
                  src="/FesTimeIcon2.svg"
                  alt="FesTime"
                  width={32}
                  height={32}
                  style={{ display: "block" }}
                />
              </Link>
            </div>

            <nav className="nav-links desktop-only-flex">
              <Link
                href="/guide/getting-started"
                className={`nav-link-item ${isGuideActive ? "active" : ""}`}
              >
                ガイド
              </Link>
              <Link
                href="/components/booth"
                className={`nav-link-item ${isComponentsActive ? "active" : ""}`}
              >
                コンポーネント
              </Link>
              <Link
                href="/studio"
                className={`nav-link-item ${isStudioActive ? "active" : ""}`}
                style={{ color: "var(--ft-brand-primary, #4f46e5)", fontWeight: 700 }}
              >
                Studio
              </Link>
              <a
                href="https://rsu-suba.github.io/FesTime/demo"
                target="_blank"
                rel="noopener noreferrer"
                className="nav-link-item"
                style={{ display: "flex", alignItems: "center", gap: 2}}
              >
                ライブデモ <CallMadeIcon style={{ fontSize: "16" }}/>
              </a>
            </nav>
          </div>

          <div className="nav-right-group">
            <button
              type="button"
              className="nav-search-btn"
              onClick={() => setIsSearchOpen(true)}
              aria-label="検索"
            >
              <svg
                className="search-btn-icon"
                viewBox="0 0 24 24"
                width="16"
                height="16"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <span className="search-btn-text desktop-only-flex">検索...</span>
              <kbd className="search-btn-kbd desktop-only-flex">{isMac ? "⌘K" : "Ctrl K"}</kbd>
            </button>

            <a
              href="https://github.com/rsu-Suba/FesTime"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-icon-btn"
              aria-label="GitHub Repository"
              title="GitHub"
            >
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="currentColor"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>

            <ThemeToggle />
          </div>
        </div>
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
