import React from "react"
import Link from "next/link"
import { GetAllUsers } from "@/server-actions/users"

import GroupForm from "../../../../../components/usable/group/group-form"

export default async function CreateGroupPage() {
  const { users } = await GetAllUsers()

  return (
    <div className="p-5">
      <Link className="text-primary border-primary border border-solid px-5 py-2 text-sm no-underline" href="/chat">
        Back to Chats
      </Link>
      <h1 className="text-primary mt-5 py-2 text-xl font-bold uppercase">Create Group Chat</h1>
      <GroupForm initialData={null} />
    </div>
  )
}
