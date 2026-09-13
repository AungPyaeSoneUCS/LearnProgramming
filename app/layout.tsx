import type { Metadata, Viewport } from "next";
import { Geist, Noto_Sans_Myanmar } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const notoMyanmar = Noto_Sans_Myanmar({
  variable: "--font-noto-myanmar",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

import { ThemeScript } from "@/components/site/theme";
import { SiteHeader } from "@/components/site/SiteHeader";

export const metadata: Metadata = {
  metadataBase: new URL("https://takkatho.dev"),
  title: {
    default: "Myanmar Programming Learning Platform",
    template: "%s",
  },
  description:
    "လေ့လာပါ မြန်မာဘာသာဖြင့် programming သင်ခန်းစာများ။ TypeScript, WebSocket, Git, Web Performance, Software Architecture နှင့် Database များကို ကျွမ်းကျင်အောင် သင်ယူပါ။",
  keywords: [
    "Myanmar programming",
    "မြန်မာ programming",
    "TypeScript Myanmar",
    "WebSocket Myanmar",
    "Git Myanmar",
    "Database Myanmar",
    "Software Architecture Myanmar",
    "Web Performance Myanmar",
    "programming course Myanmar",
    "tech education Myanmar",
  ],
  openGraph: {
    type: "website",
    locale: "my_MM",
    alternateLocale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Myanmar Programming Learning Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
    other: [{ rel: "mask-icon", url: "/safari-pinned-tab.svg" }],
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#111827",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="my"
      className={`${geist.variable} ${notoMyanmar.variable} scroll-smooth`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-screen antialiased">
        <SiteHeader />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}