"use client";

import React, { useRef, useEffect, useState } from "react";
import { StudioState } from "@/types/studio";
import { StepContainer, StepTitle, StepDescription, ActionButtons } from "./shared";
import JSZip from "jszip";
import { Upload, message } from "antd";

interface Props {
  state: StudioState;
  onChange: (s: StudioState) => void;
  onNext: () => void;
}

export function StepEventName({ state, onChange, onNext }: Props) {
  const [loadingZip, setLoadingZip] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...state,
      config: {
        ...state.config,
        identity: { ...state.config.identity, eventName: e.target.value }
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.nativeEvent.isComposing || e.keyCode === 229) return;
    if (e.key === "Enter" && state.config.identity.eventName) {
      onNext();
    }
  };

  const handleZipUpload = async (file: File) => {
    setLoadingZip(true);
    try {
      const zip = await JSZip.loadAsync(file);
      const stateFile = zip.file(/\.?studio-state\.json$/i)[0];
      if (stateFile) {
        try {
          const savedState = JSON.parse(await stateFile.async("text"));
          onChange({
            ...state,
            ...savedState,
            currentStep: state.currentStep || 1,
          });
          message.success(`設定を復元しました（${savedState.config?.identity?.eventName || "パッチ"}）`);
          return false;
        } catch (e) {
          console.error("Failed to parse studio-state.json", e);
        }
      }

      let newConfig = { ...state.config };
      let newJsonData = { ...state.jsonData };
      let newLayout = { ...state.layout };
      let newEnv = { ...state.env };

      const configFile = zip.file(/custom\.config\.ts$/i)[0];
      if (configFile) {
        try {
          const configText = await configFile.async("text");
          const idx = configText.indexOf("CUSTOM_CONFIG");
          if (idx !== -1) {
            const braceIdx = configText.indexOf("{", idx);
            const endBraceIdx = configText.lastIndexOf("}");
            if (braceIdx !== -1 && endBraceIdx > braceIdx) {
              const parsedConfig = JSON.parse(configText.substring(braceIdx, endBraceIdx + 1));
              newConfig = {
                ...newConfig,
                ...parsedConfig,
                identity: {
                  ...newConfig.identity,
                  ...(parsedConfig.identity || {}),
                },
                theme: {
                  ...newConfig.theme,
                  ...(parsedConfig.theme || {}),
                },
                features: {
                  ...newConfig.features,
                  ...(parsedConfig.features || {}),
                },
                navigation: {
                  ...newConfig.navigation,
                  ...(parsedConfig.navigation || {}),
                },
              };

              if (Array.isArray(parsedConfig.navigation?.tabs) && parsedConfig.navigation.tabs.length > 0) {
                newLayout = {
                  ...newLayout,
                  user: {
                    ...newLayout.user,
                    mobileTabs: parsedConfig.navigation.tabs.map((tab: any, tIdx: number) => {
                      const existing = newLayout.user.mobileTabs[tIdx];
                      return {
                        id: tab.id || existing?.id || `tab-${tIdx}`,
                        title: tab.label || existing?.title || `タブ ${tIdx + 1}`,
                        icon: tab.icon || existing?.icon || "HomeRounded",
                        cards: existing?.cards || ["Header"],
                      };
                    }),
                  },
                };
              }
            }
          }
        } catch (e) {
          console.error("Failed to parse custom.config.ts", e);
        }
      }

      const layoutFile = zip.file(/layoutUtils\.ts$/i)[0];
      if (layoutFile) {
        try {
          const layoutText = await layoutFile.async("text");
          const mobileMatch = layoutText.match(/if\s*\(\s*isMobile\s*\)\s*\{([\s\S]*?)\}\s*\.filter/);
          if (mobileMatch) {
            const tabLines = mobileMatch[1].split("\n").filter((l) => l.includes("cards."));
            const parsedTabs = tabLines
              .map((line, idx) => {
                const titleMatch = line.match(/\/\/\s*(.*)$/);
                const cardMatches = Array.from(line.matchAll(/cards\.([A-Za-z0-9_]+)/g)).map((m) => m[1]);
                const existing = newLayout.user.mobileTabs[idx];
                return {
                  id: existing?.id || `tab-${idx}`,
                  title: titleMatch ? titleMatch[1].trim() : existing?.title || `タブ ${idx + 1}`,
                  icon: existing?.icon || "HomeRounded",
                  cards: cardMatches.length > 0 ? cardMatches : existing?.cards || [],
                };
              })
              .filter((t) => t.cards.length > 0);

            if (parsedTabs.length > 0) {
              newLayout = {
                ...newLayout,
                user: {
                  ...newLayout.user,
                  mobileTabs: parsedTabs,
                },
              };
            }
          }

          const adminMatch = layoutText.match(/calculateAdminLayout[\s\S]*?if\s*\(\s*isMobile\s*\)\s*\{([\s\S]*?)\}\s*\.filter/);
          if (adminMatch) {
            const adminTabLines = adminMatch[1].split("\n").filter((l) => l.includes("managers.") && !l.includes("managers.Settings"));
            const parsedAdminTabs = adminTabLines.map((line, idx) => {
              const titleMatch = line.match(/\/\/\s*(.*)$/);
              const cardMatches = Array.from(line.matchAll(/managers\.([A-Za-z0-9_]+)/g)).map((m) => m[1]);
              const existing = newLayout.admin.mobileTabs[idx];
              return {
                id: existing?.id || `admin-tab-${idx}`,
                title: titleMatch ? titleMatch[1].trim() : existing?.title || `管理タブ ${idx + 1}`,
                icon: existing?.icon || "SettingsRounded",
                cards: cardMatches.length > 0 ? cardMatches : existing?.cards || [],
              };
            }).filter((t) => t.cards.length > 0);

            if (parsedAdminTabs.length > 0) {
              newLayout = {
                ...newLayout,
                admin: {
                  ...newLayout.admin,
                  mobileTabs: parsedAdminTabs,
                },
              };
            }
          }

          const stallMatch = layoutText.match(/calculateStallAdminLayout[\s\S]*?if\s*\(\s*isMobile\s*\)\s*\{([\s\S]*?)\}\s*\.filter/);
          if (stallMatch) {
            const stallTabLines = stallMatch[1].split("\n").filter((l) => l.includes("managers."));
            const parsedStallTabs = stallTabLines.map((line, idx) => {
              const titleMatch = line.match(/\/\/\s*(.*)$/);
              const cardMatches = Array.from(line.matchAll(/managers\.([A-Za-z0-9_]+)/g)).map((m) => m[1]);
              const existing = newLayout.stallAdmin.mobileTabs[idx];
              return {
                id: existing?.id || `stall-tab-${idx}`,
                title: titleMatch ? titleMatch[1].trim() : existing?.title || `出店者タブ ${idx + 1}`,
                icon: existing?.icon || "StorefrontRounded",
                cards: cardMatches.length > 0 ? cardMatches : existing?.cards || [],
              };
            }).filter((t) => t.cards.length > 0);

            if (parsedStallTabs.length > 0) {
              newLayout = {
                ...newLayout,
                stallAdmin: {
                  ...newLayout.stallAdmin,
                  mobileTabs: parsedStallTabs,
                },
              };
            }
          }
        } catch (e) {
          console.error("Failed to parse layoutUtils.ts", e);
        }
      }

      const envFile = zip.file(/\.env$/i)[0];
      if (envFile) {
        try {
          const envText = await envFile.async("text");
          const envLines = envText.split("\n");
          for (const line of envLines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith("#")) continue;
            const eqIdx = trimmed.indexOf("=");
            if (eqIdx === -1) continue;
            const key = trimmed.substring(0, eqIdx).trim() as keyof EnvConfig;
            let val = trimmed.substring(eqIdx + 1).trim();
            if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
              val = val.slice(1, -1);
            }
            if (key in newEnv) {
              (newEnv as any)[key] = val;
            }
          }
        } catch (e) {
          console.error("Failed to parse .env", e);
        }
      }

      const boothFile = zip.file(/booth\.json$/i)[0];
      if (boothFile) newJsonData.booth = JSON.parse(await boothFile.async("text"));

      const busFile = zip.file(/bus\.json$/i)[0];
      if (busFile) newJsonData.bus = JSON.parse(await busFile.async("text"));

      const eventsFile = zip.file(/events\.json$/i)[0];
      if (eventsFile) newJsonData.events = JSON.parse(await eventsFile.async("text"));

      const spotsFile = zip.file(/spots\.json$/i)[0];
      if (spotsFile) newJsonData.spots = JSON.parse(await spotsFile.async("text"));

      const voteFile = zip.file(/vote\.json$/i)[0];
      if (voteFile) newJsonData.vote = JSON.parse(await voteFile.async("text"));

      const exhibitionsFile = zip.file(/exhibitions\.json$/i)[0];
      if (exhibitionsFile) newJsonData.exhibitions = JSON.parse(await exhibitionsFile.async("text"));

      onChange({
        ...state,
        config: newConfig,
        jsonData: newJsonData,
        layout: newLayout,
        env: newEnv,
      });

      const eventName = newConfig.identity?.eventName;
      message.success(eventName ? `設定を復元しました（${eventName}）` : "設定を復元しました");
    } catch {
      message.error("ZIPファイルの読み込みに失敗しました");
    } finally {
      setLoadingZip(false);
    }
    return false;
  };

  return (
    <StepContainer>
      <div style={{ marginBottom: 48 }}>
        <div style={{ fontSize: 13, color: "var(--ft-text-muted)", display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <span>以前の <code>festime-patch.zip</code> がある場合は</span>
          <Upload accept=".zip" beforeUpload={handleZipUpload} showUploadList={false} disabled={loadingZip}>
            <button type="button" style={{ background: "none", border: "none", padding: 0, color: "var(--ft-brand-primary, #4f46e5)", textDecoration: "underline", cursor: "pointer", fontSize: 13 }}>
              {loadingZip ? "読み込み中..." : "こちらから復元"}
            </button>
          </Upload>
          <span>できます。</span>
        </div>
      </div>

      <StepTitle>Event Name</StepTitle>
      <StepDescription>
        文化祭などの名称を入力してください。
      </StepDescription>

      <input
        ref={inputRef}
        type="text"
        placeholder="例: FesTime Event 2026"
        value={state.config.identity.eventName}
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
        onFocus={(e) => e.target.style.borderColor = "var(--ft-brand-primary)"}
        onBlur={(e) => e.target.style.borderColor = "var(--ft-border)"}
      />

      <ActionButtons onNext={onNext} isNextDisabled={!state.config.identity.eventName} />
    </StepContainer>
  );
}
