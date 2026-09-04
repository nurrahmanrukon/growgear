import { ButtonHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "outline" | "link";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-primary text-white hover:bg-primary-dark shadow-sm",
  secondary:
    "bg-surface border border-primary text-primary hover:bg-primary-light",
  outline: "bg-surface border border-border text-foreground hover:bg-surface-muted",
  link: "bg-transparent text-link hover:text-link-hover hover:underline p-0",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", fullWidth, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
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
