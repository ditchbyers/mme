import { HeartIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { CreateNewChat } from "@/server-actions/chats"
import socket from "@/config/socket-config"
import { SetChats, SetSelectedChat } from "@/redux/chatSlice"
import { UserState } from "@/redux/userSlice"

interface HeartButtonSimpleProps {
  userId: string
}

export function HeartButtonSimple({ userId }: HeartButtonSimpleProps) {
  const { currentUserData }: UserState = useSelector((state: any) => state.user)
  const chats = useSelector((state: any) => state.chat.chats)
  const dispatch = useDispatch()

  const [liked, setLiked] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!currentUserData?.id) return

    const existingChat = chats.find((chat: any) => {
      if (!chat.users) return false
      const chatUserIds = chat.users.map((u: any) => u.id || u)
      return (
        chatUserIds.length === 2 &&
        chatUserIds.includes(userId) &&
        chatUserIds.includes(currentUserData.id)
      )
    })

    setLiked(!!existingChat)
  }, [chats, userId, currentUserData?.id])

  const onAddToChat = async () => {
    if (loading || liked) return
    try {
      setLoading(true)

      const response = await CreateNewChat(
        {
          users: [userId, currentUserData.id],
          createdBy: currentUserData.id!,
          isGroupChat: false,
        },
        { userId: currentUserData.id }
      )

      if (response.error) throw new Error(response.error)

      socket.emit("create-new-chat", {
        chat: response,
        senderId: currentUserData.id,
      })

      dispatch(SetChats([...chats, response]))
      dispatch(SetSelectedChat(response))
      setLiked(true)
    } catch (error: any) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <span
      title={liked ? "Chat already exists" : "Add to chat"}
    >
      <HeartIcon
        className={`w-5 h-5 cursor-pointer transition-colors ${
          liked ? "text-red-500" : "text-gray-600 hover:text-red-500"
        }`}
        onClick={onAddToChat}
      />
    </span>
  )
}
