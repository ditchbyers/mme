"use client"

import React, { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { GetCurrentUserFromMongoDB } from "@/server-actions/users"
import { UserType } from "@/types"
import { SignedIn, SignedOut, SignInButton, SignUpButton, useClerk } from "@clerk/nextjs"
import { MessagesSquare } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"

import socket from "@/config/socket-config"
import { SetCurrentUser, SetOnlineUsers, UserState } from "@/lib/redux/userSlice"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import CurrentUserInfo from "@/components/usable/user/current-user-infor"

import { SearchCommandPopover } from "./header-search"

export default function Header() {
  const pathname = usePathname()
  const isPublicRoute = pathname.includes("sign-in") || pathname.includes("sign-up")
  if (isPublicRoute) return null

  const router = useRouter()
  const dispatch = useDispatch()
  const { currentUserData }: UserState = useSelector((state: any) => state.user)
  const [showCurrentUserInfo, setShowCurrentUserInfo] = useState(false)

  useEffect(() => {
    if (isPublicRoute) return
    const getCurrentUser = async () => {
      try {
        const response = await GetCurrentUserFromMongoDB()
        if (response.error) throw new Error(response.error)
        dispatch(SetCurrentUser(response as UserType))
      } catch (error: any) {
        console.error(error.message)
      }
    }
    getCurrentUser()
  }, [])

  useEffect(() => {
    if (currentUserData) {
      socket.emit("join", currentUserData.id)

      const handleOnlineUsers = (onlineUsers: string[]) => {
        dispatch(SetOnlineUsers(onlineUsers))
        console.log("Online users updated:", onlineUsers)
      }

      socket.on("online-users-updated", handleOnlineUsers)

      return () => {
        socket.off("online-users-updated", handleOnlineUsers)
      }
    }
  }, [currentUserData])

  useEffect(() => {
    const handleBeforeUnload = () => {
      const userId = currentUserData?.id
      if (userId) {
        socket.emit("logout", userId)
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [])

  return (
    <header className="fixed top-0 right-0 left-0 z-50 hidden h-20 grid-cols-3 items-center justify-between border-b border-solid border-gray-300 bg-gray-200 px-5 py-1 lg:grid">
      {/* Left - Logo */}
      <div className="flex-shrink-0">
        <Link href="/">
          <h1 className="cursor-pointer p-3 text-xl font-bold hover:underline">Matchmaking Enabled</h1>
        </Link>
      </div>

      {/* Center - Search bar */}
      <div className="flex w-full max-w-md justify-center px-4">
        <SearchCommandPopover />
      </div>

      {/* Right - User controls */}
      <div className="flex h-full flex-1 items-center justify-end gap-4">
        <SignedOut>
          <SignInButton />
          <SignUpButton />
        </SignedOut>
        <SignedIn>
          <Link href="/chat" passHref>
            <p className="inline-flex items-center justify-center rounded-full p-2 hover:bg-gray-800">
              <MessagesSquare className="h-4 w-4 text-gray-500 hover:text-black" />
            </p>
          </Link>

          <div className="flex items-center gap-2">
            <span className="font-bold">{currentUserData?.userName}</span>
            <Avatar className="size-10 cursor-pointer" onClick={() => setShowCurrentUserInfo(true)}>
              <AvatarImage src={currentUserData?.profilePicture} alt="User Avatar" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>

          {showCurrentUserInfo && currentUserData && (
            <CurrentUserInfo
              setShowCurrentUserInfo={setShowCurrentUserInfo}
              showCurrentUserInfo={showCurrentUserInfo}
            />
          )}
        </SignedIn>
      </div>
    </header>
  )
}
