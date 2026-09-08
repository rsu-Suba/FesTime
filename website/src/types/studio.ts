export interface EventConfig {
  identity: {
    eventName: string;
    organizationName: string;
    appTitle: string;
    appDescription: string;
    eventStartDate: string;
    eventEndDate: string;
  };
  navigation: {
    homepageUrl: string;
    basePath: string;
  };
  theme: {
    primaryColor: { light: string; dark: string };
    backgroundColor: { light: string; dark: string };
    mainLogoPath: string;
  };
  api: {
    pollingIntervalMs: number;
    fullRefreshFrequency: number;
  };
  external: {
    gaId?: string;
  };
  features: {
    booth: boolean;
    vote: boolean;
    bus: boolean;
    qa: boolean;
    lost: boolean;
    exhibition: boolean;
    event: boolean;
    news: boolean;
    map: boolean;
    closedOverlay: boolean;
  };
  bus?: {
    defaultFromStop: string;
    defaultToStop: string;
    routeLabels?: Record<string, { ja: string; en: string }>;
  };
}

export interface BoothItem {
  id: number | string;
  name: string;
  team: string;
  place: string;
  menu: Array<{ content: string; price: number }>;
  image?: string;
}

export interface BusData {
  [routeKey: string]: {
    route: string[];
    time: string[][];
  };
}

export interface EventScheduleItem {
  name: string;
  start: string;
  end: string;
}

export interface EventsData {
  [dayKey: string]: EventScheduleItem[];
}

export interface SpotItem {
  id: string | number;
  location: string;
  name?: string;
  description?: string;
  lat?: number;
  lng?: number;
  area?: string;
  nearbyStalls?: number[];
  nearbyExhibitions?: number[];
  mapImg?: string | null;
}

export interface VoteItem {
  id: string;
  name: string;
  category: "s" | "e" | "o"; // s: stall, e: exhibition, o: other
}

export interface ExhibitionItem {
  id: number | string;
  name: string;
  team: string;
  place: string;
  image?: string;
}

export interface StudioJsonData {
  booth: BoothItem[];
  bus: BusData;
  events: EventsData;
  spots: SpotItem[];
  vote: VoteItem[];
  exhibitions: ExhibitionItem[];
}

export interface StudioLayoutConfig {
  user: {
    mobileTabs: {
      id: string;
      title: string;
      icon?: string;
      cards: string[];
    }[];
    pcColumns: {
      col4: string[][];
      col3: string[][];
      col2: string[][];
    };
  };
  admin: {
    mobileTabs: {
      id: string;
      title: string;
      icon?: string;
      cards: string[];
    }[];
    pcColumns: string[][];
  };
  stallAdmin: {
    mobileTabs: {
      id: string;
      title: string;
      icon?: string;
      cards: string[];
    }[];
    pcColumns: string[][];
  };
}

export type OsType = "mac" | "windows" | "linux" | "manual";

export interface EnvConfig {
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  NEXT_PUBLIC_ADMIN_EMAIL: string;
  NEXT_PUBLIC_BOOTH_ADMIN_EMAIL: string;
  NEXT_PUBLIC_BOOTH_ADMIN_PASSWORD: string;
  NEXT_PUBLIC_MOCK_TIME: string;
  NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: string;
}

export interface StudioState {
  currentStep: number;
  config: EventConfig;
  jsonData: StudioJsonData;
  layout: StudioLayoutConfig;
  osType: OsType;
  env: EnvConfig;
}

export const DEFAULT_CONFIG: EventConfig = {
  identity: {
    eventName: "",
    organizationName: "",
    appTitle: "",
    appDescription: "",
    eventStartDate: "",
    eventEndDate: "",
  },
  navigation: {
    homepageUrl: "",
    basePath: "/FesTime",
  },
  theme: {
    primaryColor: { light: "#1f1f1f", dark: "#f0f0f0" },
    backgroundColor: { light: "#ffffff", dark: "#18181a" },
    mainLogoPath: "",
  },
  api: {
    pollingIntervalMs: 30000,
    fullRefreshFrequency: 3,
  },
  external: {},
  features: {
    booth: true,
    vote: true,
    bus: true,
    qa: true,
    lost: true,
    exhibition: true,
    event: true,
    news: true,
    map: true,
    closedOverlay: false,
  },
};

