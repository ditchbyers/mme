"use client";
import Chats from "../../_chat-components/chats";
import ChatArea from "../../_chat-components/chat-area";
import { Divider } from "antd";

export default function Chat() {
  return (
    <div className="flex h-[85vh]">
      <Chats />
      <div className="w-px h-full bg-gray-600 mx-2" />
      <ChatArea />
    </div>
  );
}