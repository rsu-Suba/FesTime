export interface SidebarItem {
  slug: string;
  label: string;
  desc?: string;
}

export interface SidebarCategory {
  id: string;
  category: string;
  items: SidebarItem[];
}

export const SIDEBAR_SECTIONS: SidebarCategory[] = [
  {
    id: "getting-started",
    category: "Getting Started",
    items: [
      { slug: "/guide/getting-started", label: "はじめる", desc: "クイックスタート" },
      { slug: "/guide/faq", label: "FAQ", desc: "導入時の疑問 / トラブル" },
    ],
  },
  {
    id: "components",
    category: "Features",
    items: [
      { slug: "/components/booth", label: "模擬店・混雑状況", desc: "<BoothStatus />" },
      { slug: "/components/vote", label: "リアルタイム投票", desc: "<VoteList />" },
      { slug: "/components/event", label: "タイムテーブル", desc: "<EventStatus />" },
      { slug: "/components/bus", label: "バス時刻表", desc: "<BusStatus />" },
      { slug: "/components/news", label: "お知らせ", desc: "<NewsStatus />" },
      { slug: "/components/lost", label: "落とし物", desc: "<LostStatus />" },
      { slug: "/components/map", label: "マップ & QR現在地", desc: "<MapSection />" },
      { slug: "/components/qa", label: "Q&A掲示板", desc: "<QAStatus />" },
    ],
  },
  {
    id: "customization",
    category: "Customization",
    items: [
      { slug: "/guide/customization", label: "変数 / 設定対応表", desc: "Config / 各JSONの対応表" },
      { slug: "/guide/design", label: "デザイン設定", desc: "カラー / アイコン / ロゴ" },
      { slug: "/guide/i18n", label: "多言語対応 (i18n)", desc: "言語追加" },
    ],
  },
  {
    id: "operations",
    category: "Operations",
    items: [
      { slug: "/guide/operations", label: "データ準備と運用", desc: "JSON作成 / タイムライン" },
      { slug: "/guide/security", label: "セキュリティ対策", desc: "ロール / RLS" },
      { slug: "/guide/deploy", label: "デプロイ", desc: "本番公開" },
    ],
  },
  {
    id: "technical",
    category: "Technical",
    items: [
      { slug: "/guide/developer", label: "開発者ガイド / 設計", desc: "アーキテクチャ" },
      { slug: "/guide/supabase", label: "Supabase & DB仕様", desc: "データベース定義" },
      { slug: "/guide/on-premise", label: "オンプレミス運用", desc: "Supabase Local" },
    ],
  },
];
