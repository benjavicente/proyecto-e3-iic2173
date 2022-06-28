import { FormEventHandler, useCallback, useEffect, useRef, useState } from "react";
import Navbar from "~/components/Navbar";
import ChatProvider, { useChat, useMessagesOfChat } from "~/contexts/Chat";
import useLocalStorage from "~/hooks/useLocalStorage";

function Message({ id, from_user_id, message, created_at }: Message) {
  const [user] = useLocalStorage<User>('user');

  const Sentiment = async (message) => {
    const url = 'https://51zr7rl1u3.execute-api.us-east-1.amazonaws.com/serverless_lambda_stage/sentiment-analysis'
    const body = { message }
    let response;

    try {
      response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
      });
    } catch (err) {
      response = 'Sin respuesta'
      console.log('Error de cors')
    }
    const data = await response.text();
    alert(`El resultado del sentimiento es: ${data}`)
  }

  const timestamp = new Date(created_at).toLocaleString();
  return (
    <li 
      onClick={() => Sentiment(message)}
      className={`bg-slate-700 p-3 rounded flex-grow-0 w-fit max-w-lg${user ? (from_user_id === user.email ? " ml-auto bg-indigo-800" : '') : ''}`}
    >
      <div className="text-slate-200">{message}</div>
      <time className="text-slate-400 text-xs">({timestamp})</time>
      <div className="text-slate-400 text-xs">{from_user_id}</div>
    </li>
  )
}

function MessagesPanel({ currentChatID }) {
  const [messageToSend, setMessageToSend] = useState("")
  const { messages, isLoading, sendMessage } = useMessagesOfChat(currentChatID);
  const messagesContainerRef = useRef<HTMLOListElement>(null)
  const [user] = useLocalStorage<User>('user')

  

  useEffect(() => {
    const e = messagesContainerRef.current
    if (e && e.children.length != 0) e.children[e.childNodes.length - 1].scrollIntoView()
  }, [messages])

  const handleSendMessage: FormEventHandler = useCallback((e) => {
    e.preventDefault();
    sendMessage(messageToSend);
    setMessageToSend("");
  }, [messageToSend, sendMessage])

  if (user === undefined) {
    return (
      <div/>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <h2 className="p-2 text-slate-800 text-center">{currentChatID === 'public' ? 'Chat Público' : currentChatID}</h2>
      {isLoading ? (
        <div className="flex-grow flex align-middle justify-center text-slate-300"> Loading...</div>
      ) : (
        <ol className="flex flex-col flex-shrink overflow-y-scroll gap-2 p-2" ref={messagesContainerRef}>
          {messages.map(message => (<Message key={message.id} {...message} />))}
        </ol>
      )}
      {user.token ? 
        <form onSubmit={handleSendMessage} className="flex">
          <input type="text" placeholder="Mensaje" className="flex-grow bottom-0" value={messageToSend} onChange={(e) => setMessageToSend(e.target.value)} />
          <button type="submit" className="bg-slate-700 text-slate-100 p-2">Enviar</button>
        </form>
      : null}
      
    </div >
  )
}

export default function ChatPage() {
  const [idChat, setIdChat] = useLocalStorage<IdChat>('idChat')
  let currentChatID = 'public'

  const ChatItem = ({ id }) => {
    return (
      <li className="bg-slate-600 text-slate-200 p-2" onClick={() => {
        if (id !== 'Lista de chats disponibles') {
          setIdChat(id); 
        }
      }}>
        {id}
      </li>
    )
  }
  
  const ChatList = () => {
    const { chats, privateChats, isLoading } = useChat();
  
    if (isLoading) {
      return <p>Loading...</p>;
    }
    return (
      <ol className="flex flex-col">
        <ChatItem key={0} id={'Lista de chats disponibles'} />
        {chats.map(chat => (<ChatItem key={chat.id} {...chat} />))}
        {privateChats.map(chat => {
          return <ChatItem key={chat.id} {...chat} />
        })}
      </ol>
    )
  }

  
  if (idChat !== undefined) {
    currentChatID = idChat
  }

  return (
    <>
      <ChatProvider>
      <Navbar />
        <div className="grid grid-cols-[250px_1fr] bg-slate-300 grid-rows-[100vh]">
          <div className="flex flex-col bg-slate-700 h-full">
            <ChatList />
          </div>
          <MessagesPanel currentChatID={currentChatID} />
        </div>
      </ChatProvider>
    </>
  )
}
