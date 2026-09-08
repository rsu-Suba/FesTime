import type { Metadata } from "next";
import { MockProviders } from "@/mock/MockProviders";
import { MobileMenuProvider } from "@/contexts/MobileMenuContext";
import { ScrollToTop } from "@/components/docs/ScrollToTop";
import { DocsTitleManager } from "@/components/docs/DocsTitleManager";
import "@/styles/website.css";
import "@festime/styles/global-app.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://festime.suba.pro"),
  title: {
    default: "FesTime - Realtime Event Framework",
    template: "%s | FesTime",
  },
  description: "All-in-one real-time web application framework for school festivals and events. Crowd tracking, live voting, timetable, and interactive maps.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/FesTimeIcon2.svg", type: "image/svg+xml" },
    ],
    apple: "/FesTimeIcon2.svg",
  },
  openGraph: {
    title: "Start fast with FesTime",
    description: "All-in-one real-time web application framework for school festivals and events.",
    url: "https://festime.suba.pro",
    siteName: "FesTime",
    images: [
      {
        url: "/ogp.png",
        width: 1200,
        height: 630,
        alt: "Start fast with FesTime",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Start fast with FesTime",
    description: "All-in-one real-time web application framework for school festivals and events.",
    images: ["/ogp.png"],
  },
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
            <DocsTitleManager />
            {children}
          </MockProviders>
        </MobileMenuProvider>
      </body>
    </html>
  );
}
