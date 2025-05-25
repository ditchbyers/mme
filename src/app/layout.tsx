import type { Metadata } from 'next'

import './globals.css'

import { MobileNavigation } from '@/components/usable/mobile-navigation'
import { Lato } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import ThemeProvider from '@/providers/theme-provider'
import LayoutProvider from '@/providers/layout-provider'
import ReduxProvider from '@/providers/redux-provider'
import 'remixicon/fonts/remixicon.css'

const lato = Lato({
  variable: '--font-oswald',
  subsets: ['latin'],
  weight: ['100', '300', '400', '700', '900'],
})

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
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${lato.variable} flex min-h-screen flex-col antialiased`}>
          <ThemeProvider>
            <ReduxProvider>
              <LayoutProvider>
                <main className="mb-36 flex-1 space-y-20 px-0">{children}</main>
              </LayoutProvider>
            </ReduxProvider>
          </ThemeProvider>
          <footer>
            <MobileNavigation />
          </footer>
        </body>
      </html>
    </ClerkProvider>
  )
}