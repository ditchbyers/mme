import { MessageType } from '@/interfaces'
import { ChatState } from '@/redux/chatSlice'
import { GetChatMessages, ReadAllMessages } from '@/server-actions/messages'
import React from 'react'
import { useSelector } from 'react-redux'
import Message from './message'
import { UserState } from '@/redux/userSlice'

export default function Messages
  () {
  const [messages, setMessages] = React.useState<MessageType[]>([])
  const [loading, setLoading] = React.useState(false)
  const { selectedChat }: ChatState = useSelector((state: any) => state.chat)
  const { currentUserData}: UserState = useSelector((state: any) => state.user)

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

  return (
    <div className='flex-1 p-3 overflow-y-auto'>
      <div className="flex flex-col gap-3">
        {[...messages]
          .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
          .map((message) => (
            <Message key={message._id} message={message} />
          ))}
      </div>
    </div>
  )
}
