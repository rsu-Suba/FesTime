"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ComponentDocCard } from "@/components/ComponentDocCard";
import { RoleProviderWrapper } from "@/components/RoleProviderWrapper";
import CodeBlock from "@/components/CodeBlock";

const LostStatus = dynamic(() => import("@festime/features/lost/components/LostStatus"), { ssr: false });
const LostManager = dynamic(() => import("@festime/features/lost/components/LostManager"), { ssr: false });

export default function LostDocPage() {
  return (
    <ComponentDocCard
      title="写真付き落とし物管理"
      componentName="<LostStatus /> / <LostManager />"
      description="拾得物の写真付き一覧掲載および返却ステータス管理。Supabase Storage と連携した画像最適化アップロード、品名・場所での検索、返却完了時の非表示処理に対応。"
      preview={
        <RoleProviderWrapper role="user">
          <LostStatus />
        </RoleProviderWrapper>
      }
      secondaryPreview={
        <RoleProviderWrapper role="admin">
          <LostManager />
        </RoleProviderWrapper>
      }
    >
      <section className="doc-section">
        <h2>使い方</h2>
        <h3>参加者向け</h3>
        <CodeBlock
          language="tsx"
          code={`import LostStatus from "@/features/lost/components/LostStatus";

<LostStatus />`}
        />
        <h3>全体管理者向け</h3>
        <CodeBlock
          language="tsx"
          code={`import LostManager from "@/features/lost/components/LostManager";

<LostManager />`}
        />
      </section>

      <section className="doc-section">
        <h2>API <code>src/features/lost/api.ts</code></h2>
        <p>落とし物一覧の取得はアプリ共通の <code>DataContext.FetchedData.lostItems</code> を通じて自動ポーリング・キャッシュ管理され、登録・編集・削除は以下の API を通じて行われます。更新時は自動でキャッシュが無効化されます。</p>

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
                <td><code>postLostItem(item)</code></td>
                <td><code>item : {"{"} name : string, place : string, photo_path? : string {"}"}</code></td>
                <td>品名・拾得場所・写真パスを登録し <code>lost</code> キャッシュを無効化</td>
              </tr>
              <tr>
                <td><code>updateLostItem(id, updates)</code></td>
                <td><code>id : string</code><br /><code>updates : {"{"} name : string, place : string, reason : string, photo_path? : string {"}"}</code></td>
                <td>管理者専用 : 編集理由を付与して既存の落とし物情報を更新</td>
              </tr>
              <tr>
                <td><code>deleteLostItem(id, photoPath?)</code></td>
                <td><code>id : string</code><br /><code>photoPath? : string</code></td>
                <td>管理者専用 : 落とし物レコードおよび Storage の画像ファイルを削除</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="doc-section">
        <h2>コード</h2>

        <h3>クライアントサイド画像圧縮と EXIF 削除 <code>src/lib/Misc/ImageUtils.ts</code></h3>
        <p>撮影された写真をブラウザ内で Canvas API を用いて最大 800×800px にリサイズ・JPEG 圧縮し、EXIF 位置情報などのメタデータを自動除去してアップロードします。</p>
        <CodeBlock
          language="typescript"
          filename="src/lib/Misc/ImageUtils.ts"
          code={`export const compressImage = (file: File, maxDim = 800, quality = 0.5): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(maxDim / img.width, maxDim / img.height, 1);
      const canvas = document.createElement("canvas");
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => blob ? resolve(blob) : reject(), "image/jpeg", quality);
    };
  });
};`}
        />
      </section>

      <section className="doc-section">
        <h2>データベーススキーマ</h2>
        <CodeBlock
          language="sql"
          filename="lost_items"
          code={`CREATE TABLE lost_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  place TEXT NOT NULL,
  photo_path TEXT,
  is_returned BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);`}
        />
      </section>
    </ComponentDocCard>
  );
}
