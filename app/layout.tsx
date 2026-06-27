import type { Metadata } from "next";
import { Cormorant_Garamond, Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  style: ["normal", "italic"],
});

const notoJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-noto-jp",
});

export const metadata: Metadata = {
  title: "Cael & Jiawen",
  description: "我们的小世界",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Cael",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${notoJP.variable}`}>
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body style={{ backgroundColor: "#ffffff" }}>{children}</body>
    </html>
  );
}
