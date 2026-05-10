import { createContext, useContext, useState, useMemo, useEffect, ReactNode, Dispatch, SetStateAction } from "react";
import { ConfigProvider, theme } from "antd";
import enUS from "antd/lib/locale/en_US";
import jaJP from "antd/lib/locale/ja_JP";
import { useTranslation } from "react-i18next";
import { getCookie, setCookie } from "@/lib/Server/Cookie";
import { CUSTOM_CONFIG } from "@/constants/custom.config";
import DarkClick from "@/lib/Data/DarkClick";

type ThemeContextType = {
    primaryColor: string;
    isDarkMode: boolean;
    setIsDarkMode: Dispatch<SetStateAction<boolean>>;
    localeLang: typeof jaJP | typeof enUS;
    setLocaleLang: Dispatch<SetStateAction<typeof jaJP | typeof enUS>>;
    isPerformanceMode: boolean;
    setIsPerformanceMode: Dispatch<SetStateAction<boolean>>;
};

type ThemeProviderProps = {
    children: ReactNode;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
    const { i18n } = useTranslation();
    const primaryColor = CUSTOM_CONFIG.theme.primaryColor.light;
    const darkPrimaryColor = CUSTOM_CONFIG.theme.primaryColor.dark;
    const { defaultAlgorithm, darkAlgorithm } = theme;

    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== "undefined") return getCookie("dark") === "true";
        return false;
    });

    const [isPerformanceMode, setIsPerformanceMode] = useState(true);
    const [localeLang, setLocaleLang] = useState(i18n.languages[0] == "ja" ? jaJP : enUS);

    useEffect(() => {
        const root =
            (document.getElementById("app-root") as HTMLElement) || (document.querySelector(":root") as HTMLElement);

        DarkClick(isDarkMode);
        setCookie("dark", isDarkMode.toString(), 7);

        if (root) {
            root.style.setProperty("--main-color", isDarkMode ? darkPrimaryColor : primaryColor);
        }

        let meta = document.querySelector('meta[name="theme-color"]');
        if (!meta) {
            meta = document.createElement("meta");
            meta.setAttribute("name", "theme-color");
            document.head.appendChild(meta);
        }
        meta.setAttribute("content", isDarkMode ? CUSTOM_CONFIG.theme.backgroundColor.dark : CUSTOM_CONFIG.theme.backgroundColor.light);
    }, [isDarkMode, darkPrimaryColor, primaryColor]);

    const themeValue = useMemo(() => {
        const currentPrimary = isDarkMode ? darkPrimaryColor : primaryColor;
        return {
            primaryColor: currentPrimary,
            isDarkMode,
            setIsDarkMode,
            localeLang,
            setLocaleLang,
            isPerformanceMode,
            setIsPerformanceMode,
        };
    }, [isDarkMode, localeLang, isPerformanceMode, darkPrimaryColor, primaryColor]);

    return (
        <ThemeContext.Provider value={themeValue}>
            <ConfigProvider
                locale={localeLang}
                theme={{
                    algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
                    token: {
                        colorPrimary: themeValue.primaryColor,
                        colorInfo: themeValue.primaryColor,
                        zIndexPopupBase: 11000,
                    },
                    components: {
                        Select: {
                            optionSelectedColor: isDarkMode ? "#000000" : "#ffffff",
                            optionSelectedBg: isDarkMode ? (CUSTOM_CONFIG.theme.primaryColor.dark === "#f0f0f0" ? "#f0f0f0" : darkPrimaryColor) : primaryColor,
                        },
                        Radio: {
                            buttonSolidCheckedColor: isDarkMode ? "#000000" : "#ffffff",
                        },
                        Button: {
                            primaryColor: isDarkMode ? "#000" : "#fff",
                        },
                    },
                }}
            >
                {children}
            </ConfigProvider>
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
