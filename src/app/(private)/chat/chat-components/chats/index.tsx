import React from 'react'
import ChatsHeader from './chats-header'
import ChatsList from './chats-list'

export default function Chats({ fullscreen = false }: { fullscreen?: boolean }) {
  return (
    <div className={`${fullscreen ? "w-full h-full" : "w-[400px] h-full"} flex flex-col p-3`}>
      <ChatsHeader />
      <div className="flex-1 overflow-auto mt-3">
        <ChatsList />
      </div>
    </div>
  )
}

