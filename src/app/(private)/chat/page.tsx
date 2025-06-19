"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { ChatState } from "@/redux/chatSlice"
import { useSelector } from "react-redux"

import ChatArea from "./chat-components/chat-area"
import Chats from "./chat-components/chats"

export default function ChatLayout() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null)
  const { selectedChat }: ChatState = useSelector((state: any) => state.chat)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 1020)
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [])

  if (isMobile === null) return null
  const showChatsOnly = isMobile && !selectedChat
  const showChatOnly = isMobile && selectedChat
  const showBoth = !isMobile

  return (
    <div className="flex h-full w-full overflow-hidden">
      {(showChatsOnly || showBoth) && <Chats fullscreen={showChatsOnly} />}
      {showBoth && <div className="h-full w-px bg-gray-300" />}
      {(showChatOnly || showBoth) && <ChatArea isMobile={isMobile} />}
    </div>
  )
}
