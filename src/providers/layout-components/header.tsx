"use client"

import React, { useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserType } from "@/interfaces"
import { SetCurrentUser, SetOnlineUsers, UserState } from "@/redux/userSlice"
import { GetCurrentUserFromMongoDB } from "@/server-actions/users"
import { SignedIn, SignedOut, SignInButton, SignUpButton} from "@clerk/nextjs"
import { useDispatch, useSelector } from "react-redux"

import socket from "@/config/socket-config"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import CurrentUserInfo from "./current-user-infor"

export default function Header() {
  const pathname = usePathname()
  const isPublicRoute = pathname.includes("sign-in") || pathname.includes("sign-up")
  if (isPublicRoute) return null

  const dispatch = useDispatch()
  const { currentUserData }: UserState = useSelector((state: any) => state.user)
  const [showCurrentUserInfo, setShowCurrentUserInfo] = React.useState(false)
 
  useEffect(() => {
    if(isPublicRoute) return
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

  return (
    <header className="hidden lg:flex fixed top-0 left-0 right-0 z-50 h-16 items-center justify-between border-b border-solid border-gray-300 bg-gray-200 px-5 py-1">
      <div>
        <Link href="/">
          <h1 className="cursor-pointer p-3 text-xl font-bold hover:underline">Matchmaking Enabled</h1>
        </Link>
      </div>
      <div className="flex gap-4">
        <SignedOut>
          <SignInButton />
          <SignUpButton />
        </SignedOut>
        <SignedIn>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-bold">{currentUserData?.userName}</span>
            <Avatar className="cursor-pointer" onClick={() => setShowCurrentUserInfo(true)}>
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