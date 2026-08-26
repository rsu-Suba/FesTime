export const supabase: any = {
  auth: {
    getSession: async () => ({ data: { session: null } }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signOut: async () => {},
  },
  storage: {
    from: (_bucket: string) => ({
      upload: async (_path: string, _file: any) => ({ error: null }),
      getPublicUrl: (_path: string) => ({ data: { publicUrl: "" } }),
    }),
  },
  from: (table: string) => ({
    select: () => ({
      data: [],
      error: null,
      order: () => ({ data: [], error: null }),
      eq: () => ({ data: [], error: null }),
    }),
    insert: async (data: any[]) => {
      if (typeof window !== "undefined" && table === "lost_items" && data?.[0]) {
        window.dispatchEvent(new CustomEvent("festime-mock-post-lost", { detail: data[0] }));
      }
      return { error: null };
    },
    update: (data: any) => ({
      eq: async (col: string, val: any) => {
        if (typeof window !== "undefined" && table === "lost_items") {
          window.dispatchEvent(new CustomEvent("festime-mock-update-lost", { detail: { id: val, ...data } }));
        }
        return { error: null };
      },
    }),
    delete: () => ({
      eq: async (col: string, val: any) => {
        if (typeof window !== "undefined" && table === "lost_items") {
          window.dispatchEvent(new CustomEvent("festime-mock-delete-lost", { detail: { id: val } }));
        }
        return { error: null };
      },
    }),
  }),
  rpc: async () => ({ data: null, error: null }),
  channel: () => ({
    on: () => ({ subscribe: () => ({}) }),
  }),
};
