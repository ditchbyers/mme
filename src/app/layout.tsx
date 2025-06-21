import type { Metadata } from "next"

import "./globals.css"

import { Lato } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"

import ReduxProvider from "@/lib/redux-provider"
import Header from "@/components/usable/navigation/header"
import { MobileNavigation } from "@/components/usable/navigation/mobile-navigation"

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
        <body className={`${lato.variable} flex h-full min-h-screen w-full flex-col antialiased`}>
          <ReduxProvider>
            <Header />
            <main className="flex-1 lg:mt-16">{children}</main>
            <footer className="min-h-[1px]">
              <MobileNavigation />
            </footer>
          </ReduxProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
