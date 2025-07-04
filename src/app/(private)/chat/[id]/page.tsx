import Messages from "@/components/usable/chat/chat-area/messages"
import NewMessages from "@/components/usable/chat/chat-area/new-messages"
import Recipient from "@/components/usable/chat/chat-area/recipient"

/**
 * Chat page component for individual user conversations
 * Displays a full chat interface including recipient info, message history, and message input
 *
 * @param params - Route parameters containing the chat ID
 * @param params.id - The unique identifier of the chat/conversation
 * @returns JSX element containing the complete chat interface
 */
export default async function ChatWithUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <>
      <Recipient />
      <Messages messageID={id} />
      <NewMessages />
    </>
  )
}
