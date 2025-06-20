import React from "react"
import { useRouter } from "next/navigation"
import { formatDateTime } from "@/helpers/date-formats"
import { Drawer } from "antd"
import { useSelector } from "react-redux"

import { ChatState } from "@/lib/redux/chatSlice"
import { UserState } from "@/lib/redux/userSlice"
import { Button } from "@/components/ui/button"

export default function RecipientInfo({
  showRecipientInfo,
  setShowRecipientInfo,
}: {
  showRecipientInfo: boolean
  setShowRecipientInfo: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const { selectedChat }: ChatState = useSelector((state: any) => state.chat)
  const { currentUserData }: UserState = useSelector((state: any) => state.user)
  const router = useRouter()

  let chatName = "",
    chatImage = "",
    chatBio = "",
    chatLocation = "",
    chatLanguage = "",
    chatGames = "",
    chatPlatform = "",
    chatUserName = ""
  if (selectedChat?.isGroupChat) {
    chatName = selectedChat.groupName
    chatImage = selectedChat.groupProfilePicture
    chatBio = selectedChat.groupBio
  } else {
    const recipient = selectedChat?.users.find((user) => user.id !== currentUserData?.id)
    console.log("recipient", recipient)
    chatName = recipient?.name || ""
    chatUserName = recipient?.userName || ""
    chatImage = recipient?.profilePicture || ""
    chatBio = recipient?.bio || ""
    chatLanguage = recipient?.language || ""
    chatLocation = recipient?.location || ""
    chatGames = recipient?.games ? recipient.games.map((game) => game.name).join(", ") || "" : ""
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
    <Drawer open={showRecipientInfo} onClose={() => setShowRecipientInfo(false)}>
      <div className="flex flex-col items-center justify-center gap-5">
        <img
          src={chatImage || "./image.png"}
          alt="Profile"
          className="h-28 w-28 rounded-full"
          onError={(e) => {
            ;(e.target as HTMLImageElement).src = "./image.png"
          }}
        />
        {selectedChat?.isGroupChat && <span className="text-gray-600">{chatName}</span>}
        {!selectedChat?.isGroupChat && <span className="text-gray-600">{chatUserName}</span>}
      </div>

      {selectedChat?.isGroupChat && (
        <>
          <div className="my-4 w-full border-t border-gray-300" />

          <div className="my-4 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <span className="text-grey-500 text-sm">{selectedChat.users.length} Members</span>
              <Button onClick={() => router.push(`/chat/groups/edit-group/${selectedChat.id}`)}>Edit Group</Button>
            </div>
            {selectedChat?.users.map((user: any) => (
              <div key={user.id} className="flex items-center gap-3">
                <img
                  src={user.profilePicture || "./image.png"}
                  alt="Profile"
                  className="h-10 w-10 rounded-full"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src = "./image.png"
                  }}
                />
                <span className="text-sm text-gray-700">{user.name}</span>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="my-4 w-full border-t border-gray-300" />
      <div className="flex flex-col gap-5">
        {getProperty("Created On", formatDateTime(selectedChat?.createdAt!))}
        {selectedChat?.isGroupChat && <>{getProperty("Created By", selectedChat?.createdBy?.name! || "")}</>}
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
