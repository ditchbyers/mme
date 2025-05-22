import { MessageType } from '@/interfaces'
import { ChatState } from '@/redux/chatSlice'
import { GetChatMessages } from '@/server-actions/messages'
import React from 'react'
import { useSelector } from 'react-redux'
import Message from './message'

export default function Messages
  () {
  const [messages, setMessages] = React.useState<MessageType[]>([])
  const [loading, setLoading] = React.useState(false)
  const { selectedChat }: ChatState = useSelector((state: any) => state.chat)

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
    if (selectedChat) {
      getMessages()
    }
  }, [selectedChat])

  return (
    <div
      className='flex-1 p-3'>
      <div className="flex flex-col gap-3">
        {messages.map((message) => {
          return (
            <Message
              key={message._id}
              message={message}
            />
          )
        })}
      </div>
    </div>
  )
}
