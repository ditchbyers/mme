import React, { useEffect } from "react"
import { ChatState, SetChats } from "@/redux/chatSlice"
import store from "@/redux/store"
import { UserState } from "@/redux/userSlice"
import { GetAllChats } from "@/server-actions/chats"
import { ChatType, MessageType } from "@/types"
import { Spin } from "antd"
import { useDispatch, useSelector } from "react-redux"

import socket from "@/config/socket-config"

import ChatCard from "./chat-card"

export default function ChatsList() {
  const dispatch = useDispatch()
  const { currentUserData }: UserState = useSelector((state: any) => state.user)
  const { chats, selectedChat }: ChatState = useSelector((state: any) => state.chat)
  const [loading, setLoading] = React.useState(false)

  const getChats = async () => {
    try {
      setLoading(true)
      const response = await GetAllChats(currentUserData?.id!)
      if (response.error) throw new Error("No chat found")
      console.log("response", response)

      dispatch(SetChats(response))
    } catch (error: any) {
      console.error("Error fetching chats", error.message || error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (currentUserData) {
      getChats()
    }
  }, [currentUserData])

  useEffect(() => {
    socket.on("new-message-received", (newMessage: MessageType) => {
      let { chats }: ChatState = store.getState().chat
      let prevChats = [...chats]

      let indexOfChatToUpdate = prevChats.findIndex((chat) => chat.id === newMessage.chat.id)
      if (indexOfChatToUpdate === -1) return

      let chatToUpdate = prevChats[indexOfChatToUpdate]

      if (chatToUpdate.lastMessage && chatToUpdate.lastMessage.socketMessageId === newMessage.socketMessageId) return

      let chatToUpdateCopy: ChatType = { ...chatToUpdate }
      chatToUpdateCopy.lastMessage = newMessage
      chatToUpdateCopy.updatedAt = newMessage.createdAt
      chatToUpdateCopy.unreadCounts = { ...(chatToUpdate.unreadCounts || {}) }

      if (newMessage.sender.id !== currentUserData?.id && selectedChat?.id !== newMessage.chat.id) {
        chatToUpdateCopy.unreadCounts[currentUserData?.id!] =
          (chatToUpdateCopy.unreadCounts[currentUserData?.id!] || 0) + 1
      }

      prevChats[indexOfChatToUpdate] = chatToUpdateCopy

      prevChats = [prevChats[indexOfChatToUpdate], ...prevChats.filter((chat) => chat.id !== newMessage.chat.id)]
      dispatch(SetChats(prevChats))
    })
    return () => {
      socket.off("new-message-received")
    }
  }, [currentUserData?.id, selectedChat])

  useEffect(() => {
    socket.on("new-chat-created", (newChat: ChatType) => {
      let { chats }: ChatState = store.getState().chat

      const chatExists = chats.find((chat) => chat.id === newChat.id)
      if (chatExists) return

      const updatedChats = [newChat, ...chats]
      dispatch(SetChats(updatedChats))
    })

    return () => {
      socket.off("new-chat-created")
    }
  }, [])

  return (
    <div>
      {chats.length > 0 && (
        <div className="mt-5 flex flex-col gap-5">
          {chats.map((chat) => {
            console.log("CHATS", chats)
            return <ChatCard key={chat.id} chat={chat} />
          })}
        </div>
      )}

      {loading && (
        <div className="items-center, mt-32 flex justify-center">
          <div className="flex flex-col">
            <Spin />
            <span className="my-5 text-sm text-gray-500">Loading chats...</span>
          </div>
        </div>
      )}
    </div>
  )
}
