"use client";

import BoothModalManager from "@festime/features/booth/components/BoothModalManager";

import React, { createContext, useContext, ReactNode, useState, useEffect, useMemo, useCallback } from "react";
import { ConfigProvider, App, theme } from "antd";
import jaJP from "antd/lib/locale/ja_JP";
import dayjs, { Dayjs } from "dayjs";
import { I18nextProvider } from "react-i18next";
import i18n from "../i18n/i18n";
import DarkClick from "@festime/lib/Data/DarkClick";

export type StatusLevel = 0 | 1 | 2;

export interface StallStatus {
  id: number | string;
  stallName: string;
  crowdLevel: StatusLevel;
  stockLevel: StatusLevel;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  edit_reason?: string;
  created_at: string;
}

export interface QuestionItem {
  id: string;
  text: string;
  answer?: string;
  edit_reason?: string;
  is_published?: boolean;
  created_at: string;
}

export interface LostItem {
  id: string;
  name: string;
  place: string;
  photo_path?: string;
  edit_reason?: string;
  created_at: string;
}

const INITIAL_STALLS: StallStatus[] = [
  { id: 1, stallName: "ポップコーン", crowdLevel: 0, stockLevel: 0 },
  { id: 2, stallName: "チュロス", crowdLevel: 1, stockLevel: 1 },
  { id: 3, stallName: "たこ焼き", crowdLevel: 2, stockLevel: 0 },
  { id: 4, stallName: "焼き鳥", crowdLevel: 0, stockLevel: 0 },
];

const BASE_MOCK_TIME = "2026-05-27T10:15:00";

const INITIAL_NEWS: NewsItem[] = [
  {
    id: "1",
    title: "【完売】チョコバナナ",
    content: "模擬店 7 のチョコバナナは、好評につき完売いたしました。ありがとうございました。",
    created_at: dayjs(BASE_MOCK_TIME).subtract(5, "minute").toISOString(),
  },
  {
    id: "2",
    title: "イベントリマインド",
    content: "メインステージにて、オープニングセレモニーが進行中です！",
    created_at: dayjs(BASE_MOCK_TIME).subtract(30, "minute").toISOString(),
  },
];

const INITIAL_QUESTIONS: QuestionItem[] = [
  {
    id: "1",
    text: "体育館への行き方が難しい！",
    answer: "たしかに！",
    created_at: dayjs(BASE_MOCK_TIME).subtract(15, "minute").toISOString(),
    is_published: true,
  },
  {
    id: "2",
    text: "ゴミ箱の場所は？",
    answer: "たしかに！",
    created_at: dayjs(BASE_MOCK_TIME).subtract(40, "minute").toISOString(),
    is_published: true,
  },
];

const INITIAL_LOST_ITEMS: LostItem[] = [
  {
    id: "1",
    name: "黒い財布",
    place: "中庭ベンチ付近",
    photo_path: "",
    created_at: dayjs(BASE_MOCK_TIME).subtract(20, "minute").toISOString(),
  },
  {
    id: "2",
    name: "水色のタオルハンカチ",
    place: "第1体育館 入口",
    photo_path: "",
    created_at: dayjs(BASE_MOCK_TIME).subtract(45, "minute").toISOString(),
  },
];

const DEMO_CONFIG = {
  vote_start_at: dayjs("2026-05-27 09:00:00").unix(),
  vote_end_at: dayjs("2026-05-27 17:00:00").unix(),
  voting_enabled: 1,
  maintenance_mode: 0,
  poll_interval_ms: 30000,
};

const DataContext = createContext<any>(undefined);

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
};

export const RoleContext = createContext<any>(undefined);

export const useRole = () => {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within RoleProvider");
  return ctx;
};

export interface ThemeContextType {
  primaryColor: string;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  toggleDarkMode: () => void;
  localeLang: any;
  setLocaleLang: (val: any) => void;
  isPerformanceMode: boolean;
  setIsPerformanceMode: (val: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    return {
      primaryColor: "#1f1f1f",
      isDarkMode: false,
      setIsDarkMode: () => { },
      toggleDarkMode: () => { },
      localeLang: jaJP,
      setLocaleLang: () => { },
      isPerformanceMode: true,
      setIsPerformanceMode: () => { },
    };
  }
  return ctx;
};

const TimeContext = createContext<{ currentTime: Dayjs } | undefined>(undefined);

export const useAppTime = () => {
  const ctx = useContext(TimeContext);
  if (!ctx) throw new Error("useAppTime must be used within TimeProvider");
  return ctx;
};

