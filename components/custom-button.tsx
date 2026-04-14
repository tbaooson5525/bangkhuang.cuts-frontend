import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

const CustomButton = forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        {...props}
        className={cn(
          "bg-brand-secondary rounded-full p-5 cursor-pointer transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed",
          className,
        )}
      >
        {children}
      </button>
    );
  },
);

CustomButton.displayName = "CustomButton";
export default CustomButton;
