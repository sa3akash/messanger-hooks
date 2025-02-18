"use client";

import React, { useEffect, useRef, useState } from "react";

type Message = {
  id: number;
  name: string;
  email: string;
  body: string;
};

type ChatWindowProps = {
  initialMessages: Message[];
};

export default function ChatWindow({ initialMessages }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [showNewMessageButton, setShowNewMessageButton] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const isUserAtBottom = useRef(true); // To track user's position
  const prevScrollHeight = useRef(0); // To preserve scroll position during loading

  // Scroll to the bottom (helper)
  const scrollToBottom = (smooth = true) => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: smooth ? "smooth" : "auto",
      });
    }
  };

  // Check if the user is at the bottom
  const checkIfUserAtBottom = () => {
    if (!chatContainerRef.current) return false;

    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    return Math.abs(scrollTop + clientHeight - scrollHeight) < 5; // Allow small floating-point differences
  };

  // Add new message via "socket" simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const newMessage: Message = {
        id: Date.now(),
        name: "Socket User",
        email: "socket@example.com",
        body: "New message from socket!",
      };

      setMessages((prev) => [...prev, newMessage]);

      if (isUserAtBottom.current) {
        scrollToBottom(); // Auto-scroll to the bottom if the user is already at the bottom
      } else {
        setShowNewMessageButton(true); // Show the "New Message" button if the user is not at the bottom
      }
    }, 5000); // Simulate a new message every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Fetch older messages when scrolled to the top
  const fetchOlderMessages = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    prevScrollHeight.current = chatContainerRef.current?.scrollHeight || 0;

    const newMessages: Message[] = await fetch(
      `https://jsonplaceholder.typicode.com/comments?_start=${
        messages.length
      }&_limit=10`
    ).then((res) => res.json());

    if (newMessages.length === 0) {
      setHasMore(false);
    } else {
      setMessages((prev) => [...newMessages, ...prev]);

      // Preserve scroll position after adding older messages
      setTimeout(() => {
        const container = chatContainerRef.current;
        if (container) {
          const newScrollHeight = container.scrollHeight;
          container.scrollTop = newScrollHeight - prevScrollHeight.current;
        }
      }, 0);
    }

    setLoading(false);
  };

  // Handle scrolling events
  const handleScroll = () => {
    const container = chatContainerRef.current;
    if (!container) return;

    // Check if the user scrolled to the top to load older messages
    if (container.scrollTop === 0) {
      fetchOlderMessages();
    }

    // Check if the user is at the bottom
    const atBottom = checkIfUserAtBottom();
    isUserAtBottom.current = atBottom;

    // Hide "New Message" button if the user scrolls back to the bottom
    if (atBottom) {
      setShowNewMessageButton(false);
    }
  };

  // Add a new message (mock user input)
  const addMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now(),
      name: "User",
      email: "user@example.com",
      body: text,
    };

    setMessages((prev) => [...prev, newMessage]);

    // Auto-scroll to bottom when the user sends a message
    setTimeout(() => scrollToBottom(), 0);
  };

  return (
    <div className="flex flex-col h-[400px]">
      {/* Chat Container */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 bg-gray-100 relative"
        onScroll={handleScroll}
      >
        {loading && (
          <p className="text-center text-gray-500">Loading older messages...</p>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.email === "user@example.com" ? "justify-end" : "justify-start"
            } mb-2`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                msg.email === "user@example.com"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-black"
              }`}
            >
              <p>{msg.body}</p>
              <span className="block text-xs text-gray-600 mt-1">
                {msg.name}
              </span>
            </div>
          </div>
        ))}

        {/* "New Message" Button */}
        {showNewMessageButton && (
          <button
            className="absolute bottom-10 right-4 bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg"
            onClick={() => scrollToBottom(true)}
          >
            New Message
          </button>
        )}
      </div>

      {/* Input Box */}
      <div className="p-4 bg-white">
        <input
          type="text"
          className="w-full border rounded-lg px-4 py-2"
          placeholder="Type a message..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.currentTarget.value.trim()) {
              addMessage(e.currentTarget.value);
              e.currentTarget.value = "";
            }
          }}
        />
      </div>
    </div>
  );
}

