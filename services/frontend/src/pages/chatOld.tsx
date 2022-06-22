import useLocalStorage from "~/hooks/useLocalStorage"
import useWebSocket from 'react-use-websocket';
import { useFetch } from "~/lib/api";
import { classNames } from "~/lib/utils";
import { useCallback, useMemo, useState, FormEventHandler, useEffect } from "react";


type Status<T> = { status: any, data?: T } | { error: any }

function Message({ content, isOwn = false }) {
  return (
    <li className={classNames("w-fit px-2 py-1 rounded", isOwn ? "bg-sky-400 ml-auto" : "bg-slate-400")}>
      {content}
    </li>
  )
}


export default function ChatPage() {
  const [token] = useLocalStorage<string | null>("token")
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const chatFeed = useFetch<Message[]>("/api/chat/public")
  const chat = useFetch<Chat[]>("/api/chat/", token || undefined)

  console.log("Re-rendering chat page")

  let WSURL: string | null = null
  let WSQueryParams: { [key: string]: string } = {}

  useEffect(() => {
    if (chatFeed.data && chatFeed.data.length > messages.length) {
      setMessages(chatFeed.data || [])
    }
  }, [chatFeed])

  if (typeof window !== "undefined" && token) {
    WSURL = window.location.origin.replace(/^http(s?):/, 'ws$1:') + "/api/chat/ws";
    WSQueryParams = { token }
  }

  const { sendJsonMessage, lastJsonMessage } = useWebSocket(WSURL, { queryParams: WSQueryParams });
  console.log(lastJsonMessage)

  useEffect(() => {
    if (!chatFeed.data || !lastJsonMessage) return
    if (("message" in lastJsonMessage) && lastJsonMessage !== messages[messages.length - 1]) {
      console.log(lastJsonMessage)
      console.log("saving message")
      setMessages([...messages, lastJsonMessage])
    }
  }, [lastJsonMessage, messages])

  console.log()

  const sendMessage: FormEventHandler = useCallback((event) => {
    event.preventDefault()
    setMessage("")
    sendJsonMessage({ message, type: "public" })
  }, [sendJsonMessage, message])

  return (
    <div className="grid grid-cols-[200px_1fr] bg-gray-70 h-screen">
      <div className="bg-slate-700 text-white">
        <h2 className="bg-slate-900 h-12 flex justify-center items-center">ChatPage</h2>
        {/* Input para nuevo chat */}
        <div className="flex flex-col justify-center items-center px-4 py-2">
          Nuevo chat
          <input className="text-black w-full" type="text" placeholder="ID de Usuario" />
        </div>
        {/* Lista de chats */}
        <ol className="flex flex-col gap-2 p-3 ">
          <li className="bg-slate-800">
            <button className="w-full h-full px-4 py-2">
              Chat Público
            </button>
          </li>
        </ol>
      </div>
      {/* Vista de chat */}
      <div className="h-screen grid grid-rows-[1fr_min-content]">
        <ul className="bg-slate-300 min-w-0 flex flex-col overflow-y-scroll gap-4 p-4">
          {messages.map((message) => <Message key={message.id} content={message.message} />)}
        </ul>
        <form className="flex" onSubmit={sendMessage}>
          <input value={message} onChange={(e) => setMessage(e.target.value)} type="text" className="flex-grow" />
          <button type="submit" className="p-2  text-white bg-sky-600 hover:bg-sky-500">
            Enviar
          </button>
        </form>
      </div>
    </div>
  )
}
