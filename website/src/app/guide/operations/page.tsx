import React from "react";

export default function OperationsPage() {
  return (
    <div className="doc-article">
      <div className="doc-header">
        <h1 className="doc-title">Operation</h1>
        <p className="doc-desc">
          アプリをどのように管理・運用すべきかをまとめます。
        </p>
      </div>

      <section className="doc-section">
        <h2>当日前 (準備期) </h2>
        <ol style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "12px", color: "var(--ft-text-secondary)", fontSize: "14.5px" }}>
          <li>
            <strong>マスターデータのインポート:</strong>
            <ul style={{ paddingLeft: "20px", marginTop: "4px" }}>
              <li><code>public/data/*.json</code> にブース、イベント、バス運行、スポット情報を流し込みます。</li>
              <li><code>booth.json</code>と<code>exhibitions.json</code>は全てに連番のIDが振られていることを確認してください。</li>
            </ul>
          </li>
          <li>
            <strong>QR コードの発行:</strong>
            <ul style={{ paddingLeft: "20px", marginTop: "4px" }}>
              <li>一般ユーザー用 (トップページ: <code>https://[your-domain]/app/</code>) 。</li>
              <li>Spot-QR用: 管理画面 (「スポットQR生成」タブ) から生成した、校内に貼る周辺検索用。</li>
            </ul>
          </li>
          <li>
            <strong>Supabase 側データの初期化:</strong>
            <ul style={{ paddingLeft: "20px", marginTop: "4px" }}>
              <li><code>src/constants/custom.config.ts</code>の<code>CUSTOM_CONFIG.features</code>にて必要な機能をtrue、そうでないものをfalseにします。</li>
              <li><code>SQL/generate_full.ts</code>を実行し、Supabase セットアップ用の <code>SQL/Full.sql</code>を生成します。</li>
              <li><code>SQL/Full.sql</code> をSupabase SQL Editorで実行し、Supabaseのデータベースをセットアップします。</li>
              <li>Optional: 投票機能がある場合
                <ul style={{ paddingLeft: "20px", marginTop: "4px" }}>
                  <li><code>SQL/06_generate_votejson.sql</code> をSupabase SQL Editorで実行し、出力されたJSON文字列を<code>public/data/vote.json</code>にコピー&amp;ペーストします。</li>
                </ul>
              </li>
            </ul>
          </li>
        </ol>
      </section>

      <section className="doc-section">
        <h2>当日</h2>

        <h3>管理画面 <code>/admin</code> からの更新</h3>
        <p>全体管理者はスマホまたは PC から以下の情報を更新します。</p>
        <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px", color: "var(--ft-text-secondary)", fontSize: "14.5px" }}>
          <li><strong>お知らせ:</strong> 連絡や全体告知を投稿します。</li>
          <li><strong>落とし物:</strong> 写真をアップロード (Supabase Storage) し、名称と場所を登録します。</li>
          <li><strong>Q&amp;A:</strong> 寄せられた質問に回答を追記します。</li>
        </ul>

        <h3>ブース情報の管理 <code>/booth</code></h3>
        <p>各団体の責任者は、自身のスマホから以下の情報を随時更新します。</p>
        <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px", color: "var(--ft-text-secondary)", fontSize: "14.5px" }}>
          <li><strong>混雑度:</strong> 「空き」「やや混雑」「混雑」の 3段階で更新します。</li>
          <li><strong>在庫状況:</strong> 「在庫あり」「在庫少なめ」「品切れ」で更新します。</li>
        </ul>

        <h3>トラブル対応</h3>
        <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px", color: "var(--ft-text-secondary)", fontSize: "14.5px" }}>
          <li><strong>データが更新されない:</strong> ブラウザの再読み込みを促してください。</li>
          <li><strong>画像が表示されない:</strong> GitHub Pages のキャッシュが原因の場合があります。少し待つか、シークレットモードで確認してください。</li>
        </ul>
      </section>

      <section className="doc-section">
        <h2>終了後</h2>
        <ol style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "12px", color: "var(--ft-text-secondary)", fontSize: "14.5px" }}>
          <li>
            <strong>結果の集計:</strong>
            <ul style={{ paddingLeft: "20px", marginTop: "4px" }}>
              <li>投票結果などを Supabase Dashboard の <code>Table Editor</code> から CSV でエクスポートします。</li>
            </ul>
          </li>
          <li>
            <strong>課金の停止判断:</strong>
            <ul style={{ paddingLeft: "20px", marginTop: "4px" }}>
              <li>アクセスがなくなれば Supabase を Free プランに戻せますが、データのバックアップを必ず取ってください。</li>
            </ul>
          </li>
        </ol>
      </section>
    </div>
  );
}
