import type { Metadata } from "next"

import "./globals.css"

import { Lato } from "next/font/google"
import ReduxProvider from "@/providers/redux-provider"
import { ClerkProvider } from "@clerk/nextjs"

import { MobileNavigation } from "@/components/usable/mobile-navigation"

import "remixicon/fonts/remixicon.css"

import Content from "@/providers/layout-components/content"
import Header from "@/providers/layout-components/header"

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
          <ReduxProvider>
            <Header />
            <Content>{children}</Content>
          </ReduxProvider>
          <footer>
            <MobileNavigation />
          </footer>
        </body>
      </html>
    </ClerkProvider>
  )
}
