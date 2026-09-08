"use client";

import React from "react";
import dynamic from "next/dynamic";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import { AVAILABLE_ICONS, IconName } from "../utils/iconMap";

const BottomNavigator = dynamic(() => import("@festime/components/Layout/Bottom"), { ssr: false });

interface TabItem {
  id: string;
  title: string;
  icon?: string;
  cards: string[];
}

interface Props {
  role: "user" | "admin" | "stallAdmin";
  value: number;
  onChange: (val: number) => void;
  tabs?: TabItem[];
  isMapEnabled?: boolean;
}

export function PreviewBottomNav({ role, value, onChange, tabs = [], isMapEnabled = false }: Props) {
  let mode: "user" | "admin" | "booth" | "vote" = "user";
  if (role === "admin") mode = "admin";
  if (role === "stallAdmin") mode = "booth";

  let customItems = undefined;

  if (tabs.length > 0) {
    customItems = tabs.map((t, i) => {
      let iconKey = (t.icon || "") as IconName;
      if (!iconKey || !AVAILABLE_ICONS[iconKey]) {
        if (role === "admin") {
          iconKey = i === 0 ? "SettingsRounded" : i === 1 ? "EventNoteRounded" : "WidgetsRounded";
        } else if (role === "stallAdmin") {
          iconKey = i === 0 ? "StorefrontRounded" : "NewspaperRounded";
        } else {
          iconKey = "MoreHorizRounded";
        }
      }
      const IconComponent = AVAILABLE_ICONS[iconKey]?.component || AVAILABLE_ICONS.MoreHorizRounded.component;

      return {
        key: i.toString(),
        icon: IconComponent,
        label: t.title
      };
    });
  }

  return (
    <div
      style={{
        pointerEvents: "auto",
        position: "relative",
        zIndex: 100,
        height: 64,
        marginBottom: 12,
        padding: "0 10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <div style={{ flex: 1, display: "flex", justifyContent: "center", height: 58, gap: 8 }}>
        <BottomNavigator
          mode={mode}
          value={value.toString()}
          setValue={(val: string) => onChange(parseInt(val, 10))}
          isMoving={false}
          setIsMoving={() => { }}
          disabled={false}
          customItems={customItems}
        />
      {isMapEnabled && (
        <button
          type="button"
          aria-label="MAP"
          style={{
            position: "relative",
            width: 58,
            height: 58,
            borderRadius: "9999px",
            backgroundColor: "var(--bottom-nav, rgba(250, 250, 254, 0.75))",
            WebkitBackdropFilter: "saturate(180%) blur(10px)",
            backdropFilter: "saturate(180%) blur(10px)",
            border: "0.5px solid var(--glass-border, rgba(255, 255, 255, 0.6))",
            boxShadow: "var(--bottom-nav-shadow, 0 4px 16px rgba(0,0,0,0.08))",
            color: "var(--main-color, var(--text-color, inherit))",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            cursor: "pointer",
            padding: 0,
            transition: "all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = "scale(0.92)";
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <MapRoundedIcon style={{ fontSize: 26 }} />
          <span style={{ fontSize: 9, fontWeight: "bold", marginTop: -2 }}>MAP</span>
        </button>
      )}
      </div>

    </div>
  );
}
