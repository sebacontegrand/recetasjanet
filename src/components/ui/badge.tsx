import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "secondary" | "outline"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
    return (
        <div
            className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                {
                    "border-transparent bg-brand-primary text-warm-50 hover:bg-brand-primary-hover": variant === "default",
                    "border-transparent bg-brand-secondary text-warm-50 hover:bg-brand-secondary/80": variant === "secondary",
                    "text-warm-800 border-warm-200": variant === "outline",
                },
                className
            )}
            {...props}
        />
    )
}

export { Badge }