export const DEFAULT_JSON_DATA: StudioJsonData = {
  booth: [
    {
      id: 1,
      name: "ポップコーン",
      team: "チームA",
      place: "テント番号1",
      menu: [{ content: "100g", price: 200 }],
      image: "",
    },
    {
      id: 2,
      name: "チュロス",
      team: "チームB",
      place: "テント番号2",
      menu: [{ content: "チョコ", price: 200 }],
      image: "",
    },
    {
      id: 3,
      name: "たこ焼き",
      team: "チームC",
      place: "テント3",
      menu: [{ content: "6個", price: 180 }],
      image: "",
    },
    {
      id: 4,
      name: "焼き鳥",
      team: "チームD",
      place: "テント4",
      menu: [
        { content: "1本", price: 150 },
        { content: "3本", price: 400 },
        { content: "5本", price: 750 },
      ],
      image: "",
    },
  ],
  bus: {
    Outbound: {
      route: ["キャンパス 発", "中央駅 着"],
      time: [
        ["08:00", "09:00", "10:00", "11:00"],
        ["08:30", "09:30", "10:30", "11:30"],
      ],
    },
    Inbound: {
      route: ["中央駅 発", "キャンパス 着"],
      time: [
        ["13:00", "14:00", "15:00", "16:00"],
        ["13:30", "14:30", "15:30", "16:30"],
      ],
    },
  },
  events: {
    day1: [
      { name: "オープニング", start: "10:00", end: "10:20" },
      { name: "カラオケ", start: "10:40", end: "11:10" },
      { name: "ライブステージ", start: "11:20", end: "11:30" },
    ],
    day2: [
      { name: "オープニング", start: "10:00", end: "10:05" },
      { name: "軽音楽部", start: "10:10", end: "12:10" },
      { name: "吹奏楽部", start: "12:30", end: "13:15" },
    ],
  },
  spots: [
    { id: "1F_NW", location: "校舎 1階 北西", nearbyStalls: [], nearbyExhibitions: [] },
    { id: "1F_NE", location: "校舎 1階 北東", nearbyStalls: [], nearbyExhibitions: [] },
    { id: "1F_SW", location: "校舎 1階 南西", nearbyStalls: [], nearbyExhibitions: [] },
    { id: "1F_SE", location: "校舎 1階 南東", nearbyStalls: [], nearbyExhibitions: [] },
    { id: "2F_NW", location: "校舎 2階 北西", nearbyStalls: [], nearbyExhibitions: [] },
    { id: "2F_NE", location: "校舎 2階 北東", nearbyStalls: [], nearbyExhibitions: [] },
    { id: "2F_SW", location: "校舎 2階 南西", nearbyStalls: [], nearbyExhibitions: [] },
    { id: "2F_SE", location: "校舎 2階 南東", nearbyStalls: [], nearbyExhibitions: [] },
    { id: "3F_NW", location: "校舎 3階 北西", nearbyStalls: [], nearbyExhibitions: [] },
    { id: "3F_NE", location: "校舎 3階 北東", nearbyStalls: [], nearbyExhibitions: [] },
    { id: "3F_SW", location: "校舎 3階 南西", nearbyStalls: [], nearbyExhibitions: [] },
    { id: "3F_SE", location: "校舎 3階 南東", nearbyStalls: [], nearbyExhibitions: [] },
    { id: "4F_W", location: "校舎 4階 北西", nearbyStalls: [], nearbyExhibitions: [] },
    { id: "4F_E", location: "校舎 4階 北東", nearbyStalls: [], nearbyExhibitions: [] },
    { id: "Library", location: "図書館", nearbyStalls: [], nearbyExhibitions: [] },
  ],
  vote: [
    { id: "31", name: "写真展示", category: "e" },
    { id: "32", name: "フォトスポット", category: "e" },
    { id: "33", name: "学科展示", category: "e" },
    { id: "34", name: "ロボット展示", category: "e" },
    { id: "01", name: "ポップコーン", category: "s" },
    { id: "02", name: "チュロス", category: "s" },
    { id: "03", name: "たこ焼き", category: "s" },
    { id: "04", name: "焼き鳥", category: "s" },
  ],
  exhibitions: [
    { id: 1, name: "写真展示", team: "写真同好会", place: "教室1", image: "" },
    { id: 2, name: "フォトスポット", team: "実行委員会", place: "フォトブース", image: "" },
    { id: 3, name: "学科展示", team: "学科", place: "教室", image: "" },
    { id: 4, name: "ロボット展示", team: "メカ部", place: "第1体育館", image: "" },
  ],
};

