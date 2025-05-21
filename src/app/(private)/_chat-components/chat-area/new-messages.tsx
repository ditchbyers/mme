import { Button } from '@/components/ui/button'
import { ChatState } from '@/redux/chatSlice'
import { UserState } from '@/redux/userSlice'
import { SendNewMessage } from '@/server-actions/messages'
import React from 'react'
import { useSelector } from 'react-redux'

export default function NewMessages
  () {
  const [text, setText] = React.useState('')
  const {currentUserData} : UserState = useSelector((state: any) => state.user)
  const {selectedChat}: ChatState = useSelector((state: any) => state.chat)

  const onSend = async () => {
    try {
      const dbPayload = {
        text, 
        image: "",
        sender: currentUserData?._id!,
        chat: selectedChat?._id!
      }
      const response = await SendNewMessage(dbPayload)
      if (response.error) throw new Error(response.error)
      setText('')
    } catch (error: any) {
      console.log(error)
    }
  }
  return (
    <div
      className='p-3 bg-gray-100 border-0 border-t border-solid border-gray-200 flex gap-5 justify-center items-center'>
      <div>
        {/*Emoji hier*/}
      </div>
      <div className='flex-1'>
        <input
          type="text"
          placeholder='Type a message'
          className='w-full border border-solid border-gray-300 focus:outline-none focus:border-gray-500 h-[45px] px-5'
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <Button onClick={onSend}>SEND</Button>
    </div>
  )
}
