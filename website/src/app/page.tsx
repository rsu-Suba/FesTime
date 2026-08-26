import React from "react";
import Link from "next/link";
import HeroCardsClient from "@/components/HeroCardsClient";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export default function HomePage() {
  return (
    <div className="landing-page-layout">
      <SiteHeader />

      <main className="hero-wrapper">
        <div className="hero-grid">
          <div className="hero-left">

            <h1 className="hero-title">Start fast with<br />
              <span className="gradient-brand">FesTime</span></h1>

            <p className="hero-desc">
              FesTimeは、イベント運営に必要な機能を統合したオープンソースフレームワークです。バックエンドにSupabaseを採用し、クラウド環境からオンプレミスまで柔軟な運用に対応します。
            </p>

            <div className="hero-actions">
              <Link href="/guide/getting-started" className="btn btn-primary">
                Get Started
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link href="/components/booth" className="btn btn-secondary">
                View Components
              </Link>
            </div>
          </div>

          <div className="hero-right">
            <HeroCardsClient />
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
