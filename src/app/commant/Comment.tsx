"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface User {
  id: number
  name: string
  avatar: string
}

interface CommentProps {
  id: number
  user: User
  content: string
  replies: CommentProps[]
  onReply: (parentId: number, content: string, userId: number) => void
  currentUser: User
}

export function Comment({ id, user, content, replies, onReply, currentUser }: CommentProps) {
  const [isReplying, setIsReplying] = useState(false)
  const [replyContent, setReplyContent] = useState('')

  const handleReply = () => {
    if (replyContent.trim()) {
      onReply(id, replyContent, currentUser.id)
      setReplyContent('')
      setIsReplying(false)
    }
  }

  return (
    <div className="mb-4 border-l-2 border-gray-200 pl-4">
      <div className="mb-2 flex items-start gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <span className="font-bold">{user.name}</span>
          <p>{content}</p>
        </div>
      </div>
      {!isReplying && (
        <Button variant="outline" size="sm" onClick={() => setIsReplying(true)}>
          Reply
        </Button>
      )}
      {isReplying && (
        <div className="mt-2">
          <Textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write your reply..."
            className="mb-2"
          />
          <Button size="sm" onClick={handleReply}>Submit Reply</Button>
          <Button variant="outline" size="sm" onClick={() => setIsReplying(false)} className="ml-2">
            Cancel
          </Button>
        </div>
      )}
      {replies.length > 0 && (
        <div className="ml-4 mt-2">
          {replies.map((reply) => (
            <Comment key={reply.id} {...reply} onReply={onReply} currentUser={currentUser} />
          ))}
        </div>
      )}
    </div>
  )
}



