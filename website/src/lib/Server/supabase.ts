const createQueryBuilder = (initialData: any = []) => {
  const builder: any = {
    data: initialData,
    error: null,
    select: () => builder,
    order: () => builder,
    eq: () => builder,
    limit: () => builder,
    single: () => Promise.resolve({ data: initialData?.[0] || null, error: null }),
    then: (resolve: any, reject: any) =>
      Promise.resolve({ data: initialData, error: null }).then(resolve, reject),
  };
  return builder;
};

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
  from: (table: string) => {
    const builder = createQueryBuilder([]);
    return {
      select: () => builder,
      insert: async (data: any[]) => {
        if (typeof window !== "undefined" && data?.[0]) {
          if (table === "lost_items") {
            window.dispatchEvent(new CustomEvent("festime-mock-post-lost", { detail: data[0] }));
          } else if (table === "news") {
            window.dispatchEvent(new CustomEvent("festime-mock-post-news", { detail: data[0] }));
          } else if (table === "questions") {
            window.dispatchEvent(new CustomEvent("festime-mock-ask-question", { detail: data[0] }));
          }
        }
        return { error: null };
      },
      update: (data: any) => ({
        eq: async (col: string, val: any) => {
          if (typeof window !== "undefined") {
            if (table === "lost_items") {
              window.dispatchEvent(new CustomEvent("festime-mock-update-lost", { detail: { id: val, ...data } }));
            } else if (table === "news") {
              window.dispatchEvent(new CustomEvent("festime-mock-update-news", {
                detail: { id: val, title: data.title, content: data.content, reason: data.edit_reason || "" }
              }));
            } else if (table === "questions") {
              window.dispatchEvent(new CustomEvent("festime-mock-reply-question", {
                detail: { id: val, answer: data.answer, edit_reason: data.edit_reason }
              }));
            }
          }
          return { error: null };
        },
      }),
      delete: () => ({
        eq: async (col: string, val: any) => {
          if (typeof window !== "undefined") {
            if (table === "lost_items") {
              window.dispatchEvent(new CustomEvent("festime-mock-delete-lost", { detail: { id: val } }));
            } else if (table === "news") {
              window.dispatchEvent(new CustomEvent("festime-mock-delete-news", { detail: { id: val } }));
            } else if (table === "questions") {
              window.dispatchEvent(new CustomEvent("festime-mock-delete-question", { detail: { id: val } }));
            }
          }
          return { error: null };
        },
      }),
    };
  },
  rpc: (fn: string) => {
    let mockData: any = null;
    if (fn === "get_vote_results_compressed") {
      mockData = [
        { c: "s", i: "01", v: 142 },
        { c: "s", i: "02", v: 98 },
        { c: "s", i: "03", v: 75 },
        { c: "s", i: "04", v: 43 },
        { c: "e", i: "31", v: 110 },
        { c: "e", i: "32", v: 89 },
        { c: "e", i: "33", v: 64 },
        { c: "e", i: "34", v: 52 },
      ];
    } else if (fn === "get_vote_results_summary") {
      mockData = [
        { rank: 1, category: "s", name: "ポップコーン (チームA)", votes: 142 },
        { rank: 2, category: "s", name: "チュロス (チームB)", votes: 98 },
        { rank: 3, category: "s", name: "たこ焼き (チームC)", votes: 75 },
        { rank: 4, category: "s", name: "焼き鳥 (チームD)", votes: 43 },
        { rank: 1, category: "e", name: "写真展示 (写真同好会)", votes: 110 },
        { rank: 2, category: "e", name: "フォトスポット (実行委員会)", votes: 89 },
        { rank: 3, category: "e", name: "学科展示 (学科)", votes: 64 },
        { rank: 4, category: "e", name: "ロボット展示 (メカ部)", votes: 52 },
      ];
    }
    const builder: any = {
      data: mockData,
      error: null,
      limit: () => builder,
      then: (resolve: any, reject: any) =>
        Promise.resolve({ data: mockData, error: null }).then(resolve, reject),
    };
    return builder;
  },
  channel: () => ({
    on: () => ({ subscribe: () => ({}) }),
  }),
};
