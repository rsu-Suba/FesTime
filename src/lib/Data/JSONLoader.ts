// Fetch and cache static JSON master data from public/data/

import { BASE_PATH } from "@/constants/paths";

export type JSONDataType = "booth" | "exhibitions" | "events" | "vote" | "bus" | "spots";

const cache: Partial<Record<JSONDataType, unknown>> = {};
const pendingRequests: Partial<Record<JSONDataType, Promise<unknown>>> = {};

// Load json from public/data/ and cache with in-memory.
// Concurrent requests for the same file are merged.
export const loadJSON = async <T = any>(type: JSONDataType): Promise<T> => {
  if (cache[type]) return cache[type] as T;
  if (pendingRequests[type]) return pendingRequests[type] as Promise<T>;

  const request = (async () => {
    try {
      const url = `${BASE_PATH || ""}/data/${type}.json`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to load ${type}.json (HTTP ${response.status})`);

      const data = await response.json();
      cache[type] = data;
      return data as T;
    } catch (error) {
      console.error(`[JSONLoader] Error loading ${type}:`, error);
      throw error;
    } finally {
      delete pendingRequests[type];
    }
  })();

  pendingRequests[type] = request;
  return request as Promise<T>;
};

