import { TypoProps } from "@/types"

import { cn } from "@/lib/utils"

export function TypographyP({ className, children }: TypoProps) {
  return <p className={cn("leading-7 [&:not(:first-child)]:mt-2", className)}>{children}</p>
}
