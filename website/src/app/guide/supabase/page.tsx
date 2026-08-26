import React from "react";
import type { Metadata } from "next";
import Mermaid from "@/components/Mermaid";

export const metadata: Metadata = {
  title: "Supabase",
};

export default function SupabaseGuidePage() {
  return (
    <div className="doc-article">
      <div className="doc-header">
        <h1 className="doc-title">Back-end : Supabase</h1>
        <p className="doc-desc">
          本アプリのバックエンドである Supabase データベースの詳細<br/>このページはライトテーマでの閲覧を推奨します。
        </p>
      </div>

      <section className="doc-section">
        <h2>システム構成と権限フロー</h2>
        <p>
          本アプリのセキュリティは、フロントエンドのロール管理とバックエンドの RLS (Row Level Security) の組み合わせで成立しています。
        </p>

        <Mermaid chart={`graph TD
    subgraph "Clients (Frontend)"
        User["一般来場者 (User)"]
        Admin["全体管理者 (Admin)"]
        StallAdmin["模擬店運営 (StallAdmin)"]
    end

    subgraph "Auth Logic"
        Pass["管理者ログイン<br/>(Password)"]
        QR["QRトークン検証<br/>(?id=&token=)"]
        Session["Supabase Auth<br/>(authenticated)"]
    end

    subgraph "Vote Validation (RPC)"
        TimeCheck["期間チェック<br/>(app_settings参照)"]
        TargetCheck["ID実在チェック<br/>(vote_targets参照)"]
        FraudCheck["不正/多重投票防止<br/>(IP/連打制限)"]
    end

    subgraph "Supabase DB (Server)"
        UserGen[(ユーザー生成データ<br/>votes)]
        Dynamic[(リアルタイム更新データ<br/>stalls_status / news / lost_items / questions)]
        Master[(マスターデータ Read only<br/>vote_targets / app_settings)]
    end

    User -->|"Read Only"| Dynamic
    User --> TimeCheck
    TimeCheck --> TargetCheck
    TargetCheck --> FraudCheck
    FraudCheck -->|"Insert"| UserGen
    
    User -->|"Insert<br/>(Q&A)"| Dynamic

    StallAdmin --> QR
    QR --> Session
    Session -->|"Update<br/>(stalls_status)"| Dynamic

    Admin --> Pass
    Pass --> Session
    Session -->|"Full Access<br/>(All Tables)"| Dynamic`} />
      </section>

      <section className="doc-section">
        <h2>テーブル構成</h2>

        <h3>1. リアルタイム更新データ (店舗・状況管理)</h3>
        <p>模擬店の混雑状況や、運営からの動的な情報を管理するテーブル群です。</p>
        <Mermaid chart={`erDiagram
    stalls_status {
        bigint id PK
        string stall_name "団体名"
        int crowd_level "0:空き / 1:やや混雑 / 2:混雑"
        int stock_level "0:在庫あり / 1:在庫少なめ / 2:品切れ"
        timestamp updated_at
    }
    news {
        uuid id PK
        string title "ニュースタイトル"
        text content "本文"
        text edit_reason "編集理由"
        timestamp created_at
    }`} />

        <h3>2. 広報・コミュニケーション (落とし物・Q&A)</h3>
        <p>来場者とのやり取りや、写真を含む情報を管理するテーブル群です。</p>
        <Mermaid chart={`erDiagram
    lost_items {
        uuid id PK
        string name "物品名"
        string place "拾得場所"
        string photo_path "Storage内のパス"
        text edit_reason "編集理由"
        timestamp created_at
    }
    questions {
        uuid id PK
        text text "質問本文"
        text answer "運営からの回答"
        text edit_reason "編集理由"
        timestamp created_at
    }`} />

        <h3>3. アプリ設定と投票システム</h3>
        <p>アプリの挙動制御と、リレーションを持つ投票データを管理するテーブル群です。</p>
        <Mermaid chart={`erDiagram
    app_settings {
        string key PK "設定名 (vote_start_at等)"
        int value_int
        text value_text
        timestamp updated_at
    }
    vote_targets {
        string id PK "01, 02..."
        string name "店名/展示名"
        string category "s:模擬店 / e:展示"
        int display_order "表示順"
        timestamp created_at
    }
    votes {
        uuid id PK
        string voter_id "識別ID"
        string target_id FK "vote_targets.id"
        string category
        timestamp created_at
    }

    vote_targets ||--o{ votes : "is voted"`} />

        <h3>Supabaseのapp_settingsテーブル</h3>
        <div className="table-responsive" style={{ margin: "16px 0 28px" }}>
          <table className="doc-table">
            <thead>
              <tr>
                <th style={{ width: "25%" }}>Key</th>
                <th style={{ width: "45%" }}>役割</th>
                <th style={{ width: "30%" }}>デフォルト値</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>poll_interval_ms</code></td>
                <td>Realtimeが途切れた時に<code>get_stalls_only</code>を実行する間隔　[ミリ秒]</td>
                <td><code>30000</code></td>
              </tr>
              <tr>
                <td><code>vote_start_at</code></td>
                <td>投票開始時刻</td>
                <td><code>2026-05-23 10:00:00+09</code></td>
              </tr>
              <tr>
                <td><code>vote_end_at</code></td>
                <td>投票終了時刻</td>
                <td><code>2026-05-24 15:00:00+09</code></td>
              </tr>
              <tr>
                <td><code>voting_enabled</code></td>
                <td>投票可能フラグ</td>
                <td><code>1</code></td>
              </tr>
              <tr>
                <td><code>maintenance_mode</code></td>
                <td>メンテナンスフラグ</td>
                <td><code>0</code></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="doc-section">
        <h2>アクセス制御とセキュリティ設計 (RLS / RPC)</h2>
        <p>
          データベースへの直接書き込みは原則として Supabase Auth で認証された管理者のみに許可され、一般ユーザーからの更新はバリデーション付きの RPC (Remote Procedure Call) 経由に制限されています。
        </p>

        <div className="table-responsive" style={{ margin: "16px 0 28px" }}>
          <table className="doc-table">
            <thead>
              <tr>
                <th style={{ width: "20%" }}>ロール</th>
                <th style={{ width: "35%" }}>アクセス許可範囲</th>
                <th style={{ width: "45%" }}>制御方式</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>一般来場者 (Anon)</strong></td>
                <td>全テーブルの閲覧 (SELECT)、Q&A 投稿 (INSERT)、投票 (RPC)</td>
                <td>RLS (<code>FOR SELECT USING (true)</code>) & RPC (<code>vote_for_target</code>)</td>
              </tr>
              <tr>
                <td><strong>模擬店運営 (StallAdmin)</strong></td>
                <td>自店舗の混雑・在庫状況の更新 (UPDATE)</td>
                <td>QRトークン検証による Auth セッション & RLS</td>
              </tr>
              <tr>
                <td><strong>全体管理者 (Admin)</strong></td>
                <td>全テーブルの作成・更新・削除 (ALL)</td>
                <td>管理者ログインによる Auth セッション & RLS</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="doc-section">
        <h2>セキュリティ監査テスト仕様</h2>
        <p>
          <code>src/lib/Misc/audit_security.ts</code> スクリプトは、悪意のあるクライアントからの不正アクセスや改ざんをシミュレートし、RLS ポリシーおよび RPC の防御性能を検証します。
        </p>

        <div className="table-responsive" style={{ margin: "16px 0" }}>
          <table className="doc-table">
            <thead>
              <tr>
                <th style={{ width: "12%" }}>テスト ID</th>
                <th style={{ width: "28%" }}>検証項目・攻撃内容</th>
                <th style={{ width: "60%" }}>防御メカニズム & チェックポイント</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>T1</code></td>
                <td>期間外の不正投票</td>
                <td><code>vote_for_target</code> 内で <code>app_settings</code> の <code>vote_start_at</code> / <code>vote_end_at</code> を照合し拒絶。</td>
              </tr>
              <tr>
                <td><code>T2</code></td>
                <td>匿名ユーザーによる直接改ざん</td>
                <td><code>news</code> や <code>stalls_status</code> 等のテーブル RLS が <code>ENABLE</code> であり、匿名書き込みがブロックされること。</td>
              </tr>
              <tr>
                <td><code>T3</code></td>
                <td>ID 偽装・連打による多重投票</td>
                <td>RPC 内でクライアント IP <code>x-forwarded-for</code> のハッシュ化およびレート制限インターバル判定を行い遮断。</td>
              </tr>
              <tr>
                <td><code>T4</code></td>
                <td>システム設定値の不正操作</td>
                <td><code>app_settings</code> の RLS および <code>tr_block_anon_update</code> トリガーにより匿名更新を強制ロールバック。</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
