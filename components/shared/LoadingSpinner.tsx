import { cn } from "@/lib/utils";

type Props = { className?: string; size?: "sm" | "md" | "lg" };

const sizes = {
  sm: "w-5 h-5",
  md: "w-7 h-7",
  lg: "w-8 h-8",
};

export default function LoadingSpinner({ className, size = "md" }: Props) {
  return (
    <div className='flex justify-center py-10'>
      <div
        className={cn(
          "rounded-full border-2 border-neutral-300 border-t-neutral-800 animate-spin",
          sizes[size],
          className,
        )}
      />
    </div>
  );
}
