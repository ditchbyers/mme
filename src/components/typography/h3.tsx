import { TypoProps } from "@/types"

import { cn } from "@/lib/utils"

export function TH3({ children, className }: TypoProps) {
  return (
    <h3
      className={cn(
        "scroll-m-20 text-2xl font-semibold tracking-tight",
        className
      )}
    >
      {children}
    </h3>
  )
}
