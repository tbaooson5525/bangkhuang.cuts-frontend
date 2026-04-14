"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

export default function AppDrawer({ open, onClose, title, children }: Props) {
  return (
    <Drawer
      open={open}
      onOpenChange={(o) => {
        if (!o) onClose();
      }}
      direction='right'
    >
      <DrawerContent className='h-full w-[420px] right-0 left-auto rounded-none flex flex-col'>
        <DrawerHeader className='border-b border-neutral-100 shrink-0'>
          <DrawerTitle>{title}</DrawerTitle>
        </DrawerHeader>
        <div className='flex-1 overflow-y-auto p-6'>{children}</div>
      </DrawerContent>
    </Drawer>
  );
}
