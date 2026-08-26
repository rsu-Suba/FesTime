import React from "react";

export default function SecurityGuidePage() {
  return (
    <div className="doc-article">
      <div className="doc-header">
        <h1 className="doc-title">Role / Security</h1>
        <p className="doc-desc">
          本アプリには 3 つのロール (権限) が存在します。これらは <code>src/contexts/RoleContext.tsx</code> によってフロントエンドで管理され、Supabase の RLS (Row Level Security) によってバックエンドで保護されています。
        </p>
      </div>

      <section className="doc-section">
        <h2>ロールの定義</h2>
        <ol style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "16px", color: "var(--ft-text-secondary)", fontSize: "14.5px" }}>
          <li>
            <strong>User (一般ユーザー)</strong>
            <ul style={{ paddingLeft: "20px", marginTop: "4px" }}>
              <li>権限: お知らせ・落とし物・Q&amp;A の閲覧、マップの確認、投票の実行。</li>
              <li>アクセス方法: 通常の URL アクセス。</li>
            </ul>
          </li>
          <li>
            <strong>Admin (全体管理者)</strong>
            <ul style={{ paddingLeft: "20px", marginTop: "4px" }}>
              <li>権限: 全データの閲覧・編集・削除、お知らせ・落とし物・Q&amp;A の作成、投票結果の確認。</li>
              <li>アクセス方法: <code>/admin</code> パスへのアクセス ＋ Supabase Authによるパスワード認証。</li>
            </ul>
          </li>
          <li>
            <strong>StallAdmin (模擬店運営)</strong>
            <ul style={{ paddingLeft: "20px", marginTop: "4px" }}>
              <li>権限: 自分の団体の混雑状況・在庫状況の更新。</li>
              <li>アクセス方法: Adminユーザーまたはシフト前任者が生成した<code>id</code> と <code>token</code> パラメータを含む QR コードによる認証。</li>
            </ul>
          </li>
        </ol>
      </section>

      <section className="doc-section">
        <h2>権限識別の仕組み</h2>

        <h3>フロントエンド <code>RoleContext.tsx</code> / <code>/booth/page.tsx</code></h3>
        <p>現在の URL パス、<code>localStorage</code>、および URL パラメータの状態を組み合わせてロールを決定しています。</p>
        <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "6px", color: "var(--ft-text-secondary)", fontSize: "14.5px", marginTop: "8px" }}>
          <li>パスに <code>/admin</code> を含み、<code>localStorage.admin_auth</code> が <code>"true"</code> → <code>admin</code> ロール。</li>
          <li>パスに <code>/booth</code> を含み、URL の <code>token</code> が有効であるか <code>localStorage.booth_auth</code> が <code>"true"</code> → <code>stall-admin</code> ロール。</li>
        </ul>

        <h3>認証フロー</h3>
        <ol style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px", color: "var(--ft-text-secondary)", fontSize: "14.5px", marginTop: "8px", marginBottom: "16px" }}>
          <li><strong>Admin:</strong> 事前に発行されたパスワードでログイン。</li>
          <li><strong>StallAdmin:</strong> 全体管理者が <code>/admin</code> から発行した QR コード、または前のシフト担当者が表示した「交代用 QR」を読み取ることでログイン (トークンによる検証) 。</li>
          <li><strong>一度ログインすると:</strong> <code>localStorage</code> にフラグが保存され、一定期間は QR なしでもアクセスが維持されます。</li>
        </ol>

        <p style={{ fontSize: "14px", background: "var(--ft-brand-soft)", padding: "12px 16px", borderRadius: "8px", color: "var(--ft-text-primary)", borderLeft: "4px solid var(--ft-brand-primary)" }}>
          <strong>注意:</strong> フロントエンドのロール切り替えは UI の表示制御のためのものであり、書き込み制限などの真のセキュリティは Supabase 側の RLS ポリシーで担保されています。
        </p>
      </section>

      <section className="doc-section">
        <h2>バックエンド (Supabase RLS)</h2>
        <p>
          データベースの各テーブルには <strong>RLS (Row Level Security)</strong> が設定されており、不適切な書き込みを防止しています。
        </p>
        <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "6px", color: "var(--ft-text-secondary)", fontSize: "14.5px", marginTop: "8px" }}>
          <li><code>votes</code> テーブル: 同一ユーザー (voter_id) からの重複投票を DB レベルで防止。</li>
          <li>各管理用テーブル: 公開アクセスは <code>SELECT</code> のみに制限。</li>
        </ul>
      </section>
    </div>
  );
}
