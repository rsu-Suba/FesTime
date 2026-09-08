"use client";

import React, { useEffect } from "react";
import { StudioState } from "@/types/studio";
import { StepContainer, StepTitle, StepDescription, ActionButtons } from "./shared";
import { ColorPicker } from "antd";
import { useTheme } from "@/mock/MockProviders";

interface Props {
  state: StudioState;
  onChange: (s: StudioState) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function StepTheme({ state, onChange, onNext, onPrev }: Props) {
  const { config } = state;
  const { isDarkMode } = useTheme();

  const updateTheme = (type: "primaryColor" | "backgroundColor", mode: "light" | "dark", hex: string) => {
    onChange({
      ...state,
      config: {
        ...state.config,
        theme: {
          ...state.config.theme,
          [type]: { ...state.config.theme[type], [mode]: hex }
        }
      }
    });
  };

  const activePrimary = isDarkMode
    ? config.theme.primaryColor.dark
    : config.theme.primaryColor.light;
  const activeBg = isDarkMode
    ? config.theme.backgroundColor.dark
    : config.theme.backgroundColor.light;

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.style.backgroundColor = activeBg;
    }
    return () => {
      if (typeof document !== "undefined") {
        document.body.style.backgroundColor = "";
      }
    };
  }, [activeBg]);

  return (
    <StepContainer>
      <StepTitle>Color / Styling</StepTitle>
      <StepDescription>
        アプリのメインカラーと背景色を設定してください。
      </StepDescription>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 40 }}>
        <p style={{ fontSize: "20px", fontWeight: 600, margin: "1em 0 0" }}>
          ライトテーマ
        </p>
        <p style={{ fontSize: "20px", fontWeight: 600, margin: "1em 0 0" }}>
          ダークテーマ
        </p>
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "1rem", color: "var(--ft-text-secondary)", marginBottom: 12 }}>
            メインカラー
          </label>
          <ColorPicker
            value={config.theme.primaryColor.light}
            onChange={(_, hex) => updateTheme("primaryColor", "light", hex)}
            showText
            size="large"
          />
        </div>
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "1rem", color: "var(--ft-text-secondary)", marginBottom: 12 }}>
            メインカラー
          </label>
          <ColorPicker
            value={config.theme.primaryColor.dark}
            onChange={(_, hex) => updateTheme("primaryColor", "dark", hex)}
            showText
            size="large"
          />
        </div>
        <div>
          <label style={{ display: "block", fontSize: "1rem", color: "var(--ft-text-secondary)", marginBottom: 12 }}>
            背景色
          </label>
          <ColorPicker
            value={config.theme.backgroundColor.light}
            onChange={(_, hex) => updateTheme("backgroundColor", "light", hex)}
            showText
            size="large"
          />
        </div>
        <div>
          <label style={{ display: "block", fontSize: "1rem", color: "var(--ft-text-secondary)", marginBottom: 12 }}>
            背景色
          </label>
          <ColorPicker
            value={config.theme.backgroundColor.dark}
            onChange={(_, hex) => updateTheme("backgroundColor", "dark", hex)}
            showText
            size="large"
          />
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <p style={{ fontSize: 13, color: "var(--ft-text-muted)", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", margin: 0 }}>
          カードプレビュー ({isDarkMode ? "ダークモード" : "ライトモード"})
        </p>
      </div>

      <div
        style={{
          backgroundColor: isDarkMode ? "#1d1d1d" : "#ffffff",
          borderRadius: 28,
          boxShadow: isDarkMode ? "0 4px 20px rgba(0,0,0,0.4)" : "0 2px 12px rgba(0,0,0,0.06)",
          color: isDarkMode ? "#ffffff" : "#000000",
          overflow: "hidden",
          maxWidth: 480
        }}
      >
        <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: 700, fontSize: "1.05rem" }}>
            {config.identity.eventName || "FesTime 2026"}
          </span>
        </div>

        <div
          style={{
            borderTop: `1px solid ${isDarkMode ? "#494949" : "#ededed"}`,
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <p style={{ margin: 0, fontSize: 13, color: isDarkMode ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.65)", lineHeight: 1.6 }}>
            メインカラーはボタンやバッジなどのアクセントに、背景色はアプリ全体の背景やステータスバーに反映されます。
          </p>

          <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr", alignItems: "center" }}>
            <button
              type="button"
              style={{
                backgroundColor: activePrimary,
                color: isDarkMode ? "#000000" : "#ffffff",
                border: "none",
                borderRadius: 12,
                padding: "10px 16px",
                fontWeight: 600,
                fontSize: "0.95rem",
                cursor: "default",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              プライマリーボタン
            </button>
            <button
              type="button"
              style={{
                backgroundColor: "transparent",
                color: isDarkMode ? "#ffffff" : "#000000",
                border: `1px solid ${isDarkMode ? "#494949" : "#d9d9d9"}`,
                borderRadius: 12,
                padding: "10px 16px",
                fontWeight: 500,
                fontSize: "0.95rem",
                cursor: "default",
              }}
            >
              サブボタン
            </button>
          </div>
        </div>
      </div>

      <ActionButtons onNext={onNext} onPrev={onPrev} />
    </StepContainer>
  );
}
