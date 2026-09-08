"use client";

import React, { useRef, useEffect, useState } from "react";
import { StudioState } from "@/types/studio";
import { StepContainer, StepTitle, StepDescription, ActionButtons } from "./shared";
import { Input, Switch } from "antd";

interface Props {
  state: StudioState;
  onChange: (s: StudioState) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function StepEnv({ state, onChange, onNext, onPrev }: Props) {
  const [internalStep, setInternalStep] = useState(0);

  const env = state.env || {
    NEXT_PUBLIC_SUPABASE_URL: "",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "",
    NEXT_PUBLIC_ADMIN_EMAIL: "",
    NEXT_PUBLIC_BOOTH_ADMIN_EMAIL: "",
    NEXT_PUBLIC_BOOTH_ADMIN_PASSWORD: "",
    NEXT_PUBLIC_QR_AUTH_KEY: "",
    NEXT_PUBLIC_MOCK_TIME: "",
    NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: "",
  };

  const updateEnv = (key: keyof typeof env, value: string) => {
    onChange({ ...state, env: { ...env, [key]: value } });
  };

  const handleNextInternal = () => {
    if (internalStep < steps.length - 1) {
      setInternalStep(s => s + 1);
    } else {
      onNext();
    }
  };

  const handlePrevInternal = () => {
    if (internalStep > 0) {
      setInternalStep(s => s - 1);
    } else {
      onPrev();
    }
  };

  const bigInputStyle: React.CSSProperties = {
    width: "100%",
    fontSize: "1.3rem",
    padding: "16px 20px",
    borderRadius: 999,
    border: "2px solid var(--ft-border)",
    backgroundColor: "var(--bg-color)",
    color: "var(--ft-text-primary)",
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.nativeEvent.isComposing || e.keyCode === 229) return;
    if (e.key === "Enter") {
      handleNextInternal();
    }
  };

  const hasSupabaseFeatures = !!(
    state.config.features.booth ||
    state.config.features.vote ||
    state.config.features.news ||
    state.config.features.lost ||
    state.config.features.qa
  );

  const steps = [
    {
      id: "supabase",
      title: "Database: Supabase",
      desc: "FesTime のバックエンドとして使用する Supabase の URL と API Key を入力してください。",
      condition: hasSupabaseFeatures,
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <div style={{ fontSize: 12, color: "var(--ft-text-muted)", marginBottom: 6, fontWeight: 600 }}>NEXT_PUBLIC_SUPABASE_URL</div>
            <Input
              style={bigInputStyle}
              placeholder="https://xxxxxxxx.supabase.co"
              value={env.NEXT_PUBLIC_SUPABASE_URL}
              onChange={e => updateEnv("NEXT_PUBLIC_SUPABASE_URL", e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div>
            <div style={{ fontSize: 12, color: "var(--ft-text-muted)", marginBottom: 6, fontWeight: 600 }}>NEXT_PUBLIC_SUPABASE_ANON_KEY</div>
            <Input
              style={bigInputStyle}
              placeholder="eyJhbGciOi..."
              value={env.NEXT_PUBLIC_SUPABASE_ANON_KEY}
              onChange={e => updateEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>
      )
    },
    {
      id: "admin",
      title: "Admin Account",
      desc: "本部管理画面にログインするためのメールアドレスを入力してください。",
      condition: hasSupabaseFeatures,
      content: (
        <Input
          style={bigInputStyle}
          placeholder="admin@example.com"
          value={env.NEXT_PUBLIC_ADMIN_EMAIL}
          onChange={e => updateEnv("NEXT_PUBLIC_ADMIN_EMAIL", e.target.value)}
          onKeyDown={handleKeyDown}
        />
      )
    },
    {
      id: "booth",
      title: "Booth Staff Account",
      desc: "各模擬店の責任者が、混雑状況や在庫を更新するための共通ログイン情報を入力してください",
      condition: state.config.features.booth,
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <div style={{ fontSize: 12, color: "var(--ft-text-muted)", marginBottom: 6, fontWeight: 600 }}>メールアドレス</div>
            <Input
              style={bigInputStyle}
              placeholder="booth@example.com"
              value={env.NEXT_PUBLIC_BOOTH_ADMIN_EMAIL}
              onChange={e => updateEnv("NEXT_PUBLIC_BOOTH_ADMIN_EMAIL", e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div>
            <div style={{ fontSize: 12, color: "var(--ft-text-muted)", marginBottom: 6, fontWeight: 600 }}>パスワード</div>
            <Input.Password
              style={bigInputStyle}
              placeholder="パスワードを入力"
              value={env.NEXT_PUBLIC_BOOTH_ADMIN_PASSWORD}
              onChange={e => updateEnv("NEXT_PUBLIC_BOOTH_ADMIN_PASSWORD", e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>
      )
    },
    {
      id: "mockTime",
      title: "Time Simulation",
      desc: "タイムテーブルなどの動作確認のために、アプリ内の現在時刻を固定しますか？（本番では空にしてください）",
      condition: true,
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", backgroundColor: "var(--ft-card-bg)", borderRadius: 999, border: "1px solid var(--ft-border)", marginRight: "auto" }}>
            <Switch
              checked={!!env.NEXT_PUBLIC_MOCK_TIME}
              onChange={(c) => updateEnv("NEXT_PUBLIC_MOCK_TIME", c ? "2026-10-10T10:00:00" : "")}
            />
            <span style={{ fontSize: "1rem", fontWeight: 600, color: "var(--ft-text-primary)" }}>モックタイムを有効にする</span>
          </div>
          {!!env.NEXT_PUBLIC_MOCK_TIME && (
            <Input
              style={bigInputStyle}
              type="datetime-local"
              value={env.NEXT_PUBLIC_MOCK_TIME.slice(0, 16)}
              onChange={e => updateEnv("NEXT_PUBLIC_MOCK_TIME", e.target.value + ":00")}
              onKeyDown={handleKeyDown}
            />
          )}
        </div>
      )
    },
    {
      id: "ga",
      title: "Google Analytics",
      desc: "アクセス解析を利用する場合は GA ID (G-XXXXXXX) を入力してください。",
      condition: true,
      content: (
        <Input
          style={bigInputStyle}
          placeholder="例: G-XXXXXXXXXX"
          value={env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}
          onChange={e => updateEnv("NEXT_PUBLIC_GOOGLE_ANALYTICS_ID", e.target.value)}
          onKeyDown={handleKeyDown}
        />
      )
    }
  ].filter(s => s.condition);

  const safeIndex = Math.min(internalStep, Math.max(0, steps.length - 1));
  const currentQuestion = steps[safeIndex] || steps[0];

  return (
    <StepContainer>
      <div style={{ marginBottom: 12, fontSize: 13, color: "var(--ft-text-muted)", fontWeight: 600 }}>
        環境変数設定 ({safeIndex + 1} / {steps.length})
      </div>

      <StepTitle>{currentQuestion.title}</StepTitle>
      <StepDescription>{currentQuestion.desc}</StepDescription>

      {currentQuestion.content}

      <ActionButtons
        onNext={handleNextInternal}
        onPrev={handlePrevInternal}
        nextLabel={"OK"}
      />
    </StepContainer>
  );
}
