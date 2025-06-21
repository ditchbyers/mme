import React from "react"
import Link from "next/link"
import { formatDateTime } from "@/helpers/date-formats"
import { ChatType } from "@/types"
import { useDispatch, useSelector } from "react-redux"

import { ChatState, SetSelectedChat } from "@/lib/redux/chatSlice"
import { UserState } from "@/lib/redux/userSlice"

type ChatWithUnreadCounts = ChatType & {
  unreadCounts?: { [userId: string]: number }
}

type Props = {
  chat: ChatType
  onSelect: () => void
}

function ChatCard({ chat, onSelect }: Props) {
  const dispatch = useDispatch()
  const { currentUserData, onlineUsers }: UserState = useSelector((state: any) => state.user)
  const { selectedChat }: ChatState = useSelector((state: any) => state.chat)
  const chatWithUnread = chat as ChatWithUnreadCounts

  let chatName = ""
  let chatImage = ""
  let lastMessage = ""
  let lastMessageSenderName = ""
  let lastMessageTime = ""

  if (chat.isGroupChat) {
    chatName = chat.groupName
    chatImage = chat.groupProfilePicture
  } else {
    const receipient = chat.users.find((user) => user.id !== currentUserData?.id)
    chatName = receipient?.userName || ""
    chatImage = receipient?.profilePicture!
  }

  if (chat.lastMessage?.sender) {
    lastMessageSenderName =
      chat.lastMessage.sender.id === currentUserData?.id ? "You :" : `${chat.lastMessage.sender.name.split(" ")[0]} :`
    const dateWithAdded2Hours = new Date(chat.lastMessage.createdAt)
    dateWithAdded2Hours.setHours(dateWithAdded2Hours.getHours() + 2)
    lastMessageTime = formatDateTime(dateWithAdded2Hours.toISOString())
    lastMessage = chat.lastMessage.text
  }

  const isSelected = selectedChat?.id === chat.id

  const unreadCounts = () => {
    if (!chat.unreadCounts || !chat.unreadCounts[currentUserData?.id!] || chat.id === selectedChat?.id) {
      return null
    }

    return (
      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-700">
        <span className="text-xs text-white">{chat.unreadCounts[currentUserData?.id!]}</span>
      </div>
    )
  }

  const onlineIndicator = () => {
    if (chat.isGroupChat) return null
    const recipientId = chat.users.find((user) => user.id !== currentUserData.id)?.id
    if (onlineUsers.includes(recipientId!)) {
      return <div className="h-2 w-2 rounded-full bg-green-500"></div>
    }
  }

  return (
    <div
      // href={`/chat/${chat.id}`}
      className={`flex cursor-pointer justify-between rounded-md px-2 py-3 hover:bg-gray-100 ${isSelected ? "border border-solid border-gray-300 bg-gray-200" : ""}`}
      onClick={onSelect}
    >
      <div className="flex items-center gap-3">
        <img
          src={chatImage || "./image.png"}
          alt="Profile"
          className="size-10 rounded-full"
          onError={(e) => {
            ; (e.target as HTMLImageElement).src = "./image.png"
          }}
        />
        <div className="flex flex-col gap-1">
          <span className="text flex items-center gap-2 font-bold text-gray-700">
            {chatName}
            {onlineIndicator()}
          </span>
          <span className="max-w-[260px] overflow-hidden text-xs text-ellipsis whitespace-nowrap text-gray-700">
            {lastMessageSenderName} {lastMessage}
          </span>
        </div>
      </div>

      <div>
        {unreadCounts()}
        <span className="text-xs text-gray-500">{lastMessageTime}</span>
      </div>
    </div>
  )
}

export default ChatCard
