import { Switch } from "antd";
import { useTheme } from "@/contexts/ThemeContext";

export default function DarkSwitch() {
   const theme = useTheme();
   if (!theme) return null;
   const { isDarkMode, setIsDarkMode } = theme;

   return <Switch checked={isDarkMode} onChange={(checked) => setIsDarkMode(checked)} />;
}
