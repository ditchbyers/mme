import { ChatState } from '@/redux/chatSlice'
import { UserState } from '@/redux/userSlice'
import React from 'react'
import { useSelector } from 'react-redux'

export default function Recipient() {
    const { selectedChat }: ChatState = useSelector((state: any) => state.chat)
    const { currentUserData }: UserState = useSelector((state: any) => state.user)

    let chatName = ""
    let chatImage = ""

    if (selectedChat?.isGroupChat) {
        chatName = selectedChat.groupName
        chatImage = selectedChat.groupProfilePicture
    } else {
        const recipient = selectedChat?.users.find(
            (user) => user._id !== currentUserData?._id
        )
        chatName = recipient?.name || ""
        chatImage = recipient?.profilePicture || ""
    }

    return (
        <div className='flex justify-between items-center px-5 py-3 border-b border-gray-200 bg-gray-300 w-full'>
            <div className='flex gap-5 items-center'>
                <img src={chatImage} alt="Profile" className='w-10 h-10 rounded-full' />
                <span className='text-gray-700 text-sm'>{chatName}</span>
            </div>
        </div>
    )
}