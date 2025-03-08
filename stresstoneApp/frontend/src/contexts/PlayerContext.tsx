// File: stresstoneApp/frontend/src/contexts/PlayerContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface SoundTrack {
  _id: string;
  title: string;
  creator?: { name: string };
  audioUrl?: string;
  imageFileId?: string;
}

interface PlayerContextType {
  currentTrack: SoundTrack | null;
  isPlaying: boolean;
  setCurrentTrack: (track: SoundTrack | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  togglePlay: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [currentTrack, setCurrentTrack] = useState<SoundTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => setIsPlaying(!isPlaying);

  return (
    <PlayerContext.Provider value={{ currentTrack, isPlaying, setCurrentTrack, setIsPlaying, togglePlay }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};