"use client";

import { useTheme } from "next-themes";
import { Toaster as SonnerToaster } from "sonner";

type ToasterProps = React.ComponentProps<typeof SonnerToaster>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <SonnerToaster
      theme={theme as ToasterProps["theme"]}
      className='toaster group'
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:dark:bg-neutral-900 group-[.toaster]:text-neutral-900 group-[.toaster]:dark:text-white group-[.toaster]:border-neutral-200 group-[.toaster]:dark:border-white/[0.08] group-[.toaster]:shadow-lg",
          description:
            "group-[.toast]:text-neutral-500 group-[.toast]:dark:text-white/50",
          actionButton:
            "group-[.toast]:bg-neutral-900 group-[.toast]:dark:bg-white group-[.toast]:text-white group-[.toast]:dark:text-neutral-900",
          cancelButton:
            "group-[.toast]:bg-neutral-100 group-[.toast]:dark:bg-white/10 group-[.toast]:text-neutral-500 group-[.toast]:dark:text-white/50",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
