"use client"

import Link from "next/link"
import { SignedIn, SignedOut, SignInButton, SignUpButton, useUser } from "@clerk/nextjs"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

export function Header() {
  const { user } = useUser()

  // useEffect(() => {
  //   if (currentUserData) {
  //     socket.emit("join", currentUserData._id)

  //     const handleOnlineUsers = (onlineUsers: string[]) => {
  //       dispatch(SetOnlineUsers(onlineUsers))
  //       console.log("Online users updated:", onlineUsers)
  //     }

  //     socket.on("online-users-updated", handleOnlineUsers)

  //     return () => {
  //       socket.off("online-users-updated", handleOnlineUsers)
  //     }
  //   }
  // }, [currentUserData])

  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-solid border-gray-300 bg-gray-200 px-5 py-1">
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
          <Drawer direction="right">
            <DrawerTrigger asChild>
              <div className="flex items-center space-x-2">
                <Avatar className="cursor-pointer">
                  <AvatarImage src={user?.imageUrl} alt="User Avatar" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </div>
            </DrawerTrigger>
            <DrawerContent>
              <div className="mx-auto w-full max-w-sm">
                <DrawerHeader>
                  <DrawerTitle>Move Goal</DrawerTitle>
                  <DrawerDescription>Set your daily activity goal.</DrawerDescription>
                </DrawerHeader>
                <div className="p-4 pb-0">
                  <div className="flex items-center justify-center space-x-2">test</div>
                </div>
                <DrawerFooter>
                  <Button>Submit</Button>
                  <DrawerClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DrawerClose>
                </DrawerFooter>
              </div>
            </DrawerContent>
          </Drawer>
        </SignedIn>
      </div>
    </header>
  )
}
