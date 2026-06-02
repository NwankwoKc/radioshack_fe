import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { Room, RoomEvent } from "livekit-client";

interface LiveKitContextType {
  room: Room | null;
  isConnected: boolean;
  joinRoom: (url: string, token: string) => Promise<Room>;
  leaveRoom: () => Promise<void>;
}

const LiveKitContext = createContext<LiveKitContextType | null>(null);

export function LiveKitProvider({ children }: { children: ReactNode }) {
  const [room, setRoom] = useState<Room | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  async function joinRoom(url: string, token: string): Promise<Room> {
    const newRoom = new Room();

    newRoom.on(RoomEvent.Connected, () => setIsConnected(true));
    newRoom.on(RoomEvent.Disconnected, () => {
      setIsConnected(false);
      setRoom(null);
    });

    await newRoom.connect(url, token);
    setRoom(newRoom);
    return newRoom;
  }

  async function leaveRoom(): Promise<void> {
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

export function useLiveKit(): LiveKitContextType {
  const context = useContext(LiveKitContext);
  if (!context) {
    throw new Error("useLiveKit must be used within a LiveKitProvider");
  }
  return context;
}
