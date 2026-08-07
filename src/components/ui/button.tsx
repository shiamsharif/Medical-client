import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary text-white shadow-sm hover:bg-primary-dark",
        secondary: "bg-secondary text-white hover:bg-secondary/90",
        outline: "border border-border bg-surface text-foreground hover:bg-muted",
        ghost: "text-muted-foreground hover:bg-muted hover:text-foreground",
        danger: "bg-danger text-white hover:bg-danger/90",
      },
      size: { sm: "min-h-9 rounded-lg px-3", md: "min-h-11", lg: "min-h-12 px-6 text-base", icon: "size-11 p-0" },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants> & { asChild?: boolean };

export function Button({ className, variant, size, asChild, ...props }: ButtonProps) {
  const Component = asChild ? Slot : "button";
  return <Component className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
