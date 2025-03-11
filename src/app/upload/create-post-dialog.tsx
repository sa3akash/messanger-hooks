"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ImagePlus, Pencil } from "lucide-react"
import { UploadForm } from "./upload-form"
import type { Post } from "./types"

interface CreatePostDialogProps {
  post?: Post
  onPost: (post: Post) => void
  onUpdate?: (post: Post) => void
}

export const CreatePostDialog = ({ post, onPost, onUpdate }: CreatePostDialogProps) => {
  const [open, setOpen] = useState(false)

  const handleComplete = (newPost: Post) => {
    if (post && onUpdate) {
      onUpdate(newPost)
    } else {
      onPost(newPost)
    }
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {post ? (
          <Button variant="ghost" size="sm">
            <Pencil className="w-4 h-4 mr-2" />
            Edit post
          </Button>
        ) : (
          <Button className="gap-2">
            <ImagePlus className="w-4 h-4" />
            Create post
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-scroll p-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>{post ? "Edit post" : "Create new post"}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto">
          <UploadForm post={post} onComplete={handleComplete} />
        </div>
      </DialogContent>
    </Dialog>
  )
}

