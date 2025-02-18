/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import MessageInput from "@/components/MessageInput";
import MessageList from "@/components/MessageList";
import type React from "react";

import { useChat } from "./useChat";

interface ChatWindowProps {
  conversationId: number;
}

const ChatWindow: React.FC<ChatWindowProps> = () => {
  const { addMessage, chatBottomRef, chatContainerRef, messages, isLoading } =
    useChat({ conversationId: "1" });

  return (
    <div className="flex flex-col h-full relative ">
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 flex flex-col "
      >
        <MessageList messages={messages} currentUserId={0} />

        <div ref={chatBottomRef}></div>
      </div>
      {isLoading && (
        <div className="absolute top-0 z-10 right-0 left-0 flex items-center justify-center">
          <div className="text-center py-2 bg-white border-t  w-[70%]">
            <span className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-900"></span>
            <span className="ml-2">Loading...</span>
          </div>
        </div>
      )}
      <MessageInput onSendMessage={addMessage} />
    </div>
  );
};

export default ChatWindow;
