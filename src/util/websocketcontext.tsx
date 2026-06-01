import { createContext, useContext, useEffect, useRef } from "react";
import Connectwebsocket from './ws.connect'

interface wscontext {
  ws: Connectwebsocket | null;
}

const webseocketcontext = createContext<wscontext | null>(null)

export function Websocketprovider({ children }: any) {
  const wsref = useRef<Connectwebsocket | null>(null)
  useEffect(() => {
    const connection = new Connectwebsocket('ws://localhost:3000/chat')
    wsref.current = connection
    return () => connection.disconnect()
  }, [])
  return (
    <webseocketcontext.Provider value={{ ws: wsref.current }}>{children}</webseocketcontext.Provider>
  )
}

export function usewsinstancehook() {
  const context = useContext(webseocketcontext)
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider')
  }
  return context.ws
}
