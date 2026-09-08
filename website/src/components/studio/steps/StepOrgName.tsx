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

export function StepOrgName({ state, onChange, onNext, onPrev }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleChangeOrg = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...state,
      config: {
        ...state.config,
        identity: { ...state.config.identity, organizationName: e.target.value }
      }
    });
  };

  const handleChangeUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...state,
      config: {
        ...state.config,
        navigation: { ...state.config.navigation, homepageUrl: e.target.value }
      }
    });
  };

  const handleKeyDownOrg = (e: React.KeyboardEvent) => {
    if (e.nativeEvent.isComposing || e.keyCode === 229) return;
    if (e.key === "Enter") {
      urlInputRef.current?.focus();
    }
  };

  const handleKeyDownUrl = (e: React.KeyboardEvent) => {
    if (e.nativeEvent.isComposing || e.keyCode === 229) return;
    if (e.key === "Enter" && state.config.identity.organizationName) {
      onNext();
    }
  };

  return (
    <StepContainer>
      <StepTitle>Organization Name</StepTitle>
      <StepDescription>
        フッターのコピーライト等に表示される実行委員会や団体の名前を入力してください。
      </StepDescription>

      <div style={{ display: "flex", flexDirection: "column", gap: 24, width: "100%" }}>
        <div>
          <label style={{ display: "block", fontSize: "1rem", fontWeight: 600, color: "var(--ft-text-secondary)", marginBottom: 8 }}>
            主催組織名
          </label>
          <input
            ref={inputRef}
            type="text"
            placeholder="例: 実行委員会"
            value={state.config.identity.organizationName}
            onChange={handleChangeOrg}
            onKeyDown={handleKeyDownOrg}
            style={{
              width: "100%",
              fontSize: "1.5rem",
              padding: "16px 20px",
              border: "2px solid var(--ft-border)",
              borderRadius: 999,
              outline: "none",
              transition: "border-color 0.2s",
              backgroundColor: "var(--bg-color, #ffffff)",
              color: "var(--ft-text-primary)"
            }}
            onFocus={(e) => e.target.style.borderColor = "var(--ft-brand-primary)"}
            onBlur={(e) => e.target.style.borderColor = "var(--ft-border)"}
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: "1rem", fontWeight: 600, color: "var(--ft-text-secondary)", marginBottom: 8 }}>
            公式ホームページ URL
          </label>
          <input
            ref={urlInputRef}
            type="url"
            placeholder="例: https://example.com"
            value={state.config.navigation.homepageUrl || ""}
            onChange={handleChangeUrl}
            onKeyDown={handleKeyDownUrl}
            style={{
              width: "100%",
              fontSize: "1.5rem",
              padding: "16px 20px",
              border: "2px solid var(--ft-border)",
              borderRadius: 999,
              outline: "none",
              transition: "border-color 0.2s",
              backgroundColor: "var(--bg-color, #ffffff)",
              color: "var(--ft-text-primary)"
            }}
            onFocus={(e) => e.target.style.borderColor = "var(--ft-brand-primary)"}
            onBlur={(e) => e.target.style.borderColor = "var(--ft-border)"}
          />
        </div>
      </div>

      <ActionButtons onNext={onNext} onPrev={onPrev} isNextDisabled={!state.config.identity.organizationName} />
    </StepContainer>
  );
}
