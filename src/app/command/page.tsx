import { CommentSection } from "./comment-section";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Blog Post Title</h1>
      <p className="mb-8">This is the content of the blog post. It can be as long as needed.</p>
      <CommentSection />
    </main>
  )
}
