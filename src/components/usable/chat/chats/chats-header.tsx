"use client"
import React from 'react'

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronDownIcon } from "lucide-react"
import NewChatModal from './new-chat-modal'
import { useRouter } from 'next/navigation';

export default function ChatsHeader() {
    const [showNewChatModal, setShowNewChatModal] = React.useState(false)
    const router = useRouter();

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">

                <h1 className="text-xl text-gray-500 font-bold uppercase">Chats</h1>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="outline">
                            New
                            <ChevronDownIcon className="ml-1 size-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setShowNewChatModal(true)}
                            onSelect={(e) => e.preventDefault()}>
                            New Chat
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => router.push('/chat/groups/create-group')}>
                            New Group
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                {showNewChatModal && (
                    <NewChatModal setShowNewChatModal={setShowNewChatModal} showNewChatModal={showNewChatModal} />
                )}

            </div>
            <input
                type="text"
                placeholder="Search chats..."
                className="bg-blue-100/30 w-full border border-gray-300 border-solid outline-none rounded-md px-3 h-14 focus:outline-none focus:border-primary"
            />

        </div>

    )
}