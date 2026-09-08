"use client";

import React from "react";
import { StudioState } from "@/types/studio";
import { StepContainer, StepTitle, StepDescription, ActionButtons } from "./shared";
import { DatePicker, Input } from "antd";
import dayjs from "dayjs";

interface Props {
  state: StudioState;
  onChange: (s: StudioState) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function StepDate({ state, onChange, onNext, onPrev }: Props) {
  const handleChangeDesc = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({
      ...state,
      config: {
        ...state.config,
        identity: { ...state.config.identity, appDescription: e.target.value }
      }
    });
  };

  return (
    <StepContainer>
      <StepTitle>Schedule / Overview</StepTitle>
      <StepDescription>
        イベントの期間と、簡単な紹介文を入力してください。
      </StepDescription>

      <div style={{ marginBottom: 32 }}>
        <label style={{ display: "block", fontSize: "1rem", fontWeight: 600, color: "var(--ft-text-secondary)", marginBottom: 8 }}>
          開催日程
        </label>
        <DatePicker.RangePicker
          size="large"
          style={{ width: "100%", padding: "12px 16px", fontSize: "1.2rem", borderRadius: 999, border: "2px solid var(--ft-border)" }}
          value={[
            state.config.identity.eventStartDate ? dayjs(state.config.identity.eventStartDate) : null,
            state.config.identity.eventEndDate ? dayjs(state.config.identity.eventEndDate) : null,
          ]}
          onChange={(_, dateStrings) => {
            onChange({
              ...state,
              config: {
                ...state.config,
                identity: { ...state.config.identity, eventStartDate: dateStrings[0], eventEndDate: dateStrings[1] }
              }
            });
          }}
        />
      </div>

      <div>
        <label style={{ display: "block", fontSize: "1rem", fontWeight: 600, color: "var(--ft-text-secondary)", marginBottom: 8 }}>
          アプリ説明文
        </label>
        <Input.TextArea
          rows={3}
          style={{ width: "100%", padding: "12px 16px", fontSize: "1.2rem", borderRadius: "calc(1.2rem + 12px)", border: "2px solid var(--ft-border)" }}
          placeholder="模擬店の混雑状況、ステージのタイムテーブルをチェック！"
          value={state.config.identity.appDescription}
          onChange={handleChangeDesc}
        />
      </div>

      <ActionButtons onNext={onNext} onPrev={onPrev} />
    </StepContainer>
  );
}
