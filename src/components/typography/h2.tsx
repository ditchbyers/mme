import { TypoProps } from "@/types"

import { cn } from "@/lib/utils"

export function TH2({ children, className }: TypoProps) {
  return (
    <h2
      className={cn(
        "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
        className
      )}
    >
      {children}
    </h2>
  )
}
