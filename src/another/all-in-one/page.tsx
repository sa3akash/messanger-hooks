'use client'

import { useEffect, useRef, useState, useCallback } from "react";

interface Message {
  id: number;
  body: string;
}

export default function Messenger() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const prevScrollHeight = useRef(0);

  const fetchMessages = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await fetch(`https://jsonplaceholder.typicode.com/comments?_page=${page}&_limit=10`);
      const data = await res.json();
      if (data.length === 0) {
        setHasMore(false);
      } else {
        setMessages((prev) => [...data.reverse(), ...prev]);
      }
    } catch (error) {
      console.error("Failed to fetch messages", error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  useEffect(() => {
    fetchMessages();
  }, [page]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight - prevScrollHeight.current;
    }
  }, [messages]);

  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight } = containerRef.current;
      prevScrollHeight.current = scrollHeight;
      if (scrollTop === 0 && !loading && hasMore) {
        setPage((prev) => prev + 1);
      }
    }
  }, [loading, hasMore]);

  return (
    <div className="flex flex-col h-screen bg-gray-100 p-4">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto bg-white p-4 rounded-lg shadow-md"
        style={{ height: "80vh" }}
      >
        {loading && <div className="text-center text-gray-500">Loading...</div>}
        {messages.map((msg) => (
          <div key={msg.id} className="p-2 my-2 bg-blue-500 text-white rounded-lg w-max max-w-xs">
            {msg.body}
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded-lg"
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">Send</button>
      </div>
    </div>
  );
}
