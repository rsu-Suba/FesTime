import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { jaTranslation } from "./locales/ja";
import { enTranslation } from "./locales/en";

const resources = {
  ja: {
    translation: jaTranslation,
  },
  en: {
    translation: enTranslation,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "ja",
    fallbackLng: "ja",
    defaultNS: "translation",
    ns: ["translation"],
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

if (i18n.language !== "ja") {
  i18n.changeLanguage("ja");
}

export default i18n;
