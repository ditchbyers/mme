"use client"

import { useSelector } from "react-redux"

import { ChatState } from "@/lib/redux/chatSlice"
import Messages from "@/components/usable/chat/chat-area/messages"
import NewMessages from "@/components/usable/chat/chat-area/new-messages"
import Recipient from "@/components/usable/chat/chat-area/recipient"

export default function ChatPage() {
  const { selectedChat }: ChatState = useSelector((state: any) => state.chat)

  if (!selectedChat) {
    return (
      <div className="flex h-full flex-1 flex-col items-center justify-center">
        <img src="/21_Message_Board.jpg" alt="" className="h-60" />
        <span className="text-sm font-semibold text-gray-600">Select a chat to start messaging</span>
      </div>
    )
  }

  return (
    <div className="flex h-full w-full flex-col justify-between">
      <Recipient />
      <Messages />
      <NewMessages />
    </div>
  )
}
