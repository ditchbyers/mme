import { MessageType } from '@/interfaces'
import { ChatState } from '@/redux/chatSlice'
import { GetChatMessages, ReadAllMessages } from '@/server-actions/messages'
import React, { use, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Message from './message'
import { UserState } from '@/redux/userSlice'
import socket from '@/config/socket-config'

export default function Messages
  () {
  const [messages, setMessages] = React.useState<MessageType[]>([])
  const [loading, setLoading] = React.useState(false)
  const { selectedChat }: ChatState = useSelector((state: any) => state.chat)
  const { currentUserData }: UserState = useSelector((state: any) => state.user)
  const messagesDivRef = React.useRef<HTMLDivElement>(null)

  const getMessages = async () => {
    try {
      setLoading(true)
      const response = await GetChatMessages(selectedChat?._id!)
      if (response.error) throw new Error(response.error)
      setMessages(response)
    } catch (error: any) {
      console.log(error.message)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    if (selectedChat && selectedChat._id) {
      getMessages()
      ReadAllMessages({
        userId: currentUserData._id!,
        chatId: selectedChat._id!,
      });
    }
  }, [selectedChat])

  useEffect(() => {

    socket.on("new-message-received", (message: MessageType) => {


      if (selectedChat?._id === message.chat._id) {
        setMessages((prevMessages) => {

          const messageAlreadyExists = prevMessages.find(
            (msg) => msg.socketMessageId === message.socketMessageId
          )
          if (messageAlreadyExists) return prevMessages;
          else return [...prevMessages, message];
        });
      }
    })
  }, [selectedChat])

  useEffect(() => {
    if (messagesDivRef.current) {
      messagesDivRef.current.scrollTop = messagesDivRef.current.scrollHeight + 100;
    }
  }, [messages])

  return (
    <div className='flex-1 p-3 overflow-y-auto' ref={messagesDivRef}>
      <div className="flex flex-col gap-3">
        {[...messages]
          .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
          .map((message) => (
            <Message key={message._id || message.socketMessageId} message={message} />
          ))}
        {/*{messages.map((message) => {
          return <Message key={message._id || message.socketMessageId} message={message}/>
        })}*/}
      </div>
    </div>
  )
}
