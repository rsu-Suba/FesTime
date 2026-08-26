"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ComponentDocCard } from "@/components/ComponentDocCard";
import CodeBlock from "@/components/CodeBlock";

const EventStatus = dynamic(() => import("@festime/features/event/components/EventStatus"), { ssr: false });

export default function EventDocPage() {
  return (
    <ComponentDocCard
      title="タイムテーブル・ステージ進行"
      componentName="<EventStatus />"
      description="ステージ企画や各会場プログラムのタイムテーブルおよび進行状況の可視化。現在時刻に連動した進行中プログラムの自動ハイライトと進捗バー表示に対応。"
      preview={<EventStatus />}
    >
      <section className="doc-section">
        <h2>使い方</h2>
        <h3>参加者向け</h3>
        <CodeBlock
          language="tsx"
          code={`import EventStatus from "@/features/event/components/EventStatus";

<EventStatus />`}
        />
      </section>

      <section className="doc-section">
        <h2>Hooks <code>src/features/event/hooks/useEventData.ts</code></h2>
        <p>静的 JSON ファイル <code>public/data/events.json</code> からスケジュールデータを非同期ロードし、現在時刻やフィルターに応じたイベント一覧を提供します。</p>

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
                <td><code>filteredEvents</code></td>
                <td><code>Event[]</code></td>
                <td>開催日程およびフィルター (1時間以内 / すべて) に適合したイベント配列</td>
              </tr>
              <tr>
                <td><code>filterMode</code></td>
                <td><code>"hour" | "all"</code></td>
                <td>現在のフィルターモード (直近1時間以内 / 全表示)</td>
              </tr>
              <tr>
                <td><code>setFilterMode(mode)</code></td>
                <td><code>(mode : "hour" | "all") =&gt; void</code></td>
                <td>フィルターモードの切り替え</td>
              </tr>
              <tr>
                <td><code>currentTime</code></td>
                <td><code>Dayjs</code></td>
                <td><code>TimeContext</code> から取得したアプリ共通の現在時刻</td>
              </tr>
              <tr>
                <td><code>getEventTime(timeStr)</code></td>
                <td><code>(timeStr : string) =&gt; Dayjs</code></td>
                <td>当日の日付と時刻文字列を結合した Dayjs インスタンスを生成</td>
              </tr>
              <tr>
                <td><code>newIndexMap</code></td>
                <td><code>Map&lt;string, number&gt;</code></td>
                <td>「すべて」展開時に新規表示されるカードのアニメーション遅延 (Stagger) 計算用インデックスマップ</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="doc-section">
        <h2>コード</h2>

        <h3>プログレスバーの進捗率計算</h3>
        <p>現在時刻 <code>currentTime</code> と企画の開始・終了時刻からミリ秒単位で進捗パーセンテージ (0〜100%) を動的算出します。</p>
        <CodeBlock
          language="typescript"
          filename="src/features/event/utils/calculateProgress.ts"
          code={`const calculateProgress = (startStr: string, endStr: string, current: Dayjs) => {
  const start = dayjs(\`\${current.format("YYYY-MM-DD")} \${startStr}\`);
  const end = dayjs(\`\${current.format("YYYY-MM-DD")} \${endStr}\`);
  
  if (current.isBefore(start)) return 0;
  if (current.isAfter(end)) return 100;
  
  const totalDuration = end.diff(start);
  const elapsed = current.diff(start);
  return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
};`}
        />

        <h3>newIndexMap によるアニメーション遅延制御</h3>
        <p>フィルターを「1時間以内」から「すべて」に切り替えた際、すでに画面上にあった項目は維持し、新しく追加展開されるカードにのみインデックスを割り振って時間差 (Stagger) フェードインさせます。</p>
        <CodeBlock
          language="typescript"
          filename="src/features/event/components/EventStatus.tsx"
          code={`// useEventData 内で新規要素のみをカウント
const newIndex = newIndexMap.get(event.name);
const isNewItem = newIndex !== undefined;
const enterDelay = isNewItem ? 0.1 + newIndex * 0.06 : 0;

// Framer Motion で新規要素のみ遅延アニメーション
<motion.div
  layout
  initial={isNewItem ? { opacity: 0, y: 30, scale: 0.8 } : false}
  animate={{ opacity: isFinished ? 0.4 : 1, y: 0, scale: 1 }}
  transition={{ delay: enterDelay }}
/>`}
        />
      </section>

      <section className="doc-section">
        <h2>データ構造 <code>public/data/events.json</code></h2>
        <p>開催日程別 (day1, day2, ...) に企画名と開始・終了時刻を定義します。</p>
        <CodeBlock
          language="json"
          filename="public/data/events.json"
          code={`{
  "day1": [
    { "name": "オープニング", "start": "10:00", "end": "10:20" },
    { "name": "ライブステージ", "start": "10:40", "end": "12:00" }
  ],
  "day2": [
    { "name": "ダンスパフォーマンス", "start": "11:00", "end": "12:30" }
  ]
}`}
        />
      </section>
    </ComponentDocCard>
  );
}
