"use client";

import {
  Menu,
  Search,
  Sun,
  Moon,
  Bell,
  RotateCcw,
  PanelLeft,
  PanelRight,
  Star,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { useDarkMode } from "@/context/DarkModeContext";

interface HeaderProps {
  onMobileMenuToggle: () => void;
  onSidebarToggle: () => void;
  onRightBarToggle: () => void;
}

const ROUTE_LABELS: Record<string, string> = {
  admin: "Admin",
  dashboard: "Dashboard",
  services: "Dịch vụ",
  schedule: "Lịch hẹn",
  staffs: "Nhân viên",
  gallery: "Gallery",
  settings: "Cài đặt",
};

function useBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  return segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const label = ROUTE_LABELS[segment] ?? segment;
    const isLast = index === segments.length - 1;
    return { label, href, isLast };
  });
}

export function Header({
  onMobileMenuToggle,
  onSidebarToggle,
  onRightBarToggle,
}: HeaderProps) {
  const breadcrumbs = useBreadcrumbs();
  const { isDark, toggle: toggleDark } = useDarkMode();

  return (
    <header
      className={cn(
        "sticky top-0 z-20 flex items-center justify-between",
        "h-[68px] px-5",
        "bg-white/95 dark:bg-[rgb(32,32,32)]/95 backdrop-blur-sm",
        "border-b border-black/[0.06] dark:border-white/[0.06]",
      )}
    >
      {/* ── Left ── */}
      <div className='flex items-center gap-2'>
        <button
          onClick={onMobileMenuToggle}
          className='md:hidden flex items-center justify-center w-8 h-8 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors'
        >
          <Menu size={16} className='text-black/50 dark:text-white/50' />
        </button>

        <IconBtn
          onClick={onSidebarToggle}
          label='Toggle sidebar'
          className='hidden md:flex'
        >
          <PanelLeft size={16} />
        </IconBtn>

        <IconBtn label='Favourite' className='hidden md:flex'>
          <Star size={16} />
        </IconBtn>

        <Breadcrumb className='ml-1 hidden md:flex'>
          <BreadcrumbList className='text-[13px] gap-1 sm:gap-1.5'>
            {breadcrumbs.map(({ label, href, isLast }) =>
              isLast ? (
                <BreadcrumbItem key={href}>
                  <BreadcrumbPage className='font-medium text-black dark:text-white text-[13px]'>
                    {label}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              ) : (
                <BreadcrumbItem key={href}>
                  <BreadcrumbLink
                    asChild
                    className='text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white text-[13px] transition-colors'
                  >
                    <Link href={href}>{label}</Link>
                  </BreadcrumbLink>
                  <BreadcrumbSeparator className='text-black/20 dark:text-white/20' />
                </BreadcrumbItem>
              ),
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* ── Right ── */}
      <div className='flex items-center gap-1'>
        <div className='hidden sm:flex items-center gap-2 h-8 px-3 rounded-lg bg-black/[0.04] dark:bg-white/[0.06] text-[13px] text-black/35 dark:text-white/35 cursor-pointer hover:bg-black/[0.06] dark:hover:bg-white/[0.08] transition-colors mr-1'>
          <Search size={13} />
          <span>Search</span>
          <kbd className='ml-1 text-[10px] bg-black/[0.06] dark:bg-white/[0.08] px-1.5 py-0.5 rounded font-mono leading-none'>
            /
          </kbd>
        </div>

        <IconBtn onClick={toggleDark} label='Toggle dark mode'>
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </IconBtn>

        <IconBtn label='History'>
          <RotateCcw size={16} />
        </IconBtn>

        <IconBtn label='Notifications'>
          <div className='relative'>
            <Bell size={16} />
            <span className='absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#ff4747]' />
          </div>
        </IconBtn>

        <IconBtn
          onClick={onRightBarToggle}
          label='Toggle right panel'
          className='hidden lg:flex'
        >
          <PanelRight size={16} />
        </IconBtn>
      </div>
    </header>
  );
}

function IconBtn({
  children,
  label,
  onClick,
  className,
}: {
  children: React.ReactNode;
  label: string;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={cn(
        "flex items-center justify-center w-8 h-8 rounded-lg",
        "text-black/50 dark:text-white/50",
        "hover:bg-black/[0.05] dark:hover:bg-white/[0.05] transition-colors",
        className,
      )}
    >
      {children}
    </button>
  );
}
