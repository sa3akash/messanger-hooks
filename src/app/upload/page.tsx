"use client"

import { useState } from "react"
import { Post } from "./types"
import { CreatePostDialog } from "./create-post-dialog"
import { PostCard } from "./PostCard"


export default function Page() {
  const [posts, setPosts] = useState<Post[]>([])

  const handleNewPost = (post: Post) => {
    setPosts((prev) => [post, ...prev])
  }

  const handleUpdatePost = (updatedPost: Post) => {
    setPosts((prev) => prev.map((post) => (post.id === updatedPost.id ? updatedPost : post)))
  }

  const handleDeletePost = (postId: string) => {
    setPosts((prev) => prev.filter((post) => post.id !== postId))
  }

  return (
    <main className="container max-w-xl py-8 space-y-8 mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Social Feed</h1>
        <CreatePostDialog onPost={handleNewPost} />
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} onUpdate={handleUpdatePost} onDelete={handleDeletePost} />
        ))}
        {posts.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">No posts yet. Create your first post!</div>
        )}
      </div>
    </main>
  )
}
