import React from "react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Guide",
};

const ALL_GUIDES = [
  {
    slug: "getting-started",
    title: "クイックスタート & 0円インフラ構成",
    icon: "",
    desc: "GitHub ForkからSupabase無料設定、GitHub Pagesデプロイまでの15分手順。",
  },
  {
    slug: "customization",
    title: "設定 & JSONマスターデータ",
    icon: "",
    desc: "custom.config.tsによるテーマ・機能ON/OFFと、JSONデータの作成・Excel連携方法。",
  },
  {
    slug: "operations",
    title: "当日運用ハンドブック & 出店者マニュアル",
    icon: "",
    desc: "出店者向け印刷マニュアル、実行委員会の前日・当日チェックリスト、現場FAQ。",
  },
  {
    slug: "security",
    title: "セキュリティ & 不正防止設計",
    icon: "",
    desc: "人気投票の3重多重投票防止 (IPハッシュ・RPC) 、PostgreSQL RLSによる権限分離。",
  },
  {
    slug: "cases",
    title: "運用実績 & 導入事例",
    icon: "",
    desc: "第23回東窓祭や第18回北斗祭のアクセス統計・本番稼働レポートと現場の知見。",
  },
];

export default function GuideIndexPage() {
  return (
    <div className="doc-article">
      <div className="doc-header">
        <h1 className="doc-title">FesTime 導入・運用ガイド</h1>
        <p className="doc-desc">
          FesTimeの導入手順から、無料インフラ構成、設定ファイルのカスタマイズ、当日の出店者マニュアル、セキュリティ設計までを網羅しています。
        </p>
      </div>

      <div className="features-cards-grid" style={{ marginTop: "32px" }}>
        {ALL_GUIDES.map((item) => (
          <Link key={item.slug} href={`/guide/${item.slug}`} className="feature-box" style={{ cursor: "pointer" }}>
            <div className="feature-icon">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
