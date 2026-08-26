import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import CodeBlock from "@/components/CodeBlock";

export const metadata: Metadata = {
  title: "Start",
};

export default function GettingStartedPage() {
  return (
    <div className="doc-article">
      <div className="doc-header">
        <h1 className="doc-title">Getting Started</h1>
        <p className="doc-desc">
          FesTime をローカル環境に導入し、Supabase と連携してアプリを起動するまでのクイックスタートガイド
        </p>
      </div>

      <section className="doc-section">
        <h2>全体の流れ</h2>
        <ol style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "6px", color: "var(--ft-text-secondary)", fontSize: "14.5px", margin: "12px 0 24px" }}>
          <li>リポジトリのクローン & インストール</li>
          <li>Supabase プロジェクトの作成 & APIキー取得</li>
          <li>設定ファイル <code>custom.config.ts</code> と環境変数 <code>.env</code> の準備</li>
          <li>SQL の自動生成 & データベース構築</li>
          <li>開発サーバー起動 & セキュリティ監査テスト</li>
        </ol>
      </section>

      <section className="doc-section">
        <h2>Step 1: リポジトリのクローン & インストール</h2>
        <p>GitHub からリポジトリをクローンし、依存パッケージをインストールします。</p>
        <CodeBlock
          language="bash"
          code={`git clone https://github.com/rsu-Suba/FesTime.git
cd FesTime
npm install`}
        />
      </section>

      <section className="doc-section">
        <h2>Step 2: Supabase プロジェクトの作成 & アカウント準備</h2>
        <ol style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "10px", color: "var(--ft-text-secondary)", fontSize: "14.5px", margin: "12px 0" }}>
          <li><a href="https://supabase.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--ft-brand-primary)", textDecoration: "underline" }}>Supabase</a> にアクセスし、ログインまたは新規アカウントを作成します。</li>
          <li><strong>「New project」</strong> をクリックし、プロジェクト名とデータベースのパスワードを設定して作成します。</li>
          <li>
            プロジェクト作成完了後、プロジェクトトップページに記載されているURL右側のCopyボタンをクリックし、<strong>Project URL</strong>をコピーします。<br />また、左サイドメニューの <strong>「Project Settings」 → 「API Keys」 → 「Legacy anon」</strong> を開き <strong>Public anonキー</strong>をコピーします。
            <ul style={{ paddingLeft: "20px", marginTop: "6px" }}>
              <li><strong>Project URL</strong> (例: <code>https://xxxxxxxx.supabase.co</code>)</li>
              <li><strong>anon public key</strong> (例: <code>eyJhbGciOi...</code>)</li>
            </ul>
          </li>
          <li>
            左メニューの <strong>「Authentication」 → 「Users」 → 「Add user」 (Create user)</strong> から、以下の <strong>2 つの管理用アカウント</strong> を作成します (実在しないメールアドレスでも可能です) :
            <ul style={{ paddingLeft: "20px", marginTop: "6px" }}>
              <li><strong>全体管理者 (Admin) : </strong> 本部スタッフ用 (ニュース配信・Q&A回答・落とし物管理・設定変更の全権限) <br /><span style={{ fontSize: "12.5px", color: "var(--ft-text-muted)" }}>例: <code>admin@example.com</code></span></li>
              <li><strong>模擬店管理者 (StallAdmin) : </strong> 模擬店スタッフ用 (混雑・在庫状況の更新権限) <br /><span style={{ fontSize: "12.5px", color: "var(--ft-text-muted)" }}>例: <code>booth@example.com</code></span></li>
              <li>2つのアカウントのパスワードは異なるものを設定することを推奨します。</li>
              <li>全体管理者メールアドレス、模擬店管理者のメールアドレス & パスワードは後述する <code>.env</code> ファイルに記述します。</li>
            </ul>
          </li>
        </ol>
        <div style={{ background: "rgba(234, 179, 8, 0.1)", borderLeft: "4px solid #eab308", padding: "12px 16px", borderRadius: "4px", margin: "16px 0", fontSize: "14px" }}>
          <strong>本番運用時のプランについて:</strong><br />
          文化祭当日の本番アクセス集中時は、Supabase Pro プランの利用を推奨します。無料枠では接続数制限によりリアルタイム通信が停止するリスクがあります。
        </div>
      </section>

      <section className="doc-section">
        <h2>Step 3: 設定ファイルと環境変数の準備</h2>
        <h3 style={{ marginTop: "20px" }}>1. <code>custom.config.ts</code> の編集</h3>
        <p>
          <code>src/constants/custom.config.ts</code> を開き、イベントで使用する機能の ON/OFF <code>features</code> やイベント名を編集します。
        </p>
        <ul style={{ paddingLeft: "20px", margin: "8px 0 14px", fontSize: "14px" }}>
          <li>
            <code>custom.config.ts</code> の各設定項目の詳細や JSON データとの対応関係については、<Link href="/guide/customization" style={{ color: "var(--ft-brand-primary)", fontWeight: "bold", textDecoration: "underline" }}>変数 &amp; 設定対応表</Link> をご確認ください。
          </li>
        </ul>
        <div style={{ background: "rgba(59, 130, 246, 0.15)", borderLeft: "4px solid #3b82f6", padding: "12px 16px", borderRadius: "4px", fontSize: "14px" }}>
          <strong>SQL生成スクリプト (SQL/generate_full.ts) の実行前に custom.config.ts を編集してください</strong><br />
          FesTime の SQL 生成スクリプトは、<code>custom.config.ts</code> で有効にした機能フラグ (投票・模擬店・落とし物等) や <code>.env</code> の管理者情報を読み取り、<strong>あなたのイベントに最適化された専用の構築用SQL <code>Full.sql</code> を自動生成</strong>します。
        </div>
        <h3 style={{ marginTop: "20px" }}>2. 環境変数 <code>.env</code> の作成</h3>
        <p>
          プロジェクトルートに <code>.env</code> ファイルを作成し、Step 2 で取得した Supabase 情報と作成したアカウントのメールアドレス・パスワードを設定します。
        </p>
        <CodeBlock
          language="bash"
          filename=".env"
          code={`NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
NEXT_PUBLIC_ADMIN_EMAIL=admin@example.com
NEXT_PUBLIC_BOOTH_ADMIN_EMAIL=booth@example.com
NEXT_PUBLIC_BOOTH_ADMIN_PASSWORD=your_secure_password
NEXT_PUBLIC_QR_AUTH_KEY=your_secure_qr_secret`}
        />
        <p>
          開発中にアプリ内に擬似的な時刻を設定したい場合は以下の変数を <code>.env</code> 内に記載してください。
        </p>
        <CodeBlock language="bash" filename=".env" code={`NEXT_PUBLIC_MOCK_TIME="2026-05-23T10:14:00"`} />
        <p>
          Google Analytics を使用する場合は以下の変数を <code>.env</code> 内に記載してください。
        </p>
        <CodeBlock language="bash" filename=".env" code={`NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=GA-000000`} />
      </section>

      <section className="doc-section">
        <h2>Step 4: SQL の自動生成 & データベース構築</h2>
        <p>
          Step 3 の設定内容を反映したフルセットアップ SQL を生成し、Supabase に流し込みます。
        </p>
        <ol style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "10px", color: "var(--ft-text-secondary)", fontSize: "14.5px", margin: "12px 0" }}>
          <li>
            ターミナルで以下のコマンドを実行して <code>SQL/Full.sql</code> を生成します: 
            <CodeBlock
              language="bash"
              code={`npx tsx SQL/generate_full.ts`}
            />
          </li>
          <li>Supabase ダッシュボードの左メニューから <strong>「SQL Editor」</strong> を開きます。</li>
          <li><strong>「New query」</strong> を作成します。</li>
          <li>
            生成された <code>SQL/Full.sql</code> の内容をすべてコピーして貼り付け、右下の <strong>「Run」</strong> を押して実行します。
          </li>
          <li>「Success. No rows returned」と表示されれば、イベント専用のテーブル・RLS・関数が一括構築されます。</li>
        </ol>

        <h3 style={{ marginTop: "24px" }}>投票機能を使用する場合: <code>vote.json</code> の生成</h3>
        <p>
          <code>custom.config.ts</code> で投票機能を有効 <code>features.vote: true</code> にしている場合、フロントエンドの投票候補一覧を描画するための静的 JSON を生成します。
        </p>
        <ol style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px", color: "var(--ft-text-secondary)", fontSize: "14.5px", margin: "10px 0" }}>
          <li>Supabase の SQL Editor で <code>SQL/06_generate_votejson.sql</code> を実行します。</li>
          <li>クエリの実行結果 (JSON 配列データ) をコピーし、フロントエンドの <code>public/data/vote.json</code> に保存してください。</li>
        </ol>
      </section>

      <section className="doc-section">
        <h2>Step 5: 開発サーバー起動 & セキュリティ監査</h2>
        <p>ローカル開発サーバーを起動してアプリにアクセスします。</p>
        <CodeBlock
          language="bash"
          code={`npm run dev`}
        />
        <p>
          ブラウザで <a href="http://localhost:3000" target="_blank" rel="noopener noreferrer" style={{ color: "var(--ft-brand-primary)" }}>http://localhost:3000</a> にアクセスし、FesTime の画面が表示されれば導入完了です！
        </p>

        <h3 style={{ marginTop: "24px" }}>セキュリティ・権限設定の監査テスト</h3>
        <p>
          Supabase の RLS (アクセス制御) や不正投票防止ロジックが正しく動作しているかを以下のコマンドで一括テストできます: 
        </p>
        <CodeBlock
          language="bash"
          code={`npx tsx --env-file-if-exists=.env src/lib/Misc/audit_security.ts`}
        />
        <p>
          すべてのテスト項目で <strong>「Attack failed」</strong> (攻撃の遮断に成功) と表示されれば、本番でも安全に運用できる状態です。
        </p>
      </section>
    </div>
  );
}
