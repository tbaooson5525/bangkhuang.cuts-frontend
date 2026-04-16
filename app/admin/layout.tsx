"use client";
import SideBar from "@/components/sidebar";
import { usePathname } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <div className='min-h-screen bg-[#EEEBDD] grid grid-rows-[auto_1fr] h-screen overflow-hidden'>
      <Analytics />
      <div className='flex overflow-hidden'>
        {pathname !== "/admin/login" ? <SideBar /> : null}
        <main className='flex-1 overflow-y-auto no-scrollbar px-3 my-2'>
          {children}
        </main>
      </div>
    </div>
  );
}
