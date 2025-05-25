import { ChatState, SetChats } from '@/redux/chatSlice'
import { UserState } from '@/redux/userSlice'
import { GetAllChats } from '@/server-actions/chats'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ChatCard from './chat-card'
import { Spin } from 'antd'
import socket from '@/config/socket-config'
import { ChatType, MessageType } from '@/interfaces'
import store from '@/redux/store'

export default function ChatsList() {
  const dispatch = useDispatch()
  const { currentUserData }: UserState = useSelector((state: any) => state.user)
  const { chats, selectedChat }: ChatState = useSelector((state: any) => state.chat)
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
    if (currentUserData) getChats()
  }, [currentUserData])

  useEffect(() => {
    socket.on("new-message-received", (newMessage: MessageType) => {

      let { chats }: ChatState = store.getState().chat
      let prevChats = [...chats]

      let indexOfChatToUpdate = prevChats.findIndex(
        (chat) => chat._id === newMessage.chat._id
      )
      if (indexOfChatToUpdate === -1) return;

      let chatToUpdate = prevChats[indexOfChatToUpdate]

     if(chatToUpdate.lastMessage && chatToUpdate.lastMessage.socketMessageId === newMessage.socketMessageId) return;


      let chatToUpdateCopy: ChatType = { ...chatToUpdate }
      chatToUpdateCopy.lastMessage = newMessage
      chatToUpdateCopy.updatedAt = newMessage.createdAt
      chatToUpdateCopy.unreadCounts = { ...(chatToUpdate.unreadCounts || {}) }

      if (newMessage.sender._id !== currentUserData?._id &&
        selectedChat?._id !== newMessage.chat._id) {
        chatToUpdateCopy.unreadCounts[currentUserData?._id!] = (chatToUpdateCopy.unreadCounts[currentUserData?._id!] || 0) + 1;
      }

      prevChats[indexOfChatToUpdate] = chatToUpdateCopy;

      prevChats = [
        prevChats[indexOfChatToUpdate],
        ...prevChats.filter((chat) => chat._id !== newMessage.chat._id),
      ];
      dispatch(SetChats(prevChats))
    })
    return () => {
      socket.off("new-message-received");
    };
  }, [currentUserData?._id, selectedChat]
  )

  return (
    <div>
      {chats.length > 0 && (
        <div className="flex flex-col gap-5 mt-5">
          {chats.map((chat) => {
            return <ChatCard key={chat._id} chat={chat} />
          })}
        </div>
      )}

      {loading && (
        <div className="flex mt-32 items-center, justify-center">
          <div className="flex flex-col ">
            <Spin />
            <span className='text-gray-500 text-sm my-5'>
              Loading chats...
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
