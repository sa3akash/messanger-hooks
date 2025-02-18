import { useCallback, useEffect, useRef, useState } from "react";

interface Message {
  id: number;
  name: string;
  email: string;
  body: string;
}

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef(1);
  const isFetchingRef = useRef(false);
  const isFirstLoad = useRef(true); // Track first load

  /** Scroll to the latest message (only for new messages) */
  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
        chatContainerRef.current?.scrollTo({
          top: chatContainerRef.current.scrollHeight,
          behavior: "smooth", // Enables smooth scrolling
        });
      });
  }, []);

  /** Fetch older messages while keeping scroll position */
  const fetchMessages = useCallback(async () => {
    if (isFetchingRef.current || !hasMore) return;

    const chatContainer = chatContainerRef.current;
    const prevScrollHeight = chatContainer?.scrollHeight ?? 0;
    const prevScrollTop = chatContainer?.scrollTop ?? 0;

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

      const newMessages = await response.json();
      if (newMessages.length === 0) {
        setHasMore(false);
      } else {
        setMessages((prevMessages) => [
          ...newMessages.reverse(), // Prepend new messages
          ...prevMessages,
        ]);
        pageRef.current += 1;
      }

    //   requestAnimationFrame(() => {
    //     if (chatContainer) {
    //       if (isFirstLoad.current) {
    //         requestAnimationFrame(() => {
    //           if (chatContainerRef.current) {
    //             chatContainerRef.current.scrollTop =
    //               chatContainerRef.current.scrollHeight;
    //           }
    //         });
    //         isFirstLoad.current = false;
    //       } else {
    //         // Preserve scroll position
    //         const newScrollHeight = chatContainer.scrollHeight;
    //         chatContainer.scrollTop =
    //           newScrollHeight - prevScrollHeight + prevScrollTop;
    //       }
    //     }
    //   });


    setTimeout(() => {
        requestAnimationFrame(() => {  
            if (chatContainer && chatContainerRef.current) {  
              const { current: isFirstLoadCurrent } = isFirstLoad;  
              const { scrollHeight } = chatContainerRef.current;  
    
              console.log({
                isFirstLoadCurrent,scrollHeight
              })
          
              if (isFirstLoadCurrent) {  
                chatContainerRef.current.scrollTop = scrollHeight;  
                isFirstLoad.current = false;  
              } else {  
                chatContainer.scrollTop = scrollHeight - prevScrollHeight + prevScrollTop;  
              }  
            }  
          });
    }, 0);

    


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
      scrollToBottom()
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












// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useCallback, useEffect, useRef, useState } from "react";

// interface Message {
//   id: number;
//   name: string;
//   email: string;
//   body: string;
// }

// export const useChat = () => {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const chatContainerRef = useRef<HTMLDivElement>(null);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const isFetchingRef = useRef(false);
//   const lastScrollHeightRef = useRef<number>(0);

//   const scrollToBottom = useCallback(() => {
//     requestAnimationFrame(() => {
//       messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     });
//   }, []);

//   const fetchMessages = useCallback(
//     async (pageNum: number) => {
//       if (isFetchingRef.current || !hasMore) return;

//       isFetchingRef.current = true;
//       setIsLoading(true);
//       setError(null);

//       try {
//         const response = await fetch(
//           `https://jsonplaceholder.typicode.com/comments?_page=${pageNum}&_limit=20`
//         );
//         if (!response.ok) {
//           throw new Error("Failed to fetch messages");
//         }
//         const newMessages = await response.json();
//         if (newMessages.length === 0) {
//           setHasMore(false);
//         } else {
//           setMessages((prevMessages) => [...newMessages.reverse(), ...prevMessages]);
//           setPage((prevPage) => prevPage + 1);
//         }
//       } catch (err) {
//         setError("An error occurred while fetching messages. Please try again.");
//         console.error("Error fetching messages:", err);
//       } finally {
//         setIsLoading(false);
//         isFetchingRef.current = false;
//       }
//     },
//     [hasMore]
//   );

//   useEffect(() => {
//     fetchMessages(1);
//   }, [fetchMessages]);

//   useEffect(() => {
//     if (messages.length > 0 && !isLoading) {
//       scrollToBottom();
//     }
//   }, [messages, isLoading, scrollToBottom]);

//   const handleSendMessage = (newMessage: string) => {
//     if (newMessage.trim()) {
//       const newMsg: Message = {
//         id: Date.now(),
//         name: "You",
//         email: "you@example.com",
//         body: newMessage.trim(),
//       };
//       setMessages((prevMessages) => [...prevMessages, newMsg]);
//     //   setTimeout(scrollToBottom, 0);
//     scrollToBottom()
//     }
//   };

//   const handleScroll = useCallback(() => {
//     if (!chatContainerRef.current || isFetchingRef.current || !hasMore) return;

//     const { scrollTop, scrollHeight } = chatContainerRef.current;

//     if (scrollTop === 0) {
//       lastScrollHeightRef.current = scrollHeight;
//       fetchMessages(page);
//     }
//   }, [fetchMessages, page, hasMore]);

//   useEffect(() => {
//     const chatContainer = chatContainerRef.current;
//     if (!chatContainer) return;

//     const debouncedHandleScroll = debounce(handleScroll, 200);
//     chatContainer.addEventListener("scroll", debouncedHandleScroll);

//     return () => {
//       chatContainer.removeEventListener("scroll", debouncedHandleScroll);
//     };
//   }, [handleScroll]);

//   useEffect(() => {
//     if (isLoading) return;

//     const chatContainer = chatContainerRef.current;
//     if (chatContainer && lastScrollHeightRef.current) {
//       requestAnimationFrame(() => {
//         const newScrollHeight = chatContainer.scrollHeight;
//         chatContainer.scrollTop = newScrollHeight - lastScrollHeightRef.current;
//         lastScrollHeightRef.current = 0;
//       });
//     }
//   }, [isLoading]);

//   return {
//     messages,
//     chatContainerRef,
//     handleSendMessage,
//     error,
//     messagesEndRef,
//     isLoading,
//     hasMore,
//   };
// };

// function debounce(func: (...args: any[]) => void, wait: number) {
//   let timeout: NodeJS.Timeout | null = null;
//   return function executedFunction(...args: any[]) {
//     if (timeout) {
//       clearTimeout(timeout);
//     }
//     timeout = setTimeout(() => {
//       func(...args);
//       timeout = null;
//     }, wait);
//   };
// }

// ====================

// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useCallback, useEffect, useRef, useState } from "react";

// interface Message {
//   id: number;
//   name: string;
//   email: string;
//   body: string;
// }

// export const useChat = () => {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const chatContainerRef = useRef<HTMLDivElement>(null);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const isFetchingRef = useRef(false);
//   const lastScrollHeightRef = useRef<number>(0);

//   const scrollToBottom = useCallback(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, []);

//   const fetchMessages = useCallback(
//     async (pageNum: number) => {
//       if (isFetchingRef.current || !hasMore) return;

//       isFetchingRef.current = true;
//       setIsLoading(true);
//       setError(null);

//       try {
//         const response = await fetch(
//           `https://jsonplaceholder.typicode.com/comments?_page=${pageNum}&_limit=20`
//         );
//         if (!response.ok) {
//           throw new Error("Failed to fetch messages");
//         }
//         const newMessages = await response.json();
//         if (newMessages.length === 0) {
//           setHasMore(false);
//         } else {
//           setMessages((prevMessages) => [
//             ...newMessages.reverse(),
//             ...prevMessages,
//           ]);
//           setPage((prevPage) => prevPage + 1);
//         }
//       } catch (err) {
//         setError(
//           "An error occurred while fetching messages. Please try again."
//         );
//         console.error("Error fetching messages:", err);
//       } finally {
//         setIsLoading(false);
//         isFetchingRef.current = false;
//       }
//     },
//     [hasMore]
//   );

//   useEffect(() => {
//     fetchMessages(1);
//   }, [fetchMessages]);

//   useEffect(() => {
//     if (messages.length > 0 && !isLoading) {
//       scrollToBottom();
//     }
//   }, [messages, isLoading, scrollToBottom]);

//   const handleSendMessage = (newMessage: string) => {
//     if (newMessage.trim()) {
//       const newMsg: Message = {
//         id: Date.now(),
//         name: "You",
//         email: "you@example.com",
//         body: newMessage.trim(),
//       };
//       setMessages((prevMessages) => [...prevMessages, newMsg]);
//       setTimeout(scrollToBottom, 0);
//     }
//   };

//   const handleScroll = useCallback(() => {
//     if (!chatContainerRef.current || isFetchingRef.current || !hasMore) return;

//     const { scrollTop, scrollHeight } = chatContainerRef.current;

//     if (scrollTop === 0) {
//       lastScrollHeightRef.current = scrollHeight;
//       fetchMessages(page);
//     }
//   }, [fetchMessages, page, hasMore]);

//   useEffect(() => {
//     const chatContainer = chatContainerRef.current;
//     if (!chatContainer) return;

//     const debouncedHandleScroll = debounce(handleScroll, 200);
//     chatContainer.addEventListener("scroll", debouncedHandleScroll);

//     return () => {
//       chatContainer.removeEventListener("scroll", debouncedHandleScroll);
//     };
//   }, [handleScroll]);

//   useEffect(() => {
//     if (isLoading) return;

//     const chatContainer = chatContainerRef.current;
//     if (chatContainer && lastScrollHeightRef.current) {
//       const newScrollHeight = chatContainer.scrollHeight;
//       const newScrollTop = newScrollHeight - lastScrollHeightRef.current;
//       chatContainer.scrollTop = newScrollTop;
//       lastScrollHeightRef.current = 0;
//     }
//   }, [isLoading]);

//   return {
//     messages,
//     chatContainerRef,
//     handleSendMessage,
//     error,
//     messagesEndRef,
//     isLoading,
//     hasMore,
//   };
// };

// function debounce(func: (...args: any[]) => void, wait: number) {
//   let timeout: NodeJS.Timeout | null = null;
//   return function executedFunction(...args: any[]) {
//     const later = () => {
//       timeout = null;
//       func(...args);
//     };
//     if (timeout) {
//       clearTimeout(timeout);
//     }
//     timeout = setTimeout(later, wait);
//   };
// }
