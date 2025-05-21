import { SetChats } from '@/redux/chatSlice'
import { UserState } from '@/redux/userSlice'
import { GetAllChats } from '@/server-actions/chats'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

export default function ChatsList() {
  const dispatch = useDispatch()
  const { currentUserData }: UserState = useSelector((state: any) => state.user)
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
    getChats()
  }, [currentUserData])

  return (
    <div>chats-list</div>
  )
}
