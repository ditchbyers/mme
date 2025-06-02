import React from 'react'
import Recipient from './recipient'
import { ChatState } from '@/redux/chatSlice'
import { useSelector } from 'react-redux'
import Messages from './messages'
import NewMessages from './new-messages'


export default function ChatArea() {
  const { selectedChat }: ChatState = useSelector((state: any) => state.chat)

  if (!selectedChat) {
    return (
      <div className='flex-1 flex flex-col justify-center items-center h-full' >
        <img src="/21_Message_Board.jpg" alt="" className='h-60' />
        <span className='font-semibold text-gray-600 text-sm'>
          Select a chat to start messaging
        </span>
      </div>

    )
  }
  return (
    selectedChat && (
      <div className='flex flex-col w-full h-full justify-between'>
        <Recipient />
        <Messages />
        <NewMessages />
      </div>
    )
  )
}
