import React from 'react'
import { Button } from '@/components/ui/button'
import { UserType } from '@/interfaces'
import { ChatState, SetChats } from '@/redux/chatSlice'
import { UserState } from '@/redux/userSlice'
import { CreateNewChat } from '@/server-actions/chats'
import { GetAllUsers } from '@/server-actions/users'
import { Divider, Modal, Spin } from 'antd'
import { useSelector, useDispatch } from 'react-redux'

export default function NewChatModal({
    showNewChatModal,
    setShowNewChatModal,
}:
    {
        showNewChatModal: boolean,
        setShowNewChatModal: React.Dispatch<React.SetStateAction<boolean>>

    }

) {
    const [loading, setLoading] = React.useState(false)
    const [users, setUsers] = React.useState<UserType[]>([])
    const [selectedUserId, setSelectedUserId] = React.useState<string | null>(null)
    const { currentUserData }: UserState = useSelector((state: any) => state.user)
    const visibleUsers = users.filter((user) => user.id !== currentUserData.id)
    const {chats} : ChatState = useSelector((state: any) => state.chat)
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
            const response = await CreateNewChat({
                users: [userId, currentUserData.id],
                createdBy: currentUserData.id!,
                isGroupChat: false,
            }, { userId: currentUserData.id })
            if (response.error) throw new Error(response.error)
            dispatch(SetChats([...chats, response]));
            setShowNewChatModal(false)
        } catch (error: any) {
            
        } finally {
            setLoading(false)
        }
    }

    React.useEffect(() => {
        if (showNewChatModal) {
            getUsers()
        }
    }, [showNewChatModal])

    return (
        <Modal
            open={showNewChatModal}
            onCancel={() => setShowNewChatModal(false)}
            footer={null}
            centered
            title={null}>

            <div className="flex flex-col gap-5">
                <h1 className="text-primary text-center text-xl, font-bold uppercase">
                    Create New Chat
                </h1>

                {loading && !selectedUserId && (
                    <div className="flex justify-center mt-20">
                        <Spin />
                    </div>
                )}

                {!loading && users.length > 0 && (
                    <div className="flex flex-col gap-2">
                        {users.map((user, index) => {
                            const chatAlreadyCreated = chats.find((chat) =>
                                chat.users.find((u) => u.id === user.id) && !chat.isGroupChat
                            );
                            if (user.id === currentUserData.id || chatAlreadyCreated) return null;
                            return (
                                <React.Fragment key={user.id}>
                                    <div className="flex justify-between items-center">
                                        <div className="flex gap-4 items-center">
                                            <img src={user.profilePicture} alt="avatar" className="w-10 h-10 rounded-full" />
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
                                    {index !== visibleUsers.length - 1 && (
                                        <Divider className="border-gray-200 my-0.5" />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                )}
            </div>
        </Modal>
    );
}

