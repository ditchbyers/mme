import type { Metadata } from 'next'

import '../globals.css'

import { MobileNavigation } from '@/components/usable/mobile-navigation'



export const metadata: Metadata = {
  title: 'Matchmaking Enabled',
  description: 'App for gamers to find gamers',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
      <html lang="en" suppressHydrationWarning>  
          <main className="mb-36 flex-1 space-y-20 pl-5 md:px-5">{children}</main>
          <MobileNavigation />
        
      </html>
  )
}
