"use client";

import { useRouter, usePathname } from "next/navigation";
import { useTransition } from "react";
import {
  Calendar1,
  HandPlatter,
  Home,
  Images,
  Settings,
  Users,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { useSignOut } from "@/hooks/useSignOut";

const NAV_ITEMS = [
  { url: "/admin/dashboard", icon: Home },
  { url: "/admin/services", icon: HandPlatter },
  { url: "/admin/schedule", icon: Calendar1 },
  { url: "/admin/staffs", icon: Users },
  { url: "/admin/gallery", icon: Images },
  { url: "/admin/settings", icon: Settings },
] as const;

export default function SideBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const { mutate: signOut } = useSignOut();

  return (
    <div className='flex flex-col w-[10%] min-h-screen items-center justify-between py-4 bg-background'>
      <div className='flex flex-col items-center gap-4 w-full'>
        <Avatar className='w-20 h-20 select-none rounded-sm transition duration-300'>
          <AvatarImage src='/images/logo.png' />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
      <nav className='flex flex-col items-center gap-4 w-full'>
        {/* Nav items */}
        <ul className='flex flex-col gap-4 w-full items-center'>
          {NAV_ITEMS.map(({ url, icon: Icon }) => {
            const isActive = pathname.startsWith(url);
            return (
              <li key={url} className='rounded-lg transition-colors'>
                <Button
                  onClick={() => startTransition(() => router.push(url))}
                  disabled={isPending}
                  aria-label={url.split("/").pop()}
                  className={cn(
                    // Base
                    "w-[52px] h-[52px] rounded-full transition-all duration-200 bg-white text-foreground/70 hover:text-secondary",
                    // Default
                    "",
                    // Active
                    isActive && "bg-brand-primary text-secondary",
                    // Disabled
                    isPending && "opacity-40 cursor-not-allowed",
                  )}
                >
                  <Icon strokeWidth={2} />
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className='flex items-center justify-center mb-2'>
        <Button
          className='w-[52px] h-[52px] rounded-full bg-brand-primary hover:bg-brand-primary/90 p-0 shadow-md'
          size='icon'
          aria-label='Logout'
          onClick={() => signOut()}
        >
          <LogOut className='w-5 h-5 text-white' />
        </Button>
      </div>
    </div>
  );
}
