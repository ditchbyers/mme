import { Button } from '@/components/ui/button'
import socket from '@/config/socket-config'
import { ChatState } from '@/redux/chatSlice'
import { UserState } from '@/redux/userSlice'
import { SendNewMessage } from '@/server-actions/messages'
import dayjs from 'dayjs'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Smile, ImagePlus } from 'lucide-react'
import EmojiPicker from 'emoji-picker-react';
import ImageSelector from './image-selector'


export default function NewMessages
  () {
  const [text, setText] = React.useState('')
  const { currentUserData }: UserState = useSelector((state: any) => state.user)
  const { selectedChat }: ChatState = useSelector((state: any) => state.chat)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [showEmojiPicker, setShowEmojiPicker] = React.useState(false)
  const [showImageSelector, setShowImageSelector] = React.useState(false)

  const onSend = async () => {
    try {
      if (!text) return;

      const commonPayloaddb = {
        text,
        image: '',
        socketMessageId: dayjs().unix().toString(),
      }

      const commonPayloadsk = {
        text,
        image: '',
        socketMessageId: dayjs().unix(),
      }

      const socketPayload = {
        ...commonPayloadsk,
        chat: selectedChat,
        sender: currentUserData,
      }

      socket.emit('send-new-message', socketPayload)
      setText('')
      setShowEmojiPicker(false)
      {
        const dbPayload = {
          ...commonPayloaddb,
          sender: currentUserData?.id!,
          chat: selectedChat?.id!
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
    <div
      className='p-3 bg-gray-100 border-0 border-t border-solid border-gray-200 flex gap-5 justify-center items-center relative'>
      <div className='gap-5 flex'>
        {showEmojiPicker && <div className="absolute left-5 bottom-20"><EmojiPicker
          onEmojiClick={(emojiObject: any) => {
            setText((prevText) => prevText + emojiObject.emoji);
            inputRef.current?.focus();
          }} /></div>}
        <Button className="" onClick={() => setShowEmojiPicker(!showEmojiPicker)}><Smile className="w-5 h-5" /></Button>
        {/* Todo: hier noch Logik um Bilder Upzuloaden <Button className = ""onClick={()=> setShowImageSelector(!showImageSelector)}><ImagePlus className="w-5 h-5" /></Button>*/}
      </div>
      <div className='flex-1'>
        <input
          type="text"
          placeholder='Type a message'
          className='w-full border border-solid border-gray-300 focus:outline-none focus:border-gray-500 h-[45px] px-5'
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && text.trim() !== '') {
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