import { ChatState, SetChats } from '@/redux/chatSlice'
import { UserState } from '@/redux/userSlice'
import { GetAllChats } from '@/server-actions/chats'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ChatCard from './chat-card'
import { Spin } from 'antd'

export default function ChatsList() {
  const dispatch = useDispatch()
  const { currentUserData }: UserState = useSelector((state: any) => state.user)
  const { chats }: ChatState = useSelector((state: any) => state.chat)
  const [loading, setLoading] = React.useState(false)

  const getChats = async () => {
    try {
      setLoading(true)
      const response = await GetAllChats(currentUserData?._id!)
      console.log(response)
      if (response.error) throw new Error("No chat found")
      dispatch(SetChats(response))
    } catch (error: any) {
      error.message("Error fetching chats")
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    if (currentUserData) getChats()
  }, [currentUserData])

  return (
    <div>
      {chats.length > 0 && (
        <div className="flex flex-col gap-5 mt-5">
          {chats.map((chat) => {
            return <ChatCard key={chat._id} chat={chat}/>
          })}
        </div>
      )}

      {loading && (
        <div className="flex mt-32 items-center, justify-center">
          <div className="flex flex-col ">
            <Spin />
            <span className='text-gray-500 text-sm my-5'>
              Loading chats...
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
