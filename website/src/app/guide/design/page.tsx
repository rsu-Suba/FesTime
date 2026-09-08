import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import CodeBlock from "@/components/docs/CodeBlock";

export const metadata: Metadata = {
  title: "Design",
};

export default function DesignPage() {
  return (
    <div className="doc-article">
      <div className="doc-header">
        <div className="doc-meta">
          <code className="doc-code-badge">Branding & Assets</code>
        </div>
        <h1 className="doc-title">Customizing the Design</h1>
        <p className="doc-desc">
          カスタムなテーマカラーへの一括変更、ファビコン (Favicon) やアプリアイコンの差し替え、マップ内QRコードの作成方法
        </p>
      </div>

      <section className="doc-section">
        <h2>1. テーマカラーの変更</h2>
        <p>
          <code>src/constants/custom.config.ts</code> の <code>theme.primaryColor</code> をテーマカラーのカラーコード (HEX) に変更するだけで、ボタンなどの全体配色が一瞬で切り替わります。
        </p>

        <CodeBlock
          language="typescript"
          filename="src/constants/custom.config.ts"
          code={`export const CUSTOM_CONFIG: EventConfig = {
  theme: {
    primaryColor: {
      light: "#b98eee", // 例: 淡い青紫
      dark: "#362841",  // ダークモード用の暗めの紫
    },
    backgroundColor: {
      light: "#fafafa",
      dark: "#121214",
    },
  },
  ...
};`}
        />
      </section>

      <section className="doc-section">
        <h2>2. アプリアイコン / ファビコンの差し替え</h2>
        <p>
          ブラウザのタブに表示されるファビコンは、<code>public/favicon.ico</code> を置き換えるだけで反映されます。
        </p>
      </section>
    </div>
  );
}
