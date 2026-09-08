"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ComponentDocCard } from "@/components/docs/ComponentDocCard";
import { RoleProviderWrapper } from "@/components/docs/RoleProviderWrapper";
import CodeBlock from "@/components/docs/CodeBlock";

const BoothStatus = dynamic(() => import("@festime/features/booth/components/BoothStatus"), { ssr: false });
const BoothManager = dynamic(() => import("@festime/features/booth/components/BoothManager"), { ssr: false });

export default function BoothDocPage() {
  return (
    <ComponentDocCard
      title="模擬店ステータス"
      componentName="<BoothStatus /> / <BoothManager />"
      description="各模擬店の混雑度 (空き / やや混雑 / 混雑) および在庫状況 (在庫あり / 残りわずか / 完売) をリアルタイムに集約・表示するコンポーネント。"
      preview={
        <RoleProviderWrapper role="user">
          <BoothStatus />
        </RoleProviderWrapper>
      }
      secondaryPreview={
        <RoleProviderWrapper role="stall-admin" assignedStall="ポップコーン">
          <BoothManager />
        </RoleProviderWrapper>
      }
    >

      <section className="doc-section">
        <h2>使い方</h2>
        <h3>参加者向け</h3>
        <CodeBlock
          language="tsx"
          code={`import BoothStatus from "@/features/booth/components/BoothStatus";
      
<BoothStatus />`}
        />
        <p>2つのカードに分割する場合</p>
        <CodeBlock
          language="tsx"
          code={`import BoothStatus from "@/features/booth/components/BoothStatus";
      
<BoothStatus split="first"/>
<BoothStatus split="second"/>`}
        />
        <h3>模擬店管理者向け</h3>
        <CodeBlock
          language="tsx"
          code={`import BoothManager from "@/features/booth/components/BoothManager";
      
<BoothManager />`}
        />
      </section>

      <section className="doc-section">
        <h2>API <code>src/features/booth/api.ts</code></h2>
        <p>クライアントからのデータ取得・更新は以下の API を通じて行われます。更新 API <code>performMutation</code> は実行完了時に自動でキャッシュを破棄します。</p>

        <div className="table-responsive">
          <table className="api-table">
            <thead>
              <tr>
                <th>API 関数</th>
                <th>引数 / ペイロード</th>
                <th>役割</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>fetchStallsOnly(ttl)</code></td>
                <td><code>ttl: number</code></td>
                <td>混雑・在庫ステータスのみを軽量 RPC <code>get_stalls_only</code> で取得</td>
              </tr>
              <tr>
                <td><code>updateStallStatus(stallName, updates)</code></td>
                <td><code>stallName: string</code><br /><code>updates: {"{"} crowdLevel?: number, stockLevel?: number {"}"}</code></td>
                <td>指定した模擬店の混雑度・在庫状況を更新し、<code>all</code>, <code>stalls_only</code> キャッシュを無効化</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="doc-section">
        <h2>コード</h2>

        <h3>isDirty による差分検出 <code>useBoothManager.ts</code></h3>
        <p>選択値がDBの現在値と異なる場合のみ「未反映」バナーを表示し、余分な更新リクエストを防止します。</p>
        <CodeBlock
          language="typescript"
          filename="useBoothManager.ts"
          code={`const checkDirty = (currentCrowd: StatusLevel, currentStock: StatusLevel) => {
  if (fetchedData?.stalls && assignedStall) {
    const myStall = fetchedData.stalls.find((s) => s.stallName === assignedStall);
    if (myStall) {
      const dirty = currentCrowd !== myStall.crowdLevel || currentStock !== myStall.stockLevel;
      setIsDirtyInternal(dirty);
      isDirtyRef.current = dirty;
      return dirty;
    }
  }
  return false;
};`}
        />

        <h3>共通キャッシュレイヤー <code>src/lib/Server/baseApi.ts</code></h3>
        <p><code>fetchWithCache</code> はメモリキャッシュ + SessionStorage の2層でキャッシュし、<code>performMutation</code> は書き込み後に指定キーを即座に無効化します。</p>
        <CodeBlock
          language="typescript"
          filename="src/lib/Server/baseApi.ts"
          code={`// performMutation: 書き込み後に指定キーのキャッシュを無効化
export const performMutation = async <T>(
  action: () => Promise<T>,
  cacheKeysToInvalidate: string[] = ["all"]
): Promise<T> => {
  const result = await action();
  invalidateCache(cacheKeysToInvalidate);
  return result;
};`}
        />
      </section>

      <section className="doc-section">
        <h2>データベーススキーマ</h2>
        <CodeBlock
          language="sql"
          filename="stalls_status"
          code={`CREATE TABLE stalls_status (
  id SERIAL PRIMARY KEY,
  stall_name TEXT NOT NULL UNIQUE,
  crowd_level SMALLINT DEFAULT 0, -- 0: 空き, 1: やや混雑, 2: 混雑
  stock_level SMALLINT DEFAULT 0, -- 0: 在庫あり, 1: 残りわずか, 2: 完売
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);`}
        />
      </section>
    </ComponentDocCard>
  );
}
