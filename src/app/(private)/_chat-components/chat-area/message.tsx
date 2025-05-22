import { MessageType } from '@/interfaces'
import React from 'react'
import { ChatState } from '@/redux/chatSlice'
import { useSelector } from 'react-redux'
import { UserState } from '@/redux/userSlice'
import dayjs from 'dayjs'
import { formatDateTime } from '@/helpers/date-formats'

export default function Message({ message }: { message: MessageType }) {

    const { selectedChat }: ChatState = useSelector((state: any) => state.chat)
    const { currentUserData }: UserState = useSelector((state: any) => state.user)


    const isLoggedInUserMessage = message.sender._id === currentUserData._id
    if (isLoggedInUserMessage) {
        return (
            <div className="flex justify-end gap-2">
                <div className="flex flex-col gap-1 items-end">
                    <span className="text-gray-500 text-xs">You</span>
                    <p className="bg-primary text-white py-2 px-7 rounded-xl rounded-tr-none m-0 text-sm">
                        {message.text}
                    </p>
                    <span className="text-gray-500 text-xs">
                        {formatDateTime(message.createdAt)}
                    </span>
                </div>
                <img
                    src={message.sender.profilePicture}
                    alt="avatar"
                    className="w-6 h-6 rounded-full"
                />
            </div>
        )
    } else {
        return (
            <div className="flex gap-2">
                <img src={message.sender.profilePicture} alt="avatar" className='w-6 h-6 rounded-full ' />
                <div className='flex flex-col gap-2'>
                    <span className='text-gray-500 text-xs'>{message.sender.name}</span>
                    <p className='bg-gray-200 text-primary py-2 px-7 rounded-xl rounded-tl-none m-0 text-sm'>{message.text}</p>
                    <span className='text-gray-500 text-xs'>{formatDateTime(message.createdAt)}</span>
                </div>
            </div>
        )
    }

}
