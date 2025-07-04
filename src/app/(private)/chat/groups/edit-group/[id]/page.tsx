import React from "react"
import Link from "next/link"
import { GetChatDataById } from "@/server-actions/chats"

import GroupForm from "../../../../../../components/usable/group/group-form"

/**
 * Edit group chat page component
 * Allows users to modify existing group chat settings and members
 * Fetches current group data and pre-populates the form for editing
 *
 * @param params - Route parameters containing the group ID
 * @param params.id - The unique identifier of the group chat to edit
 * @returns JSX element containing the group edit form with navigation
 */
async function EditGroup({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const chat = await GetChatDataById(id)

  return (
    <div className="p-5">
      <Link className="text-primary border-primary border border-solid px-5 py-2 text-sm no-underline" href="/chat">
        Back to Chats
      </Link>
      <h1 className="text-primary mt-5 py-2 text-xl font-bold uppercase">Create Group Chat</h1>

      <GroupForm initialData={JSON.parse(JSON.stringify(chat))} />
    </div>
  )
}

export default EditGroup
