"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define audio types
type SoundType = 'background' | 'select' | 'move' | 'clear' | 'gameOver';

// Audio context interface
interface AudioContextType {
  play: (sound: SoundType) => void;
  stop: (sound: SoundType) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  isMuted: boolean;
  volume: number;
}

// Default context values
const defaultContext: AudioContextType = {
  play: () => {},
  stop: () => {},
  setVolume: () => {},
  toggleMute: () => {},
  isMuted: false,
  volume: 0.5,
};

// Create the context
const AudioContext = createContext<AudioContextType>(defaultContext);

// Audio files mapping
const audioFiles: Record<SoundType, string> = {
  background: '/audio/background-2.mp4',
  select: '/audio/select.mp3',
  move: '/audio/move.mp3',
  clear: '/audio/clear.mp3',
  gameOver: '/audio/game-over.mp3',
};

// Audio elements cache
const audioElements: Partial<Record<SoundType, HTMLAudioElement>> = {};

// Provider component
interface AudioProviderProps {
  children: ReactNode;
}

export function AudioProvider({ children }: AudioProviderProps) {
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolumeState] = useState(0.5);
  const [isClient, setIsClient] = useState(false);

  // Initialize audio on client-side only
  useEffect(() => {
    setIsClient(true);
    
    // Initialize audio elements
    if (typeof window !== 'undefined') {
      Object.entries(audioFiles).forEach(([type, src]) => {
        const audio = new Audio(src);
        
        // Set background music to loop
        if (type === 'background') {
          audio.loop = true;
        }
        
        audio.volume = volume;
        audio.muted = isMuted;
        audioElements[type as SoundType] = audio;
      });
    }
    
    // Cleanup function
    return () => {
      Object.values(audioElements).forEach(audio => {
        if (audio) {
          audio.pause();
          audio.src = '';
        }
      });
    };
  }, []);

  // Function to play a sound
  const play = (sound: SoundType) => {
    if (!isClient || isMuted) return;
    
    const audio = audioElements[sound];
    if (audio) {
      // If it's not background music and it's playing, restart it
      if (sound !== 'background') {
        audio.currentTime = 0;
      }
      
      audio.play().catch(error => {
        console.error(`Error playing ${sound} sound:`, error);
      });
    }
  };

  // Function to stop a sound
  const stop = (sound: SoundType) => {
    if (!isClient) return;
    
    const audio = audioElements[sound];
    if (audio) {
      audio.pause();
      if (sound !== 'background') {
        audio.currentTime = 0;
      }
    }
  };

  // Function to set volume for all sounds
  const setVolume = (newVolume: number) => {
    if (!isClient) return;
    
    setVolumeState(newVolume);
    Object.values(audioElements).forEach(audio => {
      if (audio) {
        audio.volume = newVolume;
      }
    });
  };

  // Function to toggle mute
  const toggleMute = () => {
    if (!isClient) return;
    
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);
    
    Object.values(audioElements).forEach(audio => {
      if (audio) {
        audio.muted = newMuteState;
      }
    });
  };

  const value = {
    play,
    stop,
    setVolume,
    toggleMute,
    isMuted,
    volume,
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
}

// Custom hook to use the audio context
export function useAudio() {
  const context = useContext(AudioContext);
  
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  
  return context;
} 