import ChatWindow from "./ChatWindow";

export default async function ChatPage() {
  // Fetch the first 20 messages from JSONPlaceholder API
  const initialMessages = await fetch(
    "https://jsonplaceholder.typicode.com/comments?_start=0&_limit=20"
  ).then((res) => res.json());

  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 bg-blue-600 text-white">
        <h1 className="text-lg font-semibold">Chat Example</h1>
      </div>

      {/* Chat Window (Client Component) */}
      <ChatWindow initialMessages={initialMessages} />
    </div>
  );
}