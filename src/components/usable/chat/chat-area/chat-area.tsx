import React from "react"
import { DivProps } from "@/types"

import Messages from "./messages"
import NewMessages from "./new-messages"
import Recipient from "./recipient"

/**
 * Chat area component that contains the complete chat interface
 * Combines recipient info, message history, and new message input
 *
 * @param className - Optional CSS class name for styling
 * @returns JSX element containing the complete chat area layout
 */
export function ChatArea({ className }: DivProps) {
  return (
    <>
      <Recipient />
      <Messages />
      <NewMessages />
    </>
  )
}
