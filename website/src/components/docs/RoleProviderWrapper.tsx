"use client";

import React, { ReactNode } from "react";
import { ConfigProvider, App, theme } from "antd";
import jaJP from "antd/lib/locale/ja_JP";
import { RoleContext } from "@/contexts/RoleContext";
import { useTheme } from "@/mock/MockProviders";

interface RoleProviderWrapperProps {
  role: "user" | "admin" | "stall-admin" | "stallAdmin";
  assignedStall?: string | null;
  children: ReactNode;
  colorPrimary?: string;
}

export function RoleProviderWrapper({
  role: rawRole,
  assignedStall = "ポップコーン",
  children,
  colorPrimary,
}: RoleProviderWrapperProps) {
  const { isDarkMode } = useTheme();
  const role = rawRole === "stallAdmin" ? "stall-admin" : rawRole;

  const value = {
    role,
    setRole: () => {},
    isAdmin: role === "admin",
    isStallAdmin: role === "stall-admin",
    assignedStall: role === "stall-admin" ? (assignedStall || "ポップコーン") : null,
    isAuthenticating: false,
  };

  return (
    <ConfigProvider
      locale={jaJP}
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: colorPrimary ? { colorPrimary, colorInfo: colorPrimary } : undefined,
      }}
    >
      <App>
        <RoleContext.Provider value={value}>{children}</RoleContext.Provider>
      </App>
    </ConfigProvider>
  );
}
