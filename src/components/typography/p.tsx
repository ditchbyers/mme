import { cn } from '@/lib/utils'
import { TypoProps } from '@/types'

export function TypographyP({ className, children }: TypoProps) {
  return <p className={cn('leading-7 [&:not(:first-child)]:mt-6', className)}>{children}</p>
}
