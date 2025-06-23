"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { GetCurrentUserFromMongoDB } from "@/server-actions/users"
import { UserType } from "@/types"
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs"
import { ChevronDown, MessagesSquare } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"

import socket from "@/config/socket-config"
import { SetCurrentUser, SetOnlineUsers, UserState } from "@/lib/redux/userSlice"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import CurrentUserInfo from "@/components/usable/user/current-user-infor"

import { HeaderSearch } from "./header-search"

export default function Header() {
  const pathname = usePathname()
  const isPublicRoute = pathname.includes("sign-in") || pathname.includes("sign-up")
  if (isPublicRoute) return null

  const router = useRouter()
  const dispatch = useDispatch()
  const { currentUserData }: UserState = useSelector((state: any) => state.user)
  const [showCurrentUserInfo, setShowCurrentUserInfo] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

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
    <nav className="border-border/40 supports-[backdrop-filter]:bg-background/60 fixed top-0 z-50 hidden w-full border-b bg-gray-700/95 backdrop-blur lg:block">
      <div className="container mx-auto px-5">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link href="/" className="group flex items-center space-x-3">
              <div className="flex h-10 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 text-lg font-bold text-white shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
                MME
              </div>
              <div className="hidden sm:block">
                <h1 className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-xl font-bold text-transparent transition-all duration-300 group-hover:from-blue-600 group-hover:via-purple-600 group-hover:to-indigo-600">
                  MME
                </h1>
                <p className="text-muted-foreground -mt-1 text-xs">Matchmaking Enabled</p>
              </div>
            </Link>
          </div>
          {/* Search Bar Section */}
          <div className="mx-8 max-w-xl flex-1">
            <div className="relative">
              <HeaderSearch />
            </div>
          </div>
          {/* User Profile Section */}
          <div className="flex items-center space-x-4">
            <SignedOut>
              <SignInButton />
              <SignUpButton />
            </SignedOut>
            <SignedIn>
              <Link
                href="/chat"
                passHref
                className="hover:bg-accent relative flex h-9 w-9 items-center justify-center p-0 transition-colors"
              >
                <MessagesSquare className="h-4 w-4" />
                <span className="sr-only">Open Chat</span>
              </Link>
              <Button
                variant="ghost"
                className="hover:bg-accent group relative h-9 rounded-full pr-3 pl-2 transition-all duration-200"
                onClick={() => setShowCurrentUserInfo(true)}
              >
                <div className="flex items-center space-x-2">
                  <Avatar className="group-hover:ring-primary/20 h-7 w-7 ring-2 ring-transparent transition-all duration-200">
                    <AvatarImage src={currentUserData?.profilePicture} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-xs font-medium text-white">
                      {currentUserData?.userName
                        .split(" ")
                        .map((word) => word.charAt(0))
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden flex-col items-start md:flex">
                    <span className="text-foreground text-sm font-medium">{currentUserData?.name}</span>
                    <span className="text-muted-foreground -mt-0.5 text-xs">{currentUserData?.email}</span>
                  </div>
                  <ChevronDown className="text-muted-foreground group-hover:text-foreground h-3 w-3 transition-colors" />
                </div>
              </Button>
              {showCurrentUserInfo && currentUserData && (
                <CurrentUserInfo
                  setShowCurrentUserInfo={setShowCurrentUserInfo}
                  showCurrentUserInfo={showCurrentUserInfo}
                />
              )}
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  )
}
