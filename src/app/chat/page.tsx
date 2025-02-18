"use client"

import ConversationList from "@/components/ConversationList"
import { useState } from "react"
import ChatWindow from "./ChatWindow"


export default function Home() {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null)

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/4 bg-white border-r">
        <ConversationList onSelectConversation={setSelectedConversation} />
      </div>
      <div className="flex-1">
        {selectedConversation ? (
          <ChatWindow conversationId={selectedConversation} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  )
}
