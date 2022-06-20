import useLocalStorage from "~/hooks/useLocalStorage"
import useWebSocket, { ReadyState } from 'react-use-websocket';

export default function ChatPage() {
  const [token] = useLocalStorage<string | null>("token")

  let WSURL: string | null = null
  let WSQueryParams: { [key: string]: string } = {}

  if (typeof window !== "undefined" && token) {
    WSURL = window.location.origin.replace(/^http(s?):/, 'ws$1:') + "/api/chat/ws";
    WSQueryParams = { token }
  }

  const { sendJsonMessage, lastJsonMessage } = useWebSocket(WSURL, { queryParams: WSQueryParams });

  console.log(lastJsonMessage)

  const sendMessage = (message: string) => {
    sendJsonMessage({ message })
  }

  return (
    <div>
      <h2>ChatPage</h2>
      <input />
      <button onClick={() => sendMessage("AAAAAA")}>Presionar aquí</button>
    </div>
  )
}
