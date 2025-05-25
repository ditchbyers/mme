import { TypoProps } from "@/types"

import { cn } from "@/lib/utils"

export function TH1({ children, className }: TypoProps) {
  return (
    <h1
      className={cn(
        "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
        className
      )}
    >
      {children}
    </h1>
  )
}
