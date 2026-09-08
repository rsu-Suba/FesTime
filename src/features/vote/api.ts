// Voting API with anonymous voter ID generation and client rate limiting
import { supabase } from "@/lib/Server/supabase";
import { getCookie, setCookie } from "@/lib/Server/Cookie";

// Retrieve or generate a unique voter UUID, synced between LocalStorage and Cookies
export const getVoterId = async () => {
  if (typeof window === "undefined") return "";

  const COOKIE_NAME = "voter_id_v2";

  let localId = localStorage.getItem("voter_id");
  const cookieId = getCookie(COOKIE_NAME);

  if (!localId && cookieId) {
    localId = cookieId;
    localStorage.setItem("voter_id", localId);
  } else if (localId && !cookieId) {
    setCookie(COOKIE_NAME, localId, 365);
  } else if (!localId && !cookieId) {
    localId = crypto.randomUUID();
    localStorage.setItem("voter_id", localId);
    setCookie(COOKIE_NAME, localId, 365);
  }

  return localId || "";
};

// Submit a vote with client-side rate limiting (max 5 votes per minute)
export const submitVote = async (targetId: string, category: string) => {
  const RATE_LIMIT_KEY = "vote_timestamps";
  const WINDOW_MS = 60 * 1000;
  const MAX_VOTES = 5;

  const now = Date.now();
  const stored = localStorage.getItem(RATE_LIMIT_KEY);
  let timestamps: number[] = stored ? JSON.parse(stored) : [];
  timestamps = timestamps.filter((t) => now - t < WINDOW_MS);

  if (timestamps.length >= MAX_VOTES) {
    throw new Error("投票のリクエストが多すぎます。しばらく待ってから再度お試しください。");
  }

  const voterId = await getVoterId();
  const userAgent = typeof window !== "undefined" ? navigator.userAgent : "";

  const { data, error } = await supabase.rpc("vote_for_target", {
    p_voter_id: voterId,
    p_target_id: targetId,
    p_category: category,
    p_user_agent: userAgent,
  });

  if (error) {
    console.error("[Vote] Supabase RPC Error:", error);
    throw new Error(error.message || "Failed to submit vote");
  }

  timestamps.push(now);
  localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(timestamps));

  return { success: true, data };
};

// Fetch votes cast by the current voter
export const getMyVotes = async (voterId: string) => {
  const { data, error } = await supabase.rpc("get_my_votes", {
    p_voter_id: voterId,
  });
  if (error) {
    console.error("[Vote] getMyVotes Error:", error);
    throw new Error(error.message || "Failed to fetch my votes");
  }
  return data as { category: string; target_id: string }[];
};

// Clear voter ID from storage and cookies (for testing / reset)
export const clearVoterId = () => {
  if (typeof window === "undefined") return;
  const COOKIE_NAME = "voter_id_v2";
  localStorage.removeItem("voter_id");
  localStorage.removeItem("voted_items");
  document.cookie = `${COOKIE_NAME}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

// Fetch compressed vote rankings/results for display
export const getVoteResults = async () => {
  const { data, error } = await supabase.rpc("get_vote_results_compressed");
  if (error) throw error;
  return data;
};

// Export raw vote data (admin only)
export const exportVoteData = async () => {
  const { data, error } = await supabase.rpc("export_vote_data");
  if (error) throw error;
  return data;
};

// Fetch summary of voting results
export const getVoteResultsSummary = async () => {
  const { data, error } = await supabase.rpc("get_vote_results_summary");
  if (error) throw error;
  return data;
};

// Audit potential duplicate/suspicious voting activities
export const auditSuspiciousVotes = async () => {
  const { data, error } = await supabase.rpc("audit_suspicious_votes");
  if (error) throw error;
  return data;
};

