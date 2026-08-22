// Supply data received from the server to the entire app

"use client";

import React, { useState, useEffect, useRef } from "react";
import { DataContext, DataContextType } from "./DataContext";
import { fetchAllData } from "@/lib/Server/baseApi";
import { askQuestion as askQuestionApi } from "@/features/qa/api";
import { fetchStallsOnly } from "@/features/booth/api";
import { StallStatus } from "@/features/booth/types";
import { NewsItem } from "@/features/news/types";
import { LostItem } from "@/features/lost/types";
import { Question } from "@/features/qa/types";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { usePathname, useSearchParams } from "next/navigation";
import { useMapControl } from "@/contexts/MapContext";
import { loadJSON } from "@/lib/Data/JSONLoader";
import { CUSTOM_CONFIG } from "@/constants/custom.config";

dayjs.extend(customParseFormat);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const mapControl = useMapControl();

  const isMapOpen = mapControl?.isMapOpen || false;
  const isBoothModalOpen = !!searchParams.get("booth-info");
  const isAdminPage = pathname?.includes("/admin") || pathname?.includes("/booth");
  const isSuspended = isMapOpen || isBoothModalOpen;

  const [isLoading, setIsLoading] = useState(!isSuspended);
  const [stalls, setStalls] = useState<StallStatus[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [lostItems, setLostItems] = useState<LostItem[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [config, setConfig] = useState<Record<string, number | null>>({});
  const [lastUpdated, setLastUpdated] = useState<number>(Date.now());
  const [isStallsLive] = useState(false);

  const [isJSONLoaded, setIsJSONLoaded] = useState(false);
  const staticStallNameMap = useRef<Record<number | string, string>>({});

  // Load static booth master data
  useEffect(() => {
    loadJSON("booth").then((data: any[]) => {
      data.forEach((s) => {
        if (s.id) staticStallNameMap.current[s.id] = s.name;
      });
      setIsJSONLoaded(true);
    });
  }, []);

  const isSuspendedRef = useRef(isSuspended);
  useEffect(() => {
    isSuspendedRef.current = isSuspended;
  }, [isSuspended]);

  const isInitialRefreshStarted = useRef(false);
  const refreshCycle = useRef(0);
  const lastFetchTime = useRef(0);

  const parseCompactDate = (compactDateStr: string) => {
    if (!compactDateStr) return new Date().toISOString();
    const currentYear = new Date().getFullYear();
    const parsed = dayjs(`${currentYear}${compactDateStr}`, "YYYYMMDDHHmm");
    return parsed.toISOString();
  };

  const performRefresh = async (forceFull = false) => {
    if (isSuspendedRef.current && !forceFull) {
      return;
    }

    const fullRefreshFreq = CUSTOM_CONFIG.api.fullRefreshFrequency || 3;
    const isFullRefresh = forceFull || refreshCycle.current % fullRefreshFreq === 0;
    const currentInterval = config.poll_interval_ms || CUSTOM_CONFIG.api.pollingIntervalMs || 30000;
    const ttl = forceFull ? 0 : Math.max(0, currentInterval - 1000);

    if (!isFullRefresh && !CUSTOM_CONFIG.features.booth) {
      refreshCycle.current = (refreshCycle.current + 1) % 24;
      return;
    }

    try {
      const allData = isFullRefresh
        ? await fetchAllData(ttl)
        : await fetchStallsOnly(ttl);

      if (allData) {
        lastFetchTime.current = Date.now();
        setLastUpdated(Date.now());

        // Update stalls
        if (allData.s && CUSTOM_CONFIG.features.booth) {
          setStalls(
            allData.s
              .map((row: any) => {
                const id = row.i;
                const name = staticStallNameMap.current[id] || row.n;
                if (!name) return null;

                return {
                  id: id,
                  stallName: name,
                  crowdLevel: row.c,
                  stockLevel: row.l,
                };
              })
              .filter((s: StallStatus | null): s is StallStatus => s !== null),
          );
        }

        // Update news, lost items, QA, and config on full refresh
        if (isFullRefresh) {
          if (allData.n && CUSTOM_CONFIG.features.news) {
            setNews(
              allData.n.map((row: any) => ({
                id: row.i,
                title: row.t,
                content: row.c,
                created_at: parseCompactDate(row.a),
                edit_reason: row.r,
              })),
            );
          }
          if (allData.l && CUSTOM_CONFIG.features.lost) {
            setLostItems(
              allData.l.map((row: any) => ({
                id: row.i,
                name: row.n,
                place: row.p,
                photo_path: row.f,
                created_at: parseCompactDate(row.a),
                edit_reason: row.r,
              })),
            );
          }
          if (allData.q && CUSTOM_CONFIG.features.qa) {
            setQuestions(
              allData.q.map((row: any) => ({
                id: row.i,
                text: row.t,
                answer: row.w,
                created_at: parseCompactDate(row.a),
                edit_reason: row.r,
              })),
            );
          }
          if (allData.config) setConfig(allData.config);
        }
      }
    } catch (e: any) {
      console.error("[DataProvider] Refresh Error:", e?.message || e);
    } finally {
      setIsLoading(false);
      refreshCycle.current = (refreshCycle.current + 1) % 24;
    }
  };

  // Initial fetch
  useEffect(() => {
    if (isInitialRefreshStarted.current || !isJSONLoaded) return;
    const shouldFetchImmediately = isAdminPage || !isSuspended;
    if (!shouldFetchImmediately) return;

    isInitialRefreshStarted.current = true;
    performRefresh(true);
  }, [isSuspended, isJSONLoaded, isAdminPage]);

  // Refetch when tab becomes visible if polling is enabled
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const now = Date.now();
        const diff = now - lastFetchTime.current;
        const currentInterval = config.poll_interval_ms || CUSTOM_CONFIG.api.pollingIntervalMs || 30000;
        if (currentInterval > 0 && diff > currentInterval && !isSuspended) {
          performRefresh(false);
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isSuspended, config.poll_interval_ms]);

  // Periodic polling (only when pollingIntervalMs > 0)
  useEffect(() => {
    const interval = config.poll_interval_ms ?? CUSTOM_CONFIG.api.pollingIntervalMs;
    if (!interval || interval <= 0 || isSuspended) return;

    const jitter = Math.floor(Math.random() * 2000);
    const timer = setInterval(() => performRefresh(false), interval + jitter);
    return () => clearInterval(timer);
  }, [isSuspended, config.poll_interval_ms]);

  const value: DataContextType = {
    api: {
      fetchedData: { stalls, news, lostItems, questions, config },
      isLoading,
      isPosting: false,
      error: "",
      fetchData: async () => performRefresh(true),
      handlePost: () => {},
      askQuestion: async (text: string) => {
        if (!CUSTOM_CONFIG.features.qa) {
          console.warn("[DataProvider] askQuestion is disabled in CUSTOM_CONFIG");
          return;
        }
        await askQuestionApi(text);
      },
      lastUpdated,
      isStallsLive,
    },
    work: {} as any,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};