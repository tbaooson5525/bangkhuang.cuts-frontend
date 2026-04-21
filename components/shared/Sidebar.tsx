"use client";

import { usePathname } from "next/navigation";
import {
  Calendar1,
  HandPlatter,
  Home,
  Images,
  Settings,
  Users,
  ChevronLeft,
  LogOutIcon,
  KeyIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useSignOut } from "@/hooks/useSignOut";
import Link from "next/link";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { useRouter } from "next/navigation";

const iconMap: Record<string, React.ElementType> = {
  Home,
  HandPlatter,
  Calendar1,
  Users,
  Images,
  Settings,
};

const NAV_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard",
    url: "/admin/dashboard",
    icon: "Home",
  },
  {
    id: "services",
    label: "Services",
    url: "/admin/services",
    icon: "HandPlatter",
  },
  {
    id: "schedule",
    label: "Schedule",
    url: "/admin/schedule",
    icon: "Calendar1",
  },
  { id: "staffs", label: "Staffs", url: "/admin/staffs", icon: "Users" },
  { id: "gallery", label: "Gallery", url: "/admin/gallery", icon: "Images" },
  {
    id: "settings",
    label: "Settings",
    url: "/admin/settings",
    icon: "Settings",
  },
] as const;

const currentUser = {
  name: "Bangkhuang.cuts",
  email: "tiemcattocbangkhuang@gmail.com",
  avatar: "/images/logo.png",
};

interface SidebarProps {
  collapsed: boolean;
}

export default function SideBar({ collapsed }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { mutate: signOut } = useSignOut();

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col h-screen sticky top-0 z-30 shrink-0",
        "bg-white dark:bg-[rgb(32,32,32)]",
        "border-r border-black/[0.06] dark:border-white/[0.06]",
        "transition-[width] duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden",
        collapsed ? "w-[64px]" : "w-[212px]",
      )}
    >
      <div
        className={cn(
          "flex items-center shrink-0 h-[68px] border-b border-black/[0.06] dark:border-white/[0.06]",
          collapsed ? "justify-center px-0" : "px-5",
        )}
      >
        <Image
          src={collapsed ? "/images/logo.png" : "/images/sidebar_logo.png"}
          alt='Bangkhuang Logo'
          width={collapsed ? 300 : 600}
          height={collapsed ? 300 : 600}
        />
      </div>

      <nav className='flex-1 overflow-y-auto px-3 py-3'>
        <ul className='space-y-0.5'>
          {NAV_ITEMS.map((item) => {
            const Icon = iconMap[item.icon];
            const isActive = pathname.startsWith(item.url);
            return (
              <li key={item.id}>
                <Link
                  href={item.url}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg transition-all duration-150 select-none",
                    collapsed
                      ? "justify-center w-10 h-10 mx-auto"
                      : "px-3 py-2.5 w-full",
                    isActive
                      ? "bg-black/[0.06] dark:bg-white/[0.08]"
                      : "hover:bg-black/[0.04] dark:hover:bg-white/[0.04]",
                  )}
                >
                  <Icon
                    size={16}
                    className={cn(
                      "shrink-0 transition-colors",
                      isActive
                        ? "text-black dark:text-white"
                        : "text-black/40 dark:text-white/40 group-hover:text-black/70 dark:group-hover:text-white/70",
                    )}
                  />
                  {!collapsed && (
                    <span
                      className={cn(
                        "text-[13.5px] leading-5 truncate",
                        isActive
                          ? "text-black dark:text-white font-medium"
                          : "text-black/60 dark:text-white/60",
                      )}
                    >
                      {item.label}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div
        className={cn(
          "shrink-0 border-t border-black/[0.06] dark:border-white/[0.06] transition-all duration-150 select-none hover:bg-black/[0.04] dark:hover:bg-white/[0.04]",
          collapsed ? "flex justify-center py-4" : "px-4 py-4",
        )}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {collapsed ? (
              <Avatar className='w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold  shrink-0'>
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback className='rounded-full'>BK</AvatarFallback>
              </Avatar>
            ) : (
              <div className='flex items-center gap-3 px-1'>
                <Avatar className='w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold  shrink-0'>
                  <AvatarImage
                    src={currentUser.avatar}
                    alt={currentUser.name}
                  />
                  <AvatarFallback className='rounded-full'>BK</AvatarFallback>
                </Avatar>
                <div className='min-w-0'>
                  <p className='text-[13px] font-medium text-black dark:text-white truncate leading-tight'>
                    {currentUser.name}
                  </p>
                  <p className='text-[11px] text-black/40 dark:text-white/40 truncate leading-tight mt-0.5'>
                    {currentUser.email}
                  </p>
                </div>
              </div>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent side='right'>
            <DropdownMenuItem
              onClick={() => router.push("/admin/change-password")}
            >
              <KeyIcon />
              Đổi mật khẩu
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => signOut()}>
              <LogOutIcon />
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}

export function MobileSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { mutate: signOut } = useSignOut();

  return (
    <>
      {open && (
        <div
          className='fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden'
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          "fixed left-0 top-0 bottom-0 z-50 w-[212px] md:hidden flex flex-col",
          "bg-white dark:bg-[rgb(32,32,32)]",
          "border-r border-black/[0.06] dark:border-white/[0.06]",
          "transition-transform duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className='flex items-center justify-between h-[68px] px-5 border-b border-black/[0.06] dark:border-white/[0.06]'>
          <Image
            src={"/images/sidebar_logo.png"}
            alt='Bangkhuang Logo'
            width={300}
            height={300}
          />
          <button
            onClick={onClose}
            className='p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5'
          >
            <ChevronLeft
              size={15}
              className='text-black/30 dark:text-white/30'
            />
          </button>
        </div>

        <nav className='flex-1 overflow-y-auto px-3 py-3'>
          <ul className='space-y-0.5'>
            {NAV_ITEMS.map((item) => {
              const Icon = iconMap[item.icon];
              const isActive = pathname.startsWith(item.url);
              return (
                <li key={item.id}>
                  <Link
                    href={item.url}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg w-full transition-colors",
                      isActive
                        ? "bg-black/[0.06] dark:bg-white/[0.08]"
                        : "hover:bg-black/[0.04] dark:hover:bg-white/[0.04]",
                    )}
                  >
                    <Icon
                      size={16}
                      className={cn(
                        "shrink-0",
                        isActive
                          ? "text-black dark:text-white"
                          : "text-black/40 dark:text-white/40",
                      )}
                    />
                    <span
                      className={cn(
                        "text-[13.5px]",
                        isActive
                          ? "font-medium text-black dark:text-white"
                          : "text-black/60 dark:text-white/60",
                      )}
                    >
                      {item.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className='border-t border-black/[0.06] dark:border-white/[0.06] px-4 py-4'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className='flex items-center gap-3'>
                <Avatar className='w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold  shrink-0'>
                  <AvatarImage
                    src={currentUser.avatar}
                    alt={currentUser.name}
                  />
                  <AvatarFallback className='rounded-full'>BK</AvatarFallback>
                </Avatar>
                <div className='min-w-0'>
                  <p className='text-[13px] font-medium text-black dark:text-white truncate'>
                    {currentUser.name}
                  </p>
                  <p className='text-[11px] text-black/40 dark:text-white/40 truncate'>
                    {currentUser.email}
                  </p>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent side='right'>
              <DropdownMenuItem
                onClick={() => {
                  router.push("/admin/change-password");
                  onClose();
                }}
              >
                <KeyIcon />
                Đổi mật khẩu
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => signOut()}>
                <LogOutIcon />
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
    </>
  );
}
