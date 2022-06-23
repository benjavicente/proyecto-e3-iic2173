import axios from "axios"
import { useState, createContext, useEffect, useCallback, useContext, useMemo } from "react"
import useLocalStorage from "~/hooks/useLocalStorage"
import useLocalStorageEmail from "~/hooks/useLocalStorageEmail"


type IChat = {
  id: string,
  messages: Message[] | null,
  amount: number,
}

type IChatState = {
  chats: IChat[],
  isLoading: boolean,
  loadChatById: (chatId: string) => void,
  sendMessage: (message: object) => void,
}


const ChatContext = createContext<IChatState | undefined>(undefined)

export default function ChatProvider(props) {  
  const [isLoading, setIsLoading] = useState(true)
  const [chats, setChats] = useState<IChat[]>([])
  const [token] = useLocalStorage<string | null>("token")
  const [email] = useLocalStorageEmail<string | null>("email")

  // Load initial state
  useEffect(() => {
    if (!token) return
    setIsLoading(true)
    Promise.all([
      axios.get<Message[]>("/api/chat/public"),
      axios.get<Chat[]>("/api/chat/", { headers: { Authorization: `Bearer ${token}` } }),
    ]).then(([publicChatFeed, chatList]) => {
      console.log('Public', publicChatFeed)
      // Set the chats
      setChats([
        { id: "public", messages: publicChatFeed.data, amount: publicChatFeed.data.length },
        ...chatList.data.map(chat => ({ id: chat.other_user_id, messages: null, amount: chat.count })),
      ])
      setIsLoading(false)
    })
  }, [token])

  // Load chat by id if it's not loaded
  const loadChatById = useCallback(async (chatId: string) => {
    if (chats.find(chat => chat.id === chatId)) return
    setIsLoading(true)
    const { data } = await axios.get<Message[]>(`/api/chat/${chatId}`)
    setChats([...chats, { id: chatId, messages: data, amount: data.length }])
    setIsLoading(false)
  }, [chats])

  // Create the websocket connection
  const ws = useMemo(() => {
    if (typeof window === "undefined") return
    const websocket = new WebSocket(`${window.location.origin.replace(/^http(s?):/, 'ws$1:')}/api/chat/ws?token=${token}`)
    return websocket
  }, [token])


  // Update the stream of messages
  const updateChatsFromWS = useCallback((wsResponse: MessageEvent) => {
    if (isLoading) return
    // TODO: parse the message and update the state
    const message = JSON.parse(wsResponse.data)
    if (!("message" in message)) return
    if ("to_user_id" in message) {
      // Is a private message
      setChats(chats.map(chat => (chat.id === message.from_user_id ? { ...chat, messages: [...chat.messages || [], message] } : chat)))
    } else {
      // Is a public message
      setChats(chats.map(c => (c.id === "public" ? { ...c, amount: c.amount + 1, messages: [...c.messages || [], message] } : c)))
    }
  }, [isLoading, setChats, chats])

  console.log(chats)

  // Listen to the websocket
  useEffect(() => {
    if (!ws) return
    ws.addEventListener("message", updateChatsFromWS)
    return () => ws.removeEventListener("message", updateChatsFromWS)
  }, [updateChatsFromWS, ws])


  // Send message to the websocket
  const sendMessage = useCallback(async (payload: { chatId: string, message: string }) => {
    if (!ws) throw new Error("WebSocket is not initialized")  // This should never happen
    // Transform the payload
    const isToPublic = payload.chatId === "public"
    console.log(payload)
    if (isToPublic) {
      ws.send(JSON.stringify({ message: payload.message, type: "public" }))
    } else {
      ws.send(JSON.stringify({ message: payload.message, type: "private", to_user_id: payload.chatId }))
    }
  }, [ws])

  return <ChatContext.Provider value={{ chats, sendMessage, isLoading, loadChatById }} {...props} />
}


function useChatContext() {
  const context = useContext(ChatContext)
  if (!context) throw new Error("useChatContext must be used within a ChatProvider")
  return context
}

export function useChat() {
  const { chats, isLoading } = useChatContext()
  return { chats: chats.map(({ id, amount }) => ({ id, amount })), isLoading }
}

export function useMessagesOfChat(chatId: string) {
  const { chats, isLoading, loadChatById, sendMessage } = useChatContext()
  loadChatById(chatId)
  const messages = chats.find(chat => chat.id === chatId)?.messages || []

  const sendMessageWithID = useCallback((message: string) => {
    sendMessage({ chatId, message })
  }, [sendMessage, chatId])

  return { messages, isLoading, sendMessage: sendMessageWithID }
}
