import { MessageType } from '@/interfaces'
import { ChatState, SetChats } from '@/redux/chatSlice'
import { GetChatMessages, ReadAllMessages } from '@/server-actions/messages'
import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Message from './message'
import { UserState } from '@/redux/userSlice'
import socket from '@/config/socket-config'

export default function Messages
  () {
  const [messages, setMessages] = React.useState<MessageType[]>([])
  const [loading, setLoading] = React.useState(false)
  const { selectedChat, chats }: ChatState = useSelector((state: any) => state.chat)
  const { currentUserData }: UserState = useSelector((state: any) => state.user)
  const messagesDivRef = React.useRef<HTMLDivElement>(null)
  const dispach = useDispatch()

  const getMessages = async () => {
    try {
      setLoading(true)
      const response = await GetChatMessages(selectedChat?.id!)
      if (response.error) throw new Error(response.error)
      setMessages(response)
    } catch (error: any) {
      console.log(error.message)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {

    getMessages()


  }, [selectedChat]);

  useEffect(() => {

    socket.on("new-message-received", (message: MessageType) => {


      if (selectedChat?.id === message.chat.id) {
        setMessages((prev) => {

          const messageAlreadyExists = prev.find(
            (msg) => msg.socketMessageId === message.socketMessageId
          )
          if (messageAlreadyExists) return prev;
          else return [...prev, message];
        });
      }
    })
  }, [selectedChat])

  useEffect(() => {
    if (messagesDivRef.current) {
      messagesDivRef.current.scrollTop = messagesDivRef.current.scrollHeight + 100;
    }
    ReadAllMessages({
      userId: currentUserData?.id!,
      chatId: selectedChat?.id!,
    });

    const newChats = chats.map((chat) => {
      if (chat.id === selectedChat?.id) {
        let chatData = { ...chat };
        chatData.unreadCounts = { ...chat.unreadCounts };
        chatData.unreadCounts[currentUserData.id] = 0;
        return chatData;
      } else {
        return chat;
      }
    });

    dispach(SetChats(newChats));
  }, [selectedChat, messages]);

  return (
    <div className='flex-1 p-3 overflow-y-auto' ref={messagesDivRef}>
      <div className="flex flex-col gap-3">
        {[...messages]
          .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
          .map((message) => (
            <Message key={message.id || message.socketMessageId} message={message} />
          ))}
        {/*{messages.map((message) => {
          return <Message key={message.id || message.socketMessageId} message={message}/>
        })}*/}
      </div>
    </div>
  )
}
