"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ComponentDocCard } from "@/components/docs/ComponentDocCard";
import { RoleProviderWrapper } from "@/components/docs/RoleProviderWrapper";
import CodeBlock from "@/components/docs/CodeBlock";

const QAStatus = dynamic(() => import("@festime/features/qa/components/QAStatus"), { ssr: false });
const QAManager = dynamic(() => import("@festime/features/qa/components/QAManager"), { ssr: false });

export default function QADocPage() {
  return (
    <ComponentDocCard
      title="Q&A掲示板"
      componentName="<QAStatus /> / <QAManager />"
      description="来場者からの匿名質問受付と運営本部によるリアルタイム回答管理。質問の投稿・閲覧、管理者による回答作成・編集理由の記録、不適切投稿の削除に対応。"
      preview={
        <RoleProviderWrapper role="user">
          <QAStatus />
        </RoleProviderWrapper>
      }
      secondaryPreview={
        <RoleProviderWrapper role="admin">
          <QAManager />
        </RoleProviderWrapper>
      }
    >
      <section className="doc-section">
        <h2>使い方</h2>
        <h3>参加者向け</h3>
        <CodeBlock
          language="tsx"
          code={`import QAStatus from "@/features/qa/components/QAStatus";

<QAStatus />`}
        />
        <h3>全体管理者向け</h3>
        <CodeBlock
          language="tsx"
          code={`import QAManager from "@/features/qa/components/QAManager";

<QAManager />`}
        />
      </section>

      <section className="doc-section">
        <h2>API <code>src/features/qa/api.ts</code></h2>
        <p>質問・回答一覧の取得はアプリ共通の <code>DataContext.FetchedData.questions</code> を通じて自動ポーリング・キャッシュ管理され、質問投稿・回答・削除は以下の API を通じて行われます。更新時は自動でキャッシュが無効化されます。</p>

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
                <td><code>askQuestion(text)</code></td>
                <td><code>text : string</code></td>
                <td>来場者から匿名で質問を投稿し <code>qa</code> キャッシュを無効化</td>
              </tr>
              <tr>
                <td><code>replyToQuestion(id, answer, reason?)</code></td>
                <td><code>id : string</code><br /><code>answer : string</code><br /><code>reason? : string</code></td>
                <td>管理者専用 : 回答を投稿・更新。修正時は <code>edit_reason</code> に時刻付きで理由を記録</td>
              </tr>
              <tr>
                <td><code>deleteQuestion(id)</code></td>
                <td><code>id : string</code></td>
                <td>管理者専用 : 不適切な質問や解決済みの問い合わせを削除</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="doc-section">
        <h2>コード</h2>

        <h3>回答・編集理由のタイムスタンプ記録 <code>src/features/qa/api.ts</code></h3>
        <p>回答内容を更新する際、管理者が入力した修正理由に現在時刻 (HH:mm) を付与して <code>edit_reason</code> カラムへ記録します。</p>
        <CodeBlock
          language="typescript"
          filename="src/features/qa/api.ts"
          code={`export const replyToQuestion = async (id: string, answer: string, reason?: string) => {
  return performMutation(async () => {
    const updates: { answer: string; edit_reason?: string } = { answer };
    if (reason && reason.trim() !== "") {
      const now = new Date();
      const timeStr = \`\${String(now.getHours()).padStart(2, "0")}:\${String(now.getMinutes()).padStart(2, "0")}\`;
      updates.edit_reason = \`\${reason} (\${timeStr})\`;
    }
    const { error } = await supabase.from("questions").update(updates).eq("id", id);
    if (error) throw error;
    return { success: true };
  });
};`}
        />
      </section>

      <section className="doc-section">
        <h2>データベーススキーマ</h2>
        <CodeBlock
          language="sql"
          filename="questions"
          code={`CREATE TABLE questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT,
  edit_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  answered_at TIMESTAMP WITH TIME ZONE
);`}
        />
      </section>
    </ComponentDocCard>
  );
}
