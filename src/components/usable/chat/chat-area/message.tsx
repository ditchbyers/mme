import React from "react"
import { formatDateTime } from "@/helpers/date-formats"
import { MessageType } from "@/types"
import { useSelector } from "react-redux"

import { UserState } from "@/lib/redux/userSlice"

/**
 * Individual message component for chat display
 * Renders a single message with different styling based on sender
 * Shows sender info, message content, and timestamp
 *
 * @param message - The message object containing text, sender info, and metadata
 * @returns JSX element displaying the formatted message
 */
export default function Message({ message }: { message: MessageType }) {
  const { currentUserData }: UserState = useSelector((state: any) => state.user)

  console.log(message)

  const isLoggedInUserMessage = message.sender.id === currentUserData.id
  if (isLoggedInUserMessage) {
    return (
      <div className="flex justify-end gap-2">
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs text-gray-500">You</span>
          <p className="bg-primary m-0 rounded-xl rounded-tr-none px-7 py-2 text-sm tracking-wide wrap-anywhere text-white">
            {message.text}
          </p>
          <span className="text-xs text-gray-500">{formatDateTime(message.createdAt)}</span>
        </div>
        <img src={message.sender.profilePicture} alt="avatar" className="h-6 w-6 rounded-full" />
      </div>
    )
  } else {
    return (
      <div className="flex gap-2">
        <img src={message.sender.profilePicture} alt="avatar" className="h-6 w-6 rounded-full" />
        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-500">{message.sender.name}</span>
          <p className="text-primary m-0 overflow-x-hidden rounded-xl rounded-tl-none bg-gray-200 px-7 py-2 text-sm tracking-wide wrap-anywhere">
            {message.text}
          </p>
          <span className="text-xs text-gray-500">{formatDateTime(message.createdAt)}</span>
        </div>
      </div>
    )
  }
}
