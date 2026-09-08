"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ComponentDocCard } from "@/components/docs/ComponentDocCard";
import { RoleProviderWrapper } from "@/components/docs/RoleProviderWrapper";
import CodeBlock from "@/components/docs/CodeBlock";

const VoteFormCard = dynamic(() => import("@/components/docs/VoteFormCard"), { ssr: false });
const MockVoteAdmin = dynamic(() => import("@/components/docs/MockVoteAdmin"), { ssr: false });

export default function VoteDocPage() {
  return (
    <ComponentDocCard
      title="リアルタイム投票"
      componentName="<VoteStatus /> & <VoteList /> & <VoteAdmin />"
      description="模擬店や展示部門の人気投票を、不正無くオンラインで投票可能。設定済みの投票終了時間を過ぎると自動的に投票不可能となり、0秒で集計が完了。"
      preview={
        <RoleProviderWrapper role="user">
          <VoteFormCard />
        </RoleProviderWrapper>
      }
      secondaryPreview={
        <RoleProviderWrapper role="admin">
          <MockVoteAdmin filterCategory="s" />
        </RoleProviderWrapper>
      }
    >

      <section className="doc-section">
        <h2>使い方</h2>
        <h3>参加者向け</h3>
        <p>トップページから投票ページへのリンクカード</p>
        <CodeBlock
          language="tsx"
          code={`import VoteStatus from "@/features/vote/components/VoteStatus";
            
<VoteStatus />`}
        />
        <p>投票ページでのカード</p>
        <CodeBlock
          language="tsx"
          code={`import { VoteList } from "@/features/vote/components/VoteList";
import { useVoteData } from "@/features/vote/hooks/useVoteData";

const {
    votingId,
    timeStatus,
    handleVote,
    filteredTargets,
    currentVotedId,
    votedItems,
} = useVoteData();

---

<VoteList
  targets={filteredTargets}
  currentVotedId={currentVotedId}
  votingId={votingId}
  canVote={timeStatus.canVote}
  onVote={handleVote}
  loading={loading}
/>`}
        />
        <h3>全体管理者向け</h3>
        <CodeBlock
          language="tsx"
          code={`import VoteAdmin from "@/features/vote/components/VoteAdmin";
            
<VoteAdmin filterCategory="s" />`}
        />
      </section>

      <section className="doc-section">
        <h2>API <code>src/features/vote/api.ts</code></h2>
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
                <td><code>getVoterId()</code></td>
                <td>なし</td>
                <td>LocalStorageとCookieを同期して匿名UUIDを取得・生成</td>
              </tr>
              <tr>
                <td><code>submitVote(targetId, category)</code></td>
                <td><code>targetId: string</code><br /><code>category: string</code></td>
                <td>クライアント側レートリミット判定後、Supabase RPC で投票処理</td>
              </tr>
              <tr>
                <td><code>getMyVotes(voterId)</code></td>
                <td><code>voterId: string</code></td>
                <td>指定したUUIDの投票履歴 (部門とターゲットID) を取得</td>
              </tr>
              <tr>
                <td><code>clearVoterId()</code></td>
                <td>なし</td>
                <td>LocalStorage および Cookie に保存された投票者 UUID と投票履歴を消去</td>
              </tr>
              <tr>
                <td><code>getVoteResults()</code></td>
                <td>なし</td>
                <td>全部門の圧縮済み順位・得票数を取得 <code>get_vote_results_compressed</code></td>
              </tr>
              <tr>
                <td><code>getVoteResultsSummary()</code></td>
                <td>なし</td>
                <td>管理者専用 : 部門ごとの総投票数や集計サマリーを取得 <code>get_vote_results_summary</code></td>
              </tr>
              <tr>
                <td><code>exportVoteData()</code></td>
                <td>なし</td>
                <td>管理者専用 : 生の投票ログをエクスポート</td>
              </tr>
              <tr>
                <td><code>auditSuspiciousVotes()</code></td>
                <td>なし</td>
                <td>管理者専用 : 不審な連打投票・組織票の痕跡を検出</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="doc-section">
        <h2>コード</h2>

        <h3>1. 多重投票の抑制と不正対策</h3>
        <p>
          FesTime では、参加者がアプリインストールやログインなしで手軽に参加できるよう、匿名型の投票システムを採用しています。しかし、イベントの公平性を保つため、バックグラウンドで厳格な不正対策を講じています。
        </p>
        <ul>
          <li><strong>匿名識別子の発行と永続化:</strong> 端末・ブラウザ単位で独自の識別子を安全に発行し、複数のストレージメカニズムを組み合わせてセッションが切れても状態を強固に保持する仕組みを導入しています。</li>
          <li><strong>レートリミットと連打防止:</strong> クライアント側およびネットワーク層で短時間の連続リクエストを監視し、機械的なアクセスや異常な連打を即座に遮断します。</li>
          <li><strong>データベース層での保護:</strong> Supabase 側の Row Level Security (RLS) やサーバーサイド関数においてもバリデーションを行い、改ざんされたリクエストや不正なデータ書き込みを防止しています。</li>
        </ul>

        <h3 style={{ marginTop: "40px" }}>2. 軽量・高速集計 RPC <code>get_vote_results_compressed</code></h3>
        <p>
          万単位の投票レコードをそのまま取得するのではなく、PostgreSQL 側でリアルタイムに <code>GROUP BY</code> 集計し、キー名を1文字 (<code>c</code>: category, <code>i</code>: id, <code>v</code>: votes) に圧縮して 1KB 未満の最小 JSON で返却します。
        </p>
        <CodeBlock
          language="sql"
          filename="SQL/Functions/get_vote_results_compressed.sql"
          code={`CREATE OR REPLACE FUNCTION get_vote_results_compressed()
RETURNS json
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT coalesce(json_agg(
    json_build_object(
      'c', category,
      'i', target_id,
      'v', vote_count
    )
  ), '[]'::json)
  FROM (
    SELECT category, target_id, count(*)::int AS vote_count
    FROM votes
    GROUP BY category, target_id
    ORDER BY category, vote_count DESC
  ) sub;
$$;`}
        />
      </section>

      <section className="doc-section">
        <h2>データベーススキーマ</h2>
        <CodeBlock
          language="sql"
          filename="votes table"
          code={`CREATE TABLE votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  voter_id TEXT NOT NULL,
  category TEXT NOT NULL,
  target_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  
  -- 同一人物による同一部門への多重投票をDBレベルでブロック
  UNIQUE(voter_id, category)
);`}
        />
      </section>

    </ComponentDocCard>
  );
}
