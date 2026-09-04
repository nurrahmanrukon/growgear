import { ButtonHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "outline" | "link";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-gradient-to-b from-orange-light to-orange border border-orange-dark text-[#0f1111] hover:brightness-95 shadow-sm",
  secondary:
    "bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b] border border-[#a88734] text-[#0f1111] hover:brightness-95 shadow-sm",
  outline:
    "bg-white border border-border text-[#0f1111] hover:bg-surface-muted",
  link: "bg-transparent text-link hover:text-link-hover hover:underline p-0",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", fullWidth, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
          variantClasses[variant],
          fullWidth && "w-full",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
