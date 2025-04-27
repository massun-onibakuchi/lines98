"use client";

import React from 'react';
import { useAudio } from '@/lib/audio/AudioContext';

const VolumeControl: React.FC = () => {
  const { volume, setVolume, toggleMute, isMuted } = useAudio();
  
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    margin: '10px 0',
  };
  
  const buttonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '20px',
  };
  
  const sliderContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flex: 1,
  };
  
  const sliderStyle: React.CSSProperties = {
    flex: 1,
    cursor: 'pointer',
  };
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };
  
  // Determine which icon to show based on mute state and volume level
  const getVolumeIcon = () => {
    if (isMuted) return '🔇';
    if (volume === 0) return '🔇';
    if (volume < 0.5) return '🔉';
    return '🔊';
  };
  
  return (
    <div style={containerStyle}>
      <button 
        style={buttonStyle} 
        onClick={toggleMute}
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        {getVolumeIcon()}
      </button>
      
      <div style={sliderContainerStyle}>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          style={sliderStyle}
          disabled={isMuted}
        />
      </div>
    </div>
  );
};

export default VolumeControl; 