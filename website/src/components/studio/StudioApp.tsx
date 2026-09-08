"use client";

import React, { useState, useEffect, useRef } from "react";
import { StudioState, DEFAULT_STUDIO_STATE, DEFAULT_LAYOUT, StudioLayoutConfig } from "@/types/studio";
import { message } from "antd";
import { SiteHeader } from "@/components/docs/SiteHeader";
import { SiteFooter } from "@/components/docs/SiteFooter";
import { StudioSidebar } from "./StudioSidebar";
import { StepEventName } from "./steps/StepEventName";
import { StepAppTitle } from "./steps/StepAppTitle";
import { StepOrgName } from "./steps/StepOrgName";
import { StepDate } from "./steps/StepDate";
import { StepTheme } from "./steps/StepTheme";
import { StepFeatures } from "./steps/StepFeatures";
import { StepEnv } from "./steps/StepEnv";
import { StepData } from "./steps/StepData";
import { StepTabs } from "./steps/StepTabs";
import { StepLayout } from "./steps/StepLayout";
import { StepExport } from "./steps/StepExport";

const STORAGE_KEY = "festime_studio_state";

const sanitizeLayout = (layout: any): StudioLayoutConfig => {
  if (!layout) return DEFAULT_LAYOUT;
  const strip = (cards: string[]) => (Array.isArray(cards) ? cards.filter((c) => c !== "Spot" && c !== "Settings") : []);
  const sanitized = JSON.parse(JSON.stringify(layout));
  if (sanitized.user) {
    if (Array.isArray(sanitized.user.mobileTabs)) {
      sanitized.user.mobileTabs.forEach((tab: any) => {
        tab.cards = strip(tab.cards);
      });
    }
    if (sanitized.user.pcColumns) {
      if (Array.isArray(sanitized.user.pcColumns.col4)) {
        sanitized.user.pcColumns.col4 = sanitized.user.pcColumns.col4.map(strip);
      }
      if (Array.isArray(sanitized.user.pcColumns.col3)) {
        sanitized.user.pcColumns.col3 = sanitized.user.pcColumns.col3.map(strip);
      }
      if (Array.isArray(sanitized.user.pcColumns.col2)) {
        sanitized.user.pcColumns.col2 = sanitized.user.pcColumns.col2.map(strip);
      }
    }
  }
  if (sanitized.admin) {
    const isExcludedAdminCard = (c: string) =>
      !c || c === "Spot" || c === "Settings" || c.startsWith("VoteAdmin") || c === "ServerStatus" || c === "ServerConfig";
    const adminStrip = (cards: string[]) =>
      Array.isArray(cards)
        ? cards
          .filter((c) => !isExcludedAdminCard(c))
          .map((c) => {
            if (c === "News") return "NewsManager";
            if (c === "QA") return "QAManager";
            if (c === "Lost") return "LostManager";
            return c;
          })
          .filter((c) => ["NewsManager", "QAManager", "LostManager"].includes(c))
        : [];
    if (
      Array.isArray(sanitized.admin.mobileTabs) &&
      sanitized.admin.mobileTabs.length > 0 &&
      !sanitized.admin.mobileTabs.some((t: any) => t.id === "admin-main" || t.id === "admin-vote" || t.id === "admin-server")
    ) {
      sanitized.admin.mobileTabs.forEach((tab: any) => {
        tab.cards = adminStrip(tab.cards);
      });
    } else {
      sanitized.admin.mobileTabs = DEFAULT_LAYOUT.admin.mobileTabs;
    }
    if (
      Array.isArray(sanitized.admin.pcColumns) &&
      sanitized.admin.pcColumns.length === 3 &&
      !sanitized.admin.pcColumns.some((col: string[]) => col.some(isExcludedAdminCard))
    ) {
      sanitized.admin.pcColumns = sanitized.admin.pcColumns.map(adminStrip);
      const totalCards = sanitized.admin.pcColumns.flat().length;
      if (totalCards === 0) {
        sanitized.admin.pcColumns = DEFAULT_LAYOUT.admin.pcColumns;
      }
    } else {
      sanitized.admin.pcColumns = DEFAULT_LAYOUT.admin.pcColumns;
    }
  } else {
    sanitized.admin = DEFAULT_LAYOUT.admin;
  }
  if (sanitized.stallAdmin) {
    const stallStrip = (cards: string[]) =>
      Array.isArray(cards)
        ? cards
          .filter((c) => c !== "Spot" && c !== "Settings")
          .map((c) => (c === "NewsStatus" ? "News" : c))
          .filter((c) => ["BoothManager", "News"].includes(c))
        : [];
    if (Array.isArray(sanitized.stallAdmin.mobileTabs) && sanitized.stallAdmin.mobileTabs.length > 0) {
      sanitized.stallAdmin.mobileTabs.forEach((tab: any) => {
        tab.cards = stallStrip(tab.cards);
        if (tab.title === "本部連絡") {
          tab.title = "お知らせ";
        }
      });
    } else {
      sanitized.stallAdmin.mobileTabs = DEFAULT_LAYOUT.stallAdmin.mobileTabs;
    }
    if (Array.isArray(sanitized.stallAdmin.pcColumns) && sanitized.stallAdmin.pcColumns.length > 0) {
      sanitized.stallAdmin.pcColumns = sanitized.stallAdmin.pcColumns.map(stallStrip);
      const totalCards = sanitized.stallAdmin.pcColumns.flat().length;
      if (totalCards === 0) {
        sanitized.stallAdmin.pcColumns = DEFAULT_LAYOUT.stallAdmin.pcColumns;
      }
    } else {
      sanitized.stallAdmin.pcColumns = DEFAULT_LAYOUT.stallAdmin.pcColumns;
    }
  } else {
    sanitized.stallAdmin = DEFAULT_LAYOUT.stallAdmin;
  }
  return sanitized;
};

