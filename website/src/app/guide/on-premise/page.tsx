import React from "react";
import CodeBlock from "@/components/CodeBlock";
import Link from "next/link";

export default function OnPremiseGuidePage() {
  return (
    <div className="doc-article">
      <div className="doc-header">
        <h1 className="doc-title">On-premise operation</h1>
        <p className="doc-desc">
          Supabase Local (Docker) と Cloudflare Tunnels を組み合わせ、クラウド費用を一切かけずに学校や団体のPC 1台で完全オンプレミス運用を実現する実践ガイド
        </p>
      </div>

      <section className="doc-section">
        <h2>完全オンプレミス運用の概要とメリット</h2>
        <p>
          FesTime は Supabase Cloud (マネージドサービス) だけでなく、<strong>Supabase CLI を利用したローカル Docker 環境 (Supabase Local) </strong>でもまったく同一のコードベースで動作します。
          さらに <strong>Cloudflare Tunnels</strong> を組み合わせることで、ルーターのポート開放や固定IP契約を行うことなく、安全に SSL (HTTPS) 暗号化された通信で来場者へサービスを公開できます。
        </p>

        <div className="table-responsive" style={{ margin: "16px 0 24px" }}>
          <table className="doc-table">
            <thead>
              <tr>
                <th style={{ width: "20%" }}>項目</th>
                <th style={{ width: "40%" }}>クラウド運用 (Supabase Cloud)</th>
                <th style={{ width: "40%" }}>完全オンプレ運用 (Local + Cloudflare)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>コスト</strong></td>
                <td>Pro プラン ($25/月〜) 推奨</td>
                <td><strong>完全無料 ($0)</strong></td>
              </tr>
              <tr>
                <td><strong>データ保管場所</strong></td>
                <td>AWS / クラウドリージョン</td>
                <td><strong>実行委員会 / 学校内のローカル PC</strong></td>
              </tr>
              <tr>
                <td><strong>同時接続・制限</strong></td>
                <td>プラン枠に依存 (クォータ制限あり) </td>
                <td><strong>マシンスペックと回線帯域のみに依存</strong></td>
              </tr>
              <tr>
                <td><strong>セキュリティ</strong></td>
                <td>クラウド標準の保護</td>
                <td>Cloudflare による DDoS 保護 + トンネル通信</td>
              </tr>
              <tr>
                <td><strong>向いている環境</strong></td>
                <td>クレカ決済やクラウド利用が承認されている学校</td>
                <td>予算制約がある、または閉域網・校内完結が求められる学校</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="doc-section">
        <h2>アーキテクチャ構成</h2>
        <p>
          来場者や模擬店スタッフのアクセスは Cloudflare のエッジサーバーを経由し、セキュアな暗号化トンネル <code>cloudflared</code> を通じて本部PCのローカル Docker コンテナ群へルーティングされます。
        </p>

        <ol style={{ marginTop: "8px", marginBottom: 0 }}>
          <li><strong>来場者・スタッフ</strong>: <code>https://your-domain.com</code> または GitHub Pages のフロントエンドにアクセス</li>
          <li><strong>Cloudflare Edge</strong>: SSL 終端、DDoS 攻撃緩和、グローバル CDN キャッシュ</li>
          <li><strong>Cloudflare Tunnel (cloudflared)</strong>: ポート開放なしでローカル PC と Cloudflare 間を暗号化接続</li>
          <li><strong>Kong API Gateway (Port 54321)</strong>: リクエストを PostgreSQL、PostgREST、GoTrue (Auth)、Storage へ中継</li>
          <li><strong>Supabase Local (Docker)</strong>: 高速なローカル SSD & メモリ上で SQL 関数・トランザクションを実行</li>
        </ol>
      </section>

      <section className="doc-section">
        <h2>前提環境・必要なツール</h2>
        <ul style={{ paddingLeft: "20px", color: "var(--ft-text-secondary)", fontSize: "14.5px" }}>
          <li><strong>ホスト PC:</strong> メモリ 8GB 以上 (16GB 推奨)、macOS / Windows (WSL2) / Linux</li>
          <li><strong>Docker Desktop:</strong> または Docker Engine + Docker Compose</li>
          <li><strong>Supabase CLI:</strong> 公式コマンドラインツール</li>
          <li><strong>Cloudflare アカウント:</strong> 無料プランで利用可能 (独自ドメインまたは Quick Tunnels)</li>
          <li><strong>有線 LAN 接続:</strong> 安定運用のために Wi-Fi ではなく有線接続を強く推奨</li>
        </ul>
      </section>

      <section className="doc-section">
        <h2>Step 1: Supabase Local の初期化 & 起動</h2>
        <p>
          リポジトリのルートディレクトリで Supabase CLI を初期化し、Docker コンテナ群を起動します。
        </p>

        <CodeBlock
          language="bash"
          code={`# 1. Supabase CLI のインストール (Mac の場合)
brew install supabase/tap/supabase

# 2. プロジェクトの初期化
supabase init

# 3. ローカルコンテナ群を起動 (Docker Desktop が起動している必要があります)
supabase start`}
        />

        <p>
          起動が完了すると、ターミナルに以下のような接続情報が表示されます :
        </p>

        <CodeBlock
          language="bash"
          code={`Started supabase local development setup.
         API URL: http://127.0.0.1:54321
          DB URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres
      Studio URL: http://127.0.0.1:54323
    Inbucket URL: http://127.0.0.1:54324
        anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`}
        />

        <h3>データベースの構築 & アカウント設定</h3>
        <ol style={{ paddingLeft: "20px", color: "var(--ft-text-secondary)", fontSize: "14.5px" }}>
          <li>ブラウザでローカル Supabase Studio <code>http://localhost:54323</code> を開きます。</li>
          <li>左メニューの <strong>「SQL Editor」</strong> を開き、プロジェクト内の <code>SQL/Full.sql</code> を貼り付けて実行します。</li>
          <li>続いて <code>SQL/06_generate_votejson.sql</code> を実行し、結果を <code>public/data/vote.json</code> に配置します。</li>
          <li>左メニューの <strong>「Authentication」 → 「Users」</strong> から、全体管理者と模擬店管理者の2アカウントを作成します。</li>
        </ol>
      </section>

      <section className="doc-section">
        <h2>Step 2: Cloudflare Tunnels による安全な外部公開</h2>
        <p>
          ローカルの API Gateway <code>http://localhost:54321</code> を、ルーターのポート開放なしでインターネット上に公開します。
        </p>

        <h3>方法 A: Quick Tunnel (検証・即時テスト用 / ドメイン不要)</h3>
        <p>
          Cloudflare 公式の <code>cloudflared</code> をインストールして以下のワンライナーを実行するだけで、一時的なランダム公開 URL <code>https://xxxx.trycloudflare.com</code> が即座に発行されます。
        </p>

        <CodeBlock
          language="bash"
          code={`# cloudflared のインストール (Mac の場合)
brew install cloudflared

# Kong API Gateway を一時公開
cloudflared tunnel --url http://localhost:54321`}
        />

        <h3>方法 B: 名前付きトンネル (本番運用推奨 / 独自ドメイン)</h3>
        <p>
          固定ドメイン (例: <code>your-domain.com</code>) で運用する場合は、Cloudflare Zero Trust ダッシュボードまたは CLI で名前付きトンネルを作成します。
        </p>

        <CodeBlock
          language="bash"
          code={`# 1. Cloudflare にログイン
cloudflared tunnel login

# 2. トンネルの作成
cloudflared tunnel create festime-tunnel

# 3. ドメインのルーティング設定
cloudflared tunnel route dns festime-tunnel your-domain.com

# 4. 設定ファイル (~/.cloudflared/config.yml) を作成
tunnel: <TUNNEL_UUID>
credentials-file: /Users/<USER>/.cloudflared/<TUNNEL_UUID>.json

ingress:
  - hostname: your-domain.com
    service: http://localhost:54321
  - service: http_status:404

# 5. トンネルを常駐起動
cloudflared tunnel run festime-tunnel`}
        />
      </section>

      <section className="doc-section">
        <h2>Step 3: アプリ環境変数の接続設定</h2>
        <p>
          Cloudflare Tunnel で発行された公開 URL、およびローカル Supabase の <code>anon key</code> を <code>.env</code> に設定します。
        </p>

        <CodeBlock
          language="bash"
          filename=".env"
          code={`# Cloudflare Tunnel 経由の公開 API エンドポイント
NEXT_PUBLIC_SUPABASE_URL=https://your-domain.com
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...

# 認証設定
NEXT_PUBLIC_ADMIN_EMAIL=admin@example.com
NEXT_PUBLIC_BOOTH_ADMIN_EMAIL=booth@example.com
NEXT_PUBLIC_BOOTH_ADMIN_PASSWORD=your_secure_password`}
        />

        <p>
          設定完了後、フロントエンドを通常通りビルドして GitHub Pages や校内 Web サーバーにデプロイすれば、完全オンプレミス運用での本番稼働が開始されます。
        </p>
      </section>

      <section className="doc-section">
        <h2>本番運用のチェックリスト & Tips</h2>
        <div className="table-responsive" style={{ margin: "16px 0" }}>
          <table className="doc-table">
            <thead>
              <tr>
                <th style={{ width: "30%" }}>運用項目</th>
                <th style={{ width: "70%" }}>推奨対策 & ベストプラクティス</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>PC のスリープ防止</strong></td>
                <td>
                  文化祭本番中に PC がスリープすると全サービスが停止します。macOS の場合は <code>caffeinate -d -i -m -u</code> コマンドを実行するか、OS の省電力設定でスリープを無効化してください。
                </td>
              </tr>
              <tr>
                <td><strong>有線 LAN & UPS (無停電電源)</strong></td>
                <td>
                  Wi-Fi は混雑時に切断されるリスクがあるため、サーバー PC はルーター直結の有線 LAN を使用してください。万一のブレーカー落ちに備え、ノート PC (バッテリー稼働可能) をサーバーにするのが最適です。
                </td>
              </tr>
              <tr>
                <td><strong>投票・データの定期バックアップ</strong></td>
                <td>
                  <code>supabase db dump -f backup_$(date +%Y%m%d_%H%M%S).sql</code> を定期実行 (または cron 設定) して、投票データや落とし物ログを定期的に別ストレージへ退避してください。
                </td>
              </tr>
              <tr>
                <td><strong>Cloudflare キャッシュの活用</strong></td>
                <td>
                  Cloudflare ダッシュボードの「Caching」ルールで静的アセットや公開画像キャッシュを有効化することで、校内回線への下りトラフィック負荷を 90% 以上削減できます。
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
