"use client"

import { useState } from "react"
import { useSelector } from "react-redux"

import { ChatState } from "@/lib/redux/chatSlice"
import Messages from "@/components/usable/chat/chat-area/messages"
import NewMessages from "@/components/usable/chat/chat-area/new-messages"
import Recipient from "@/components/usable/chat/chat-area/recipient"
import ChatsHeader from "@/components/usable/chat/chats/chats-header"
import ChatsList from "@/components/usable/chat/chats/chats-list"

export default function ChatPage() {
  const { selectedChat }: ChatState = useSelector((state: any) => state.chat)
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="flex h-full w-full">
      {/* ChatList - Desktop OR mobile if no chat selected */}
      <div className={`w-full p-3 lg:w-[400px] ${selectedChat ? "hidden" : "block"} lg:block`}>
        <ChatsHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <div className="mt-3 flex-1 overflow-auto">
          <ChatsList searchQuery={searchQuery} />
        </div>
      </div>

      {/* Divider */}
      <div className="hidden h-full w-px bg-gray-300 lg:block" />

      {/* ChatArea */}
      {selectedChat && (
        <div className="flex w-full flex-1 flex-col lg:w-auto" style={{ height: "calc(100vh - 80px)" }}>
          <div className="flex h-full w-full flex-col justify-between">
            <Recipient />
            <Messages />
            <NewMessages />
          </div>
        </div>
      )}
    </div>
  )
}
