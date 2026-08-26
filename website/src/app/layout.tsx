import type { Metadata } from "next";
import { MockProviders } from "@/mock/MockProviders";
import { MobileMenuProvider } from "@/contexts/MobileMenuContext";
import { ScrollToTop } from "@/components/ScrollToTop";
import "@/styles/website.css";
import "@festime/styles/global-app.css";

export const metadata: Metadata = {
  title: "FesTime - 文化祭・イベント向けリアルタイム情報共有フレームワーク",
  description: "文化祭や学園祭をリアルタイムに。模擬店の混雑状況、オンライン投票、タイムテーブル、バス案内まで、すべてが揃ったオールインワン・オープンソース・フレームワーク。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <MobileMenuProvider>
          <MockProviders>
            <ScrollToTop />
            {children}
          </MockProviders>
        </MobileMenuProvider>
      </body>
    </html>
  );
}
