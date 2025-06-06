import { ChatState } from '@/redux/chatSlice'
import { UserState } from '@/redux/userSlice'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import RecipientInfo from './recipient-info'
import { ChatType } from '@/interfaces'
import socket from '@/config/socket-config'


export default function Recipient() {
    const [typing = false, setTyping] = React.useState<boolean>(false)
    const [senderName = "", setSenderName] = React.useState<string>("")
    const [showRecipientInfo, setShowRecipientInfo] = React.useState<boolean>(false)
    const { selectedChat }: ChatState = useSelector((state: any) => state.chat)
    const { currentUserData }: UserState = useSelector((state: any) => state.user)

    let chatName = ""
    let chatImage = ""

    if (selectedChat?.isGroupChat) {
        chatName = selectedChat.groupName
        chatImage = selectedChat.groupProfilePicture
    } else {
        const recipient = selectedChat?.users.find(
            (user) => user.id !== currentUserData?.id
        )
        chatName = recipient?.userName || ""
        chatImage = recipient?.profilePicture || ""
    }

    const typingAnimation = () => {
        if (typing) return (
            <span className='text-green-700 font-semibold text-xs'>
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
        <div className='flex justify-between items-center px-5 py-3 border-b border-gray-200 bg-gray-300 w-full cursor-pointer'>

            <div className='flex gap-5 items-center' onClick={() => setShowRecipientInfo(true)}>
                <img
                    src={chatImage || './image.png'}
                    alt="Profile"
                    className='w-10 h-10 rounded-full'
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = './image.png';
                    }}
                />
                <div className='flex flex-col gap-1'>
                    <span className='text-gray-700 text-sm'>{chatName}</span>
                    {typingAnimation()}
                </div>
            </div>

            {showRecipientInfo && (
                <RecipientInfo {...{ showRecipientInfo, setShowRecipientInfo }} />
            )}
        </div>
    )