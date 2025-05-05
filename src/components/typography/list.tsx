import { cn } from '@/lib/utils'
import { TypoProps } from '@/types'

export function TList({ className, children }: TypoProps) {
  return <ul className={cn('my-6 ml-6 list-disc [&>li]:mt-2', className)}>{children}</ul>
}
