import React from "react"
import { DivProps } from "@/types"

import Messages from "./messages"
import NewMessages from "./new-messages"
import Recipient from "./recipient"

export function ChatArea({ className }: DivProps) {
  return (
    <>
      <Recipient />
      <Messages />
      <NewMessages />
    </>
  )
}
