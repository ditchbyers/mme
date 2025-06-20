"use client"

import React, { useEffect } from "react"
import { SendNewMessage } from "@/server-actions/messages"
import dayjs from "dayjs"
import EmojiPicker from "emoji-picker-react"
import { ImagePlus, Smile } from "lucide-react"
import { useSelector } from "react-redux"

import socket from "@/config/socket-config"
import { ChatState } from "@/lib/redux/chatSlice"
import { UserState } from "@/lib/redux/userSlice"
import { Button } from "@/components/ui/button"

import ImageSelector from "./image-selector"

export default function NewMessages() {
  const [text, setText] = React.useState("")
  const { currentUserData }: UserState = useSelector((state: any) => state.user)
  const { selectedChat }: ChatState = useSelector((state: any) => state.chat)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [showEmojiPicker, setShowEmojiPicker] = React.useState(false)
  const [showImageSelector, setShowImageSelector] = React.useState(false)

  const onSend = async () => {
    try {
      if (!text) return

      const commonPayloaddb = {
        text,
        image: "",
        socketMessageId: dayjs().unix().toString(),
        createdAt: dayjs().toISOString(),
      }

      const commonPayloadsk = {
        text,
        image: "",
        socketMessageId: dayjs().unix(),
        createdAt: dayjs().toISOString(),
      }

      const socketPayload = {
        ...commonPayloadsk,
        chat: selectedChat,
        sender: currentUserData,
      }

      socket.emit("send-new-message", socketPayload)
      setText("")
      setShowEmojiPicker(false)
      {
        const dbPayload = {
          ...commonPayloaddb,
          sender: currentUserData?.id!,
          chat: selectedChat?.id!,
        }
        await SendNewMessage(dbPayload)
      }
    } catch (error: any) {
      console.log(error)
    }
  }

  useEffect(() => {
    socket.emit("typing", { chat: selectedChat, senderId: currentUserData?.id, senderName: currentUserData?.name! })
  }, [selectedChat, text])

  return (
    <div className="relative flex items-center justify-center gap-5 border-0 border-t border-solid border-gray-200 bg-gray-100 p-3">
      <div className="flex gap-5">
        {showEmojiPicker && (
          <div className="absolute bottom-20 left-5">
            <EmojiPicker
              onEmojiClick={(emojiObject: any) => {
                setText((prevText) => prevText + emojiObject.emoji)
                inputRef.current?.focus()
              }}
            />
          </div>
        )}
        <Button className="" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
          <Smile className="h-5 w-5" />
        </Button>
      </div>
      <div className="flex-1">
        <input
          type="text"
          placeholder="Type a message"
          className="h-[45px] w-full border border-solid border-gray-300 px-5 focus:border-gray-500 focus:outline-none"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && text.trim() !== "") {
              onSend()
            }
          }}
        />
      </div>
      <Button onClick={onSend}>SEND</Button>

      {showImageSelector && (
        <ImageSelector setShowImageSelector={setShowImageSelector} showImageSelector={showImageSelector} />
      )}
    </div>
  )
}
