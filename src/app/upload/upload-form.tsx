"use client"

import { useCallback, useState, useRef, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import { ImagePlus, Loader2, Upload, X, ChevronLeft, ChevronRight } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MediaPreview } from "./media-preview"
import type { Post, IFiles } from "./types"

interface UploadFormProps {
  post?: Post
  onComplete: (post: Post) => void
}

export function UploadForm({ post, onComplete }: UploadFormProps) {
  const [files, setFiles] = useState<IFiles[]>(post?.files || [])
  const [caption, setCaption] = useState(post?.caption || "")
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  const [uploading, setUploading] = useState(false)
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0)

  const filesRef = useRef(files)
  filesRef.current = files

  useEffect(() => {
    if (post?.files) {
      setFiles(
        post.files.map((file) => ({
          ...file,
          preview: file.url, // Use the URL as preview for existing files
        })),
      )
    }
  }, [post])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: IFiles[] = acceptedFiles.map((file) => ({
      mimetype: file.type,
      size: file.size,
      name: file.name,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substring(7),
    }))

    setFiles((prev) => [...prev, ...newFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
      "video/*": [".mp4", ".webm", ".ogg"],
    },
    maxSize: 1024 * 1024 * 500,
    multiple: true,
  })

  const mockApiCall = async (file: IFiles): Promise<string> => {
    return new Promise((resolve) => {
      let progress = 0
      const intervalId = setInterval(() => {
        progress += Math.random() * 10
        setUploadProgress((prev) => ({ ...prev, [file.id!]: Math.min(progress, 100) }))
        if (progress >= 100) {
          clearInterval(intervalId)
          resolve(`https://example.com/uploads/${file.name}`)
        }
      }, 200)
    })
  }

  const handleUpload = async () => {
    setUploading(true)
    setUploadProgress({})

    const uploadPromises = files.map(async (file) => {
      if (file.url) return file // Skip already uploaded files
      const url = await mockApiCall(file)
      return { ...file, url }
    })

    const uploadedFiles = await Promise.all(uploadPromises)

    const newPost: Post = {
      id: post?.id || Math.random().toString(36).substring(7),
      files: uploadedFiles,
      caption,
      timestamp: new Date(),
      likes: post?.likes || 0,
      comments: post?.comments || [],
      author: {
        name: "You",
        image: "/placeholder.svg",
      },
    }

    setUploading(false)
    onComplete(newPost)
  }

  const removeFile = (fileToRemove: IFiles) => {
    setFiles((prev) => {
      const newFiles = prev.filter((file) => file.id !== fileToRemove.id)
      if (fileToRemove.preview && !fileToRemove.url) {
        URL.revokeObjectURL(fileToRemove.preview)
      }
      if (currentPreviewIndex >= newFiles.length) {
        setCurrentPreviewIndex(Math.max(0, newFiles.length - 1))
      }
      return newFiles
    })
  }

  useEffect(() => {
    return () => {
      filesRef.current.forEach((file) => {
        if (file.preview && !file.url) {
          URL.revokeObjectURL(file.preview)
        }
      })
    }
  }, [])


  console.log(files)

  return (
    <div className="p-6">
      {files.length === 0 ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive ? "border-primary bg-primary/10" : "border-muted-foreground/25"}`}
        >
          <input {...getInputProps()} />
          <ImagePlus className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          {isDragActive ? (
            <p className="text-lg">Drop your media here ...</p>
          ) : (
            <div>
              <p className="text-lg mb-2">Drag & drop your media here</p>
              <p className="text-sm text-muted-foreground">Share multiple photos and videos (up to 500MB each)</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Preview Section */}
            <div className="space-y-4">
              <div className="relative">
                <div className="aspect-square relative rounded-lg overflow-hidden bg-muted">
                  <MediaPreview file={files[currentPreviewIndex]} />
                  {uploading && (
                    <div
                      className="absolute inset-0 flex items-center justify-center transition-all duration-500 ease-in-out"
                      style={{
                        background: "rgba(0, 0, 0, 0.2)",
                        backdropFilter: "blur(4px)",
                      }}
                    >
                      <div className="text-center space-y-3 p-4">
                        <div className="relative">
                          <Progress
                            value={uploadProgress[files[currentPreviewIndex].id!] || 0}
                            className="h-2 w-48 transition-all duration-300 ease-in-out"
                          />
                          <p className="text-sm font-medium mt-2 text-white">
                            {(uploadProgress[files[currentPreviewIndex].id!] || 0).toFixed(0)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* File Info */}
                  {!uploading && files[currentPreviewIndex].mimetype?.startsWith("video/") && (
                    <div className="absolute bottom-2 left-2 right-2 bg-black/50 text-white text-xs p-2 rounded">
                      <p>Duration: {(files[currentPreviewIndex].duration! / 60)?.toFixed(2)} Minites</p>
                      <p>Resolution: {files[currentPreviewIndex].resolution}</p>
                      <p>Size: {(files[currentPreviewIndex].size! / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                  )}

                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 rounded-full bg-background/80 hover:bg-background/90"
                    onClick={() => removeFile(files[currentPreviewIndex])}
                  >
                    <X className="w-4 h-4" />
                  </Button>

                  {files.length > 1 && (
                    <>
                      {currentPreviewIndex > 0 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 hover:bg-background/90"
                          onClick={() => setCurrentPreviewIndex((prev) => prev - 1)}
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                      )}
                      {currentPreviewIndex < files.length - 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 hover:bg-background/90"
                          onClick={() => setCurrentPreviewIndex((prev) => prev + 1)}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {files.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {files.map((file, index) => (
                    <button
                      key={file.id}
                      onClick={() => setCurrentPreviewIndex(index)}
                      className={`
                        relative flex-shrink-0 w-16 h-16 
                        rounded-lg overflow-hidden 
                        transition-all duration-300 ease-in-out
                        transform hover:scale-105
                        ${currentPreviewIndex === index ? "ring-2 ring-primary z-10" : "opacity-70 hover:opacity-100"}
                      `}
                    >
                      <MediaPreview file={file} />
                      {file.mimetype?.startsWith("video/") && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                          <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center">
                            <div className="w-0 h-0 border-l-4 border-l-white border-y-transparent border-y-4 ml-0.5" />
                          </div>
                        </div>
                      )}
                      {uploading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <p className="text-white text-xs font-bold">{(uploadProgress[file.id!] || 0).toFixed(0)}%</p>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Form Section */}
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <Avatar>
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>UN</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">You</p>
                  <p className="text-sm text-muted-foreground">Sharing with everyone</p>
                </div>
              </div>

              <div className="space-y-4">
                <Textarea
                  placeholder="Write a caption..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="min-h-[120px] resize-none"
                />

                <div {...getRootProps()} className="cursor-pointer">
                  <input {...getInputProps()} />
                  <Button type="button" variant="outline" className="w-full">
                    <ImagePlus className="w-4 h-4 mr-2" />
                    Add more media
                  </Button>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setFiles([])
                    setCaption("")
                  }}
                  disabled={uploading}
                >
                  Cancel
                </Button>
                <Button onClick={handleUpload} disabled={uploading || !files.length} className="min-w-[100px]">
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {post ? "Updating..." : "Posting..."}
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      {post ? "Update" : "Share"}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

