import { createContext, useContext, useState } from "react";
import { Room } from "livekit-client";
const LiveKitContext = createContext(null);

export function LiveKitProvider({ children }) {
  const [room, setRoom] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  async function joinRoom(url, token) {
    const newRoom = new Room();

    newRoom.on("connected", () => setIsConnected(true));
    newRoom.on("disconnected", () => {
      setIsConnected(false);
      setRoom(null);
    });

    await newRoom.connect(url, token);
    setRoom(newRoom);
    return newRoom;
  }

  async function leaveRoom() {
    if (room) {
      await room.disconnect();
    }
  }

  return (
    <LiveKitContext.Provider value={{ room, isConnected, joinRoom, leaveRoom }}>
      {children}
    </LiveKitContext.Provider>
  );
}


export function useLiveKit() {
  return useContext(LiveKitContext);
}
