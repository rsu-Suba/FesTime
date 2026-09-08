import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import WidgetsRoundedIcon from "@mui/icons-material/WidgetsRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import NewspaperRoundedIcon from "@mui/icons-material/NewspaperRounded";
import QuestionAnswerRoundedIcon from "@mui/icons-material/QuestionAnswerRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import EventNoteRoundedIcon from "@mui/icons-material/EventNoteRounded";
import DirectionsBusRoundedIcon from "@mui/icons-material/DirectionsBusRounded";
import LocalCafeRoundedIcon from "@mui/icons-material/LocalCafeRounded";
import CameraAltRoundedIcon from "@mui/icons-material/CameraAltRounded";
import FastfoodRoundedIcon from "@mui/icons-material/FastfoodRounded";
import TheaterComedyRoundedIcon from "@mui/icons-material/TheaterComedyRounded";

export const AVAILABLE_ICONS = {
  HomeRounded: { component: HomeRoundedIcon, label: "ホーム" },
  StorefrontRounded: { component: StorefrontRoundedIcon, label: "お店" },
  VisibilityRounded: { component: VisibilityRoundedIcon, label: "展示" },
  WidgetsRounded: { component: WidgetsRoundedIcon, label: "ウィジェット" },
  NewspaperRounded: { component: NewspaperRoundedIcon, label: "ニュース" },
  QuestionAnswerRounded: { component: QuestionAnswerRoundedIcon, label: "Q&A" },
  SearchRounded: { component: SearchRoundedIcon, label: "検索/虫眼鏡" },
  MapRounded: { component: MapRoundedIcon, label: "マップ" },
  InfoRounded: { component: InfoRoundedIcon, label: "情報" },
  EventNoteRounded: { component: EventNoteRoundedIcon, label: "イベント" },
  DirectionsBusRounded: { component: DirectionsBusRoundedIcon, label: "バス" },
  LocalCafeRounded: { component: LocalCafeRoundedIcon, label: "カフェ" },
  FastfoodRounded: { component: FastfoodRoundedIcon, label: "飲食" },
  CameraAltRounded: { component: CameraAltRoundedIcon, label: "写真" },
  TheaterComedyRounded: { component: TheaterComedyRoundedIcon, label: "ステージ" },
  MoreHorizRounded: { component: MoreHorizRoundedIcon, label: "その他" },
  SettingsRounded: { component: SettingsRoundedIcon, label: "設定" },
};

export type IconName = keyof typeof AVAILABLE_ICONS;
