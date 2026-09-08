"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ComponentDocCard } from "@/components/docs/ComponentDocCard";
import { RoleProviderWrapper } from "@/components/docs/RoleProviderWrapper";
import CodeBlock from "@/components/docs/CodeBlock";

const NewsStatus = dynamic(() => import("@festime/features/news/components/NewsStatus"), { ssr: false });
const NewsManager = dynamic(() => import("@festime/features/news/components/NewsManager"), { ssr: false });

export default function NewsDocPage() {
  return (
    <ComponentDocCard
      title="お知らせ"
      componentName="<NewsStatus /> / <NewsManager />"
      description="緊急連絡、プログラム変更、完売情報などのリアルタイム告知配信。Hot バッジによる最新情報の強調表示、管理者による投稿・編集・削除に対応。"
      preview={
        <RoleProviderWrapper role="user">
          <NewsStatus />
        </RoleProviderWrapper>
      }
      secondaryPreview={
        <RoleProviderWrapper role="admin">
          <NewsManager />
        </RoleProviderWrapper>
      }
    >
      <section className="doc-section">
        <h2>使い方</h2>
        <h3>参加者向け</h3>
        <CodeBlock
          language="tsx"
          code={`import NewsStatus from "@/features/news/components/NewsStatus";

<NewsStatus />`}
        />
        <h3>全体管理者向け</h3>
        <CodeBlock
          language="tsx"
          code={`import NewsManager from "@/features/news/components/NewsManager";

<NewsManager />`}
        />
      </section>

      <section className="doc-section">
        <h2>API <code>src/features/news/api.ts</code></h2>
        <p>お知らせ一覧の取得はアプリ共通の <code>DataContext.FetchedData.news</code> を通じて自動ポーリング・キャッシュ管理され、登録・編集・削除は以下の API を通じて行われます。更新時は自動でキャッシュが無効化されます。</p>

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
                <td><code>postNews(title, content)</code></td>
                <td><code>title : string</code><br /><code>content : string</code></td>
                <td>管理者専用 : 新規ニュースを即時配信し <code>news</code> キャッシュを無効化</td>
              </tr>
              <tr>
                <td><code>updateNews(id, updates)</code></td>
                <td><code>id : string</code><br /><code>updates : {"{"} title: string, content: string, reason: string {"}"}</code></td>
                <td>管理者専用 : 編集理由を付与して既存ニュースを更新</td>
              </tr>
              <tr>
                <td><code>deleteNews(id)</code></td>
                <td><code>id : string</code></td>
                <td>管理者専用 : 指定したニュースを削除</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="doc-section">
        <h2>コード</h2>

        <h3>最新投稿への HOT バッジ自動付与</h3>
        <p>投稿から 20 分以内の新しいお知らせに対し、視覚的な HOT バッジを動的に付与します。</p>
        <CodeBlock
          language="typescript"
          filename="src/features/news/utils/isHotNews.ts"
          code={`export const isHotNews = (createdAt: string, thresholdMinutes = 20): boolean => {
  const postTime = new Date(createdAt).getTime();
  const now = Date.now();
  const diffMinutes = (now - postTime) / (1000 * 60);
  return diffMinutes >= 0 && diffMinutes <= thresholdMinutes;
};`}
        />
      </section>

      <section className="doc-section">
        <h2>データベーススキーマ</h2>
        <CodeBlock
          language="sql"
          filename="news"
          code={`CREATE TABLE news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  edit_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);`}
        />
      </section>
    </ComponentDocCard>
  );
}
