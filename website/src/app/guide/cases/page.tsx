import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import CallMadeIcon from "@mui/icons-material/CallMade";

export const metadata: Metadata = {
  title: "運用実績・導入事例",
  description: "FesTime を実際の文化祭で導入した本番運用の結果、アクセス統計、現場運用のレポート。",
};

export default function CasesPage() {
  return (
    <div className="doc-article">
      <div className="doc-header">
        <h1 className="doc-title">運用実績・導入事例</h1>
        <p className="doc-desc">
          FesTime を実際の文化祭で導入した本番運用の結果、アクセス統計、現場運用のレポート。
        </p>
      </div>

      <section className="doc-section" style={{marginBottom: "36px"}}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "8px" }}>
          <h2 style={{ margin: 0 }}>第18回 北斗祭 (富山高専 射水) </h2>
          <span className="case-tag">2026年5月23日・24日</span>
          <a
            href="https://github.com/HokutoFes26/app"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "13px",
              color: "var(--ft-brand-primary)",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            リポジトリ <CallMadeIcon style={{ fontSize: 14 }} />
          </a>
        </div>
        <p>
          FesTime の初運用として開発されたリファレンス実装です。特設ホームページとともにWebアプリとして公開され、2日間の開催期間中に 1,380名以上のアプリ利用と 9,000以上のPVを安定して処理しました。学内アンケートでも高い満足度を記録しています。
        </p>

        <h3>導入概要</h3>
        <table className="doc-table" style={{ width: "100%", marginBottom: "20px" }}>
          <tbody>
            <tr>
              <th style={{ width: "25%" }}>対象イベント</th>
              <td>第18回 北斗祭</td>
            </tr>
            <tr>
              <th>開催期間</th>
              <td>2026年5月23日・24日</td>
            </tr>
            <tr>
              <th>技術構成</th>
              <td>FesTime + Supabase + Google Analytics 4</td>
            </tr>
            <tr>
              <th>提供機能</th>
              <td>
                模擬店・展示の案内、リアルタイム混雑・在庫管理、校内マップ、交通情報、お知らせ配信、写真付き落とし物管理、オンライン人気投票
              </td>
            </tr>
          </tbody>
        </table>

        <h3>アクセス状況 (5/23・24 開催期間) </h3>
        <table className="doc-table" style={{ width: "100%", marginBottom: "20px" }}>
          <tbody>
            <tr>
              <th style={{ width: "35%" }}>ユーザー数 (開催2日間、重複なし) </th>
              <td><strong>1,385 人</strong></td>
            </tr>
            <tr>
              <th>ページビュー (PV)</th>
              <td><strong>9,060 PV</strong></td>
            </tr>
            <tr>
              <th>1人あたり平均PV</th>
              <td><strong>6.5 PV</strong></td>
            </tr>
            <tr>
              <th>平均滞在時間</th>
              <td><strong>1分30秒</strong></td>
            </tr>
            <tr>
              <th>オンライン投票実績</th>
              <td><strong>813 票</strong> (投票率 1.12〜1.21票/人 (最大2票)、投票アクセス率 53%) </td>
            </tr>
            <tr>
              <th>お知らせ配信数</th>
              <td><strong>7 件</strong></td>
            </tr>
            <tr>
              <th>落とし物登録数</th>
              <td><strong>16 件</strong> (写真付き) </td>
            </tr>
          </tbody>
        </table>

        <h3>満足度アンケート結果 (学内実施) </h3>
        <table className="doc-table" style={{ width: "100%", marginBottom: "20px" }}>
          <thead>
            <tr>
              <th style={{ width: "35%" }}>対象</th>
              <th>満足度</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>ウェブアプリ (FesTime) </td>
              <td><strong>4.34</strong> / 5.0</td>
            </tr>
            <tr>
              <td>特設ホームページ</td>
              <td><strong>4.57</strong> / 5.0</td>
            </tr>
          </tbody>
        </table>

        <h3>Supabase / インフラ負荷</h3>
        <p>
          本番期間中の急激なアクセス集中に備えた安全策として、開催月のみ Supabase Pro プラン ($25/月) を一時的に契約して運用しました。実際の利用量は、<strong>無料枠のリソース上限内に収まる水準</strong>でした。
        </p>
        <table className="doc-table" style={{ width: "100%", marginBottom: "20px" }}>
          <thead>
            <tr>
              <th>項目</th>
              <th>5/23 (1日目)</th>
              <th>5/24 (2日目)</th>
              <th>開催期間合計</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>リアルタイム同時接続ピーク</td>
              <td>23</td>
              <td>33</td>
              <td><strong>33 同時接続</strong></td>
            </tr>
            <tr>
              <td>データベースリクエスト</td>
              <td>11,700 回</td>
              <td>13,700 回</td>
              <td><strong>25,400 回</strong></td>
            </tr>
            <tr>
              <td>リアルタイムリクエスト</td>
              <td>5,700 回</td>
              <td>5,000 回</td>
              <td><strong>10,700 回</strong></td>
            </tr>
            <tr>
              <td>リアルタイムメッセージ数</td>
              <td>2,480 件</td>
              <td>1,750 件</td>
              <td><strong>4,230 件</strong></td>
            </tr>
            <tr>
              <td>データ転送量 (Egress)</td>
              <td>0.06 GB</td>
              <td>0.04 GB</td>
              <td><strong>0.10 GB</strong></td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="doc-section">
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "8px" }}>
          <h2 style={{ margin: 0 }}>第23回 東窓祭 (富山東高校)</h2>
          <span className="case-tag">2026年9月18日・19日</span>
        </div>

        <h3>導入概要</h3>
        <table className="doc-table" style={{ width: "100%", marginBottom: "20px" }}>
          <tbody>
            <tr>
              <th style={{ width: "25%" }}>対象イベント</th>
              <td>第23回 東窓祭</td>
            </tr>
            <tr>
              <th>開催期間</th>
              <td>2026年9月18日・19日</td>
            </tr>
            <tr>
              <th>技術構成</th>
              <td>FesTime + Supabase + Google Analytics 4</td>
            </tr>
            <tr>
              <th>提供機能</th>
              <td>
                模擬店・展示の案内、リアルタイム混雑・在庫管理、校内マップ、交通情報、お知らせ配信、写真付き落とし物管理、匿名Q&amp;A掲示板、オンライン人気投票
              </td>
            </tr>
          </tbody>
        </table>

        <h3>アクセス状況 (9月19日 本格運用時)</h3>
        <p style={{ fontSize: "13.5px", color: "var(--ft-text-muted)" }}>
          ※9月18日は一般公開終了後に Google Analytics を導入したため、9月19日が終日計測の数値となります。
        </p>
        <table className="doc-table" style={{ width: "100%", marginBottom: "20px" }}>
          <tbody>
            <tr>
              <th style={{ width: "35%" }}>アクティブユーザー数</th>
              <td><strong>233 人</strong> (新規ユーザー 196人) </td>
            </tr>
            <tr>
              <th>ページビュー (PV)</th>
              <td><strong>1,253 PV</strong></td>
            </tr>
            <tr>
              <th>セッション数</th>
              <td><strong>310 セッション</strong></td>
            </tr>
            <tr>
              <th>1人あたりPV</th>
              <td><strong>約 5.4 PV</strong></td>
            </tr>
            <tr>
              <th>平均エンゲージメント時間</th>
              <td><strong>約 112 秒</strong> / ユーザー</td>
            </tr>
            <tr>
              <th>オンライン人気投票</th>
              <td><strong>計 48 票</strong> (模擬店 21票、展示 27票) </td>
            </tr>
          </tbody>
        </table>

        <h3>ページ別アクセス内訳</h3>
        <table className="doc-table" style={{ width: "100%", marginBottom: "20px" }}>
          <thead>
            <tr>
              <th>ページパス</th>
              <th>主な用途</th>
              <th>PV</th>
              <th>ユーザー数</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>/</code></td>
              <td>一般来場者向けトップ (展示・模擬店情報・混雑状況) </td>
              <td>1,174</td>
              <td>220</td>
            </tr>
            <tr>
              <td><code>/vote/</code></td>
              <td>一般来場者向けオンライン人気投票</td>
              <td>48</td>
              <td>33</td>
            </tr>
            <tr>
              <td><code>/exhibition/</code></td>
              <td>展示責任者向け管理ページ (混雑状況更新) </td>
              <td>24</td>
              <td>9</td>
            </tr>
            <tr>
              <td><code>/admin/</code></td>
              <td>運営・管理者用ページ</td>
              <td>5</td>
              <td>3</td>
            </tr>
            <tr>
              <td><code>/booth/</code></td>
              <td>模擬店責任者向け管理ページ</td>
              <td>2</td>
              <td>1</td>
            </tr>
          </tbody>
        </table>

        <h3>運用結果総括 &amp; 現場の知見</h3>
        <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "10px", color: "var(--ft-text-secondary)", fontSize: "14.5px" }}>
          <li>
            <strong>当日のリアルタイム情報基盤として機能:</strong>
            1人あたり平均5.4回のページ表示と112秒の滞在時間を記録。単に一度開くだけでなく、来場者が校内を回りながら最新の混雑状況や展示情報を確認するために継続利用されたことがうかがえます。
          </li>
          <li>
            <strong>現地ポスターと声かけによるアクセスの急増:</strong>
            前日に比べてサイト案内ポスターを増やし、会場内での声かけを積極的に行ったことでアクセスが大幅に増加。現地での広報・誘導方法がサイト利用に大きく影響することが示唆されました。
          </li>
          <li>
            <strong>出店現場の更新負担の軽減:</strong>
            ピーク時は接客や調理で現場担当者がスマホ更新を行えない時間帯がありました。各店に更新専任者を置くか、運営本部から一括更新をサポートする体制を整えることが効果的です。
          </li>
          <li>
            <strong>投票・Q&amp;A機能の導線強化:</strong>
            オンライン投票やQ&amp;Aは正常に稼働したものの、トップページと比較して利用率に伸びしろがありました。投票専用QRコードの設置や放送でのリマインドが有効な施策となります。
          </li>
        </ul>
      </section>

      <section className="doc-section" style={{ marginTop: "40px" }}>
        <h2>イベント導入のご案内</h2>
        <p>
          FesTime はオープンソースとして公開されており、GitHub から取得して Supabase / GitHub Pages と連携することですぐに導入可能です。
        </p>
        <div style={{ display: "flex", gap: "12px", marginTop: "16px", flexWrap: "wrap" }}>
          <Link href="/guide/getting-started" className="btn btn-primary">
            クイックスタートを読む
          </Link>
          <Link href="/guide/operations" className="btn btn-secondary">
            運用ガイドを見る
          </Link>
        </div>
      </section>
    </div>
  );
}
