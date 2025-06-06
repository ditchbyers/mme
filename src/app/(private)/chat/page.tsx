"use client";
import Chats from "./chat-components/chats";
import ChatArea from "./chat-components/chat-area";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublicRoute = pathname.includes("sign-in") || pathname.includes("sign-up");
  if (isPublicRoute) return <>{children}</>;

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