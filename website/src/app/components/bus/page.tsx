"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ComponentDocCard } from "@/components/ComponentDocCard";
import CodeBlock from "@/components/CodeBlock";

const BusStatus = dynamic(() => import("@festime/features/bus/components/BusStatus"), { ssr: false });

export default function BusDocPage() {
  return (
    <ComponentDocCard
      title="バス時刻表"
      componentName="<BusStatus />"
      description="シャトルバスや臨時便の運行ダイヤおよび発車時刻の案内。発着地別の絞り込み、発車までのカウントダウン、直近1時間以内の便の抽出に対応。"
      preview={<BusStatus />}
    >
      <section className="doc-section">
        <h2>使い方</h2>
        <CodeBlock
          language="tsx"
          code={`import BusStatus from "@/features/bus/components/BusStatus";

<BusStatus />`}
        />
      </section>

      <section className="doc-section">
        <h2>Hooks <code>src/features/bus/hooks/useBusData.ts</code></h2>
        <p>静的 JSON ファイル <code>public/data/bus.json</code> から時刻表データを非同期ロードし、現在時刻や乗降地フィルターに応じた運行便一覧を提供します。</p>

        <div className="table-responsive">
          <table className="api-table">
            <thead>
              <tr>
                <th>プロパティ / 関数</th>
                <th>型</th>
                <th>役割</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>filteredBuses</code></td>
                <td><code>BusTrip[]</code></td>
                <td>選択された乗降地およびフィルター (1時間以内 / すべて) に適合した運行便配列</td>
              </tr>
              <tr>
                <td><code>fromStop</code> / <code>toStop</code></td>
                <td><code>string</code></td>
                <td>現在選択されている乗車停留所および降車停留所</td>
              </tr>
              <tr>
                <td><code>setFromStop(stop)</code> / <code>setToStop(stop)</code></td>
                <td><code>(stop : string) =&gt; void</code></td>
                <td>乗車・降車停留所の変更</td>
              </tr>
              <tr>
                <td><code>filterMode</code></td>
                <td><code>"hour" | "all"</code></td>
                <td>現在のフィルターモード (直近1時間以内 / 全便表示)</td>
              </tr>
              <tr>
                <td><code>setFilterMode(mode)</code></td>
                <td><code>(mode : "hour" | "all") =&gt; void</code></td>
                <td>フィルターモードの切り替え</td>
              </tr>
              <tr>
                <td><code>stopOptions</code></td>
                <td><code>{"{"} value: string, label: string {"}"}[]</code></td>
                <td>セレクトボックス用の多言語対応済み停留所選択肢</td>
              </tr>
              <tr>
                <td><code>nowTimeStr</code></td>
                <td><code>string</code></td>
                <td><code>TimeContext</code> から取得した現在時刻の <code>HH:mm</code> 形式文字列</td>
              </tr>
              <tr>
                <td><code>newIndexMap</code></td>
                <td><code>Map&lt;string, number&gt;</code></td>
                <td>「すべて」展開時に新規表示されるバスカードのアニメーション遅延 (Stagger) 計算用インデックスマップ</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="doc-section">
        <h2>コード</h2>

        <h3>カウントダウンと直近便の自動判定</h3>
        <p>現在時刻以降に出発する直近の便を検出し、出発までの残り分数バッジや出発済み表示を自動計算します。</p>
        <CodeBlock
          language="typescript"
          filename="src/features/bus/hooks/useBusData.ts"
          code={`const isInHourRange = (bus: BusTrip) => {
  const isUpcoming = bus.isoTime > nowTimeStr;
  return isUpcoming && bus.isoTime <= oneHourLaterStr;
};`}
        />
      </section>

      <section className="doc-section">
        <h2>データ構造 <code>public/data/bus.json</code></h2>
        <p>往路 (Outbound) と復路 (Inbound) の停留所名および時刻配列を定義します。</p>
        <CodeBlock
          language="json"
          filename="public/data/bus.json"
          code={`{
  "Outbound": {
    "route": ["キャンパス 発", "中央駅 着"],
    "time": [
      ["10:00", "11:00", "12:00", "13:00"],
      ["10:30", "11:30", "12:30", "13:30"]
    ]
  },
  "Inbound": {
    "route": ["中央駅 発", "キャンパス 着"],
    "time": [
      ["10:30", "11:30", "12:30", "13:30"],
      ["11:00", "12:00", "13:00", "14:00"]
    ]
  }
}`}
        />
      </section>
    </ComponentDocCard>
  );
}
