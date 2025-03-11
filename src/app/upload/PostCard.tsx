"use client"

import type React from "react"

import { useState } from "react"
import type { Post } from "./types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Heart, MessageCircle, MoreHorizontal, Send, Bookmark, ChevronLeft, ChevronRight } from "lucide-react"
import { CreatePostDialog } from "./create-post-dialog"
import Image from "next/image"

interface PostCardProps {
  post: Post
  onUpdate: (post: Post) => void
  onDelete: (postId: string) => void
}

export function PostCard({ post, onUpdate, onDelete }: PostCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [comment, setComment] = useState("")
  const [showComments, setShowComments] = useState(false)

  const handleLike = () => {
    setIsLiked(!isLiked)
    onUpdate({
      ...post,
      likes: isLiked ? post.likes - 1 : post.likes + 1,
    })
  }

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) return

    onUpdate({
      ...post,
      comments: [
        ...post.comments,
        {
          id: Math.random().toString(36).substring(7),
          author: { name: "You", image: "/placeholder.svg" },
          content: comment,
          timestamp: new Date(),
        },
      ],
    })
    setComment("")
  }

  return (
    <div className="bg-card rounded-lg shadow-sm border">
      <div className="p-4 flex items-center justify-between border-b">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={post.author.image} />
            <AvatarFallback>{post.author.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{post.author.name}</p>
            <p className="text-sm text-muted-foreground">{new Date(post.timestamp).toLocaleDateString()}</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <CreatePostDialog post={post} onUpdate={onUpdate} onPost={() => {}} />
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onDelete(post.id)} className="text-destructive">
              Delete post
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="relative">
        <div className="aspect-square relative bg-muted">
          {post.files[currentImageIndex].mimetype?.startsWith("image/") ? (
            <img
              src={post.files[currentImageIndex].preview || "/placeholder.svg"}
              alt={`Post ${currentImageIndex + 1}`}
              className="object-cover w-full h-full"
            />
          ) : (
            <video src={post.files[currentImageIndex].preview} className="object-cover w-full h-full" controls />
          )}
        </div>

        {post.files.length > 1 && (
          <>
            {currentImageIndex > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 hover:bg-background/90"
                onClick={() => setCurrentImageIndex((prev) => prev - 1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            )}
            {currentImageIndex < post.files.length - 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 hover:bg-background/90"
                onClick={() => setCurrentImageIndex((prev) => prev + 1)}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
            <div className="absolute top-2 right-2 bg-background/80 px-2 py-1 rounded-full text-xs">
              {currentImageIndex + 1} / {post.files.length}
            </div>
          </>
        )}
      </div>

      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleLike} className={isLiked ? "text-red-500" : ""}>
              <Heart className={`w-6 h-6 ${isLiked ? "fill-current" : ""}`} />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setShowComments(!showComments)}>
              <MessageCircle className="w-6 h-6" />
            </Button>
            <Button variant="ghost" size="icon">
              <Send className="w-6 h-6" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSaved(!isSaved)}
            className={isSaved ? "text-yellow-500" : ""}
          >
            <Bookmark className={`w-6 h-6 ${isSaved ? "fill-current" : ""}`} />
          </Button>
        </div>

        {post.likes > 0 && <p className="font-medium">{post.likes.toLocaleString()} likes</p>}

        {post.caption && (
          <p>
            <span className="font-medium mr-2">{post.author.name}</span>
            {post.caption}
          </p>
        )}

        {showComments && (
          <div className="space-y-2">
            {post.comments.map((comment) => (
              <div key={comment.id} className="flex items-start gap-2">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={comment.author.image} />
                  <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p>
                    <span className="font-medium mr-2">{comment.author.name}</span>
                    {comment.content}
                  </p>
                  <p className="text-xs text-muted-foreground">{new Date(comment.timestamp).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleComment} className="flex items-center gap-2">
          <Input
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={!comment.trim()}>
            Post
          </Button>
        </form>
      </div>
    </div>
  )
}

