import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { loadJSON } from "@/lib/Data/JSONLoader";
import { useAppTime } from "@/contexts/TimeContext";
import { CUSTOM_CONFIG } from "@/constants/custom.config";
import dayjs from "dayjs";

export interface BusTrip {
  time: string;
  arrivalTime: string;
  isoTime: string;
  routeTitle: string;
  direction: string;
}

export const useBusData = () => {
  const { i18n, t } = useTranslation();
  const [busData, setBusData] = useState<any>(null);
  const { currentTime } = useAppTime();

  const lang = (i18n.language?.startsWith("ja") ? "ja" : "en") as "ja" | "en";

  useEffect(() => {
    loadJSON("bus").then(setBusData);
  }, []);

  const allStops = useMemo(() => {
    if (!busData) return [];
    const stops = new Set<string>();
    Object.values(busData).forEach((route: any) => {
      route.route.forEach((s: string) => stops.add(s));
    });
    return Array.from(stops);
  }, [busData]);

  const nowTimeStr = currentTime.format("HH:mm");
  const oneHourLaterStr = currentTime.add(1, "hour").format("HH:mm");
  
  const defaultFrom = CUSTOM_CONFIG.bus?.defaultFromStop || "";
  const defaultTo = CUSTOM_CONFIG.bus?.defaultToStop || "";

  const [fromStop, setFromStop] = useState(defaultFrom);
  const [toStop, setToStop] = useState(defaultTo);
  const [filterMode, setFilterMode] = useState<"hour" | "all">("hour");

  useEffect(() => {
      if (!fromStop && defaultFrom) setFromStop(defaultFrom);
      if (!toStop && defaultTo) setToStop(defaultTo);
  }, [defaultFrom, defaultTo]);

  const normalizeTime = (t: string) => {
    if (!t) return "";
    const [h, m] = t.split(":");
    return `${h.padStart(2, "0")}:${m.padStart(2, "0")}`;
  };

  const filteredBuses = useMemo(() => {
    if (!busData) return [];
    const results: BusTrip[] = [];
    
    Object.keys(busData).forEach((routeKey) => {
      const routeData = busData[routeKey];
      const fromIdx = routeData.route.indexOf(fromStop);
      const toIdx = routeData.route.indexOf(toStop);

      if (fromIdx !== -1 && toIdx !== -1 && fromIdx < toIdx) {
        routeData.time[fromIdx].forEach((time: string, tripIndex: number) => {
          const arrivalTime = routeData.time[toIdx][tripIndex];

          if (time && arrivalTime) {
            const isoTime = normalizeTime(time);
            const isUpcoming = isoTime > nowTimeStr;
            const isWithinHour = isUpcoming && isoTime <= oneHourLaterStr;

            if (filterMode === "all" || isWithinHour) {
              // CUSTOM_CONFIG から現在の言語のラベルを取得
              const label = CUSTOM_CONFIG.bus?.routeLabels[routeKey]?.[lang] || routeKey;

              results.push({
                time,
                arrivalTime,
                isoTime,
                routeTitle: label,
                direction: routeKey,
              });
            }
          }
        });
      }
    });

    return results.sort((a, b) => a.isoTime.localeCompare(b.isoTime));
  }, [busData, fromStop, toStop, nowTimeStr, oneHourLaterStr, filterMode, lang]);

  const stopOptions = allStops
    .filter((s) => s.includes("発") || s.includes("着") || s.includes("Dep") || s.includes("Arr"))
    .map((s) => ({
      value: s,
      // CUSTOM_CONFIG.bus.stopTranslations に定義があればそれを使用、なければ生の値を表示
      label: CUSTOM_CONFIG.bus?.stopTranslations?.[s]?.[lang] || s,
    }));

  const isInHourRange = (bus: BusTrip) => {
    const isUpcoming = bus.isoTime > nowTimeStr;
    return isUpcoming && bus.isoTime <= oneHourLaterStr;
  };

  const newIndexMap = useMemo(() => {
    if (filterMode !== "all") return new Map<string, number>();
    const map = new Map<string, number>();
    let i = 0;
    for (const bus of filteredBuses) {
      if (!isInHourRange(bus)) {
        map.set(bus.isoTime, i++);
      }
    }

    return map;
  }, [filteredBuses, filterMode, nowTimeStr, oneHourLaterStr]);

  return {
    busData,
    fromStop,
    setFromStop,
    toStop,
    setToStop,
    filterMode,
    setFilterMode,
    filteredBuses,
    stopOptions,
    nowTimeStr,
    newIndexMap,
    isInHourRange,
  };
};
