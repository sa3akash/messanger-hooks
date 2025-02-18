/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentRef, useCallback, useEffect, useRef, useState } from "react";


interface Props {
    conversationId: string;
  }
export const useChat = ({}:Props) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null)

  const chatContainerRef = useRef<ComponentRef<"div">>(null);
  const chatBottomRef = useRef<ComponentRef<"div">>(null);
  const lastScrollHeightRef = useRef<number>(0);
  const isFetchingRef = useRef<boolean>(false);




  const fetchMessages = useCallback(
    async (pageNum: number) => {
      if (isFetchingRef.current || !hasMore) return;

      isFetchingRef.current = true;
      setIsLoading(true);
      setError(null)

      try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/comments?_page=${pageNum}&_limit=20`)

        if (!response.ok) {
          throw new Error("Failed to fetch messages");
        }

        const newMessages = await response.json();
        if (newMessages.length === 0) {
          setHasMore(false);
        } else {
          setMessages((prevMessages) => [
            ...newMessages.reverse(),
            ...prevMessages,
          ]);
          setPage((prevPage) => prevPage + 1);
        }
      } catch (err) {
        setError("An error occurred while fetching messages. Please try again.")
        console.error("Error fetching messages:", err)
      } finally {
        setIsLoading(false);
        isFetchingRef.current = false;
      }
    },
    [hasMore]
  );

  useEffect(() => {
    setMessages([]);
    setPage(1);
    setHasMore(true);
    fetchMessages(1);
  }, [fetchMessages]);

  const scrollToBottom = useCallback(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (messages.length > 0 && !isLoading) {
      scrollToBottom();

    }
  }, [messages, isLoading, scrollToBottom]);

  const addMessage = (content: string) => {
    const newMessage = {
      id: Date.now(),
      userId: 0, // Assuming 0 is the current user
      title: "New Message",
      body: content,
    };
    setMessages((prevMessages) => [newMessage, ...prevMessages]);
    // requestAnimationFrame(() => {
    //   if (chatContainerRef.current) {
    //     chatContainerRef.current.scrollTop =
    //       chatContainerRef.current.scrollHeight;
    //   }
    // });

    scrollToBottom()
  };

  const handleScroll = useCallback(() => {
    if (!chatContainerRef.current || isLoading || !hasMore) return;

    const { scrollTop, scrollHeight } = chatContainerRef.current;

    if (scrollTop === 0) {
      lastScrollHeightRef.current = scrollHeight;
      fetchMessages(page);
    }
  }, [isLoading, hasMore, fetchMessages, page]);
  

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
    if (isLoading) return;

    const chatContainer = chatContainerRef.current;
    if (chatContainer && lastScrollHeightRef.current) {
      const newScrollHeight = chatContainer.scrollHeight;
      const newScrollTop = newScrollHeight - lastScrollHeightRef.current;
      chatContainer.scrollTop = newScrollTop;
      lastScrollHeightRef.current = 0;
    }
  }, [isLoading]);




  return {
    addMessage,
    messages,
    isLoading,
    chatContainerRef,
    chatBottomRef,
    error
  }

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