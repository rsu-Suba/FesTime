"use client";

import React from "react";
import { useTheme } from "@/mock/MockProviders";
import { EventConfig } from "@/types/studio";
import { ConfigProvider, theme as antdTheme } from "antd";
import jaJP from "antd/lib/locale/ja_JP";

export function PreviewContainer({
  children,
  isMobile,
  config,
}: {
  children: React.ReactNode;
  isMobile?: boolean;
  config?: EventConfig;
}) {
  const { isDarkMode } = useTheme();

  const primaryColor = isDarkMode
    ? config?.theme?.primaryColor?.dark || "#f0f0f0"
    : config?.theme?.primaryColor?.light || "#1f1f1f";

  const backgroundColor = isDarkMode
    ? config?.theme?.backgroundColor?.dark || "#080809"
    : config?.theme?.backgroundColor?.light || "#f1f0f5";

  return (
    <div
      style={{
        position: "relative",
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: backgroundColor,
        ["--main-color" as any]: primaryColor,
        ["--mainCanvas-color" as any]: backgroundColor,
        ["--bg-color" as any]: backgroundColor,
        ["--ft-brand-primary" as any]: primaryColor,
      }}
    >
      <div
        className="mainCanvas"
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          zIndex: 0,
          pointerEvents: "none",
          backgroundColor: backgroundColor,
        }}
      />

      <ConfigProvider
        locale={jaJP}
        theme={{
          algorithm: isDarkMode ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
          token: {
            colorPrimary: primaryColor,
            colorInfo: primaryColor,
          },
        }}
      >
        <div style={{ position: "relative", zIndex: 1, height: "100%", width: "100%", display: "flex", flexDirection: "column" }}>
          {children}
        </div>
      </ConfigProvider>
    </div>
  );
}
