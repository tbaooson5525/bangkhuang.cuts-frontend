"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { Analytics } from "@vercel/analytics/next";
import { cn } from "@/lib/utils";
import { Header } from "@/components/shared/Header";
import { RightBar } from "@/components/shared/RightBar";
import SideBar, { MobileSidebar } from "@/components/shared/Sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDarkMode } from "@/context/DarkModeContext";
import { useUIState } from "@/hooks/useUIState";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isDark } = useDarkMode();
  const { sidebarCollapsed, rightBarCollapsed, toggleSidebar, toggleRightBar } =
    useUIState();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div
      className={cn(
        "min-h-screen grid grid-rows-[auto_1fr] h-screen overflow-hidden",
        isDark && "dark",
      )}
    >
      <Analytics />
      <div className='flex overflow-hidden'>
        <SideBar collapsed={sidebarCollapsed} />
        <MobileSidebar
          open={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
        />

        <div className='flex flex-col flex-1 min-w-0 bg-[#f9f9fa] dark:bg-[rgb(18,18,18)]'>
          <Header
            onMobileMenuToggle={() => setMobileSidebarOpen(true)}
            onSidebarToggle={toggleSidebar}
            onRightBarToggle={toggleRightBar}
          />
          <ScrollArea>
            <main className='flex-1 overflow-y-auto px-7 pt-6 pb-6'>
              {children}
            </main>
          </ScrollArea>
        </div>

        <RightBar collapsed={rightBarCollapsed} onToggle={toggleRightBar} />
      </div>
    </div>
  );
}
