import { useCallback, useEffect, useRef, useState } from "react";  

interface Message {  
  id: number;  
  name: string;  
  email: string;  
  body: string;  
}  

export const useChatTwo = () => {  
  const [messages, setMessages] = useState<Message[]>([]);  
  const [isLoading, setIsLoading] = useState(false);  
  const [hasMore, setHasMore] = useState(true);  
  const [error, setError] = useState<string | null>(null);  

  const chatContainerRef = useRef<HTMLDivElement>(null);  
  const pageRef = useRef(1);  
  const isFetchingRef = useRef(false);  
  const isFirstLoad = useRef(true);  

  /** Scroll to the latest message */  
  const scrollToBottom = useCallback(() => {  
    requestAnimationFrame(() => {  
      chatContainerRef.current?.scrollTo({  
        top: chatContainerRef.current.scrollHeight,  
        behavior: "smooth",  
      });  
    });  
  }, []);  

  /** Fetch older messages */  
  const fetchMessages = useCallback(async () => {  
    if (isFetchingRef.current || !hasMore) return;  

    const chatContainer = chatContainerRef.current;  
    const prevScrollHeight = chatContainer?.scrollHeight ?? 0;  

    isFetchingRef.current = true;  
    setIsLoading(true);  
    setError(null);  

    try {  
      const response = await fetch(  
        `https://jsonplaceholder.typicode.com/comments?_page=${pageRef.current}&_limit=20`  
      );  
      if (!response.ok) {  
        throw new Error("Failed to fetch messages");  
      }  

      const newMessages: Message[] = await response.json();  
      if (newMessages.length === 0) {  
        setHasMore(false);  
      } else {  
        setMessages((prevMessages) => [  
          ...newMessages.reverse(),  
          ...prevMessages,  
        ]);  
        pageRef.current += 1;  
      }  

      // Scroll handling after messages are fetched  
      requestAnimationFrame(() => {  
        if (chatContainer) {  
          const { scrollHeight, scrollTop } = chatContainer;  
          if (isFirstLoad.current) {  
            chatContainer.scrollTop = scrollHeight;  
            isFirstLoad.current = false;  
          } else {  
            chatContainer.scrollTop = scrollHeight - prevScrollHeight + scrollTop;  
          }  
        }  
      });  
    } catch (err) {  
      setError("An error occurred while fetching messages. Please try again.");  
      console.error("Error fetching messages:", err);  
    } finally {  
      setIsLoading(false);  
      isFetchingRef.current = false;  
    }  
  }, [hasMore]);  

  /** Load messages on mount */  
  useEffect(() => {  
    fetchMessages();  
  }, [fetchMessages]);  

  /** Handle sending a new message */  
  const handleSendMessage = (newMessage: string) => {  
    if (newMessage.trim()) {  
      const newMsg: Message = {  
        id: Date.now(),  
        name: "You",  
        email: "you@example.com",  
        body: newMessage.trim(),  
      };  
      setMessages((prevMessages) => [...prevMessages, newMsg]);  
      scrollToBottom();  
    }  
  };  

  /** Handle infinite scroll */  
  const handleScroll = useCallback(() => {  
    const chatContainer = chatContainerRef.current;  
    if (!chatContainer || isFetchingRef.current || !hasMore) return;  

    if (chatContainer.scrollTop === 0) {  
      fetchMessages();  
    }  
  }, [fetchMessages, hasMore]);  

  /** Attach and clean up scroll event listener */  
  useEffect(() => {  
    const chatContainer = chatContainerRef.current;  
    if (!chatContainer) return;  

    const debouncedHandleScroll = debounce(handleScroll, 200);  
    chatContainer.addEventListener("scroll", debouncedHandleScroll);  

    return () => {  
      chatContainer.removeEventListener("scroll", debouncedHandleScroll);  
    };  
  }, [handleScroll]);  

  return {  
    messages,  
    chatContainerRef,  
    handleSendMessage,  
    error,  
    isLoading,  
    hasMore,  
  };  
};  

/** Utility function for debouncing */  
function debounce(func: (...args: any[]) => void, wait: number) {  
  let timeout: NodeJS.Timeout | null = null;  
  return function executedFunction(...args: any[]) {  
    if (timeout) clearTimeout(timeout);  
    timeout = setTimeout(() => func(...args), wait);  
  };  
}