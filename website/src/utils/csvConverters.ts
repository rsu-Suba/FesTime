import Papa from "papaparse";
import { BoothItem, BusData, EventsData, SpotItem, VoteItem } from "@/types/studio";

export function parseCsvToBooths(csvText: string): BoothItem[] {
  const result = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  const boothMap = new Map<string | number, BoothItem>();

  result.data.forEach((row, index) => {
    const id = row.id || row["ID"] || String(index + 1);
    const name = row.name || row["店名"] || row["模擬店名"] || row["企画名"] || "名称未設定";
    const team = row.team || row["団体名"] || row["クラス"] || row["出店団体"] || "";
    const place = row.place || row["場所"] || row["テント番号"] || row["ブース"] || "";
    const menuContent = row.menu || row["メニュー"] || row["商品名"] || "";
    const priceNum = parseInt(row.price || row["価格"] || row["値段"] || "0", 10) || 0;

    if (!boothMap.has(id)) {
      boothMap.set(id, {
        id: isNaN(Number(id)) ? id : Number(id),
        name,
        team,
        place,
        menu: menuContent ? [{ content: menuContent, price: priceNum }] : [],
      });
    } else {
      if (menuContent) {
        boothMap.get(id)!.menu.push({ content: menuContent, price: priceNum });
      }
    }
  });

  return Array.from(boothMap.values());
}

export function parseCsvToEvents(csvText: string): EventsData {
  const result = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  const events: EventsData = { day1: [], day2: [] };

  result.data.forEach((row) => {
    const dayKey = (row.day || row["日程"] || row["日"] || "day1").toLowerCase().includes("2") ? "day2" : "day1";
    const name = row.name || row["イベント名"] || row["演目"] || row["ステージ"] || "イベント";
    const start = row.start || row["開始時刻"] || row["開始"] || "10:00";
    const end = row.end || row["終了時刻"] || row["終了"] || "11:00";

    if (!events[dayKey]) events[dayKey] = [];
    events[dayKey].push({ name, start, end });
  });

  return events;
}

export function parseCsvToSpots(csvText: string): SpotItem[] {
  const result = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  return result.data.map((row, index) => {
    const nearbyStalls = (row.nearbyStalls || row["周辺模擬店"] || row["周辺模擬店ID"] || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map(Number)
      .filter((n) => !isNaN(n));
    const nearbyExhibitions = (row.nearbyExhibitions || row["周辺展示"] || row["周辺展示ID"] || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map(Number)
      .filter((n) => !isNaN(n));
    const loc = row.location || row["設置場所"] || row["場所"] || row.name || row["スポット名"] || `スポット ${index + 1}`;

    return {
      id: row.id || row["ID"] || String(index + 1),
      location: loc,
      nearbyStalls,
      nearbyExhibitions,
    };
  });
}

export function parseCsvToVotes(csvText: string): VoteItem[] {
  const result = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  return result.data.map((row, index) => {
    let cat: "s" | "e" | "o" = "s";
    const rawCat = (row.category || row["部門"] || row["区分"] || "s").toLowerCase();
    if (rawCat.includes("e") || rawCat.includes("展示")) cat = "e";
    else if (rawCat.includes("o") || rawCat.includes("その他") || rawCat.includes("有志")) cat = "o";

    return {
      id: row.id || row["ID"] || String(index + 1).padStart(2, "0"),
      name: row.name || row["項目名"] || row["企画名"] || "投票項目",
      category: cat,
    };
  });
}
