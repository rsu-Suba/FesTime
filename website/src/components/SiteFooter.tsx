import React from "react";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="footer-links">
        <Link href="/guide/getting-started">クイックスタート</Link>
        <Link href="/guide/customization">設定・カスタマイズ</Link>
        <Link href="/components/booth">コンポーネント一覧</Link>
        <a href="https://github.com/rsu-Suba/FesTime" target="_blank" rel="noopener noreferrer">
          GitHub リポジトリ
        </a>
      </div>
      <p>Apache 2.0 License. | Copyright © 2026 rsu-Suba</p>
    </footer>
  );
}
