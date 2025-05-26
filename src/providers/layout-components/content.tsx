"use client"

import React, { use } from "react"
import { usePathname } from "next/navigation"

function Content({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isPublicRoute = pathname.includes("sign-in") || pathname.includes("sign-up") || pathname.includes("/")
  if (isPublicRoute) return <>{children}</>

  return <main className="mb-36 flex-1 space-y-20 px-0">{children}</main>
}

export default Content
