import React from "react"
import { DivProps } from "@/types"

import ChatsHeader from "./chats-header"
import ChatsList from "./chats-list"

export function ChatsWrapper({ className }: DivProps) {
  return (
    <div className={`w-full p-3 lg:w-[400px]`}>
      <ChatsHeader />
      <div className="mt-3 flex-1 overflow-auto">
        <ChatsList />
      </div>
    </div>
  )
}
