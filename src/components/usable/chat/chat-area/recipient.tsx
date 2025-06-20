"use client"

import React, { useEffect } from "react"
import { ChatType } from "@/types"
import { ArrowLeft } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"

import socket from "@/config/socket-config"
import { ChatState, clearSelectedChat } from "@/lib/redux/chatSlice"
import { UserState } from "@/lib/redux/userSlice"

import RecipientInfo from "./recipient-info"

export default function Recipient() {
  const [typing = false, setTyping] = React.useState<boolean>(false)
  const [senderName = "", setSenderName] = React.useState<string>("")
  const [showRecipientInfo, setShowRecipientInfo] = React.useState<boolean>(false)
  const { selectedChat }: ChatState = useSelector((state: any) => state.chat)
  const { currentUserData }: UserState = useSelector((state: any) => state.user)
  const dispatch = useDispatch()

  let chatName = ""
  let chatImage = ""

  if (selectedChat?.isGroupChat) {
    chatName = selectedChat.groupName
    chatImage = selectedChat.groupProfilePicture
  } else {
    const recipient = selectedChat?.users.find((user) => user.id !== currentUserData?.id)
    chatName = recipient?.userName || ""
    chatImage = recipient?.profilePicture || ""
  }

  const typingAnimation = () => {
    if (typing)
      return (
        <span className="text-xs font-semibold text-green-700">
          {selectedChat?.isGroupChat && `${senderName} `}
          Typing...
        </span>
      )
  }

  useEffect(() => {
    const handleTyping = ({ chat, senderName }: { chat: ChatType; senderName: string }) => {
      if (selectedChat?.id === chat.id) {
        setTyping(true)
        if (chat.isGroupChat) {
          setSenderName(senderName)
        }
        setTimeout(() => setTyping(false), 2000)
      }
    }

    socket.on("typing", handleTyping)

    return () => {
      socket.off("typing", handleTyping)
    }
  }, [selectedChat])

  return (
    <div className="flex w-full cursor-pointer items-center justify-between border-b border-gray-200 bg-gray-300 px-5 py-3">
      <div className="flex items-center gap-4">
        <ArrowLeft className="h-5 w-5 cursor-pointer text-gray-600" onClick={() => dispatch(clearSelectedChat())} />
        <div className="flex items-center gap-3" onClick={() => setShowRecipientInfo(true)}>
          <img
            src={chatImage || "./image.png"}
            alt="Profile"
            className="h-10 w-10 rounded-full"
            onError={(e) => {
              ;(e.target as HTMLImageElement).src = "./image.png"
            }}
          />
          <div className="flex flex-col gap-1">
            <span className="text-sm text-gray-700">{chatName}</span>
            {typingAnimation()}
          </div>
        </div>
      </div>

      {showRecipientInfo && <RecipientInfo {...{ showRecipientInfo, setShowRecipientInfo }} />}
    </div>
  )
}