export function MockProviders({ children }: { children: ReactNode }) {
  const [mockTime, setMockTime] = useState(() => dayjs(BASE_MOCK_TIME));
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const [stalls, setStalls] = useState<StallStatus[]>(INITIAL_STALLS);
  const [news, setNews] = useState<NewsItem[]>(INITIAL_NEWS);
  const [questions, setQuestions] = useState<QuestionItem[]>(INITIAL_QUESTIONS);
  const [lostItems, setLostItems] = useState<LostItem[]>(INITIAL_LOST_ITEMS);
  const [lastUpdated, setLastUpdated] = useState<number>(Date.now());

  useEffect(() => {
    const handleStallUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ stallName: string; updates: Partial<StallStatus> }>;
      const { stallName, updates } = customEvent.detail;
      setStalls((prev) =>
        prev.map((s) => {
          if (s.stallName === stallName) {
            return {
              ...s,
              crowdLevel: updates.crowdLevel !== undefined ? (updates.crowdLevel as StatusLevel) : s.crowdLevel,
              stockLevel: updates.stockLevel !== undefined ? (updates.stockLevel as StatusLevel) : s.stockLevel,
            };
          }
          return s;
        })
      );
      setLastUpdated(Date.now());
    };

    const handleNewsPost = (e: Event) => {
      const customEvent = e as CustomEvent<{ title: string; content: string }>;
      const { title, content } = customEvent.detail;
      const newItem: NewsItem = {
        id: String(Date.now()),
        title,
        content,
        created_at: dayjs().toISOString(),
      };
      setNews((prev) => [newItem, ...prev]);
      setLastUpdated(Date.now());
    };

    const handleNewsUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ id: string; title: string; content: string; reason: string }>;
      const { id, title, content, reason } = customEvent.detail;
      setNews((prev) =>
        prev.map((n) => (n.id === id ? { ...n, title, content, edit_reason: reason } : n))
      );
      setLastUpdated(Date.now());
    };

    const handleNewsDelete = (e: Event) => {
      const customEvent = e as CustomEvent<{ id: string }>;
      setNews((prev) => prev.filter((n) => n.id !== customEvent.detail.id));
      setLastUpdated(Date.now());
    };

    const handleAskQuestion = (e: Event) => {
      const customEvent = e as CustomEvent<{ text: string }>;
      const newQ: QuestionItem = {
        id: String(Date.now()),
        text: customEvent.detail.text,
        created_at: dayjs().toISOString(),
        is_published: true,
      };
      setQuestions((prev) => [newQ, ...prev]);
      setLastUpdated(Date.now());
    };

    const handleReplyQuestion = (e: Event) => {
      const customEvent = e as CustomEvent<{ id: string; answer: string; edit_reason?: string }>;
      const { id, answer, edit_reason } = customEvent.detail;
      setQuestions((prev) =>
        prev.map((q) => (q.id === id ? { ...q, answer, edit_reason } : q))
      );
      setLastUpdated(Date.now());
    };

    const handleDeleteQuestion = (e: Event) => {
      const customEvent = e as CustomEvent<{ id: string }>;
      setQuestions((prev) => prev.filter((q) => q.id !== customEvent.detail.id));
      setLastUpdated(Date.now());
    };

    const handleLostPost = (e: Event) => {
      const customEvent = e as CustomEvent<{ name: string; place: string; photo_path?: string }>;
      const { name, place, photo_path } = customEvent.detail;
      const newItem: LostItem = {
        id: String(Date.now()),
        name,
        place,
        photo_path,
        created_at: dayjs().toISOString(),
      };
      setLostItems((prev) => [newItem, ...prev]);
      setLastUpdated(Date.now());
    };

    const handleLostUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ id: string; name: string; place: string; reason: string; photo_path?: string }>;
      const { id, name, place, reason, photo_path } = customEvent.detail;
      setLostItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, name, place, edit_reason: reason, photo_path: photo_path ?? item.photo_path } : item))
      );
      setLastUpdated(Date.now());
    };

    const handleLostDelete = (e: Event) => {
      const customEvent = e as CustomEvent<{ id: string }>;
      setLostItems((prev) => prev.filter((item) => item.id !== customEvent.detail.id));
      setLastUpdated(Date.now());
    };

    window.addEventListener("festime-mock-update-stall", handleStallUpdate);
    window.addEventListener("festime-mock-post-news", handleNewsPost);
    window.addEventListener("festime-mock-update-news", handleNewsUpdate);
    window.addEventListener("festime-mock-delete-news", handleNewsDelete);
    window.addEventListener("festime-mock-ask-question", handleAskQuestion);
    window.addEventListener("festime-mock-reply-question", handleReplyQuestion);
    window.addEventListener("festime-mock-delete-question", handleDeleteQuestion);
    window.addEventListener("festime-mock-post-lost", handleLostPost);
    window.addEventListener("festime-mock-update-lost", handleLostUpdate);
    window.addEventListener("festime-mock-delete-lost", handleLostDelete);

    return () => {
      window.removeEventListener("festime-mock-update-stall", handleStallUpdate);
      window.removeEventListener("festime-mock-post-news", handleNewsPost);
      window.removeEventListener("festime-mock-update-news", handleNewsUpdate);
      window.removeEventListener("festime-mock-delete-news", handleNewsDelete);
      window.removeEventListener("festime-mock-ask-question", handleAskQuestion);
      window.removeEventListener("festime-mock-reply-question", handleReplyQuestion);
      window.removeEventListener("festime-mock-delete-question", handleDeleteQuestion);
      window.removeEventListener("festime-mock-post-lost", handleLostPost);
      window.removeEventListener("festime-mock-update-lost", handleLostUpdate);
      window.removeEventListener("festime-mock-delete-lost", handleLostDelete);
    };
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("festime_theme");
      if (stored === "dark") {
        setIsDarkMode(true);
        document.documentElement.setAttribute("data-theme", "dark");
        DarkClick(true);
      } else if (stored === "light") {
        setIsDarkMode(false);
        document.documentElement.setAttribute("data-theme", "light");
        DarkClick(false);
      } else {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setIsDarkMode(prefersDark);
        document.documentElement.setAttribute("data-theme", prefersDark ? "dark" : "light");
        DarkClick(prefersDark);
      }
    } catch {
    }
  }, []);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("festime_theme", next ? "dark" : "light");
        document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
        DarkClick(next);
      } catch {
      }
      return next;
    });
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDarkMode ? "dark" : "light");
    DarkClick(isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    const timer = setInterval(() => {
      setMockTime((prev) => prev.add(1, "second"));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const timeValue = useMemo(() => ({ currentTime: mockTime }), [mockTime]);

  const dataValue = useMemo(
    () => ({
      api: {
        fetchedData: {
          stalls,
          news,
          lostItems,
          questions,
          config: DEMO_CONFIG,
        },
        isLoading: false,
        isPosting: false,
        error: "",
        fetchData: async () => {
          setLastUpdated(Date.now());
        },
        handlePost: () => { },
        askQuestion: async () => { },
        lastUpdated,
        isStallsLive: true,
      },
      work: {},
    }),
    [stalls, news, lostItems, questions, lastUpdated]
  );

  const roleValue = {
    role: "user",
    setRole: () => { },
    isAdmin: false,
    isStallAdmin: false,
    assignedStall: null,
    isAuthenticating: false,
  };

  const themeValue = useMemo(
    () => ({
      primaryColor: isDarkMode ? "#f0f0f0" : "#1f1f1f",
      isDarkMode,
      setIsDarkMode,
      toggleDarkMode,
      localeLang: jaJP,
      setLocaleLang: () => { },
      isPerformanceMode: true,
      setIsPerformanceMode: () => { },
    }),
    [isDarkMode, toggleDarkMode]
  );

  return (
    <I18nextProvider i18n={i18n}>
      <TimeContext.Provider value={timeValue}>
        <DataContext.Provider value={dataValue}>
          <RoleContext.Provider value={roleValue}>
            <ThemeContext.Provider value={themeValue}>
              <ConfigProvider
                locale={jaJP}
                theme={{
                  algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
                  token: {
                    colorPrimary: themeValue.primaryColor,
                    colorInfo: themeValue.primaryColor,
                    zIndexPopupBase: 11000,
                  },
                  components: {
                    Select: {
                      selectorBg: isDarkMode ? "#1f1f1f" : "#ffffff",
                      colorBgElevated: isDarkMode ? "#1f1f1f" : "#ffffff",
                      colorText: isDarkMode ? "#f0f0f0" : "#1f1f1f",
                      colorTextPlaceholder: isDarkMode ? "#888888" : "#bfbfbf",
                      colorBorder: isDarkMode ? "#424242" : "#d9d9d9",
                      optionSelectedColor: isDarkMode ? "#000000" : "#ffffff",
                      optionSelectedBg: isDarkMode ? "#f0f0f0" : "#1f1f1f",
                      optionActiveBg: isDarkMode ? "#333333" : "#f5f5f5",
                    },
                    Radio: {
                      buttonSolidCheckedColor: isDarkMode ? "#000000" : "#ffffff",
                    },
                    Button: {
                      primaryColor: isDarkMode ? "#000" : "#fff",
                    },
                  },
                }}
              >
                <App>
                  {children}
                  <BoothModalManager />
                </App>
              </ConfigProvider>
            </ThemeContext.Provider>
          </RoleContext.Provider>
        </DataContext.Provider>
      </TimeContext.Provider>
    </I18nextProvider>
  );
}
