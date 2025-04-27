"use client";

import React from 'react';
import { useGame } from '@/lib/game/GameContext';

const AutoModeToggle: React.FC = () => {
  const { state, dispatch } = useGame();
  
  const toggleContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px 16px',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    margin: '10px 0',
  };
  
  const labelStyle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
  };
  
  const toggleSwitchStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    width: '60px',
    height: '34px',
  };
  
  const toggleInputStyle: React.CSSProperties = {
    opacity: 0,
    width: 0,
    height: 0,
  };
  
  const toggleSliderStyle: React.CSSProperties = {
    position: 'absolute',
    cursor: 'pointer',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: state.autoMode ? '#2196F3' : '#ccc',
    transition: '0.4s',
    borderRadius: '34px',
  };
  
  const sliderBeforeStyle: React.CSSProperties = {
    position: 'absolute',
    content: '""',
    height: '26px',
    width: '26px',
    left: '4px',
    bottom: '4px',
    backgroundColor: 'white',
    transition: '0.4s',
    borderRadius: '50%',
    transform: state.autoMode ? 'translateX(26px)' : 'translateX(0)',
  };
  
  const handleToggleClick = () => {
    dispatch({ type: 'TOGGLE_AUTO_MODE' });
  };
  
  return (
    <div style={toggleContainerStyle}>
      <div style={labelStyle}>Auto Mode:</div>
      <div style={toggleSwitchStyle} onClick={handleToggleClick}>
        <input
          type="checkbox"
          checked={state.autoMode}
          onChange={handleToggleClick}
          style={toggleInputStyle}
        />
        <span style={toggleSliderStyle}>
          <span style={sliderBeforeStyle}></span>
        </span>
      </div>
    </div>
  );
};

export default AutoModeToggle; 