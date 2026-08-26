import React from "react";
import type { Metadata } from "next";
import CodeBlock from "@/components/CodeBlock";

export const metadata: Metadata = {
  title: "Language",
};

export default function I18nGuidePage() {
  return (
    <article className="doc-article">
      <div className="doc-header">
        <div className="doc-meta">
          <code className="doc-code-badge">i18n & Locales</code>
        </div>
        <h1 className="doc-title">Multi language : i18n</h1>
        <p className="doc-desc">
          留学生や海外からの来場者に対応するための翻訳文言の追加・編集、静的 JSON の多言語化、新しい言語の追加方法を解説します。
        </p>
      </div>

      <div className="doc-content">
        <section className="doc-section">
          <h2>i18n アーキテクチャ</h2>
          <p>
            FesTime では <code>i18next</code> および <code>react-i18next</code> を採用し、ユーザーのブラウザ言語設定に応じて日本語 <code>ja</code> と英語 <code>en</code> を自動判定します。ヘッダーの言語切替ボタンから手動で切り替えることも可能です。
          </p>

          <CodeBlock
            language="typescript"
            filename="src/i18n/i18n.ts"
            code={`import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import enTranslation from "../../public/locales/en.json";
import jaTranslation from "../../public/locales/ja.json";

const resources = {
  en: {
    translation: enTranslation,
  },
  ja: {
    translation: jaTranslation,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: true,
    },
  });

export default i18n;`}
          />
        </section>

        <section className="doc-section">
          <h2>翻訳ファイルの構成と文言の追加</h2>
          <p>
            すべての UI テキストは <code>public/locales/</code> ディレクトリ下の JSON 辞書ファイルで管理されています :
          </p>
          <ul>
            <li><code>public/locales/ja.json</code>: 日本語辞書</li>
            <li><code>public/locales/en.json</code>: 英語辞書</li>
          </ul>

          <h3>文言の追加例 (JSON 形式)</h3>
          <p>新しいメッセージや機能を追加する場合は、<code>ja.json</code> と <code>en.json</code> の双方に同じキー構造でテキストを定義します : </p>

          <CodeBlock
            language="json"
            filename="public/locales/ja.json & en.json"
            code={`// public/locales/ja.json
{
  "CardTitles": {
    "BOOTH": "模擬店",
    "BUS": "バス",
    "LOST_FOUND": "落とし物"
  },
  "Booth": {
    "Details": "タップして詳細",
    "Share": "共有する"
  },
  "Bus": {
    "InNMins": "あと {{count}} 分"
  }
}

// public/locales/en.json
{
  "CardTitles": {
    "BOOTH": "Food Stalls",
    "BUS": "Shuttle Bus",
    "LOST_FOUND": "Lost & Found"
  },
  "Booth": {
    "Details": "Tap for details",
    "Share": "Share"
  },
  "Bus": {
    "InNMins": "in {{count}} min"
  }
}`}
          />

          <h3>コンポーネント内での呼び出し</h3>
          <p><code>useTranslation</code> フックを使用して辞書キーを指定します。変数の埋め込みも可能です : </p>
          <CodeBlock
            language="tsx"
            code={`import { useTranslation } from "react-i18next";

export function BoothCard() {
  const { t } = useTranslation();

  return (
    <div>
      <h3>{t("CardTitles.BOOTH")}</h3>
      <button>{t("Booth.Details")}</button>

            <span>{t("Bus.InNMins", { count: 5 })}</span>
    </div>
  );
}`}
          />
        </section>

        <section className="doc-section">
          <h2>静的 JSON データ内の多言語化 (バス停名など)</h2>
          <p>
            <code>public/data/bus.json</code> などのマスターデータ内にも、多言語化キー (辞書参照) を使用することができます :
          </p>

          <CodeBlock
            language="json"
            filename="public/data/bus.json"
            code={`{
  "Outbound": {
    "route": ["Bus.Stops.キャンパス 発", "Bus.Stops.中央駅 着"],
    "time": [
      ["10:00", "10:30"],
      ["11:00", "11:30"]
    ]
  }
}`}
          />
          <p>
            コンポーネント側で <code>t(route[0])</code> を通すことで、日本語時は「キャンパス 発」、英語時は「From Campus」と自動的に言語に応じた表示へ変換されます。
          </p>
        </section>

        <section className="doc-section">
          <h2>新しい言語 (中国語・韓国語など) の追加手順</h2>
          <ol style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px", fontSize: "14px", color: "var(--ft-text-secondary)" }}>
            <li><code>public/locales/zh.json</code> (または <code>ko.json</code>) を新規作成し、JSON形式で翻訳テキストを定義します。</li>
            <li><code>src/i18n/i18n.ts</code> でインポートし、<code>resources</code> オブジェクトに <code>zh: {"{ translation: zhTranslation }"}</code> を登録します。</li>
            <li>設定ダイアログ等の言語セレクタに新しい言語の選択肢 (例: <code>{"{ label: '中文', value: 'zh' }"}</code>) を追加します。</li>
          </ol>
        </section>
      </div>
    </article>
  );
}
