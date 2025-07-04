"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import NewChatModal from "./new-chat-modal"

type ChatsHeaderProps = {
  searchQuery: string
  setSearchQuery: (value: string) => void
}

/**
 * Header component for the chats list section
 * Provides search functionality and options to create new chats or groups
 * Includes dropdown menu for different chat creation options
 *
 * @param searchQuery - Current search query for filtering chats
 * @param setSearchQuery - Function to update the search query
 * @returns JSX element containing the chats header with search and actions
 */
export default function ChatsHeader({ searchQuery, setSearchQuery }: ChatsHeaderProps) {
  const [showNewChatModal, setShowNewChatModal] = React.useState(false)
  const router = useRouter()

  return (
    <div className="flex flex-col gap-4">
      {/* Header and New button */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-500 uppercase">Chats</h1>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="outline">
              New
              <ChevronDownIcon className="ml-1 size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setShowNewChatModal(true)} onSelect={(e) => e.preventDefault()}>
              New Chat
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => router.push("/chat/groups/create-group")}>New Group</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {showNewChatModal && (
          <NewChatModal setShowNewChatModal={setShowNewChatModal} showNewChatModal={showNewChatModal} />
        )}
      </div>

      {/* Search input */}
      <input
        type="text"
        placeholder="Search chats..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="focus:border-primary h-14 w-full rounded-md border border-solid border-gray-300 bg-blue-100/30 px-3 outline-none"
      />
    </div>
  )
}
