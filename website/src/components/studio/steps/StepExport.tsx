"use client";

import React, { useState } from "react";
import { StudioState, OsType } from "@/types/studio";
import { StepContainer, StepTitle, StepDescription, ActionButtons } from "./shared";
import { exportStudioZip } from "@/utils/codeGenerators";
import { message } from "antd";

interface Props {
  state: StudioState;
  onChange: (s: StudioState) => void;
  onPrev: () => void;
  onReset: () => void;
}

export function StepExport({ state, onChange, onPrev, onReset }: Props) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const blob = await exportStudioZip(state);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `festime-patch_${state.config.identity.eventName || "config"}.zip`;
      a.click();
      URL.revokeObjectURL(url);
      message.success("設定パッチをダウンロードしました！");
    } catch {
      message.error("ZIP生成に失敗しました。もう一度お試しください。");
    } finally {
      setDownloading(false);
    }
  };

  const setOs = (os: OsType) => onChange({ ...state, osType: os });

  return (
    <StepContainer>
      <StepTitle>Ready to Launch</StepTitle>
      <StepDescription>
        FesTime プロジェクトに適用するためのパッチファイルを生成します。<br/>
        開発環境の OS を選択して、ZIP をダウンロードしてください。
      </StepDescription>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginBottom: 32 }}>
        {([
          { value: "mac", label: "macOS / Linux", sub: "install.command" },
          { value: "windows", label: "Windows", sub: "install.bat" },
        ] as const).map((opt) => (
          <div
            key={opt.value}
            onClick={() => setOs(opt.value)}
            style={{
              padding: "24px",
              borderRadius: 30,
              border: `2px solid ${state.osType === opt.value ? "var(--ft-brand-primary)" : "var(--ft-border)"}`,
              backgroundColor: state.osType === opt.value ? "var(--ft-active-bg)" : "transparent",
              cursor: "pointer",
              transition: "all 0.2s ease",
              textAlign: "center",
            }}
          >
            <p style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--ft-text-primary)", margin: 0 }}>{opt.label}</p>
            <p style={{ fontSize: "0.9rem", color: "var(--ft-text-muted)", margin: "8px 0 0" }}>{opt.sub} を同梱</p>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <button
          onClick={handleDownload}
          disabled={downloading}
          style={{
            background: "var(--ft-brand-primary)",
            color: "var(--bg-color)",
            border: "none",
            padding: "16px 48px",
            borderRadius: 999,
            fontSize: "1.2rem",
            fontWeight: 600,
            cursor: downloading ? "not-allowed" : "pointer",
            opacity: downloading ? 0.8 : 1,
            transition: "all 0.2s ease",
            width: "100%",
            maxWidth: 400
          }}
        >
          {downloading ? "生成中..." : "パッチ (ZIP) をダウンロード"}
        </button>
        
        <button
          onClick={onPrev}
          style={{
            background: "none",
            border: "none",
            color: "var(--ft-text-secondary)",
            fontSize: "1rem",
            cursor: "pointer",
            textDecoration: "underline"
          }}
        >
          前のステップに戻る
        </button>
      </div>
    </StepContainer>
  );
}
