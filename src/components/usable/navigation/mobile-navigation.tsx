"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { GetCurrentUserFromMongoDB } from "@/server-actions/users"
import { UserType } from "@/types"
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs"
import { HouseIcon, MessagesSquare, Search, UserRound } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"

import socket from "@/config/socket-config"
import { SetCurrentUser, SetOnlineUsers, UserState } from "@/lib/redux/userSlice"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import CurrentUserInfo from "@/components/usable/user/current-user-infor"

export const MobileNavigation = () => {
  const pathname = usePathname()
  const isPublicRoute = pathname.includes("sign-in") || pathname.includes("sign-up")
  if (isPublicRoute) return null

  const router = useRouter()
  const dispatch = useDispatch()
  const { currentUserData }: UserState = useSelector((state: any) => state.user)
  const [showCurrentUserInfo, setShowCurrentUserInfo] = useState(false)
  const [openProfileModal, setOpenProfileModal] = useState(false)

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

  /*useEffect(() => {
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
  */

  return (
    <>
      <div className="fixed right-0 bottom-0 left-0 z-50 h-20 bg-slate-900 lg:hidden">
        <div className="container mx-auto flex justify-between px-4 py-6 font-bold text-gray-200 uppercase">
          <SignedOut>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex gap-10">
                <SignInButton mode="modal">
                  <Button variant="secondary" className="bg-gray-700 px-6 py-2 text-white hover:bg-gray-600">
                    Sign In
                  </Button>
                </SignInButton>

                <SignUpButton mode="modal">
                  <Button variant="secondary" className="bg-gray-700 px-6 py-2 text-white hover:bg-gray-600">
                    Sign Up
                  </Button>
                </SignUpButton>
              </div>
            </div>
          </SignedOut>

          <SignedIn>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-gray-800"
              onClick={() => router.push("/")}
            >
              <HouseIcon className="h-4 w-4 text-gray-500 hover:text-black" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-gray-800"
              onClick={() => router.push("/search")}
            >
              <Search className="h-4 w-4 text-gray-500 hover:text-black" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-gray-800"
              onClick={() => router.push("/chat")}
            >
              <MessagesSquare className="h-4 w-4 text-gray-500 hover:text-black" />
            </Button>
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
      </div>

      {showCurrentUserInfo && currentUserData && (
        <CurrentUserInfo setShowCurrentUserInfo={setShowCurrentUserInfo} showCurrentUserInfo={showCurrentUserInfo} />
      )}
    </>
  )
}
