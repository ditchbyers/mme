"use client"

import React, { useEffect, useRef, useState } from "react"
import { GetChatMessages, ReadAllMessages } from "@/server-actions/messages"
import { MessageType } from "@/types"
import { useDispatch, useSelector } from "react-redux"

import socket from "@/config/socket-config"
import { ChatState, SetChats } from "@/lib/redux/chatSlice"
import { UserState } from "@/lib/redux/userSlice"

import Message from "./message"

/**
 * Messages container component for displaying chat message history
 * Handles real-time message updates, auto-scrolling, and unread message tracking
 * Fetches and displays all messages for the selected chat
 *
 * @param messageID - Optional message ID for direct message linking
 * @returns JSX element containing the scrollable message history
 */
export default function Messages({ messageID = "" }: { messageID?: string }) {
  const [messages, setMessages] = useState<MessageType[]>([])
  const [loading, setLoading] = useState(false)
  const { selectedChat, chats }: ChatState = useSelector((state: any) => state.chat)
  const { currentUserData }: UserState = useSelector((state: any) => state.user)
  const messagesDivRef = useRef<HTMLDivElement>(null)
  const dispach = useDispatch()

  const getMessages = async () => {
    try {
      setLoading(true)
      const response = await GetChatMessages(selectedChat?.id!, currentUserData?.id!)
      if (response.error) throw new Error(response.error)
      setMessages(response)
    } catch (error: any) {
      console.log(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getMessages()
  }, [selectedChat])

  useEffect(() => {
    socket.on("new-message-received", (message: MessageType) => {
      if (selectedChat?.id === message.chat.id) {
        setMessages((prev) => {
          const messageAlreadyExists = prev.find((msg) => msg.socketMessageId === message.socketMessageId)
          if (messageAlreadyExists) return prev
          else return [...prev, message]
        })
      }
    })
  }, [selectedChat])

  useEffect(() => {
    if (messagesDivRef.current) {
      messagesDivRef.current.scrollTop = messagesDivRef.current.scrollHeight + 100
    }

    const newChats = chats.map((chat) => {
      if (chat.id === selectedChat?.id) {
        let chatData = { ...chat }
        chatData.unreadCounts = { ...chat.unreadCounts }
        chatData.unreadCounts[currentUserData.id] = 0
        return chatData
      } else {
        return chat
      }
    })

    dispach(SetChats(newChats))
  }, [selectedChat, messages])

  return (
    <div className="flex-1 overflow-y-auto" ref={messagesDivRef}>
      <div className="flex flex-col gap-3 p-3">
        {[...messages]
          .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
          .map((message) => (
            <Message key={message.id || message.socketMessageId} message={message} />
          ))}
      </div>
    </div>
  )
}
