import { ChatsWrapper } from "@/components/usable/chat/chats/chat-wrapper"

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex h-full w-full">
      <ChatsWrapper />
      <div className="h-full w-px bg-gray-300" />
      <div className="flex flex-1 flex-col" style={{ height: "calc(100vh - 80px)" }}>
        {children}
      </div>
    </div>
  )
}
