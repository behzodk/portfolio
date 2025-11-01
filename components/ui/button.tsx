import type React from "react"
import { cn } from "@/lib/utils"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline"
  size?: "sm" | "md" | "lg"
}

export function Button({ className, variant = "primary", size = "md", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          "bg-primary text-primary-foreground hover:opacity-90": variant === "primary",
          "bg-secondary text-secondary-foreground hover:opacity-90": variant === "secondary",
          "border border-border hover:bg-muted": variant === "outline",
        },
        {
          "px-3 py-1 text-sm": size === "sm",
          "px-4 py-2 text-base": size === "md",
          "px-6 py-3 text-lg": size === "lg",
        },
        className,
      )}
      {...props}
    />
  )
}
