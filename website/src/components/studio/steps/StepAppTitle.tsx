"use client";

import React, { useRef, useEffect } from "react";
import { StudioState } from "@/types/studio";
import { StepContainer, StepTitle, StepDescription, ActionButtons } from "./shared";

interface Props {
  state: StudioState;
  onChange: (s: StudioState) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function StepAppTitle({ state, onChange, onNext, onPrev }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...state,
      config: {
        ...state.config,
        identity: { ...state.config.identity, appTitle: e.target.value }
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.nativeEvent.isComposing || e.keyCode === 229) return;
    if (e.key === "Enter" && state.config.identity.appTitle) {
      onNext();
    }
  };

  return (
    <StepContainer>
      <StepTitle>App Name</StepTitle>
      <StepDescription>
        ブラウザのタブや検索結果に表示されるタイトルを入力してください。
      </StepDescription>

      <input
        ref={inputRef}
        type="text"
        placeholder="例: FesTime Event"
        value={state.config.identity.appTitle}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        style={{
          width: "100%",
          fontSize: "1.5rem",
          padding: "16px 20px",
          border: "2px solid var(--ft-border)",
          borderRadius: 999,
          outline: "none",
          transition: "all 0.2s",
          backgroundColor: "var(--bg-color)",
          color: "var(--ft-text-primary)"
        }}
        onFocus={(e) => e.target.style.borderColor = "var(--ft-brand-primary, #4f46e5)"}
        onBlur={(e) => e.target.style.borderColor = "var(--ft-border)"}
      />

      <ActionButtons onNext={onNext} onPrev={onPrev} isNextDisabled={!state.config.identity.appTitle} />
    </StepContainer>
  );
}
