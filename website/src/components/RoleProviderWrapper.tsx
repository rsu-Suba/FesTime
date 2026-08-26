"use client";

import React, { ReactNode } from "react";
import { RoleContext } from "@/contexts/RoleContext";

interface RoleProviderWrapperProps {
  role: "user" | "admin" | "stall-admin";
  assignedStall?: string | null;
  children: ReactNode;
}

export function RoleProviderWrapper({
  role,
  assignedStall = "たこ焼き本舗 (3-A)",
  children,
}: RoleProviderWrapperProps) {
  const value = {
    role,
    setRole: () => {},
    isAdmin: role === "admin",
    isStallAdmin: role === "stall-admin",
    assignedStall: role === "stall-admin" ? assignedStall : null,
    isAuthenticating: false,
  };

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}
