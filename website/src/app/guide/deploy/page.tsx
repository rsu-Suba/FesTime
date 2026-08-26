import React from "react";
import CodeBlock from "@/components/CodeBlock";

export default function DeployGuidePage() {
  return (
    <div className="doc-article">
      <div className="doc-header">
        <h1 className="doc-title">Infra / Deploy</h1>
        <p className="doc-desc">
          本アプリは、スケーラビリティとリアルタイム性を確保するために外部のクラウドサービスをフル活用しています。
        </p>
      </div>

      <section className="doc-section">
        <h2>利用サービス一覧</h2>
        <div className="table-responsive" style={{ margin: "16px 0 28px" }}>
          <table className="doc-table">
            <thead>
              <tr>
                <th style={{ width: "25%" }}>サービス</th>
                <th style={{ width: "40%" }}>役割</th>
                <th style={{ width: "15%" }}>依存度</th>
                <th style={{ width: "20%" }}>備考</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Supabase</strong></td>
                <td>データベース、認証、リアルタイム通信、ストレージ</td>
                <td><strong>極大</strong></td>
                <td>Pro プラン (有料) を推奨</td>
              </tr>
              <tr>
                <td><strong>GitHub Pages</strong></td>
                <td>フロントエンドのホスティング</td>
                <td>高</td>
                <td><code>/app</code> パスで公開。<code>docs/</code> フォルダを参照</td>
              </tr>
              <tr>
                <td><strong>GitHub</strong></td>
                <td>ソースコード管理</td>
                <td>高</td>
                <td>複数人で開発するため必要</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="doc-section">
        <h2>デプロイフロー</h2>
        <p>
          本プロジェクトは現在、GitHub Actions を使用せず、ローカル環境でビルドした成果物をプッシュする手動デプロイ方式を採用しています。
        </p>

        <ol style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "16px", color: "var(--ft-text-secondary)", fontSize: "14.5px", margin: "16px 0" }}>
          <li>
            <strong>ローカル環境でのビルド:</strong>
            <CodeBlock
              language="bash"
              code={`npm run build`}
            />
            <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "4px" }}>
              <li>これにより <code>next build</code> が実行され、静的ファイルが <code>docs/</code> ディレクトリに出力されます。</li>
              <li>ビルド完了直後に <code>src/constants/fix-paths.ts</code> が自動実行され、GitHub Pages 用のパス修正 (<code>/app</code> プレフィックスの付与) が行われます。</li>
            </ul>
          </li>
          <li>
            <strong>GitHub へのプッシュ:</strong><br />
            ビルドされた <code>docs/</code> ディレクトリを含め、変更を <code>main</code> ブランチにコミット・プッシュします。
          </li>
          <li>
            <strong>公開:</strong><br />
            GitHub Pages が <code>docs/</code> ディレクトリの内容を自動的に読み込み、数分以内に公開内容が更新されます。
          </li>
        </ol>

        <h3>GitHub Pages の設定</h3>
        <p>GitHub リポジトリの <code>Settings</code> &gt; <code>Pages</code> にて、以下の設定を行ってください。</p>
        <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "6px", color: "var(--ft-text-secondary)", fontSize: "14.5px", marginTop: "8px" }}>
          <li><strong>Build and deployment &gt; Source</strong>: <code>Deploy from a branch</code></li>
          <li><strong>Branch</strong>: <code>main</code></li>
          <li><strong>Folder</strong>: <code>/docs</code></li>
        </ul>
      </section>

      <section className="doc-section">
        <h2>Supabase Pro プランについて</h2>
        <p>
          本アプリは文化祭期間中の大量アクセス (同時接続) に耐えるため、Supabase Pro プラン ($25/mo ~) を推奨しています。
        </p>

        <ol style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px", color: "var(--ft-text-secondary)", fontSize: "14.5px", marginTop: "8px" }}>
          <li><strong>同時接続数:</strong> 無料枠では Realtime 機能の同時接続数に厳しい制限があり、文化祭当日に「リアルタイム更新が止まる」可能性があります。</li>
          <li><strong>トラフィック量:</strong> ニュース内容やQ&amp;Aが増えると無料枠では Egress の上限に到達する可能性があります。</li>
        </ol>
      </section>
    </div>
  );
}
