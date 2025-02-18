import ChatArea from "./ChatArea";
import Sidebar from "./sider";


export default function Home() {
  return (
    <main className="flex h-screen">
      <Sidebar />
      <ChatArea />
    </main>
  )
}