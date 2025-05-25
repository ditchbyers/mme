// 📄 components/ui/navigate-button.tsx
'use client'

import { useRouter } from 'next/navigation'
import { Button, type buttonVariants } from '@/components/ui/button'
import type { VariantProps } from 'class-variance-authority'

type NavigateButtonProps = {
  href: string
  children: React.ReactNode
} & React.ComponentProps<typeof Button> &
  VariantProps<typeof buttonVariants>

export default function NavigateButton({
  href,
  children,
  ...props
}: NavigateButtonProps) {
  const router = useRouter()

  return (
    <Button {...props} onClick={() => router.push(href)}>
      {children}
    </Button>
  )
}
