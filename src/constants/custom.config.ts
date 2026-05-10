export interface EventConfig {
  identity: {
    eventName: string;
    organizationName: string;
    appTitle: string;
    appDescription: string;
  };
  
  navigation: {
    homepageUrl: string;
    basePath: string;
  };
  
  theme: {
    primaryColor: { light: string; dark: string; };
    backgroundColor: { light: string; dark: string; };
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
    vote: boolean;
    bus: boolean;
    qa: boolean;
    lost: boolean;
    exhibition: boolean;
    event: boolean;
    news: boolean;
    map: boolean;
  };

  // バス情報設定
  bus?: {
    defaultFromStop: string;
    defaultToStop: string;
    // ルートキーに対する多言語ラベル
    routeLabels: {
      [routeKey: string]: {
        ja: string;
        en: string;
      };
    };
    // 停留所名に対する多言語ラベル
    stopTranslations?: {
      [stopName: string]: {
        ja: string;
        en: string;
      };
    };
  };
}

export const CUSTOM_CONFIG: EventConfig = {
  identity: {
    eventName: "Event 2026",
    organizationName: "運営名",
    appTitle: "FesTime",
    appDescription: "リアルタイム混雑状況・投票・落とし物管理",
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

  external: {
    gaId: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
  },

  features: {
    vote: true,
    bus: true,
    qa: true,
    lost: true,
    exhibition: true,
    event: true,
    news: true,
    map: true,
  },

  bus: {
    defaultFromStop: "キャンパス 発",
    defaultToStop: "中央駅 着",
    routeLabels: {
      Outbound: { ja: "キャンパス 行", en: "To Campus" },
      Inbound: { ja: "中央駅 行", en: "To Central Station" },
    },
    stopTranslations: {
      "キャンパス 発": { ja: "キャンパス 発", en: "Campus (Dep.)" },
      "キャンパス 着": { ja: "キャンパス 着", en: "Campus (Arr.)" },
      "北駅 発": { ja: "北駅 発", en: "North St. (Dep.)" },
      "北駅 着": { ja: "北駅 着", en: "North St. (Arr.)" },
      "中央駅 発": { ja: "中央駅 発", en: "Central St. (Dep.)" },
      "中央駅 着": { ja: "中央駅 着", en: "Central St. (Arr.)" },
    }
  },
};
