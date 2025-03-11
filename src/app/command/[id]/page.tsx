import { notFound } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const users = [
  { id: 1, name: 'Alice', avatar: '/placeholder.svg?height=128&width=128', bio: 'Software Developer' },
  { id: 2, name: 'Bob', avatar: '/placeholder.svg?height=128&width=128', bio: 'UX Designer' },
  { id: 3, name: 'Charlie', avatar: '/placeholder.svg?height=128&width=128', bio: 'Product Manager' },
  { id: 4, name: 'David', avatar: '/placeholder.svg?height=128&width=128', bio: 'Data Scientist' },
]

export default function ProfilePage({ params }: { params: { id: string } }) {
  const user = users.find(u => u.id === parseInt(params.id))

  if (!user) {
   return notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center space-x-4">
          <Avatar className="h-32 w-32">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-gray-600">{user.bio}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
