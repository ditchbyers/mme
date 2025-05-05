import { cn } from '@/lib/utils'
import { TypoProps } from '@/types'

export function TypographyH4({ className, children }: TypoProps) {
  return <h4 className={cn('scroll-m-20 text-xl font-semibold tracking-tight', className)}>{children}</h4>
}
