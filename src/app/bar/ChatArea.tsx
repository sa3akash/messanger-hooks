"use client";

import type React from "react";
import { Send, Phone, Video } from "lucide-react";
import { useState } from "react";
import { useChatTwo } from "./useChatTwo";

export default function ChatArea() {
  const [message, setMessage] = useState("");

  const {
    chatContainerRef,
    error,
    handleSendMessage,
    isLoading,
    messages,
    hasMore,
  } = useChatTwo();

  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-white p-4 flex justify-between items-center border-b">
        <h2 className="text-xl font-semibold">Chat</h2>
        <div>
          <button className="mr-2 p-2 rounded-full bg-gray-200 hover:bg-gray-300">
            <Phone size={20} />
          </button>
          <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
            <Video size={20} />
          </button>
        </div>
      </div>
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4">
        {!hasMore && messages.length > 0 && (
          <div className="text-center py-2 text-gray-500">
            No more messages to load
          </div>
        )}
        {messages.map((message, i) => (
          <div
            key={i}
            className={`mb-4 ${
              message.name === "You" ? "text-right" : "text-left"
            }`}
          >
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 mb-1">{message.name}</span>
              <span
                className={`inline-block p-2 rounded-lg ${
                  message.name === "You"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {message.body}
              </span>
            </div>
          </div>
        ))}
      </div>
      {isLoading && (
        <div className="text-center py-2 bg-white border-t">
          <span className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-900"></span>
          <span className="ml-2">Loading...</span>
        </div>
      )}
      {error && (
        <div className="text-center py-2 bg-red-100 border-t border-red-200 text-red-700">
          {error}
        </div>
      )}
      <div className="bg-white p-4 border-t">
        <div className="flex">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Send
              size={20}
              onClick={() => {
                handleSendMessage(message);
                setMessage("");
              }}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
