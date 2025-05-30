import type { Metadata } from "next"

import "./globals.css"

import { Lato } from "next/font/google"
import { Header } from "@/providers/layout-components/header"
import { ClerkProvider } from "@clerk/nextjs"

import { MobileNavigation } from "@/components/usable/mobile-navigation"

const lato = Lato({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
})

export const metadata: Metadata = {
  title: "Matchmaking Enabled",
  description: "App for gamers to find gamers",
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
          <Header />
          <main className="flex-1 space-y-20">{children}</main>
          <footer>
            <MobileNavigation />
          </footer>
        </body>
      </html>
    </ClerkProvider>
  )
}
