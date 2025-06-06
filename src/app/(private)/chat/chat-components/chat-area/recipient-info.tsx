import { Button } from '@/components/ui/button'
import { formatDateTime } from '@/helpers/date-formats'
import { ChatState } from '@/redux/chatSlice'
import { UserState } from '@/redux/userSlice'
import { Drawer } from 'antd'
import React from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'

export default function RecipientInfo({
    showRecipientInfo,
    setShowRecipientInfo
}: {
    showRecipientInfo: boolean
    setShowRecipientInfo: React.Dispatch<React.SetStateAction<boolean>>
}) {
    const { selectedChat }: ChatState = useSelector((state: any) => state.chat)
    const { currentUserData }: UserState = useSelector((state: any) => state.user)
    const router = useRouter()

    let chatName = "" , chatImage = "", chatBio = "", chatLocation = "", chatLanguage = "", chatGames = "", chatPlatform = "", chatUserName = ""
    if (selectedChat?.isGroupChat) {
        chatName = selectedChat.groupName
        chatImage = selectedChat.groupProfilePicture
        chatBio = selectedChat.groupBio
    } else {
        const recipient = selectedChat?.users.find(
            (user) => user.id !== currentUserData?.id
        )
        console.log("recipient", recipient)
        chatName = recipient?.name || ""
        chatUserName = recipient?.userName || ""
        chatImage = recipient?.profilePicture || ""
        chatBio = recipient?.bio || ""
        chatLanguage = recipient?.language || ""
        chatLocation = recipient?.location || ""
        chatGames = recipient?.games ? recipient.games.join(", ") : ""
        chatPlatform = recipient?.platforms ? recipient.platforms.join(", ") : ""
    }

    const getProperty = (key: string, value: string) => {
        return (
            <div className="flex flex-col">
                <span className="font-semibold text-gray-700">{key}</span>
                <span className="text-gray-600">{value}</span>
            </div>
        )
    }


    return (
        <Drawer
            open={showRecipientInfo}
            onClose={() => setShowRecipientInfo(false)}
        >
            <div className="flex justify-center flex-col items-center gap-5">
                <img
                    src={chatImage || './image.png'}
                    alt="Profile"
                    className='w-28 h-28 rounded-full'
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = './image.png';
                    }}
                />
                {selectedChat?.isGroupChat && (
                <span className='text-gray-600'>{chatName}</span>
                )}
                {!selectedChat?.isGroupChat && (
                    <span className='text-gray-600'>{chatUserName}</span>
                )}
            </div>



            {selectedChat?.isGroupChat && (
                <>
                    <div className="w-full border-t border-gray-300 my-4" />

                    <div className="flex flex-col gap-5 my-4">
                        <div className='flex justify-between items-center'>
                            <span className="text-grey-500 text-sm">{selectedChat.users.length} Members</span>
                            <Button onClick={() => router.push(`/chat/groups/edit-group/${selectedChat.id}`)}>
                                Edit Group
                            </Button>
                        </div>
                        {selectedChat?.users.map((user: any) => (
                            <div key={user.id} className="flex items-center gap-3">
                                <img
                                    src={user.profilePicture || './image.png'}
                                    alt="Profile"
                                    className='w-10 h-10 rounded-full'
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = './image.png';
                                    }}
                                />
                                <span className='text-gray-700 text-sm'>{user.name}</span>
                            </div>
                        ))}
                    </div>
                </>
            )}

            <div className="w-full border-t border-gray-300 my-4" />
            <div className="flex flex-col gap-5">
                {getProperty("Created On", formatDateTime(selectedChat?.createdAt!))}
                {selectedChat?.isGroupChat && (
                    <>
                        {getProperty("Created By", selectedChat?.createdBy?.name! || "")}
                    </>
                )}
                {!selectedChat?.isGroupChat && (
                    <>
                        {getProperty("Location", chatLocation || "")}
                        {getProperty("Language", chatLanguage || "")}
                        {getProperty("Games", chatGames || "")}
                        {getProperty("Platforms", chatPlatform || "")}
                    </>
                )}
                {getProperty("Bio", chatBio || "")}


            </div>
        </Drawer>
    )
}