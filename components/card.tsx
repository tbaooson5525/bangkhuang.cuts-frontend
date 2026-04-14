import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  fill?: "white" | "red" | "image";
  actionBtn?: React.ReactNode;
  actionFn?: () => void;
  style?: React.CSSProperties;
}

export default function Card({
  children,
  className,
  style,
  fill = "red",
  actionBtn,
  actionFn,
}: CardProps) {
  const background =
    fill === "white" ? "bg-white" : fill === "red" ? "bg-secondary" : "";

  const actionButton = actionBtn ? (
    actionBtn
  ) : (
    <div className='rounded-full bg-white p-3'>
      <ArrowUpRight />
    </div>
  );

  return (
    <div
      className={cn(
        background,
        "w-full p-5 rounded-[40px] relative text-brand-surface",
        className,
      )}
      style={style}
    >
      <div
        className='cursor-pointer absolute right-2 top-2 hover:scale-125 transition-all duration-300 hover:rotate-[360deg]'
        onClick={actionFn}
      >
        {actionButton}
      </div>
      {children}
    </div>
  );
}