export const DEFAULT_LAYOUT: StudioLayoutConfig = {
  user: {
    mobileTabs: [
      { id: "main", title: "メイン", icon: "HomeRounded", cards: ["Header", "HotNews", "Events", "Vote", "News", "Lost"] },
      { id: "booth", title: "模擬店", icon: "StorefrontRounded", cards: ["BoothFav", "Booth"] },
      { id: "exhibition", title: "展示", icon: "VisibilityRounded", cards: ["Exhibition"] },
      { id: "info", title: "インフォ", icon: "WidgetsRounded", cards: ["InfoTitle", "Bus", "QA", "Homepage"] },
    ],
    pcColumns: {
      col4: [
        ["BoothFav", "Booth1"],
        ["Booth2"],
        ["Events", "Bus", "Vote", "Exhibition"],
        ["News", "QA", "Lost", "Homepage"],
      ],
      col3: [
        ["BoothFav", "Booth"],
        ["Events", "Bus", "Vote", "Exhibition"],
        ["News", "QA", "Lost", "Homepage"],
      ],
      col2: [
        ["HotNews", "BoothFav", "Booth", "Exhibition", "News"],
        ["Events", "Bus", "QA", "Lost", "Vote", "Homepage"],
      ],
    },
  },
  admin: {
    mobileTabs: [
      { id: "admin-news", title: "お知らせ管理", icon: "NewspaperRounded", cards: ["NewsManager"] },
      { id: "admin-qa", title: "Q&A管理", icon: "QuestionAnswerRounded", cards: ["QAManager"] },
      { id: "admin-lost", title: "落とし物管理", icon: "SearchRounded", cards: ["LostManager"] },
    ],
    pcColumns: [
      ["NewsManager"],
      ["QAManager"],
      ["LostManager"],
    ],
  },
  stallAdmin: {
    mobileTabs: [
      { id: "stall-main", title: "在庫・混雑更新", icon: "StorefrontRounded", cards: ["BoothManager"] },
      { id: "stall-news", title: "お知らせ", icon: "NewspaperRounded", cards: ["News"] },
    ],
    pcColumns: [
      ["BoothManager"],
      ["News"],
    ],
  },
};

export const DEFAULT_ENV: EnvConfig = {
  NEXT_PUBLIC_SUPABASE_URL: "",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "",
  NEXT_PUBLIC_ADMIN_EMAIL: "",
  NEXT_PUBLIC_BOOTH_ADMIN_EMAIL: "",
  NEXT_PUBLIC_BOOTH_ADMIN_PASSWORD: "",
  NEXT_PUBLIC_MOCK_TIME: "",
  NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: "",
};

export const DEFAULT_STUDIO_STATE: StudioState = {
  currentStep: 0,
  config: DEFAULT_CONFIG,
  jsonData: DEFAULT_JSON_DATA,
  layout: DEFAULT_LAYOUT,
  osType: "mac",
  env: DEFAULT_ENV,
};
