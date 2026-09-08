"use client";

import React from "react";
import { Popconfirm, Button } from "antd";
import { UndoOutlined } from "@ant-design/icons";

interface StudioSidebarProps {
  currentStep: number;
  onStepChange: (step: number) => void;
  onReset?: () => void;
}

const CATEGORIES = [
  {
    label: "基本情報",
    steps: [
      { id: 1, label: "イベント名" },
      { id: 2, label: "サイト名" },
      { id: 3, label: "運営団体" },
      { id: 4, label: "日程・説明" },
      { id: 5, label: "テーマカラー" },
    ],
  },
  {
    label: "機能設定",
    steps: [
      { id: 6, label: "機能の選択" },
      { id: 7, label: "環境変数 (.env)" },
    ],
  },
  {
    label: "データ・レイアウト",
    steps: [
      { id: 8, label: "マスターデータ" },
      { id: 9, label: "タブ構成" },
      { id: 10, label: "レイアウト" },
    ],
  },
  {
    label: "エクスポート",
    steps: [
      { id: 11, label: "完了" },
    ],
  },
];

export function StudioSidebar({ currentStep, onStepChange, onReset }: StudioSidebarProps) {
  return (
    <aside className="docs-sidebar" style={{ display: "flex", flexDirection: "column", height: "100%", boxSizing: "border-box" }}>
      <div style={{ marginBottom: 20 }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ft-text-muted)", margin: 0 }}>
          FesTime Studio
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
        {CATEGORIES.map((cat, i) => {
          const isCategoryActive = cat.steps.some(s => s.id === currentStep);
          return (
            <div key={i}>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, color: isCategoryActive ? "var(--ft-text-primary)" : "var(--ft-text-muted)", marginBottom: 8, paddingLeft: 12 }}>
                {cat.label}
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 4 }}>
                {cat.steps.map(step => (
                  <li key={step.id}>
                    <button
                      onClick={() => onStepChange(step.id)}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        padding: "8px 32px",
                        background: currentStep === step.id ? "var(--ft-active-bg)" : "transparent",
                        border: "transparent",
                        borderRadius: 6,
                        color: currentStep === step.id ? "var(--ft-brand-primary, #4f46e5)" : "var(--ft-text-secondary)",
                        fontWeight: currentStep === step.id ? 600 : 500,
                        fontSize: "0.9rem",
                        cursor: "pointer",
                        transition: "all 0.15s ease"
                      }}
                    >
                      {step.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {onReset && (
        <div style={{ marginTop: "auto", paddingTop: 16 }}>
          <Popconfirm
            title="設定をリセットしてやり直しますか？"
            description="現在のすべての設定内容が破棄され、最初からやり直します。"
            onConfirm={onReset}
            okText="リセットする"
            cancelText="キャンセル"
            okButtonProps={{ danger: true }}
            placement="topRight"
          >
            <Button
              danger
              type="text"
              icon={<UndoOutlined />}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                fontSize: "0.85rem",
                color: "var(--ft-text-muted)",
                height: 36,
                borderRadius: 8,
              }}
            >
              リセットしてやり直す
            </Button>
          </Popconfirm>
        </div>
      )}
    </aside>
  );
}
