import React from "react";
import type { Metadata } from "next";
import CodeBlock from "@/components/docs/CodeBlock";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Custom",
};

export default function CustomizationPage() {
  return (
    <div className="doc-article">
      <div className="doc-header">
        <div className="doc-meta">
          <code className="doc-code-badge">Reference</code>
        </div>
        <h1 className="doc-title">Variable / Setting Reference</h1>
        <p className="doc-desc">
          <code>src/constants/custom.config.ts</code> および <code>public/data/*.json</code> 内で定義されている各変数が、画面 UI や各機能のどの部分に対応・影響しているかの一覧表です。
        </p>
      </div>

      <section className="doc-section">
        <h2>1. <code>custom.config.ts</code> 変数対応表</h2>
        <p>アプリ全体の基本メタデータ、ブランドカラー、各機能の表示トグルを制御する変数群です。</p>

        <div className="table-responsive" style={{ margin: "20px 0" }}>
          <table className="doc-table">
            <thead>
              <tr>
                <th style={{ width: "26%" }}>変数名 (Key Path)</th>
                <th style={{ width: "16%" }}>型 (Type)</th>
                <th style={{ width: "28%" }}>デフォルト例</th>
                <th style={{ width: "30%" }}>対応する UI / 影響範囲</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>identity.eventName</code></td>
                <td><code>string</code></td>
                <td><code>&quot;FesTime 2026&quot;</code></td>
                <td>イベント名</td>
              </tr>
              <tr>
                <td><code>identity.organizationName</code></td>
                <td><code>string</code></td>
                <td><code>&quot;Organization&quot;</code></td>
                <td>イベントを運営する団体名</td>
              </tr>
              <tr>
                <td><code>identity.appTitle</code></td>
                <td><code>string</code></td>
                <td><code>&quot;FesTime App&quot;</code></td>
                <td>ブラウザの <code>&lt;title&gt;</code></td>
              </tr>
              <tr>
                <td><code>identity.appDescription</code></td>
                <td><code>string</code></td>
                <td><code>&quot;Real-time status, voting, and management&quot;</code></td>
                <td>SEO用 <code>&lt;meta name=&quot;description&quot;&gt;</code>、OGP説明文</td>
              </tr>
              <tr>
                <td><code>identity.eventStartDate</code></td>
                <td><code>string (YYYY-MM-DD)</code></td>
                <td><code>&quot;2026-05-27&quot;</code></td>
                <td>イベント開始の日付判定 (タイムテーブル Day1 連動)</td>
              </tr>
              <tr>
                <td><code>identity.eventEndDate</code></td>
                <td><code>string (YYYY-MM-DD)</code></td>
                <td><code>&quot;2026-05-28&quot;</code></td>
                <td>イベント終了の日付判定 (タイムテーブル Day2 連動)</td>
              </tr>
              <tr><td></td><td></td><td></td><td></td></tr>
              <tr>
                <td><code>navigation.homepageUrl</code></td>
                <td><code>string</code></td>
                <td><code>&quot;https://rsu-suba.github.io/FesTime/&quot;</code></td>
                <td>イベント公式サイト URL</td>
              </tr>
              <tr>
                <td><code>navigation.basePath</code></td>
                <td><code>string</code></td>
                <td><code>&quot;/FesTime&quot;</code></td>
                <td>サブディレクトリ配信時のベースパス</td>
              </tr>
              <tr><td></td><td></td><td></td><td></td></tr>
              <tr>
                <td><code>theme.primaryColor.light</code></td>
                <td><code>string (HEX)</code></td>
                <td><code>&quot;#1f1f1f&quot;</code></td>
                <td>ライトモード時の CSS 変数 <code>--main-color</code>、主要ボタン枠線</td>
              </tr>
              <tr>
                <td><code>theme.primaryColor.dark</code></td>
                <td><code>string (HEX)</code></td>
                <td><code>&quot;#f0f0f0&quot;</code></td>
                <td>ダークモード時の CSS 変数 <code>--main-color</code>、主要ボタン枠線</td>
              </tr>
              <tr>
                <td><code>theme.backgroundColor.light</code></td>
                <td><code>string (HEX)</code></td>
                <td><code>&quot;#ffffff&quot;</code></td>
                <td>ライトモード時の CSS 変数 <code>--bg-color</code>、カード背景色</td>
              </tr>
              <tr>
                <td><code>theme.backgroundColor.dark</code></td>
                <td><code>string (HEX)</code></td>
                <td><code>&quot;#18181a&quot;</code></td>
                <td>ダークモード時の CSS 変数 <code>--bg-color</code>、カード背景色</td>
              </tr>
              <tr><td></td><td></td><td></td><td></td></tr>
              <tr>
                <td><code>features.booth</code></td>
                <td><code>boolean</code></td>
                <td><code>true</code></td>
                <td>模擬店・混雑状況の有効化</td>
              </tr>
              <tr>
                <td><code>features.vote</code></td>
                <td><code>boolean</code></td>
                <td><code>true</code></td>
                <td>人気投票の有効化</td>
              </tr>
              <tr>
                <td><code>features.bus</code></td>
                <td><code>boolean</code></td>
                <td><code>true</code></td>
                <td>バス時刻表の有効化</td>
              </tr>
              <tr>
                <td><code>features.qa</code></td>
                <td><code>boolean</code></td>
                <td><code>true</code></td>
                <td>Q&amp;A 掲示板の有効化</td>
              </tr>
              <tr>
                <td><code>features.lost</code></td>
                <td><code>boolean</code></td>
                <td><code>true</code></td>
                <td>落とし物の有効化</td>
              </tr>
              <tr>
                <td><code>features.exhibition</code></td>
                <td><code>boolean</code></td>
                <td><code>true</code></td>
                <td>展示物一覧の有効化</td>
              </tr>
              <tr>
                <td><code>features.event</code></td>
                <td><code>boolean</code></td>
                <td><code>true</code></td>
                <td>タイムテーブル・ステージ進行の有効化</td>
              </tr>
              <tr>
                <td><code>features.news</code></td>
                <td><code>boolean</code></td>
                <td><code>true</code></td>
                <td>お知らせ配信の有効化</td>
              </tr>
              <tr>
                <td><code>features.map</code></td>
                <td><code>boolean</code></td>
                <td><code>true</code></td>
                <td>マップの有効化</td>
              </tr>
              <tr>
                <td><code>features.closedOverlay</code></td>
                <td><code>boolean</code></td>
                <td><code>false</code></td>
                <td>終了後のオーバーレイ表示</td>
              </tr>
              <tr><td></td><td></td><td></td><td></td></tr>
              <tr>
                <td><code>bus.defaultFromStop</code></td>
                <td><code>string</code></td>
                <td><code>&quot;キャンパス 発&quot;</code></td>
                <td>バスカードの初期選択「出発地」ドロップダウン値</td>
              </tr>
              <tr>
                <td><code>bus.defaultToStop</code></td>
                <td><code>string</code></td>
                <td><code>&quot;中央駅 着&quot;</code></td>
                <td>バスカードの初期選択「到着地」ドロップダウン値</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="doc-section">
        <h2>2. 各 JSON マスターデータの変数対応表</h2>
        <p><code>public/data/</code> 配下の各 JSON ファイルで定義される変数の対応表とフォーマット例です。</p>

        <h3>1. 模擬店データ <code>public/data/booth.json</code></h3>
        <p>各模擬店の基本情報、メニュー、および出店場所を定義します。</p>
        <div className="table-responsive" style={{ margin: "16px 0 20px" }}>
          <table className="doc-table">
            <thead>
              <tr>
                <th style={{ width: "24%" }}>キー名 (Key)</th>
                <th style={{ width: "16%" }}>型 (Type)</th>
                <th style={{ width: "25%" }}>設定例</th>
                <th style={{ width: "35%" }}>対応する UI / 影響範囲</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>id</code></td>
                <td><code>number</code></td>
                <td><code>1</code> : 連番</td>
                <td>店舗一意識別 ID (Supabase データベース同期キー)</td>
              </tr>
              <tr>
                <td><code>name</code></td>
                <td><code>string</code></td>
                <td><code>&quot;ポップコーン&quot;</code></td>
                <td>模擬店一覧カードの見出し、投票フォームの選択肢名</td>
              </tr>
              <tr>
                <td><code>team</code></td>
                <td><code>string</code></td>
                <td><code>&quot;チームA&quot;</code></td>
                <td>出店団体・クラス名</td>
              </tr>
              <tr>
                <td><code>place</code></td>
                <td><code>string</code></td>
                <td><code>&quot;テント番号1&quot;</code></td>
                <td>出店場所・ブース番号</td>
              </tr>
              <tr>
                <td><code>menu</code></td>
                <td><code>Array&lt;Item&gt;</code></td>
                <td><code>{'[{"content": "100g", "price": 200}]'}</code></td>
                <td>販売品目 <code>content</code> と価格 <code>price</code> の配列</td>
              </tr>
              <tr>
                <td><code>image</code></td>
                <td><code>string</code></td>
                <td><code>&quot;./img/booth/popcorn.jpg&quot;</code></td>
                <td>模擬店の紹介画像パス</td>
              </tr>
            </tbody>
          </table>
        </div>
        <CodeBlock
          language="json"
          filename="public/data/booth.json"
          code={`[
  {
    "id": 1,
    "name": "ポップコーン",
    "team": "チームA",
    "place": "テント番号1",
    "menu": [
      { "content": "100g", "price": 200 }
    ],
    "image": ""
  },
  {
    "id": 2,
    "name": "焼き鳥",
    "team": "チームB",
    "place": "テント番号2",
    "menu": [
      { "content": "1本", "price": 150 },
      { "content": "3本", "price": 400 }
    ],
    "image": ""
  }
]`}
        />

        <h3 style={{ marginTop: "40px" }}>2. タイムテーブル <code>public/data/events.json</code></h3>
        <p>ステージや各会場プログラムのスケジュールを日程別に定義します。</p>
        <div className="table-responsive" style={{ margin: "16px 0 20px" }}>
          <table className="doc-table">
            <thead>
              <tr>
                <th style={{ width: "24%" }}>キー名 (Key)</th>
                <th style={{ width: "16%" }}>型 (Type)</th>
                <th style={{ width: "25%" }}>設定例</th>
                <th style={{ width: "35%" }}>対応する UI / 影響範囲</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>day1 / day2</code></td>
                <td><code>Event[]</code></td>
                <td><code>[...]</code></td>
                <td>開催日程ごとのイベント配列</td>
              </tr>
              <tr>
                <td><code>name</code></td>
                <td><code>string</code></td>
                <td><code>&quot;オープニング&quot;</code></td>
                <td>タイムテーブルカード内の企画タイトル</td>
              </tr>
              <tr>
                <td><code>start</code></td>
                <td><code>string (HH:mm)</code></td>
                <td><code>&quot;10:00&quot;</code></td>
                <td>開始時刻 (進行中ハイライト判定)</td>
              </tr>
              <tr>
                <td><code>end</code></td>
                <td><code>string (HH:mm)</code></td>
                <td><code>&quot;10:20&quot;</code></td>
                <td>終了時刻 (プログレスバー計算)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <CodeBlock
          language="json"
          filename="public/data/events.json"
          code={`{
  "day1": [
    { "name": "オープニング", "start": "10:00", "end": "10:20" },
    { "name": "カラオケ大会", "start": "10:40", "end": "11:10" }
  ],
  "day2": [
    { "name": "ライブステージ", "start": "10:10", "end": "12:10" },
    { "name": "吹奏楽部 演奏", "start": "12:30", "end": "13:15" }
  ]
}`}
        />

        <h3 style={{ marginTop: "40px" }}>3. スマートバス時刻表 <code>public/data/bus.json</code></h3>
        <p>往路 (Outbound) と復路 (Inbound) の各停留所および運行ダイヤをマトリクス形式で定義します。</p>
        <div className="table-responsive" style={{ margin: "16px 0 20px" }}>
          <table className="doc-table">
            <thead>
              <tr>
                <th style={{ width: "24%" }}>キー名 (Key)</th>
                <th style={{ width: "16%" }}>型 (Type)</th>
                <th style={{ width: "25%" }}>設定例</th>
                <th style={{ width: "35%" }}>対応する UI / 影響範囲</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>Outbound / Inbound</code></td>
                <td><code>RouteData</code></td>
                <td><code>{"{ route: [...], time: [...] }"}</code></td>
                <td>系統ごとの路線定義</td>
              </tr>
              <tr>
                <td><code>route</code></td>
                <td><code>string[]</code></td>
                <td><code>[&quot;キャンパス 発&quot;, &quot;中央駅 着&quot;]</code></td>
                <td>経由する停留所名の配列 (乗降地セレクタの選択肢)</td>
              </tr>
              <tr>
                <td><code>time</code></td>
                <td><code>string[][] (HH:mm)</code></td>
                <td><code>[[&quot;08:00&quot;, ...], [&quot;08:30&quot;, ...]]</code></td>
                <td>各停留所の発着時刻配列 (インデックス順に対応)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <CodeBlock
          language="json"
          filename="public/data/bus.json"
          code={`{
  "Outbound": {
    "route": ["キャンパス 発", "中央駅 着"],
    "time": [
      ["08:00", "09:00", "10:00", "11:00"],
      ["08:30", "09:30", "10:30", "11:30"]
    ]
  },
  "Inbound": {
    "route": ["中央駅 発", "キャンパス 着"],
    "time": [
      ["13:00", "14:00", "15:00", "16:00"],
      ["13:30", "14:30", "15:30", "16:30"]
    ]
  }
}`}
        />

        <h3 style={{ marginTop: "40px" }}>4. 展示企画データ <code>public/data/exhibitions.json</code></h3>
        <p>校内各教室や体育館で行われるクラス展示・部活動展示の情報を定義します。</p>
        <div className="table-responsive" style={{ margin: "16px 0 20px" }}>
          <table className="doc-table">
            <thead>
              <tr>
                <th style={{ width: "24%" }}>キー名 (Key)</th>
                <th style={{ width: "16%" }}>型 (Type)</th>
                <th style={{ width: "25%" }}>設定例</th>
                <th style={{ width: "35%" }}>対応する UI / 影響範囲</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>id</code></td>
                <td><code>number</code></td>
                <td><code>1</code></td>
                <td>展示一意識別 ID (マップ・QRスポット連動キー)</td>
              </tr>
              <tr>
                <td><code>name</code></td>
                <td><code>string</code></td>
                <td><code>&quot;写真展示&quot;</code></td>
                <td>展示企画のタイトル、投票フォームの選択肢名</td>
              </tr>
              <tr>
                <td><code>team</code></td>
                <td><code>string</code></td>
                <td><code>&quot;写真同好会&quot;</code></td>
                <td>出展クラス・部活動名</td>
              </tr>
              <tr>
                <td><code>place</code></td>
                <td><code>string</code></td>
                <td><code>&quot;教室1&quot;</code></td>
                <td>展示場所・教室名</td>
              </tr>
              <tr>
                <td><code>image</code></td>
                <td><code>string</code></td>
                <td><code>&quot;./img/exhibition/ClassA.jpg&quot;</code></td>
                <td>展示企画の紹介画像パス</td>
              </tr>
            </tbody>
          </table>
        </div>
        <CodeBlock
          language="json"
          filename="public/data/exhibitions.json"
          code={`[
  {
    "id": 1,
    "name": "写真展示",
    "team": "写真同好会",
    "place": "教室1",
    "image": ""
  },
  {
    "id": 2,
    "name": "フォトスポット",
    "team": "実行委員会",
    "place": "フォトブース",
    "image": ""
  }
]`}
        />

        <h3 style={{ marginTop: "40px" }}>5. マップ &amp; QR現在地スポット <code>public/data/spots.json</code></h3>
        <p>校内に設置された各 QR コードの ID、場所名、および周辺にある模擬店・展示の ID を定義します。</p>
        <div className="table-responsive" style={{ margin: "16px 0 20px" }}>
          <table className="doc-table">
            <thead>
              <tr>
                <th style={{ width: "24%" }}>キー名 (Key)</th>
                <th style={{ width: "16%" }}>型 (Type)</th>
                <th style={{ width: "25%" }}>設定例</th>
                <th style={{ width: "35%" }}>対応する UI / 影響範囲</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>id</code></td>
                <td><code>string</code></td>
                <td><code>&quot;1F_NW&quot;</code></td>
                <td>QR コードのクエリ ID <code>?spot=1F_NW</code></td>
              </tr>
              <tr>
                <td><code>location</code></td>
                <td><code>string</code></td>
                <td><code>&quot;校舎 1階 北西&quot;</code></td>
                <td>現在地スポットカードの見出し表示</td>
              </tr>
              <tr>
                <td><code>nearbyStalls</code></td>
                <td><code>number[]</code></td>
                <td><code>[1, 2]</code></td>
                <td>現在地周辺の模擬店 ID 配列 (<code>booth.json</code> の <code>id</code> と連動)</td>
              </tr>
              <tr>
                <td><code>nearbyExhibitions</code></td>
                <td><code>number[]</code></td>
                <td><code>[1, 3]</code></td>
                <td>現在地周辺の展示 ID 配列 (<code>exhibitions.json</code> の <code>id</code> と連動)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <CodeBlock
          language="json"
          filename="public/data/spots.json"
          code={`[
  {
    "id": "1F_NW",
    "location": "校舎 1階 北西",
    "nearbyStalls": [1, 2],
    "nearbyExhibitions": [1]
  },
  {
    "id": "2F_NE",
    "location": "校舎 2階 北東",
    "nearbyStalls": [3, 4],
    "nearbyExhibitions": [2, 3]
  }
]`}
        />

        <h3 style={{ marginTop: "40px" }}>6. 投票対象マスター <code>public/data/vote.json</code></h3>
        <p>人気投票の対象となる模擬店 (s) および展示 (e) の ID と名称を定義します。<br /><strong><span style={{ color: "#ef4444" }}>注意: </span></strong>SQLによる自動生成のため、変更が発生すると投票機能が正しく動かない可能性があります。</p>
        <div className="table-responsive" style={{ margin: "16px 0 20px" }}>
          <table className="doc-table">
            <thead>
              <tr>
                <th style={{ width: "24%" }}>キー名 (Key)</th>
                <th style={{ width: "16%" }}>型 (Type)</th>
                <th style={{ width: "25%" }}>設定例</th>
                <th style={{ width: "35%" }}>対応する UI / 影響範囲</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>id</code></td>
                <td><code>string</code></td>
                <td><code>&quot;01&quot;</code> / <code>&quot;31&quot;</code></td>
                <td>投票ターゲットの一意識別 ID</td>
              </tr>
              <tr>
                <td><code>name</code></td>
                <td><code>string</code></td>
                <td><code>&quot;ポップコーン&quot;</code></td>
                <td>投票画面の選択肢名および管理者集計画面の項目名</td>
              </tr>
              <tr>
                <td><code>category</code></td>
                <td><code>&quot;s&quot; | &quot;e&quot;</code></td>
                <td><code>&quot;s&quot;</code> (模擬店) / <code>&quot;e&quot;</code> (展示)</td>
                <td>投票部門のカテゴリ区分</td>
              </tr>
            </tbody>
          </table>
        </div>
        <CodeBlock
          language="json"
          filename="public/data/vote.json"
          code={`[
  { "id": "01", "name": "ポップコーン", "category": "s" },
  { "id": "02", "name": "焼き鳥", "category": "s" },
  { "id": "31", "name": "写真展示", "category": "e" },
  { "id": "32", "name": "フォトスポット", "category": "e" }
]`}
        />
      </section>
    </div>
  );
}
