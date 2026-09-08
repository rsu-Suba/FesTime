"use client";

import React from "react";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import WidgetsRoundedIcon from "@mui/icons-material/WidgetsRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import NewspaperRoundedIcon from "@mui/icons-material/NewspaperRounded";
import QuestionAnswerRoundedIcon from "@mui/icons-material/QuestionAnswerRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import EventNoteRoundedIcon from "@mui/icons-material/EventNoteRounded";
import DirectionsBusRoundedIcon from "@mui/icons-material/DirectionsBusRounded";
import LocalCafeRoundedIcon from "@mui/icons-material/LocalCafeRounded";
import CameraAltRoundedIcon from "@mui/icons-material/CameraAltRounded";
import FastfoodRoundedIcon from "@mui/icons-material/FastfoodRounded";
import TheaterComedyRoundedIcon from "@mui/icons-material/TheaterComedyRounded";

import { useNavigation } from "./useNavigation";
import styles from "./Bottom.module.css";
import { CUSTOM_CONFIG } from "@/constants/custom.config";

export const ICON_MAP: Record<string, React.ElementType> = {
  HomeRounded: HomeRoundedIcon,
  StorefrontRounded: StorefrontRoundedIcon,
  VisibilityRounded: VisibilityRoundedIcon,
  WidgetsRounded: WidgetsRoundedIcon,
  NewspaperRounded: NewspaperRoundedIcon,
  QuestionAnswerRounded: QuestionAnswerRoundedIcon,
  SearchRounded: SearchRoundedIcon,
  MapRounded: MapRoundedIcon,
  InfoRounded: InfoRoundedIcon,
  EventNoteRounded: EventNoteRoundedIcon,
  DirectionsBusRounded: DirectionsBusRoundedIcon,
  LocalCafeRounded: LocalCafeRoundedIcon,
  FastfoodRounded: FastfoodRoundedIcon,
  CameraAltRounded: CameraAltRoundedIcon,
  TheaterComedyRounded: TheaterComedyRoundedIcon,
  MoreHorizRounded: MoreHorizRoundedIcon,
  SettingsRounded: SettingsRoundedIcon,
};

export const NAV_CONFIG = {
  user: [
    { key: "0", icon: HomeRoundedIcon, label: "Main" },
    { key: "1", icon: StorefrontRoundedIcon, label: "Booth" },
    { key: "2", icon: VisibilityRoundedIcon, label: "Exhibition" },
    { key: "3", icon: WidgetsRoundedIcon, label: "Info" },
  ],
  admin: [
    { key: "0", icon: NewspaperRoundedIcon, label: "News" },
    { key: "1", icon: QuestionAnswerRoundedIcon, label: "QA" },
    { key: "2", icon: SearchRoundedIcon, label: "Lost" },
    { key: "3", icon: SettingsRoundedIcon, label: "Settings" },
  ],
  booth: [
    { key: "0", icon: HomeRoundedIcon, label: "Main" },
    { key: "1", icon: SettingsRoundedIcon, label: "Settings" },
  ],
  vote: [
    { key: "0", icon: StorefrontRoundedIcon, label: "模擬店" },
    { key: "1", icon: VisibilityRoundedIcon, label: "展示" },
    { key: "2", icon: MoreHorizRoundedIcon, label: "その他" },
  ],
};

export type BottomMode = keyof typeof NAV_CONFIG;

export interface BottomNavItem {
  key: string;
  icon: React.ElementType;
  label: string;
}

interface BottomNavigatorProps {
  mode: BottomMode;
  value: string;
  setValue: (val: string) => void;
  isMoving: boolean;
  setIsMoving: (val: boolean) => void;
  disabled?: boolean;
  customItems?: BottomNavItem[];
}

export default function BottomNavigator({
  mode,
  value,
  setValue,
  isMoving,
  setIsMoving,
  disabled,
  customItems,
}: BottomNavigatorProps) {
  let configItems: BottomNavItem[] = NAV_CONFIG[mode];
  if (mode === "user" && CUSTOM_CONFIG.navigation.tabs && CUSTOM_CONFIG.navigation.tabs.length > 0) {
    configItems = CUSTOM_CONFIG.navigation.tabs.map((t, i) => ({
      key: i.toString(),
      icon: ICON_MAP[t.icon] || MoreHorizRoundedIcon,
      label: t.label
    }));
  }

  const items = customItems || configItems;
  const tabCount = items.length;

  const { indicatorRef, footerRef, triggerMove, indicatorStyles, slotWidth, SIDE_PADDING } = useNavigation({
    value,
    setValue,
    isMoving,
    setIsMoving,
    disabled,
    tabCount,
  });

  return (
    <footer className={styles.bottomFooter}>
      <div
        className={styles.footerRef}
        ref={footerRef}
        style={{ padding: `0 ${SIDE_PADDING}%` }}
      >
        <div
          className={styles.navIndicator}
          ref={indicatorRef}
          style={{
            ...indicatorStyles,
            cursor: disabled ? "default" : "grab",
          }}
        ></div>

        <div className={styles.navWrapper}>
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = value === item.key;
            return (
              <div
                key={item.key}
                onClick={() => triggerMove(value, item.key)}
                className={styles.navTabBtn}
                style={{ width: `${slotWidth}%` }}
              >
                <Icon
                  className={`${styles.navIcon} ${isActive ? styles.active : styles.inactive}`}
                />
                <div
                  className={`${styles.navLabel} ${isActive ? styles.active : styles.inactive}`}
                >
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
