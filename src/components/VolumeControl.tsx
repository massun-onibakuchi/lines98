"use client";

import React from 'react';
import { useAudio } from '@/lib/audio/AudioContext';

const VolumeControl: React.FC = () => {
  const { toggleMute, isMuted } = useAudio();
  
  // Determine which icon to show based on mute state
  const getVolumeIcon = () => {
    return isMuted ? '🔇' : '🔊';
  };
  
  return (
    <div className="flex items-center justify-between p-1 bg-gray-100 rounded-lg">
      <span className="text-xs font-medium text-gray-700">Sound:</span>
      <button 
        className="text-lg bg-transparent border-0 cursor-pointer"
        onClick={toggleMute}
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        {getVolumeIcon()}
      </button>
    </div>
  );
};

export default VolumeControl; 