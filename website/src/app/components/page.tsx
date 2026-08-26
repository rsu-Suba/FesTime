import React from "react";
import Link from "next/link";

const ALL_COMPONENTS = [
  {
    slug: "booth",
    title: "模擬店・混雑状況",
    name: "<BoothStatus />",
    icon: "",
    desc: "信号機ランプによる混雑度・在庫状況の即時表示とお気に入り機能。",
  },
  {
    slug: "vote",
    title: "リアルタイム人気投票",
    name: "<VoteStatus />",
    icon: "",
    desc: "多重投票防止とSupabase RPC集計を備えたセキュアな投票システム。",
  },
  {
    slug: "event",
    title: "タイムテーブル・ステージ進行",
    name: "<EventStatus />",
    icon: "",
    desc: "音楽プレイヤー風プログレスバーによるステージ進行状況の可視化。",
  },
  {
    slug: "bus",
    title: "スマートバス時刻表",
    name: "<BusStatus />",
    icon: "",
    desc: "直近の便のカウントダウンと乗降地絞り込みに対応した交通案内。",
  },
  {
    slug: "news",
    title: "お知らせ・緊急ニュース",
    name: "<NewsStatus />",
    icon: "",
    desc: "20分以内のHotバッジ強調と編集履歴付きリアルタイム告知配信。",
  },
  {
    slug: "lost",
    title: "写真付き落とし物管理",
    name: "<LostStatus />",
    icon: "",
    desc: "写真アップロードと受取場所・解決ステータス管理機能。",
  },
  {
    slug: "map",
    title: "マップ & QR現在地連動",
    name: "<SpotStatus />",
    icon: "",
    desc: "校内QRコード読み取りによる現在地周辺情報のインタラクティブ展開。",
  },
  {
    slug: "qa",
    title: "Q&A・質問掲示板",
    name: "<QAStatus />",
    icon: "",
    desc: "来場者からの匿名質問と本部からのリアルタイム回答共有。",
  },
];

export default function ComponentsIndexPage() {
  return (
    <div className="doc-article">
      <div className="doc-header">
        <span className="doc-tag">Overview</span>
        <h1 className="doc-title">FesTime コンポーネント一覧</h1>
        <p className="doc-desc">
          FesTimeを構成するすべてのUIコンポーネントと、それぞれのリアルタイム同期の仕組み、データベース設計、カスタマイズ設定を解説します。
        </p>
      </div>

      <div className="features-cards-grid" style={{ marginTop: "32px" }}>
        {ALL_COMPONENTS.map((item) => (
          <Link key={item.slug} href={`/components/${item.slug}`} className="feature-box" style={{ cursor: "pointer" }}>
            <div className="feature-icon">{item.icon}</div>
            <code style={{ fontSize: "12px", color: "var(--ft-brand-primary)", display: "block", marginBottom: "6px" }}>
              {item.name}
            </code>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
