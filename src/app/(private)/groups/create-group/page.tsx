"use client";
import Chats from "../../_chat-components/chats";
import ChatArea from "../../_chat-components/chat-area";
import { Divider } from "antd";
import { useEffect } from "react";

export default function Chat() {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="flex h-[86vh] w-full overflow-hidden">
      <Chats />
      <div className="w-px h-full bg-gray-300" />
      <div className="flex-1 h-full w-full">
        <ChatArea />
      </div>
    </div>
  );
}