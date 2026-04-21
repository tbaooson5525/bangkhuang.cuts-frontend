import { cn } from "@/lib/utils";
export default function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[20px] bg-white dark:bg-[rgb(32,32,32)]",
        "border border-black/[0.04] dark:border-white/[0.04]",
        "p-6",
        className,
      )}
    >
      {children}
    </div>
  );
}
