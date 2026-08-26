import React from "react";
import CodeBlock from "@/components/CodeBlock";

export default function DeveloperPage() {
  return (
    <div className="doc-article">
      <div className="doc-header">
        <h1 className="doc-title">Development</h1>
        <p className="doc-desc">
          FesTime の技術スタック、環境構築手順、リポジトリ構成などの開発者向けガイド
        </p>
      </div>

      <section className="doc-section">
        <h2>技術スタック</h2>
        <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "6px", color: "var(--ft-text-secondary)", fontSize: "14.5px" }}>
          <li><strong>Framework:</strong> Next.js 15 (App Router)</li>
          <li><strong>Language:</strong> TypeScript</li>
          <li><strong>Core:</strong> React 19</li>
          <li><strong>UI Library:</strong> Ant Design (antd), Material UI Icons (MUI), Framer Motion, Vaul</li>
          <li><strong>Backend:</strong> Supabase</li>
          <li><strong>Map:</strong> Leaflet (react-leaflet)</li>
          <li><strong>Styling:</strong> CSS</li>
        </ul>
      </section>

      <section className="doc-section">
        <h2>環境構築</h2>
        <ol style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "12px", color: "var(--ft-text-secondary)", fontSize: "14.5px" }}>
          <li>
            <strong>リポジトリのクローン:</strong>
            <CodeBlock
              language="bash"
              code={`git clone https://github.com/rsu-Suba/FesTime.git
cd FesTime`}
            />
          </li>
          <li>
            <strong>依存関係のインストール:</strong>
            <CodeBlock
              language="bash"
              code={`npm install`}
            />
          </li>
          <li>
            <strong>環境変数の設定:</strong><br />
            <code>.env</code> ファイルを作成し、Supabase から取得したキーを設定します (<code>.gitignore</code> によりコミットされないことを確認してください) 。また、模擬店用のパスワードとQR認証用キーを設定します。
            <CodeBlock
              language="bash"
              filename=".env"
              code={`NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
NEXT_PUBLIC_ADMIN_EMAIL=admin@example.com
NEXT_PUBLIC_BOOTH_ADMIN_EMAIL=booth@example.com
NEXT_PUBLIC_BOOTH_ADMIN_PASSWORD=
NEXT_PUBLIC_QR_AUTH_KEY=`}
            />
          </li>
          <li>
            <strong>開発サーバーの起動:</strong>
            <CodeBlock
              language="bash"
              code={`npm run dev`}
            />
          </li>
        </ol>
      </section>

      <section className="doc-section">
        <h2>ビルドとデプロイ</h2>
        <p>本プロジェクトは GitHub Pages へのデプロイを想定し、静的書き出し (Static Export) を行っています。</p>
        <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "6px", color: "var(--ft-text-secondary)", fontSize: "14.5px", marginTop: "8px", marginBottom: "16px" }}>
          <li>
            <strong>ビルドコマンド:</strong> <code>npm run build</code>
            <ul style={{ paddingLeft: "20px", marginTop: "4px" }}>
              <li>内部的には <code>next build</code> を実行した後、<code>src/constants/fix-paths.ts</code> を実行します。</li>
            </ul>
          </li>
          <li><strong>出力先:</strong> <code>docs/</code> ディレクトリ (GitHub Pages がここを参照するように設定してください) 。</li>
          <li><strong>サブディレクトリ対応:</strong> <code>/app</code> パスで公開するため、<code>next.config.ts</code> で <code>basePath</code> と <code>assetPrefix</code> を設定しています。</li>
        </ul>

        <h3>パス修正スクリプト <code>src/constants/fix-paths.ts</code></h3>
        <p>
          静的書き出し後の HTML/CSS/JS ファイル内にある絶対パス (例: <code>/img/...</code>) を、サブディレクトリ対応のパス (例: <code>/app/img/...</code>) に置換する重要なスクリプトです。ビルドが成功しても画像が表示されない場合は、このスクリプトの正規表現を確認してください。
        </p>
        <ul style={{ paddingLeft: "20px", marginTop: "8px", color: "var(--ft-text-secondary)", fontSize: "14.5px" }}>
          <li><code>npm run dev</code>ではルートディレクトリ判定ですが、Pagesにデプロイするとリポジトリ名直下となりズレが発生するためこの処理が必要です。</li>
        </ul>
      </section>

      <section className="doc-section">
        <h2>特徴的な処理</h2>

        <h3>多言語対応 <code>src/i18n</code></h3>
        <p>
          <code>react-i18next</code> を利用しており、<code>public/locales/</code> 内の JSON ファイルを編集することでテキストを変更できます。
        </p>

        <h3>データ取得 <code>src/contexts/DataProvider.tsx</code></h3>
        <p>
          Supabase からのデータ取得と、JSON ファイルからのマスターデータ取得を組み合わせています。
        </p>
      </section>
    </div>
  );
}
