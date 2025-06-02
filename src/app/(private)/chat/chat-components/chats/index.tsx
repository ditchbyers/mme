import React from 'react'
import ChatsHeader from './chats-header'
import ChatsList from './chats-list'

export default function Chats() {
  return (
    <div className="w-[400px] h-full p-3">
        <ChatsHeader />
        <ChatsList />
    </div>
  )
}
