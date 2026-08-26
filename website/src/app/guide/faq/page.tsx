import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
};

export default function FAQGuidePage() {
  return (
    <article className="doc-article">
      <div className="doc-header">
        <div className="doc-meta">
          <code className="doc-code-badge">Troubleshooting</code>
        </div>
        <h1 className="doc-title">Trouble Shooting / FAQ</h1>
        <p className="doc-desc">
          運用中によくあるトラブルの対処法、導入時のよくある疑問、アクセス集中時の負荷軽減策
        </p>
      </div>

      <div className="doc-content">
        <section className="doc-section">
          <h2>当日のトラブルシューティング</h2>

          <ol style={{ paddingLeft: "24px", display: "flex", flexDirection: "column", gap: "20px", margin: "16px 0 28px" }}>
            <li>
              <strong style={{ fontSize: "15px", color: "#ef4444" }}>店舗の混雑・在庫ランプが更新できない</strong>
              <div style={{ marginTop: "6px", fontSize: "14px", lineHeight: 1.6, color: "var(--ft-text-secondary)" }}>
                <strong>原因:</strong> QR トークン認証が切れているか、ネットワークが一時的にオフラインです。<br />
                <strong>対応:</strong> 店舗管理画面を再読み込みするか、責任者用 QR コードを再スキャンしてください。
              </div>
            </li>

            <li>
              <strong style={{ fontSize: "15px", color: "#ef4444" }}>投票ボタンが押せない / 「期間外」と出る</strong>
              <div style={{ marginTop: "6px", fontSize: "14px", lineHeight: 1.6, color: "var(--ft-text-secondary)" }}>
                <strong>原因:</strong> <code>app_settings</code> の投票開始/終了時刻が現在時刻とズレているか、端末の時計が狂っています。<br />
                <strong>対応:</strong> 管理画面から投票終了時刻を延長するか、端末の自動時刻設定を確認してください。
              </div>
            </li>

            <li>
              <strong style={{ fontSize: "15px", color: "#ef4444" }}>画像や更新が反映されない</strong>
              <div style={{ marginTop: "6px", fontSize: "14px", lineHeight: 1.6, color: "var(--ft-text-secondary)" }}>
                <strong>原因:</strong> ブラウザまたは GitHub Pages の CDN キャッシュです。<br />
                <strong>対応:</strong> ブラウザのリロード (スーパーリロード) を行うか、シークレットウィンドウで確認してください。
              </div>
            </li>

            <li>
              <strong style={{ fontSize: "15px", color: "#ef4444" }}>オフライン・圏外時の挙動</strong>
              <div style={{ marginTop: "6px", fontSize: "14px", lineHeight: 1.6, color: "var(--ft-text-secondary)" }}>
                <strong>動作:</strong> 直近に取得したキャッシュデータ (LocalStorage / SessionStorage) が維持され、画面が真っ白にならずに閲覧を継続できます。
              </div>
            </li>
          </ol>
        </section>

        <section className="doc-section">
          <h2>アクセス集中・高負荷時の対策 (負荷軽減の仕組み)</h2>
          <p>
            来場者が一斉にアクセスした際、Supabase へのリクエスト集中やサーバーダウンを防ぐための最適化機能が標準で組み込まれています: 
          </p>

          <ol style={{ paddingLeft: "24px", display: "flex", flexDirection: "column", gap: "16px", margin: "16px 0", fontSize: "14px", color: "var(--ft-text-secondary)" }}>
            <li>
              <strong style={{ color: "var(--ft-text-primary)" }}>ポーリング間隔の動的変更 (poll_interval_ms):</strong>
              <div style={{ marginTop: "4px", lineHeight: 1.6 }}>
                管理画面 <code>/admin</code> または Supabase の <code>app_settings</code> テーブルで <code>poll_interval_ms</code> の値を変更 (例: <code>30000</code> → <code>60000</code> / <code>120000</code>) することで、<strong>再デプロイ不要で全端末の自動更新頻度を一括延長</strong>し、サーバー負荷を即座に下げることができます。
              </div>
            </li>
            <li>
              <strong style={{ color: "var(--ft-text-primary)" }}>操作中のポーリング自動一時停止 (Suspended Polling):</strong>
              <div style={{ marginTop: "4px", lineHeight: 1.6 }}>
                ユーザーがマップを閲覧中や、模擬店詳細モーダルを開いている間は、バックグラウンドの定期通信を自動でブロックし、無駄な API 通信を削減します。
              </div>
            </li>
            <li>
              <strong style={{ color: "var(--ft-text-primary)" }}>Realtime 接続時の通信スキップ:</strong>
              <div style={{ marginTop: "4px", lineHeight: 1.6 }}>
                Supabase Realtime の WebSocket 接続が維持されている間は、HTTP による定期取得 <code>fetchStallsOnly</code> を自動でスキップし、必要最低限の通信に抑えます。
              </div>
            </li>
            <li>
              <strong style={{ color: "var(--ft-text-primary)" }}>SessionStorage & メモリキャッシュ (fetchWithCache):</strong>
              <div style={{ marginTop: "4px", lineHeight: 1.6 }}>
                取得したデータは端末の <code>sessionStorage</code> にキャッシュされ、同一 TTL 内の重複リクエストは通信を行わずにキャッシュから瞬時に返却されます。
              </div>
            </li>
          </ol>
        </section>

        <section className="doc-section">
          <h2>FAQ: 導入・運用</h2>

          <ol style={{ paddingLeft: "24px", display: "flex", flexDirection: "column", gap: "20px", margin: "16px 0" }}>
            <li>
              <strong style={{ fontSize: "15px", color: "var(--ft-text-primary)" }}>Q. 完全無料で運用できますか？</strong>
              <p style={{ margin: "6px 0 0", fontSize: "14px", lineHeight: 1.6, color: "var(--ft-text-secondary)" }}>
                はい。GitHub Pages (または Vercel / Cloudflare Pages) と Supabase の無料枠を組み合わせることで、完全無料で運用可能です。同時接続数が数千人を超える大規模イベントの場合のみ、イベント月だけ Supabase Pro プラン ($25/月) を契約することを推奨します。
              </p>
            </li>

            <li>
              <strong style={{ fontSize: "15px", color: "var(--ft-text-primary)" }}>Q. プログラミング初心者でも導入できますか？</strong>
              <p style={{ margin: "6px 0 0", fontSize: "14px", lineHeight: 1.6, color: "var(--ft-text-secondary)" }}>
                はい。基本的な設定は <code>src/constants/custom.config.ts</code> と <code>public/data/*.json</code> のテキストを編集するだけで完了します。SQL も <code>Full.sql</code> を Supabase のエディタに貼り付けて実行するだけで全自動構築されます。
              </p>
            </li>

            <li>
              <strong style={{ fontSize: "15px", color: "var(--ft-text-primary)" }}>Q. イベント終了後のデータ保存はどうすればよいですか？</strong>
              <p style={{ margin: "6px 0 0", fontSize: "14px", lineHeight: 1.6, color: "var(--ft-text-secondary)" }}>
                Supabase の管理画面 (Table Editor) から、投票ログやアンケート結果を CSV 形式で一括エクスポートできます。
              </p>
            </li>
          </ol>
        </section>
      </div>
    </article>
  );
}
