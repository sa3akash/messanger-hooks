'use client'

import { useState } from "react"
import { User, Users } from "lucide-react"

const contacts = [
  { id: 1, name: "Alice", lastMessage: "Hey there!" },
  { id: 2, name: "Bob", lastMessage: "How are you?" },
  { id: 3, name: "Charlie", lastMessage: "See you soon!" },
  // Add more contacts as needed
]

const groups = [
  { id: 1, name: "Family", lastMessage: "Dinner tonight?" },
  { id: 2, name: "Work", lastMessage: "Meeting at 3 PM" },
  // Add more groups as needed
]

export default function Sidebar() {
  const [activeTab, setActiveTab] = useState("contacts")

  return (
    <div className="w-64 bg-gray-100 h-full flex flex-col">
      <div className="flex border-b">
        <button
          className={`flex-1 py-2 ${activeTab === "contacts" ? "bg-white" : ""}`}
          onClick={() => setActiveTab("contacts")}
        >
          <User className="inline-block mr-2" /> Contacts
        </button>
        <button
          className={`flex-1 py-2 ${activeTab === "groups" ? "bg-white" : ""}`}
          onClick={() => setActiveTab("groups")}
        >
          <Users className="inline-block mr-2" /> Groups
        </button>
      </div>
      <div className="overflow-y-auto flex-1">
        {activeTab === "contacts"
          ? contacts.map((contact) => (
              <div key={contact.id} className="p-4 border-b hover:bg-gray-200 cursor-pointer">
                <h3 className="font-semibold">{contact.name}</h3>
                <p className="text-sm text-gray-600">{contact.lastMessage}</p>
              </div>
            ))
          : groups.map((group) => (
              <div key={group.id} className="p-4 border-b hover:bg-gray-200 cursor-pointer">
                <h3 className="font-semibold">{group.name}</h3>
                <p className="text-sm text-gray-600">{group.lastMessage}</p>
              </div>
            ))}
      </div>
    </div>
  )
}

