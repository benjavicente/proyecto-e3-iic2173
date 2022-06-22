import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import useWebSocket from 'react-use-websocket';
import useLocalStorage from "~/hooks/useLocalStorage";

export const CommunicationContext = createContext({})

type ProviderChat = {
  id: string,
  messages: Message[] | null,
  amount: number,
}

export const ChatProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [token] = useLocalStorage<string | null>("token")
  const [chats, setChats] = useState<ProviderChat[]>([])

  const wsURL = useMemo(() => {
    if (typeof window === "undefined") return null
    return window.location.origin.replace(/^http(s?):/, 'ws$1:') + "/api/chat/ws"
  }, [])

  const { sendJsonMessage, lastJsonMessage } = useWebSocket(wsURL, { queryParams: { token } });

  // Inicialización del componente
  useEffect(() => {
    Promise.all([
      axios.get<Message[]>("/api/chat/public"),
      axios.get<Chat[]>("/api/chat/", { headers: { Authorization: `Bearer ${token}` } }),
    ]).then(([publicChatFeed, chatList]) => {
      setChats([
        { id: "public", messages: publicChatFeed.data, amount: publicChatFeed.data.length },
        ...chatList.data.map(chat => ({ id: chat.other_user_id, messages: null, amount: chat.count })),
      ])
      setIsLoading(false)
    })
  }, [])

  useEffect(() => {
    console.log(lastJsonMessage)
    if (!lastJsonMessage && isLoading) return
    // TODO: see if the message if public or not, and save it accordingly

  }, [lastJsonMessage, isLoading])


  // Hook para obtener los mensajes de un chat
  const useMessages = useCallback((chatId: string) => {
    // Aquí necesito obtener los mensajes de la API si no los tengo descargados
    const initialMessagesArray = useMemo(() => {
      const chat = chats.find(chat => chat.id === chatId)
      if (!chat) return null
      return chat.messages
    }, [chatId])
    const [messages, setMessages] = useState(initialMessagesArray)

    useEffect(() => {
      axios.get("/api/chats/").then((res) => {
        setMessages(res.data)
      })
    }, [])

    return messages
  }, [chats])

  // Hook para obtener el chat del usuario
  const chatsWithoutMessagesArray = useMemo(() => chats.map(({ id }) => { id }), [chats])
  const useChats = useCallback(() => {
    return chatsWithoutMessagesArray
  }, [chatsWithoutMessagesArray])

  // Callback para mandar un mensaje
  const sendMessage = useCallback((message: string, chatId: string) => {
    const results = chats.find(chat => chat.id === chatId)

    sendJsonMessage({ message, type: "public" })
    if (results) {
      // Update the messages array
    } else {
      // Create a new chat
    }

  }, [sendJsonMessage, chats])

  return (
    <CommunicationContext.Provider value={{ useMessages, useChats, sendMessage }}>
      {children}
    </CommunicationContext.Provider>)
}

/***** */


const ChatContext = createContext({})


function ChatsProvider(props) {

  const [chats, setChats] = useState([]);

  const updateChats = useCallback((wsResponse) => {

    // parsear wsResponse

    setChats(parseado(wsResponse));

  }, [setChats]);

  useEffect(() => {
    listener.listen(id);

    listener.on('update', updateChats)
    return () => {
      listener.destroy(id);
    }
  }, [id, updateChats]);

  const reload = useCallback(() => {
    listener.reload();
  }, [])



  return (
    <ChatContext.Provider value={{
      chats,
      reload
    }} {...props} />
    );
}

function useChats() {
  const {chats, reload} = useContext(ChatsContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isChatLoading, setChatLoading] = useState<{[id:string] : boolean}>({});

  useEffect((async () => {
    try {
      setIsLoading(true);
      await reload();
    } catch(error) {

    } finally {
      setIsLoading(false)
    }
  })(), []);
  
  return [chats, isLoading]
}

function useMessagesOf(id) {
  const [chats, isLoading, sender] = useChats();

  const sendMessage = useCallback((...args) => sender(id, ...args), [id]);

  return [chats.find(chat => chat.id === id)?.mesages, isChatLoading[id], sendMessage]
}

/** 
 * const [messages, isloading, sendMessage] = useMessagesOf(id);
 */