export type JSONDataType = 'booth' | 'exhibitions' | 'events' | 'vote' | 'bus' | 'spots'

const cache: Partial<Record<JSONDataType, unknown>> = {}

export const loadJSON = async <T = any>(type: JSONDataType): Promise<T> => {
  if (cache[type]) return cache[type] as T
  const res = await fetch(`/data/${type}.json`)
  if (!res.ok) throw new Error(`Failed to load ${type}.json`)
  const data = await res.json()
  cache[type] = data
  return data as T
}
