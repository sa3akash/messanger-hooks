import ChatArea from "./ChatArea";
import Sidebar from "./Sidebar";

export default function Home() {
  return (
    <main className="flex h-screen">
      <Sidebar />
      <ChatArea />
    </main>
  )
}

