"use client";

import React from "react";
import { StudioState, EventConfig } from "@/types/studio";
import { StepContainer, StepTitle, StepDescription, ActionButtons } from "./shared";
import { Switch } from "antd";

interface Props {
  state: StudioState;
  onChange: (s: StudioState) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function StepFeatures({ state, onChange, onNext, onPrev }: Props) {
  const { config } = state;

  const updateFeature = (key: keyof EventConfig["features"], val: boolean) => {
    onChange({
      ...state,
      config: {
        ...state.config,
        features: { ...state.config.features, [key]: val },
      },
    });
  };

  const features: Array<{
    key: keyof EventConfig["features"];
    label: string;
    desc: string;
    recommended?: boolean;
  }> = [
    { key: "booth", label: "模擬店・混雑状況", desc: "リアルタイム混雑度・在庫更新", recommended: true },
    { key: "vote", label: "リアルタイム人気投票", desc: "タイマー連動のオンライン投票", recommended: true },
    { key: "event", label: "タイムテーブル", desc: "日別ステージ発表・演目", recommended: true },
    { key: "news", label: "お知らせ & 緊急速報", desc: "重要通知・タイムライン", recommended: true },
    { key: "bus", label: "シャトルバス時刻表", desc: "往路・復路カウントダウン" },
    { key: "lost", label: "落とし物管理", desc: "写真付き拾得物の一覧掲載" },
    { key: "map", label: "マップ & QR現在地", desc: "キャンパスマップ表示" },
    { key: "qa", label: "Q&A 掲示板", desc: "問い合わせ受付と回答一覧" },
    { key: "exhibition", label: "展示部門", desc: "教室展示・研究発表の一覧" },
  ];

  return (
    <StepContainer>
      <StepTitle>Features</StepTitle>
      <StepDescription>
        イベントに合わせて、アプリで提供する機能を選択してください。
      </StepDescription>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {features.map((feat) => {
          const isEnabled = config.features[feat.key];
          return (
            <div
              key={feat.key}
              onClick={() => updateFeature(feat.key, !isEnabled)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "20px",
                borderRadius: 16,
                cursor: "pointer",
                transition: "all 0.2s ease",
                backgroundColor: isEnabled ? "var(--card-color)" : "rgba(0, 0, 0, 0",
                border: isEnabled ? "1px solid var(--ft-text-muted)" : "1px solid var(--ft-border, #e4e4e7)",
                boxShadow: isEnabled ? "0 2px 8px rgba(0, 0, 0, 0.04)" : "none",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: "1.05rem", fontWeight: isEnabled ? 700 : 600, color: isEnabled ? "var(--ft-text-primary)" : "var(--ft-text-secondary)" }}>
                    {feat.label}
                  </span>
                  {feat.recommended && (
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4, backgroundColor: "var(--ft-brand-primary-mono, #18181b)", color: "var(--ft-card-bg, #ffffff)" }}>
                      推奨
                    </span>
                  )}
                </div>
                <span style={{ fontSize: "0.85rem", color: "var(--ft-text-muted)", display: "block" }}>
                  {feat.desc}
                </span>
              </div>
              <div onClick={(e) => e.stopPropagation()}>
                <Switch
                  checked={isEnabled}
                  onChange={(checked) => updateFeature(feat.key, checked)}
                />
              </div>
            </div>
          );
        })}
      </div>

      <ActionButtons onNext={onNext} onPrev={onPrev} />
    </StepContainer>
  );
}
