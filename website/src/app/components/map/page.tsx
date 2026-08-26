"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ComponentDocCard } from "@/components/ComponentDocCard";
import CodeBlock from "@/components/CodeBlock";

import MapSpotDemoCard from "@/components/MapSpotDemoCard";
import MapSectionDemoCard from "@/components/MapSectionDemoCard";

export default function MapDocPage() {
  return (
    <ComponentDocCard
      title="マップ / QR現在地連動"
      componentName="<SpotStatus /> / <MapSection />"
      description="各フロアのマップ表示とブース案内。階層切り替え、および会場内に設置されたQRコード読み取りに連動した現在地周辺情報の自動展開に対応。"
      preview={<MapSectionDemoCard />}
      secondaryPreview={<MapSpotDemoCard />}
    >
      <section className="doc-section">
        <h2>使い方</h2>
        <h3>参加者向け (マップ全体表示)</h3>
        <CodeBlock
          language="tsx"
          code={`import MapSection from "@/features/map/components/MapSection";

<MapSection />`}
        />
        <h3>参加者向け (QR現在地スポット表示)</h3>
        <p style={{margin: "0"}}>Spot-QRコードを読み取ったときのみ表示</p>
        <CodeBlock
          language="tsx"
          code={`import SpotStatus from "@/features/map/components/SpotStatus";

<SpotStatus />`}
        />
      </section>

      <section className="doc-section">
        <h2>Hooks <code>src/features/map/hooks/</code></h2>
        <p>マップ機能はサーバー API 通信を行わず、以下の2つの専用フックを通じてローカルデータと UI 状態を制御します。</p>

        <div className="table-responsive">
          <table className="api-table">
            <thead>
              <tr>
                <th>フック / プロパティ</th>
                <th>型</th>
                <th>役割</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>useMapData</code></td>
                <td><code>(place?) =&gt; MapData</code></td>
                <td>フロアマップ階層切り替え、ピン座標マッピング、フルスクリーン制御 (iOS 対応)</td>
              </tr>
              <tr>
                <td><code>useMapData.activeIndex</code></td>
                <td><code>number</code></td>
                <td>現在選択されているフロアマップ番号</td>
              </tr>
              <tr>
                <td><code>useMapData.toggleFullscreen()</code></td>
                <td><code>() =&gt; void</code></td>
                <td>マップの全画面表示切り替え</td>
              </tr>
              <tr>
                <td><code>useSpotInfo</code></td>
                <td><code>() =&gt; SpotInfo</code></td>
                <td>URL クエリ <code>?spot=xxx</code> を検知し、周辺の模擬店・展示情報を自動抽出</td>
              </tr>
              <tr>
                <td><code>useSpotInfo.nearbyBooths</code></td>
                <td><code>StallStatus[]</code></td>
                <td>現在地周辺の模擬店一覧 (<code>DataContext</code> の混雑状況とリアルタイム連動)</td>
              </tr>
              <tr>
                <td><code>useSpotInfo.nearbyExhibitions</code></td>
                <td><code>Exhibition[]</code></td>
                <td>現在地周辺の展示企画一覧</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="doc-section">
        <h2>コード</h2>

        <h3>周辺ブース情報の自動抽出 <code>src/features/map/hooks/useSpotInfo.ts</code></h3>
        <p>QR コードからスポット ID を取得し、該当スポットの周辺模擬店 ID に紐づく最新の混雑・在庫ステータスを即座に結合します。</p>
        <CodeBlock
          language="typescript"
          filename="src/features/map/hooks/useSpotInfo.ts"
          code={`const nearbyBooths = useMemo(() => {
  if (!currentSpot || !fetchedData) return [];
  const ids = [...currentSpot.nearbyStalls];
  return fetchedData.stalls
    .filter((s) => ids.includes(Number(s.id)))
    .sort((a, b) => Number(a.id) - Number(b.id));
}, [currentSpot, fetchedData]);`}
        />
      </section>

      <section className="doc-section">
        <h2>データ構造 <code>public/data/spots.json</code></h2>
        <p>スポットごとの名称、階層、および周辺の模擬店・展示 ID リストを定義します。</p>
        <CodeBlock
          language="json"
          filename="public/data/spots.json"
          code={`[
  {
    "id": "1F_NW",
    "location": "校舎 1階 北西",
    "nearbyStalls": [1, 2],
    "nearbyExhibitions": [101]
  }
]`}
        />
      </section>
    </ComponentDocCard>
  );
}
