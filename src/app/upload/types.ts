export interface IFiles {
    mimetype?: string
    size?: number
    url?: string
    name?: string
    duration?: number
    resolution?: string
    display_aspect_ratio?: string
    preview?: string
    id?: string
}
  
  export interface Author {
    name: string
    image: string
  }
  
  export interface Comment {
    id: string
    author: Author
    content: string
    timestamp: Date
  }
  
  export interface Post {
    id: string
    files: IFiles[]
    caption: string
    timestamp: Date
    likes: number
    comments: Comment[]
    author: Author
  }
  
  