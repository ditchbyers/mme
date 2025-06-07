"use client"

import { useEffect, useState } from "react"
import Header from "@/providers/layout-components/header"
import { MobileNavigation } from "@/components/usable/mobile-navigation"

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const updateDevice = () => {
      setIsMobile(window.innerWidth <= 1024)
    }

    updateDevice()
    window.addEventListener("resize", updateDevice)

    return () => window.removeEventListener("resize", updateDevice)
  }, [])

  return (
    <>
      {isMobile && <Header />}
      <main className="flex-1 overflow-hidden">{children}</main>
      {isMobile && (
        <footer>
          <MobileNavigation />
        </footer>
      )}
    </>
  )
}
