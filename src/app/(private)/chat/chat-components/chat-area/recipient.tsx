import { ChatState } from '@/redux/chatSlice'
import { UserState } from '@/redux/userSlice'
import React from 'react'
import { useSelector } from 'react-redux'
import RecipientInfo from './recipient-info'

export default function Recipient() {
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
            (user) => user._id !== currentUserData?._id
        )
        chatName = recipient?.name || ""
        chatImage = recipient?.profilePicture || ""
    }

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
                <span className='text-gray-700 text-sm'>{chatName}</span>
            </div>
            {showRecipientInfo && (
                <RecipientInfo {...{ showRecipientInfo, setShowRecipientInfo }} />
            )}
        </div>
    )
}