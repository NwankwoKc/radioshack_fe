import React, { createContext, useContext, useState } from 'react';
import { Room, RoomEvent } from 'livekit-client'; // Adjust import as needed

interface LiveKitContextType {
  room: Room | null;
  isConnected: boolean;
  joinRoom: (url: string, token: string) => Promise<Room>;
  leaveRoom: () => Promise<void>;
}

const LiveKitContext = createContext<LiveKitContextType | undefined>(undefined);

export function LiveKitProvider({ children }: { children: React.ReactNode }) {
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

  const value: LiveKitContextType = {
    room,
    isConnected,
    joinRoom,
    leaveRoom
  };

  return (
    <LiveKitContext.Provider value={value}>
      {children}
    </LiveKitContext.Provider>
  );
}

export function useLiveKit(): LiveKitContextType {
  const context = useContext(LiveKitContext);

  if (context === undefined) {
    throw new Error("useLiveKit must be used within a LiveKitProvider");
  }

  return context;
}
