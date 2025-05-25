"use client"

import React, { use } from "react"
import { usePathname } from "next/navigation"
import { UserState } from "@/redux/userSlice"
import { useSelector } from "react-redux"

import Loader from "@/components/loader"

function Content({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isPublicRoute = pathname.includes("sign-in") || pathname.includes("sign-up") || pathname.includes("/")
  if (isPublicRoute) return <>{children}</>

  const { currentUserData }: UserState = useSelector((state: { user: UserState }) => state.user)

  if (!currentUserData) return <Loader />

  return <main className="mb-36 flex-1 space-y-20 px-0">{children}</main>
}

export default Content
