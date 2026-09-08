"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";

export interface SearchDocItem {
  id: string;
  title: string;
  category: "guide" | "component";
  categoryLabel: string;
  slug: string;
  description: string;
  keywords?: string[];
}

export const SEARCH_INDEX: SearchDocItem[] = [
  {
    id: "getting-started",
    title: "はじめる",
    category: "guide",
    categoryLabel: "Getting Started",
    slug: "/guide/getting-started",
    description: "FesTime をローカル環境に導入し、Supabase と連携してアプリを起動するまでのクイックスタートガイド",
    keywords: ["インストール", "セットアップ", "初期設定", "開始", "quickstart", "setup", "導入", "custom.config.ts", "環境変数"],
  },
  {
    id: "faq",
    title: "FAQ",
    category: "guide",
    categoryLabel: "Getting Started",
    slug: "/guide/faq",
    description: "運用中によくあるトラブルの対処法、導入時のよくある疑問、アクセス集中時の負荷軽減策",
    keywords: ["faq", "トラブル", "エラー", "質問", "ネットワーク", "通信障害", "問題", "オフライン", "トラブルシューティング"],
  },

  {
    id: "comp-booth",
    title: "模擬店・混雑状況",
    category: "component",
    categoryLabel: "Features",
    slug: "/components/booth",
    description: "各模擬店の混雑度 (空き / やや混雑 / 混雑) および在庫状況 (在庫あり / 残りわずか / 完売) をリアルタイムに集約・表示するコンポーネント。",
    keywords: ["模擬店", "混雑", "在庫", "booth", "屋台", "ステータス", "完売", "リアルタイム", "BoothStatus", "BoothManager"],
  },
  {
    id: "comp-vote",
    title: "リアルタイム投票",
    category: "component",
    categoryLabel: "Features",
    slug: "/components/vote",
    description: "模擬店や展示部門の人気投票を、不正無くオンラインで投票可能。設定済みの投票終了時間を過ぎると自動的に投票不可能となり、0秒で集計が完了。",
    keywords: ["投票", "グランプリ", "vote", "集計", "ランキング", "得票", "VoteFormCard", "VoteAdmin", "多重投票防止"],
  },
  {
    id: "comp-event",
    title: "タイムテーブル",
    category: "component",
    categoryLabel: "Features",
    slug: "/components/event",
    description: "ステージ企画や各会場プログラムのタイムテーブルおよび進行状況の可視化。現在時刻に連動した進行中プログラムの自動ハイライトと進捗バー表示に対応。",
    keywords: ["イベント", "タイムテーブル", "ステージ", "スケジュール", "進行", "event", "ライブ", "EventStatus", "プログレスバー"],
  },
  {
    id: "comp-bus",
    title: "バス時刻表",
    category: "component",
    categoryLabel: "Features",
    slug: "/components/bus",
    description: "シャトルバスや臨時便の運行ダイヤおよび発車時刻の案内。発着地別の絞り込み、発車までのカウントダウン、直近1時間以内の便の抽出に対応。",
    keywords: ["バス", "時刻表", "シャトルバス", "アクセス", "bus", "カウントダウン", "臨時便", "BusStatus"],
  },
  {
    id: "comp-news",
    title: "お知らせ",
    category: "component",
    categoryLabel: "Features",
    slug: "/components/news",
    description: "緊急連絡、プログラム変更、完売情報などのリアルタイム告知配信。Hot バッジによる最新情報の強調表示、管理者による投稿・編集・削除に対応。",
    keywords: ["お知らせ", "ニュース", "緊急", "完売", "news", "アナウンス", "通知", "NewsStatus", "NewsManager"],
  },
  {
    id: "comp-lost",
    title: "落とし物",
    category: "component",
    categoryLabel: "Features",
    slug: "/components/lost",
    description: "拾得物の写真付き一覧掲載および返却ステータス管理。Supabase Storage と連携した画像最適化アップロード、品名・場所での検索、返却完了時の非表示処理に対応。",
    keywords: ["落とし物", "忘れ物", "写真", "lost", "拾得物", "管理棟", "LostStatus", "LostManager", "画像圧縮"],
  },
  {
    id: "comp-map",
    title: "マップ & QR現在地",
    category: "component",
    categoryLabel: "Features",
    slug: "/components/map",
    description: "各フロアのマップ表示とブース案内。階層切り替え、および会場内に設置されたQRコード読み取りに連動した現在地周辺情報の自動展開に対応。",
    keywords: ["マップ", "地図", "現在地", "qr", "map", "会場案内", "ピン", "MapSection", "SpotStatus"],
  },
  {
    id: "comp-qa",
    title: "Q&A掲示板",
    category: "component",
    categoryLabel: "Features",
    slug: "/components/qa",
    description: "来場者からの匿名質問受付と運営本部によるリアルタイム回答管理。質問の投稿・閲覧、管理者による回答作成・編集理由の記録、不適切投稿の削除に対応。",
    keywords: ["qa", "質問", "問い合わせ", "回答", "サポート", "よくある質問", "QAStatus", "QAManager"],
  },

  {
    id: "customization",
    title: "変数 / 設定対応表",
    category: "guide",
    categoryLabel: "Customization",
    slug: "/guide/customization",
    description: "src/constants/custom.config.ts および public/data/*.json 内で定義されている各変数が、画面 UI や各機能のどの部分に対応・影響しているかの一覧表です。",
    keywords: ["カスタム", "設定", "変数", "config", "json", "リファレンス", "対応表", "booth.json", "bus.json", "events.json", "exhibitions.json", "spots.json", "vote.json"],
  },
  {
    id: "design",
    title: "デザイン設定",
    category: "guide",
    categoryLabel: "Customization",
    slug: "/guide/design",
    description: "カスタムなテーマカラーへの一括変更、ファビコン (Favicon) やアプリアイコンの差し替え、マップ内QRコードの作成方法",
    keywords: ["デザイン", "カラー", "テーマ", "アイコン", "ロゴ", "ダークモード", "色設定", "ファビコン"],
  },
  {
    id: "i18n",
    title: "多言語対応 (i18n)",
    category: "guide",
    categoryLabel: "Customization",
    slug: "/guide/i18n",
    description: "留学生や海外からの来場者に対応するための翻訳文言の追加・編集、静的 JSON の多言語化、新しい言語の追加方法を解説します。",
    keywords: ["多言語", "英語", "日本語", "翻訳", "i18n", "locale", "internationalization"],
  },

  {
    id: "operations",
    title: "データ準備と運用",
    category: "guide",
    categoryLabel: "Operations",
    slug: "/guide/operations",
    description: "アプリをどのように管理・運用すべきかをまとめます。",
    keywords: ["運用", "当日", "タイムライン", "データ準備", "json作成", "スタッフ", "マニュアル", "準備期"],
  },
  {
    id: "security",
    title: "セキュリティ対策",
    category: "guide",
    categoryLabel: "Operations",
    slug: "/guide/security",
    description: "本アプリには 3 つのロール (権限) が存在します。これらは src/contexts/RoleContext.tsx によってフロントエンドで管理され、Supabase の RLS (Row Level Security) によってバックエンドで保護されています。",
    keywords: ["セキュリティ", "不正投票", "ロール", "rls", "暗号化", "安全", "権限", "RoleContext"],
  },
  {
    id: "deploy",
    title: "デプロイ",
    category: "guide",
    categoryLabel: "Operations",
    slug: "/guide/deploy",
    description: "本アプリは、スケーラビリティとリアルタイム性を確保するために外部のクラウドサービスをフル活用しています。",
    keywords: ["デプロイ", "github pages", "ホスティング", "公開", "path", "ci/cd", "ビルド", "クラウド"],
  },

  {
    id: "developer",
    title: "開発者ガイド / 設計",
    category: "guide",
    categoryLabel: "Technical",
    slug: "/guide/developer",
    description: "FesTime の技術スタック、環境構築手順、リポジトリ構成などの開発者向けガイド",
    keywords: ["開発", "アーキテクチャ", "コンポーネント追加", "拡張", "プルリクエスト", "dev", "技術スタック", "環境構築"],
  },
  {
    id: "supabase",
    title: "Supabase & DB仕様",
    category: "guide",
    categoryLabel: "Technical",
    slug: "/guide/supabase",
    description: "本アプリのバックエンドである Supabase データベースの詳細",
    keywords: ["データベース", "sql", "supabase", "バックエンド", "テーブル", "マイグレーション", "db", "rls"],
  },
  {
    id: "on-premise",
    title: "オンプレミス運用",
    category: "guide",
    categoryLabel: "Technical",
    slug: "/guide/on-premise",
    description: "Supabase Local (Docker) と Cloudflare Tunnels を組み合わせ、クラウド費用を一切かけずに学校や団体のPC 1台で完全オンプレミス運用を実現する実践ガイド",
    keywords: ["オンプレミス", "ローカル", "supabase local", "cloudflare", "tunnels", "docker", "無料", "完全無料", "サーバー", "閉域網"],
  },
];

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const filteredItems = useMemo(() => {
    if (!query.trim()) return SEARCH_INDEX;
    const q = query.toLowerCase().trim();
    return SEARCH_INDEX.filter((item) => {
      const inTitle = item.title.toLowerCase().includes(q);
      const inDesc = item.description.toLowerCase().includes(q);
      const inCategory = item.categoryLabel.toLowerCase().includes(q);
      const inKeywords = item.keywords?.some((k) => k.toLowerCase().includes(q));
      return inTitle || inDesc || inCategory || inKeywords;
    });
  }, [query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredItems]);

  const handleSelect = (item: SearchDocItem) => {
    onClose();
    router.push(item.slug);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === "Enter" && filteredItems.length > 0) {
      e.preventDefault();
      handleSelect(filteredItems[selectedIndex]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="search-backdrop" onClick={onClose}>
      <div className="search-modal" onClick={(e) => e.stopPropagation()} onKeyDown={handleKeyDown}>
        <div className="search-input-wrapper">
          <svg className="search-input-icon" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder="ドキュメントを検索... (例: 模擬店, 投票, Supabase, config)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button className="search-clear-btn" onClick={() => setQuery("")}>
              ✕
            </button>
          )}
          <span className="search-esc-badge">ESC</span>
        </div>

        <div className="search-results-list">
          {filteredItems.length === 0 ? (
            <div className="search-empty">
              <p>「<strong>{query}</strong>」に一致する記事は見つかりませんでした。</p>
            </div>
          ) : (
            filteredItems.map((item, idx) => (
              <div
                key={item.id}
                className={`search-result-item ${idx === selectedIndex ? "selected" : ""}`}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setSelectedIndex(idx)}
              >
                <div className="search-result-header">
                  <span className="search-result-title">{item.title}</span>
                  <span className={`search-category-tag ${item.category}`}>{item.categoryLabel}</span>
                </div>
                <p className="search-result-desc">{item.description}</p>
              </div>
            ))
          )}
        </div>

        <div className="search-modal-footer">
          <div className="search-shortcuts-guide">
            <span><kbd>↑</kbd><kbd>↓</kbd> 移動</span>
            <span><kbd>↵</kbd> 決定</span>
            <span><kbd>ESC</kbd> 閉じる</span>
          </div>
        </div>
      </div>
    </div>
  );
}
