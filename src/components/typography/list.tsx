import { TypoProps } from "@/types"

import { cn } from "@/lib/utils"

export function TList({ className, children }: TypoProps) {
  return (
    <ul className={cn("my-6 ml-6 list-disc [&>li]:mt-2", className)}>
      {children}
    </ul>
  )
}
