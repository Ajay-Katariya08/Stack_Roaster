import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@wrksz/themes/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? process.env.NEXT_PUBLIC_SITE_URL.startsWith("http")
    ? process.env.NEXT_PUBLIC_SITE_URL
    : `https://${process.env.NEXT_PUBLIC_SITE_URL}`
  : process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Roast My Stack - The Brutal Developer Ego-Checker",
  description:
    "Drop your GitHub repo or package.json. Let AI Senior Architect Chad ruthlessly roast your tech stack, bad coding habits, and over-engineered architecture.",
  openGraph: {
    title: "Roast My Stack - The Brutal Developer Ego-Checker",
    description:
      "Drop your GitHub repo or package.json. Let AI Senior Architect Chad ruthlessly roast your tech stack.",
    url: "/",
    siteName: "Roast My Stack",
    images: [
      {
        url: "/api/og?score=94&archetype=The%20Resume-Driven%20Architect&emoji=%F0%9F%9B%B8&headline=You%20summoned%2042%20dependencies%20just%20to%20center%20a%20div.",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Roast My Stack - The Brutal Developer Ego-Checker",
    description:
      "Drop your GitHub repo or package.json. Let AI Senior Architect Chad ruthlessly roast your tech stack.",
    images: [
      "/api/og?score=94&archetype=The%20Resume-Driven%20Architect&emoji=%F0%9F%9B%B8&headline=You%20summoned%2042%20dependencies%20just%20to%20center%20a%20div.",
    ],
  },
  icons: {
    icon: [{ url: "/icon" }, { url: "/favicon.svg", type: "image/svg+xml" }],
    apple: "/apple-icon",
  },
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)] selection:bg-orange-500 selection:text-white transition-colors duration-200">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
