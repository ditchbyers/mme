"use client"

import { useState } from "react"
import { useSelector } from "react-redux"

import { ChatState } from "@/lib/redux/chatSlice"
import Messages from "@/components/usable/chat/chat-area/messages"
import NewMessages from "@/components/usable/chat/chat-area/new-messages"
import Recipient from "@/components/usable/chat/chat-area/recipient"
import ChatsHeader from "@/components/usable/chat/chats/chats-header"
import ChatsList from "@/components/usable/chat/chats/chats-list"

/**
 * Main chat page component with responsive layout
 * Displays a list of chats on the left and the selected chat conversation on the right
 * On mobile devices, shows either the chat list or the conversation based on selection
 * Includes search functionality for filtering chats
 *
 * @returns JSX element containing the complete chat interface with responsive layout
 */
export default function ChatPage() {
  const { selectedChat }: ChatState = useSelector((state: any) => state.chat)
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="container mx-auto flex h-full w-full border-r border-gray-300">
      {/* ChatList - Desktop OR mobile if no chat selected */}
      <div className={`w-full p-3 lg:w-[400px] ${selectedChat ? "hidden" : "block"} border-r border-gray-300 lg:block`}>
        <ChatsHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <div className="mt-3 flex-1 overflow-auto">
          <ChatsList searchQuery={searchQuery} />
        </div>
      </div>
      {/* ChatArea */}
      {selectedChat && (
        <div className="flex w-full flex-1 flex-col lg:w-auto" style={{ height: "calc(100vh - 64px)" }}>
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
