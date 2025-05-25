import { Button } from '@/components/ui/button'
import socket from '@/config/socket-config'
import { ChatState } from '@/redux/chatSlice'
import { UserState } from '@/redux/userSlice'
import { SendNewMessage } from '@/server-actions/messages'
import dayjs from 'dayjs'
import { create } from 'domain'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'

export default function NewMessages
  () {
  const [text, setText] = React.useState('')
  const { currentUserData }: UserState = useSelector((state: any) => state.user)
  const { selectedChat }: ChatState = useSelector((state: any) => state.chat)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const onSend = async () => {
    try {
      if (!text) return;

      const commonPayload = {
        text, image: "", socketMessageId: dayjs().unix(), createdAt: dayjs().toISOString(), updatedAt: dayjs().toISOString(),
      }

      const socketPayload = {
        ...commonPayload,
        chat: selectedChat,
        sender: currentUserData,
      }

      socket.emit('send-new-message', socketPayload)
      setText('')
      {
        const dbPayload = {
          ...commonPayload,
          sender: currentUserData?._id!,
          chat: selectedChat?._id!
        }
        await SendNewMessage(dbPayload)
      }

    } catch (error: any) {
      console.log(error)
    }
  }

  useEffect(() => {
    socket.emit("typing", {chat : selectedChat, senderId: currentUserData?._id})
  } , [selectedChat, text])


  return (
    <div
      className='p-3 bg-gray-100 border-0 border-t border-solid border-gray-200 flex gap-5 justify-center items-center'>
      <div>
        {/*Emoji hier*/}
      </div>
      <div className='flex-1'>
        <input
          type="text"
          placeholder='Type a message'
          className='w-full border border-solid border-gray-300 focus:outline-none focus:border-gray-500 h-[45px] px-5'
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && text.trim() !== '') {
              onSend()
            }
          }}
        />
      </div>
      <Button onClick={onSend}>SEND</Button>
    </div>
  )
}
