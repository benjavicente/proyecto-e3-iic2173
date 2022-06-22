import { FormEventHandler, useCallback, useEffect, useRef, useState } from "react";
import ChatProvider, { useChat, useMessagesOfChat } from "~/contexts/Chat";


function ChatItem({ id, amount }) {
  return (
    <li className="bg-slate-600 text-slate-200 p-2">
      {id} ({amount})
    </li>
  )
}

function ChatList() {
  const { chats, isLoading } = useChat();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <ol className="flex flex-col">
      {chats.map(chat => (<ChatItem key={chat.id} {...chat} />))}
    </ol>
  )
}

function Message({ id, message, created_at }: Message) {
  const timestamp = new Date(created_at).toLocaleString();
  return (
    <li className="bg-slate-700 p-1 rounded flex-grow-0 self-left w-fit">
      <div className="text-slate-200">{message}</div>
      <time className="text-slate-500">({timestamp})</time>
    </li>
  )
}

function MessagesPanel({ currentChatID }) {
  const [messageToSend, setMessageToSend] = useState("")
  const { messages, isLoading, sendMessage } = useMessagesOfChat(currentChatID);
  const messagesContainerRef = useRef<HTMLOListElement>(null)

  useEffect(() => {
    const e = messagesContainerRef.current
    if (e) e.children[e.childNodes.length - 1].scrollIntoView()
  }, [messages])

  const handleSendMessage: FormEventHandler = useCallback((e) => {
    e.preventDefault();
    sendMessage(messageToSend);
    setMessageToSend("");
  }, [messageToSend, sendMessage])

  return (
    <div className="h-full flex flex-col">
      <h2 className="p-2 text-slate-100 text-center">{currentChatID}</h2>
      {isLoading ? (
        <div className="flex-grow flex align-middle justify-center text-slate-300"> Loading...</div>
      ) : (
        <ol className="flex flex-col flex-shrink overflow-y-scroll gap-2 p-2" ref={messagesContainerRef}>
          {messages.map(message => (<Message key={message.id} {...message} />))}
        </ol>
      )}
      <form onSubmit={handleSendMessage} className="flex">
        <input type="text" placeholder="Mensaje" className="flex-grow" value={messageToSend} onChange={(e) => setMessageToSend(e.target.value)} />
        <button type="submit" className="bg-sky-300 p-2">Enviar</button>
      </form>
    </div >
  )
}

export default function ChatPage() {
  const [currentChatID, setCurrentChatID] = useState("public")

  return (
    <ChatProvider>
      <div className="grid grid-cols-[250px_1fr] bg-slate-800 grid-rows-[100vh]">
        <div className="flex flex-col bg-slate-700 h-full">
          <div className="px-2 py-4">
            <input type="text" placeholder="Escribir por id..." className="border-none w-full h-full grow-0 focus:ring-0 bg-slate-600 rounded text-slate-100 placeholder-slate-300" />
          </div>
          <ChatList />
        </div>
        <MessagesPanel currentChatID={currentChatID} />
      </div>
    </ChatProvider>
  )
}