export function StudioApp() {
  const [state, setState] = useState<StudioState>(DEFAULT_STUDIO_STATE);
  const [isMounted, setIsMounted] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.layout) {
        parsed.layout = sanitizeLayout(parsed.layout);
      }
      setState({ ...DEFAULT_STUDIO_STATE, ...parsed, currentStep: parsed.currentStep || 1 });
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isMounted]);

  const currentStep = state.currentStep || 1;

  const goToStep = (step: number) => {
    setState((prev) => ({ ...prev, currentStep: step }));
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  };

  const handleNext = () => { if (currentStep < 11) goToStep(currentStep + 1); };
  const handlePrev = () => { if (currentStep > 1) goToStep(currentStep - 1); };

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <StepEventName state={state} onChange={setState} onNext={handleNext} />;
      case 2: return <StepAppTitle state={state} onChange={setState} onNext={handleNext} onPrev={handlePrev} />;
      case 3: return <StepOrgName state={state} onChange={setState} onNext={handleNext} onPrev={handlePrev} />;
      case 4: return <StepDate state={state} onChange={setState} onNext={handleNext} onPrev={handlePrev} />;
      case 5: return <StepTheme state={state} onChange={setState} onNext={handleNext} onPrev={handlePrev} />;
      case 6: return <StepFeatures state={state} onChange={setState} onNext={handleNext} onPrev={handlePrev} />;
      case 7: return <StepEnv state={state} onChange={setState} onNext={handleNext} onPrev={handlePrev} />;
      case 8: return <StepData state={state} onChange={setState} onNext={handleNext} onPrev={handlePrev} />;
      case 9: return <StepTabs state={state} onChange={setState} onNext={handleNext} onPrev={handlePrev} />;
      case 10: return <StepLayout state={state} onChange={setState} onNext={handleNext} onPrev={handlePrev} />;
      case 11: return <StepExport state={state} onChange={setState} onPrev={handlePrev} onReset={() => goToStep(1)} />;
      default: return <StepEventName state={state} onChange={setState} onNext={handleNext} />;
    }
  };

  const handleResetAll = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState({
      ...DEFAULT_STUDIO_STATE,
      currentStep: 1,
    });
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
    message.success("設定をリセットしました");
  };

  return (
    <div className="docs-page-layout">
      <SiteHeader />
      <div className="docs-body-container">
        <StudioSidebar currentStep={currentStep} onStepChange={goToStep} onReset={handleResetAll} />

        <main ref={mainRef} className="docs-main-content">
          <div style={{ paddingBottom: "calc(12% + 64px)", margin: "auto 0" }}>
            {renderStep()}
          </div>
        </main>
      </div>
    </div>
  );
}
