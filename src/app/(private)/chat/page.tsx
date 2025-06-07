"use client";
import Chats from "./chat-components/chats";
import ChatArea from "./chat-components/chat-area";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ChatState } from "@/redux/chatSlice";
import { useSelector } from "react-redux";

export default function ({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublicRoute = pathname.includes("sign-in") || pathname.includes("sign-up");
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const { selectedChat }: ChatState = useSelector((state: any) => state.chat);

  if (isPublicRoute) return <>{children}</>;


  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 1020);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);
  
  if (isMobile === null) return null;
  const showChatsOnly = isMobile && !selectedChat;
  const showChatOnly = isMobile && selectedChat;
  const showBoth = !isMobile;

  return (
    <div className="flex h-full w-full overflow-hidden">
      {(showChatsOnly || showBoth) && <Chats fullscreen={showChatsOnly} />}
      {showBoth && <div className="w-px h-full bg-gray-300" />}
      {(showChatOnly || showBoth) && <ChatArea isMobile={isMobile} />}
    </div>
  );
}