"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface Message {
  id: number;
  body: string;
}

const Messenger = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const fetchMessages = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/comments?_page=${page}&_limit=10`
      );
      const data: Message[] = await response.json();
      if (data.length === 0) {
        setHasMore(false); // No more messages to fetch
      } else {
        setMessages((prev) => [...prev, ...data]); // Append new messages
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages(page);
  }, [page, fetchMessages]);

  const handleScroll = useCallback(() => {
    if (!messagesContainerRef.current || loading || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } =
      messagesContainerRef.current;
    if (scrollHeight - (scrollTop + clientHeight) < 50) {
      setPage((prev) => prev + 1); // Fetch more messages when near the bottom
    }
  }, [loading, hasMore]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  return (
    <div className="flex flex-col h-[400px] bg-gray-100 p-4">
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto">
        {messages.map((message) => (
          <div key={message.id} className="mb-4 p-4 bg-white rounded-lg shadow">
            <p className="text-gray-800">{message.body}</p>
          </div>
        ))}
        {loading && <p className="text-center">Loading...</p>}
        {!hasMore && <p className="text-center">No more messages</p>}
      </div>
    </div>
  );
};

export default Messenger;
