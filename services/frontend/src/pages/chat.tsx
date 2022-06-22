import ChatProvider, { useChat } from "~/contexts/Chat";

function ChatList() {
  const { chats, isFetching } = useChat();

  if (isFetching) {
    return <p>Loading...</p>;
  }

  return (
    <ol>
      <li>XD</li>
    </ol>
  )
}

export default function ChatPage() {
  return (
    <ChatProvider>
      <div className="grid grid-cols-[250px_1fr] bg-slate-800 h-screen">
        <div className="flex flex-col bg-slate-700">
          <div className="p-2">
            <input type="text" placeholder="Escribir por id..." className="border-none w-full h-full grow-0 focus:ring-0 bg-slate-600 rounded text-slate-100 placeholder-slate-300" />
          </div>
          <ChatList></ChatList>
        </div>
        <div></div>
      </div>
    </ChatProvider>
  )
}
