import type React from "react";
import type { Metadata, Viewport } from "next";
import "../styles/globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Providers from "@/components/shared/Provider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "bangkhuang.cuts",
  description: "Bạn hết 'bâng khuâng'chưa?",
  generator: "v0.dev",
};

const inter = Inter({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#EEEBDD",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen w-screen`}>
        <ThemeProvider
          attribute='class'
          defaultTheme='light'
          storageKey='darkMode'
        >
          <Providers>{children}</Providers>
          <Toaster position='top-right' richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
