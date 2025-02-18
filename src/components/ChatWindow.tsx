/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

interface ChatWindowProps {
  conversationId: number;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ conversationId }) => {
  const [state, setState] = useState({
    messages: [] as any[],
    isLoading: false,
    page: 1,
    hasMore: true,
    error: null as string | null,
  });

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isFetchingRef = useRef(false);
  const lastScrollHeightRef = useRef<number>(0);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const fetchMessages = useCallback(
    async (pageNum: number) => {
      if (isFetchingRef.current || !state.hasMore) return;

      isFetchingRef.current = true;
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/comments?_page=${pageNum}&_limit=20`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch messages");
        }
        const newMessages = await response.json();
        if (newMessages.length === 0) {
          setState((prev) => ({ ...prev, hasMore: false }));
        } else {
          setState((prev) => ({
            ...prev,
            messages: [...newMessages.reverse(), ...prev.messages],
            page: prev.page + 1,
          }));
        }
      } catch (err) {
        setState((prev) => ({
          ...prev,
          error: "An error occurred while fetching messages. Please try again.",
        }));
        console.error("Error fetching messages:", err);
      } finally {
        setState((prev) => ({ ...prev, isLoading: false }));
        isFetchingRef.current = false;
      }
    },
    [state.hasMore]
  );

  useEffect(() => {
    fetchMessages(1);
  }, [fetchMessages]);

  useEffect(() => {
    if (state.messages.length > 0 && !state.isLoading) {
      scrollToBottom();
    }
  }, [state.messages, state.isLoading, scrollToBottom]);

  const handleScroll = useCallback(() => {
    if (!chatContainerRef.current || isFetchingRef.current || !state.hasMore)
      return;

    const { scrollTop, scrollHeight } = chatContainerRef.current;

    if (scrollTop === 0) {
      lastScrollHeightRef.current = scrollHeight;
      fetchMessages(state.page);
    }
  }, [fetchMessages, state.page, state.hasMore]);

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (!chatContainer) return;

    const debouncedHandleScroll = debounce(handleScroll, 200);
    chatContainer.addEventListener("scroll", debouncedHandleScroll);

    return () => {
      chatContainer.removeEventListener("scroll", debouncedHandleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    if (state.isLoading) return;

    const chatContainer = chatContainerRef.current;
    if (chatContainer && lastScrollHeightRef.current) {
      const newScrollHeight = chatContainer.scrollHeight;
      const newScrollTop = newScrollHeight - lastScrollHeightRef.current;
      chatContainer.scrollTop = newScrollTop;
      lastScrollHeightRef.current = 0;
    }
  }, [state.isLoading]);

  const addMessage = (content: string) => {
    const newMessage = {
      id: Date.now(),
      userId: 0, // Assuming 0 is the current user
      title: "New Message",
      body: content,
    };
    setState((prev) => ({
      ...prev,
      messages: [newMessage, ...prev.messages],
    }));
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop =
          chatContainerRef.current.scrollHeight;
      }
    }, 0);
  };

  return (
    <div className="flex flex-col h-full">
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 flex flex-col"
      >
        <MessageList messages={state.messages} currentUserId={0} />
        {state.isLoading && <div className="text-center py-2">Loading...</div>}
        <div ref={messagesEndRef} />
      </div>
      <MessageInput onSendMessage={addMessage} />
    </div>
  );
};

export default ChatWindow;

function debounce(func: (...args: any[]) => void, wait: number) {
  let timeout: NodeJS.Timeout | null = null;
  return function executedFunction(...args: any[]) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}







// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import type React from "react";

// import { useState, useEffect, useRef, useCallback } from "react";
// import MessageList from "./MessageList";
// import MessageInput from "./MessageInput";

// interface ChatWindowProps {
//   conversationId: number;
// }

// const ChatWindow: React.FC<ChatWindowProps> = ({ conversationId }) => {
//     const [messages, setMessages] = useState<any>([])
//     const [isLoading, setIsLoading] = useState(false)
//     const [page, setPage] = useState(1)
//     const [hasMore, setHasMore] = useState(true)
//     const [error, setError] = useState<string | null>(null)
//     const chatContainerRef = useRef<HTMLDivElement>(null)
//     const messagesEndRef = useRef<HTMLDivElement>(null)
//     const isFetchingRef = useRef(false)
//     const lastScrollHeightRef = useRef<number>(0)

//     const scrollToBottom = useCallback(() => {
//       messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
//     }, [])

//     const fetchMessages = useCallback(
//       async (pageNum: number) => {
//         if (isFetchingRef.current || !hasMore) return

//         isFetchingRef.current = true
//         setIsLoading(true)
//         setError(null)

//         try {
//           const response = await fetch(`https://jsonplaceholder.typicode.com/comments?_page=${pageNum}&_limit=20`)
//           if (!response.ok) {
//             throw new Error("Failed to fetch messages")
//           }
//           const newMessages = await response.json()
//           if (newMessages.length === 0) {
//             setHasMore(false)
//           } else {
//             setMessages((prevMessages) => [...newMessages.reverse(), ...prevMessages])
//             setPage((prevPage) => prevPage + 1)
//           }
//         } catch (err) {
//           setError("An error occurred while fetching messages. Please try again.")
//           console.error("Error fetching messages:", err)
//         } finally {
//           setIsLoading(false)
//           isFetchingRef.current = false
//         }
//       },
//       [hasMore],
//     )

//     useEffect(() => {
//       fetchMessages(1)
//     }, [fetchMessages])

//     useEffect(() => {
//       if (messages.length > 0 && !isLoading) {
//         scrollToBottom()
//       }
//     }, [messages, isLoading, scrollToBottom])

//     const handleScroll = useCallback(() => {
//       if (!chatContainerRef.current || isFetchingRef.current || !hasMore) return

//       const { scrollTop, scrollHeight } = chatContainerRef.current

//       if (scrollTop === 0) {
//         lastScrollHeightRef.current = scrollHeight
//         fetchMessages(page)
//       }
//     }, [fetchMessages, page, hasMore])

//     useEffect(() => {
//       const chatContainer = chatContainerRef.current
//       if (!chatContainer) return

//       const debouncedHandleScroll = debounce(handleScroll, 200)
//       chatContainer.addEventListener("scroll", debouncedHandleScroll)

//       return () => {
//         chatContainer.removeEventListener("scroll", debouncedHandleScroll)
//       }
//     }, [handleScroll])

//     useEffect(() => {
//       if (isLoading) return

//       const chatContainer = chatContainerRef.current
//       if (chatContainer && lastScrollHeightRef.current) {
//         const newScrollHeight = chatContainer.scrollHeight
//         const newScrollTop = newScrollHeight - lastScrollHeightRef.current
//         chatContainer.scrollTop = newScrollTop
//         lastScrollHeightRef.current = 0
//       }
//     }, [isLoading])

//   const addMessage = (content: string) => {
//     const newMessage = {
//       id: Date.now(),
//       userId: 0, // Assuming 0 is the current user
//       title: "New Message",
//       body: content,
//     }
//     setMessages((prevMessages) => [newMessage, ...prevMessages])
//     setTimeout(() => {
//       if (chatContainerRef.current) {
//         chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
//       }
//     }, 0)
//   }

//   return (
//     <div className="flex flex-col h-full">
//       <div
//         ref={chatContainerRef}
//         className="flex-1 overflow-y-auto p-4 flex flex-col"
//       >
//         <MessageList messages={messages} currentUserId={0} />
//         {isLoading && (
//           <div className="text-center py-2">
//             Loading...
//           </div>
//         )}
//         <div ref={messagesEndRef} />
//       </div>
//       <MessageInput onSendMessage={addMessage} />
//     </div>
//   );
// };

// export default ChatWindow;

// function debounce(func: (...args: any[]) => void, wait: number) {
//     let timeout: NodeJS.Timeout | null = null
//     return function executedFunction(...args: any[]) {
//       const later = () => {
//         timeout = null
//         func(...args)
//       }
//       if (timeout) {
//         clearTimeout(timeout)
//       }
//       timeout = setTimeout(later, wait)
//     }
//   }
