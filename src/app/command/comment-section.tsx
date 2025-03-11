"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Comment } from "./commant";

interface User {
  id: number;
  name: string;
  avatar: string;
}

interface CommentData {
  id: number;
  user: User;
  content: string;
  replies: CommentData[];
  replyToUser?: User;
}

const users: User[] = [
  { id: 1, name: "Alice", avatar: "/placeholder.svg?height=32&width=32" },
  { id: 2, name: "Bob", avatar: "/placeholder.svg?height=32&width=32" },
  { id: 3, name: "Charlie", avatar: "/placeholder.svg?height=32&width=32" },
  { id: 4, name: "David", avatar: "/placeholder.svg?height=32&width=32" },
];

export function CommentSection() {
  const [comments, setComments] = useState<CommentData[]>([
    {
      id: 1,
      user: users[0],
      content: "This is a great post!",
      replies: [
        {
          id: 2,
          user: users[1],
          content: "I agree with Alice.",
          replies: [],
          replyToUser: users[0],
        },
      ],
    },
    {
      id: 3,
      user: users[2],
      content: "Interesting perspective.",
      replies: [],
    },
  ]);
  const [newComment, setNewComment] = useState("");
  const [currentUser, setCurrentUser] = useState<User>(users[0]);

  const addComment = (
    parentId: number | null,
    content: string,
    userId: number,
    replyToUser?: User
  ) => {
    const newId = Math.max(...comments.flat().map((c) => c.id)) + 1;
    const user = users.find((u) => u.id === userId) || currentUser;
    const newCommentData: CommentData = {
      id: newId,
      user,
      content,
      replies: [],
      replyToUser,
    };

    if (parentId === null) {
      setComments([...comments, newCommentData]);
    } else {
      const addReply = (comments: CommentData[]): CommentData[] => {
        return comments.map((comment) => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: [...comment.replies, newCommentData],
            };
          } else if (comment.replies.length > 0) {
            return { ...comment, replies: addReply(comment.replies) };
          }
          return comment;
        });
      };
      setComments(addReply(comments));
    }
  };

  const handleSubmit = () => {
    if (newComment.trim()) {
      addComment(null, newComment, currentUser.id);
      setNewComment("");
    }
  };



  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>
      <div className="mb-4">
        <Select
          onValueChange={(value) =>
            setCurrentUser(
              users.find((u) => u.id === parseInt(value)) || users[0]
            )
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select user" />
          </SelectTrigger>
          <SelectContent>
            {users.map((user) => (
              <SelectItem key={user.id} value={user.id.toString()}>
                {user.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          {...comment}
          onReply={addComment}
          currentUser={currentUser}
        />
      ))}
      <div className="mt-4">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="mb-2"
        />
        <Button onClick={handleSubmit}>Submit Comment</Button>
      </div>
    </div>
  );
}
