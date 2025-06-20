import React, { Dispatch, Fragment, SetStateAction, use, useEffect, useState } from "react"
import { CreateNewChat } from "@/server-actions/chats"
import { GetAllUsers } from "@/server-actions/users"
import { UserType } from "@/types"
import { Divider, Modal, Spin } from "antd"
import { useDispatch, useSelector } from "react-redux"

import socket from "@/config/socket-config"
import { ChatState, SetChats } from "@/lib/redux/chatSlice"
import { UserState } from "@/lib/redux/userSlice"
import { Button } from "@/components/ui/button"

export default function NewChatModal({
  showNewChatModal,
  setShowNewChatModal,
}: {
  showNewChatModal: boolean
  setShowNewChatModal: Dispatch<SetStateAction<boolean>>
}) {
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState<UserType[]>([])
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const { currentUserData }: UserState = useSelector((state: any) => state.user)
  const visibleUsers = users.filter((user) => user.id !== currentUserData.id)
  const { chats }: ChatState = useSelector((state: any) => state.chat)
  const dispatch = useDispatch()

  const getUsers = async () => {
    try {
      setLoading(true)
      const response = await GetAllUsers()
      if (response.error) throw new Error("No user found")
      setUsers(response)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const onAddToChat = async (userId: string) => {
    try {
      setSelectedUserId(userId)
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

      console.log("Emitting create-new-chat")

      socket.emit("create-new-chat", {
        chat: response,
        senderId: currentUserData.id,
      })

      dispatch(SetChats([...chats, response]))
      setShowNewChatModal(false)
    } catch (error: any) {
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (showNewChatModal) {
      getUsers()
    }
  }, [showNewChatModal])

  return (
    <Modal open={showNewChatModal} onCancel={() => setShowNewChatModal(false)} footer={null} centered title={null}>
      <div className="flex flex-col gap-5">
        <h1 className="text-primary text-xl, text-center font-bold uppercase">Create New Chat</h1>

        {loading && !selectedUserId && (
          <div className="mt-20 flex justify-center">
            <Spin />
          </div>
        )}

        {!loading && users.length > 0 && (
          <div className="flex flex-col gap-2">
            {users.map((user, index) => {
              const chatAlreadyCreated = chats.find(
                (chat) => chat.users.find((u) => u.id === user.id) && !chat.isGroupChat
              )
              if (user.id === currentUserData.id || chatAlreadyCreated) return null
              return (
                <Fragment key={user.id}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img src={user.profilePicture} alt="avatar" className="h-10 w-10 rounded-full" />
                      <span className="text-gray-500">{user.name}</span>
                    </div>
                    <Button
                      loading={selectedUserId === user.id && loading}
                      variant="outline"
                      size="sm"
                      onClick={() => onAddToChat(user.id)}
                      disabled={!!chatAlreadyCreated}
                    >
                      {chatAlreadyCreated ? "Already in Chat" : "Add to Chat"}
                    </Button>
                  </div>
                  {index !== visibleUsers.length - 1 && <Divider className="my-0.5 border-gray-200" />}
                </Fragment>
              )
            })}
          </div>
        )}
      </div>
    </Modal>
  )
}
