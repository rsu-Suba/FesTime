"use client";

import React from "react";
import dynamic from "next/dynamic";
import { EventConfig } from "@/types/studio";
import { RoleProviderWrapper } from "@/components/docs/RoleProviderWrapper";
import { NotificationOutlined } from "@ant-design/icons";

const ErrorFallback = ({ name }: { name: string }) => (
  <div style={{ padding: 16, backgroundColor: "#fff", borderRadius: 12, marginBottom: 12, border: "1px dashed #ef4444", textAlign: "center", color: "#ef4444" }}>
    {name} のプレビュー読み込みに失敗しました。<br />
    <span style={{ fontSize: 11, color: "#64748b" }}>ブラウザをリロードすると直る場合があります。</span>
  </div>
);

const Header = dynamic(() => import("@festime/components/Layout/Header").catch(() => () => <ErrorFallback name="Header" />), { ssr: false });
const BoothStatus = dynamic(() => import("@festime/features/booth/components/BoothStatus").catch(() => () => <ErrorFallback name="BoothStatus" />), { ssr: false });
const BoothStatusFavorite = dynamic(() => import("@festime/features/booth/components/BoothStatusFavorite").catch(() => () => <ErrorFallback name="BoothStatusFavorite" />), { ssr: false });
const BoothManager = dynamic(() => import("@festime/features/booth/components/BoothManager").catch(() => () => <ErrorFallback name="BoothManager" />), { ssr: false });
const EventStatus = dynamic(() => import("@festime/features/event/components/EventStatus").catch(() => () => <ErrorFallback name="EventStatus" />), { ssr: false });
const ExhibitionStatus = dynamic(() => import("@festime/features/event/components/ExhibitionStatus").catch(() => () => <ErrorFallback name="ExhibitionStatus" />), { ssr: false });
const VoteStatus = dynamic(() => import("@festime/features/vote/components/VoteStatus").catch(() => () => <ErrorFallback name="VoteStatus" />), { ssr: false });
const VoteAdmin = dynamic(() => import("@festime/features/vote/components/VoteAdmin").catch(() => () => <ErrorFallback name="VoteAdmin" />), { ssr: false });
const NewsStatus = dynamic(() => import("@festime/features/news/components/NewsStatus").catch(() => () => <ErrorFallback name="NewsStatus" />), { ssr: false });
const NewsManager = dynamic(() => import("@festime/features/news/components/NewsManager").catch(() => () => <ErrorFallback name="NewsManager" />), { ssr: false });
const BusStatus = dynamic(() => import("@festime/features/bus/components/BusStatus").catch(() => () => <ErrorFallback name="BusStatus" />), { ssr: false });
const LostStatus = dynamic(() => import("@festime/features/lost/components/LostStatus").catch(() => () => <ErrorFallback name="LostStatus" />), { ssr: false });
const LostManager = dynamic(() => import("@festime/features/lost/components/LostManager").catch(() => () => <ErrorFallback name="LostManager" />), { ssr: false });
const QAStatus = dynamic(() => import("@festime/features/qa/components/QAStatus").catch(() => () => <ErrorFallback name="QAStatus" />), { ssr: false });
const QAManager = dynamic(() => import("@festime/features/qa/components/QAManager").catch(() => () => <ErrorFallback name="QAManager" />), { ssr: false });
const ServerStatus = dynamic(() => import("@festime/features/admin/components/ServerStatus").catch(() => () => <ErrorFallback name="ServerStatus" />), { ssr: false });
const Homepage = dynamic(() => import("@festime/components/Layout/Homepage").catch(() => () => <ErrorFallback name="Homepage" />), { ssr: false });
const InfoHeader = dynamic(() => import("@festime/components/Layout/InfoHeader").catch(() => () => <ErrorFallback name="InfoTitle" />), { ssr: false });

import { useTheme } from "@/mock/MockProviders";

interface PreviewProps {
  cardKey: string;
  config: EventConfig;
  role?: "user" | "admin" | "stallAdmin";
}

