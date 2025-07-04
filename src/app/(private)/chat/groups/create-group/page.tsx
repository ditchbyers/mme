import React from "react"
import Link from "next/link"
import { GetAllUsers } from "@/server-actions/users"

import GroupForm from "../../../../../components/usable/group/group-form"

/**
 * Create group chat page component
 * Provides an interface for users to create new group chats
 * Fetches all available users and displays a form for group creation
 *
 * @returns JSX element containing the group creation form with navigation
 */
export default async function CreateGroupPage() {
  const { users } = await GetAllUsers()

  return (
    <div className="container mx-auto p-6">
      <Link className="text-primary border-primary border border-solid px-5 py-2 text-sm no-underline" href="/chat">
        Back to Chats
      </Link>
      <h1 className="text-primary mt-4 py-2 text-xl font-bold uppercase">Create Group Chat</h1>
      <GroupForm initialData={null} />
    </div>
  )
}
