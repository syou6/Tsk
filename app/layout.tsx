import type { Metadata } from "next";
import "@/styles/globals.css";
import { siteConfig } from "@/lib/siteConfig";
import { AppProviders } from "./providers";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.hero.subheading,
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
