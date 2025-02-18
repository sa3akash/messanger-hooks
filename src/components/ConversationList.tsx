/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"

import { useState, useEffect } from "react"

interface Conversation {
  id: number
  name: string
  lastMessage: string
}

interface ConversationListProps {
  onSelectConversation: (id: number) => void
}

const ConversationList: React.FC<ConversationListProps> = ({ onSelectConversation }) => {
  const [conversations, setConversations] = useState<Conversation[]>([])

  useEffect(() => {
    const fetchConversations = async () => {
      const response = await fetch("https://jsonplaceholder.typicode.com/users")
      const users = await response.json()
      const conversationsData = users.map((user: any) => ({
        id: user.id,
        name: user.name,
        lastMessage: `Last message from ${user.name}`,
      }))
      setConversations(conversationsData)
    }

    fetchConversations()
  }, [])

  return (
    <div className="h-full overflow-y-auto">
      <h2 className="text-xl font-semibold p-4 border-b">Conversations</h2>
      {conversations.map((conversation) => (
        <div
          key={conversation.id}
          className="p-4 border-b hover:bg-gray-100 cursor-pointer"
          onClick={() => onSelectConversation(conversation.id)}
        >
          <h3 className="font-semibold">{conversation.name}</h3>
          <p className="text-sm text-gray-500">{conversation.lastMessage}</p>
        </div>
      ))}
    </div>
  )
}

export default ConversationList

