// Authentication API for Admin and Booth Admin
import { supabase } from "@/lib/Server/supabase";

// Singleton promise to prevent concurrent duplicate login requests
let loginPromise: Promise<any> | null = null;

const loginWithEmailPassword = async (email: string | undefined, password: string, roleName: string) => {
  if (!email) throw new Error(`${roleName} email is not configured`);
  if (!password) throw new Error(`${roleName} password is not configured`);

  const { data: sessionData } = await supabase.auth.getSession();
  if (sessionData.session?.user.email === email) {
    return { user: sessionData.session.user };
  }

  if (loginPromise) return loginPromise;

  loginPromise = supabase.auth
    .signInWithPassword({ email, password })
    .then((res) => {
      loginPromise = null;
      if (res.error) throw res.error;
      return res.data;
    })
    .catch((err) => {
      loginPromise = null;
      throw err;
    });
  return loginPromise;
};

// Authenticate as overall admin using password
export const loginAsAdmin = (password: string) =>
  loginWithEmailPassword(process.env.NEXT_PUBLIC_ADMIN_EMAIL, password, "Admin");

// Authenticate as booth admin using configured credentials
export const loginAsStallAdmin = (password: string) =>
  loginWithEmailPassword(process.env.NEXT_PUBLIC_BOOTH_ADMIN_EMAIL, password, "Booth admin");

// Fetch current Supabase auth session
export const fetchSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error("Session fetch error:", error);
    return null;
  }
  return data.session;
};

