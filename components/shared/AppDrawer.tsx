"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import LoadingSpinner from "./LoadingSpinner";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  isLoading?: boolean;
};

export default function AppDrawer({
  open,
  onClose,
  title,
  children,
  isLoading,
}: Props) {
  return (
    <Drawer
      open={open}
      onOpenChange={(o) => {
        if (!o && !isLoading) onClose();
      }}
      direction='right'
    >
      <DrawerContent className='h-full w-[420px] right-0 left-auto rounded-none flex flex-col'>
        <DrawerHeader className='border-b border-neutral-100 dark:border-white/[0.06] shrink-0'>
          <DrawerTitle>{title}</DrawerTitle>
        </DrawerHeader>
        <div className='flex-1 overflow-y-auto p-6 relative'>
          {children}
          {/* Loading overlay */}
          {isLoading && (
            <div className='absolute inset-0 bg-white/60 dark:bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-10 rounded-b-none'>
              <LoadingSpinner />
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
