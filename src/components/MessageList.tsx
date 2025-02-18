import type React from "react"
interface Message {
  id: number
  userId: number
  title: string
  body: string
}

interface MessageListProps {
  messages: Message[]
  currentUserId: number
}

const MessageList: React.FC<MessageListProps> = ({ messages, currentUserId }) => {
  return (
    <div className="space-y-4 flex flex-col">
      {messages.map((message,i) => (
        <div key={i} className={`flex ${message.userId === currentUserId ? "justify-end" : "justify-start"}`}>
          <div
            className={` px-4 py-2 rounded-lg ${
              message.userId === currentUserId ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
            }`}
          >
            {/* <p className="font-semibold">{message.title}</p> */}
            <p>{message.body} {i}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default MessageList

