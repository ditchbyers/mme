"use client"

import { useEffect, useState } from "react"
import { GetAllChats } from "@/server-actions/chats"
import { ChatType, MessageType } from "@/types"
import { Spin } from "antd"
import { useDispatch, useSelector } from "react-redux"

import socket from "@/config/socket-config"
import { ChatState, SetChats, SetSelectedChat } from "@/lib/redux/chatSlice"
import store from "@/lib/redux/store"
import { UserState } from "@/lib/redux/userSlice"

import ChatCard from "./chat-card"

type ChatsListProps = {
  searchQuery: string
}
/**
 * Chats list component for displaying and managing user's chat conversations
 * Handles real-time chat updates, search filtering, and chat selection
 * Manages socket connections for new messages and chat creation events
 *
 * @param searchQuery - Current search query for filtering chats by name or participants
 * @returns JSX element containing the filtered and sorted list of chat cards
 */
export default function ChatsList({ searchQuery }: ChatsListProps) {
  const dispatch = useDispatch()
  const { currentUserData }: UserState = useSelector((state: any) => state.user)
  const { chats, selectedChat }: ChatState = useSelector((state: any) => state.chat)
  const [loading, setLoading] = useState(false)

  const getChats = async () => {
    try {
      setLoading(true)
      const response = await GetAllChats(currentUserData?.id!)
      if (response.error) throw new Error("No chat found")
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
      if (chatToUpdate.lastMessage?.socketMessageId === newMessage.socketMessageId) return

      let chatToUpdateCopy: ChatType = { ...chatToUpdate }
      chatToUpdateCopy.lastMessage = newMessage
      chatToUpdateCopy.updatedAt = newMessage.createdAt
      chatToUpdateCopy.unreadCounts = { ...(chatToUpdate.unreadCounts || {}) }

      if (newMessage.sender.id !== currentUserData?.id && selectedChat?.id !== newMessage.chat.id) {
        chatToUpdateCopy.unreadCounts[currentUserData?.id!] =
          (chatToUpdateCopy.unreadCounts[currentUserData?.id!] || 0) + 1
      }

      prevChats[indexOfChatToUpdate] = chatToUpdateCopy
      prevChats = [chatToUpdateCopy, ...prevChats.filter((chat) => chat.id !== newMessage.chat.id)]

      dispatch(SetChats(prevChats))
    })

    return () => {
      socket.off("new-message-received")
    }
  }, [currentUserData?.id, selectedChat])

  useEffect(() => {
    socket.on("new-chat-created", (newChat: ChatType) => {
      let { chats }: ChatState = store.getState().chat
      if (chats.find((chat) => chat.id === newChat.id)) return
      dispatch(SetChats([newChat, ...chats]))
    })

    return () => {
      socket.off("new-chat-created")
    }
  }, [])

  const filteredChats = chats.filter((chat) => {
    const query = searchQuery.toLowerCase()

    // Match group name
    const groupNameMatch = chat.groupName?.toLowerCase().includes(query)

    // Match any participant userName
    const userMatch = chat.users?.some((p) => p.userName.toLowerCase().includes(query))

    return groupNameMatch || userMatch
  })

  return (
    <div>
      {filteredChats.length > 0 && (
        <div className="mt-5 flex flex-col">
          {filteredChats.map((chat) => (
            <ChatCard
              key={chat.id}
              chat={chat}
              onSelect={() => {
                dispatch(SetSelectedChat(chat))
              }}
            />
          ))}
        </div>
      )}

      {!loading && filteredChats.length === 0 && searchQuery && (
        <div className="mt-10 text-center text-sm text-gray-500 italic">No chats found</div>
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
