/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { Send, Phone, Video } from "lucide-react"

interface Message {
  id: number
  name: string
  email: string
  body: string
}

export default function ChatArea() {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const isFetchingRef = useRef(false)
  const lastScrollHeightRef = useRef<number>(0)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  const fetchMessages = useCallback(
    async (pageNum: number) => {
      if (isFetchingRef.current || !hasMore) return

      isFetchingRef.current = true
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/comments?_page=${pageNum}&_limit=20`)
        if (!response.ok) {
          throw new Error("Failed to fetch messages")
        }
        const newMessages = await response.json()
        if (newMessages.length === 0) {
          setHasMore(false)
        } else {
          setMessages((prevMessages) => [...newMessages.reverse(), ...prevMessages])
          setPage((prevPage) => prevPage + 1)
        }
      } catch (err) {
        setError("An error occurred while fetching messages. Please try again.")
        console.error("Error fetching messages:", err)
      } finally {
        setIsLoading(false)
        isFetchingRef.current = false
      }
    },
    [hasMore],
  )

  useEffect(() => {
    fetchMessages(1)
  }, [fetchMessages])

  useEffect(() => {
    if (messages.length > 0 && !isLoading) {
      scrollToBottom()
    }
  }, [messages, isLoading, scrollToBottom])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim()) {
      const newMsg: Message = {
        id: Date.now(),
        name: "You",
        email: "you@example.com",
        body: newMessage.trim(),
      }
      setMessages((prevMessages) => [...prevMessages, newMsg])
      setNewMessage("")
      setTimeout(scrollToBottom, 0)
    }
  }

  const handleScroll = useCallback(() => {
    if (!chatContainerRef.current || isFetchingRef.current || !hasMore) return

    const { scrollTop, scrollHeight } = chatContainerRef.current

    if (scrollTop === 0) {
      lastScrollHeightRef.current = scrollHeight
      fetchMessages(page)
    }
  }, [fetchMessages, page, hasMore])

  useEffect(() => {
    const chatContainer = chatContainerRef.current
    if (!chatContainer) return

    const debouncedHandleScroll = debounce(handleScroll, 200)
    chatContainer.addEventListener("scroll", debouncedHandleScroll)

    return () => {
      chatContainer.removeEventListener("scroll", debouncedHandleScroll)
    }
  }, [handleScroll])

  useEffect(() => {
    if (isLoading) return

    const chatContainer = chatContainerRef.current
    if (chatContainer && lastScrollHeightRef.current) {
      const newScrollHeight = chatContainer.scrollHeight
      const newScrollTop = newScrollHeight - lastScrollHeightRef.current
      chatContainer.scrollTop = newScrollTop
      lastScrollHeightRef.current = 0
    }
  }, [isLoading])

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
          <div className="text-center py-2 text-gray-500">No more messages to load</div>
        )}
        {messages.map((message,i) => (
          <div key={i} className={`mb-4 ${message.name === "You" ? "text-right" : "text-left"}`}>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 mb-1">{message.name}</span>
              <span
                className={`inline-block p-2 rounded-lg ${
                  message.name === "You" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
                }`}
              >
                {message.body}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {isLoading && (
        <div className="text-center py-2 bg-white border-t">
          <span className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-900"></span>
          <span className="ml-2">Loading...</span>
        </div>
      )}
      {error && <div className="text-center py-2 bg-red-100 border-t border-red-200 text-red-700">{error}</div>}
      <form onSubmit={handleSendMessage} className="bg-white p-4 border-t">
        <div className="flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  )
}

function debounce(func: (...args: any[]) => void, wait: number) {
  let timeout: NodeJS.Timeout | null = null
  return function executedFunction(...args: any[]) {
    const later = () => {
      timeout = null
      func(...args)
    }
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

