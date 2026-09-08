import { createClient } from "@supabase/supabase-js";

const getValidUrl = (url?: string) => {
  if (!url) return "https://placeholder.supabase.co";
  const withProtocol = /^https?:\/\//i.test(url) ? url : `https://${url}`;
  try {
    new URL(withProtocol);
    return withProtocol;
  } catch {
    return "https://placeholder.supabase.co";
  }
};

const supabaseUrl = getValidUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn("[Supabase] Environment variables for Supabase are missing.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);

