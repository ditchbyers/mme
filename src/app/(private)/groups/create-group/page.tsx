"use client";
import Chats from "../../_chat-components/chats";
import ChatArea from "../../_chat-components/chat-area";

export default function Chat() {
  return (
    <div className="flex h-[85vh]">
      <Chats />
      <ChatArea />
    </div>
  );
}