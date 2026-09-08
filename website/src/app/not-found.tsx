"use client";

import React from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/docs/SiteHeader";
import { SiteFooter } from "@/components/docs/SiteFooter";

export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <SiteHeader />
      <main style={{ flex: 1, padding: "120px 24px 80px", textAlign: "center" }}>
        <h2 style={{ fontSize: "24px", marginBottom: "12px" }}>404 - ページが見つかりません</h2>
        <p style={{ margin: "16px 0", color: "var(--ft-text-secondary)" }}>
          お探しのページは存在しないか、移動した可能性があります。
        </p>
        <Link href="/" style={{ color: "var(--ft-brand-primary)", fontWeight: "bold", textDecoration: "underline" }}>
          トップページへ戻る
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}