export function RealPreviewCard({ cardKey, config, role = "user" }: PreviewProps) {
  const { isDarkMode } = useTheme();
  const primaryColor = isDarkMode
    ? config?.theme?.primaryColor?.dark || "#f0f0f0"
    : config?.theme?.primaryColor?.light || "#1f1f1f";

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <RoleProviderWrapper role="user" colorPrimary={primaryColor}>
      <div style={{ pointerEvents: "none" }}>
        {children}
      </div>
    </RoleProviderWrapper>
  );

  const AdminWrapper = ({ children }: { children: React.ReactNode }) => (
    <RoleProviderWrapper role="admin" colorPrimary={primaryColor}>
      <div style={{ pointerEvents: "none" }}>
        {children}
      </div>
    </RoleProviderWrapper>
  );

  const StallWrapper = ({ children }: { children: React.ReactNode }) => (
    <RoleProviderWrapper role="stall-admin" assignedStall="ポップコーン" colorPrimary={primaryColor}>
      <div style={{ pointerEvents: "none" }}>
        {children}
      </div>
    </RoleProviderWrapper>
  );

  switch (cardKey) {
    case "Header":
      return <Wrapper><Header /></Wrapper>;
    case "HotNews":
      return (
        <RoleProviderWrapper role="user">
          <div style={{ pointerEvents: "none" }}>
            <NewsStatus onlyHot={true} hotTime={20} />
          </div>
        </RoleProviderWrapper>
      );
    case "Booth":
      return <Wrapper><BoothStatus /></Wrapper>;
    case "Booth1":
      return <Wrapper><BoothStatus split="first" /></Wrapper>;
    case "Booth2":
      return <Wrapper><BoothStatus split="second" /></Wrapper>;
    case "BoothFav":
      return <Wrapper><BoothStatusFavorite /></Wrapper>;
    case "BoothManager":
      return <StallWrapper><BoothManager /></StallWrapper>;
    case "Events":
      return <Wrapper><EventStatus /></Wrapper>;
    case "Exhibition":
      return <Wrapper><ExhibitionStatus /></Wrapper>;
    case "Vote":
      return <Wrapper><VoteStatus /></Wrapper>;
    case "VoteAdmin":
      return (
        <AdminWrapper>
          <div style={{ position: "relative", minHeight: 320, overflow: "hidden", borderRadius: 12 }}>
            <VoteAdmin />
          </div>
        </AdminWrapper>
      );
    case "VoteAdminStall":
      return <AdminWrapper><VoteAdmin filterCategory="s" /></AdminWrapper>;
    case "VoteAdminExhibition":
      return <AdminWrapper><VoteAdmin filterCategory="e" /></AdminWrapper>;
    case "VoteAdminOther":
      return <AdminWrapper><VoteAdmin filterCategory="o" /></AdminWrapper>;
    case "News":
      return role === "stallAdmin" ? <StallWrapper><NewsStatus /></StallWrapper> : <Wrapper><NewsStatus /></Wrapper>;
    case "NewsManager":
      return <AdminWrapper><NewsManager /></AdminWrapper>;
    case "NewsStatus":
      return <StallWrapper><NewsStatus /></StallWrapper>;
    case "Bus":
      return <Wrapper><BusStatus /></Wrapper>;
    case "Lost":
      return role === "admin" ? <AdminWrapper><LostManager /></AdminWrapper> : <Wrapper><LostStatus /></Wrapper>;
    case "LostManager":
      return <AdminWrapper><LostManager /></AdminWrapper>;
    case "QA":
      return role === "admin" ? <AdminWrapper><QAManager /></AdminWrapper> : <Wrapper><QAStatus /></Wrapper>;
    case "QAManager":
      return <AdminWrapper><QAManager /></AdminWrapper>;
    case "ServerStatus":
      return (
        <AdminWrapper>
          <div style={{ position: "relative", minHeight: 380, overflow: "hidden", borderRadius: 12 }}>
            <ServerStatus />
          </div>
        </AdminWrapper>
      );
    case "Homepage":
      return <Wrapper><Homepage /></Wrapper>;
    case "InfoTitle":
      return <Wrapper><InfoHeader onSettingsClick={() => {}} /></Wrapper>;

    default:
      return (
        <div style={{ padding: 16, backgroundColor: "#fff", borderRadius: 12, marginBottom: 12, border: "1px solid #f0f0f0", textAlign: "center", color: "#64748b" }}>
          {cardKey} コンポーネント (モックなし)
        </div>
      );
  }
}
