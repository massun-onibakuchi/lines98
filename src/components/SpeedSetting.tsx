"use client";

import React from 'react';
import { useGame } from '@/lib/game/GameContext';

const SpeedSetting: React.FC = () => {
  const { state, dispatch } = useGame();
  
  const containerStyle: React.CSSProperties = {
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
  
  const selectStyle: React.CSSProperties = {
    padding: '6px 12px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    background: 'white',
    fontSize: '14px',
    cursor: 'pointer',
  };
  
  const handleSpeedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSpeed = parseInt(e.target.value, 10);
    dispatch({ type: 'SET_AUTO_SPEED', speed: newSpeed });
  };
  
  return (
    <div style={containerStyle}>
      <div style={labelStyle}>Auto Speed:</div>
      <select 
        style={selectStyle} 
        value={state.autoModeSpeed} 
        onChange={handleSpeedChange}
      >
        <option value="1000">Fast (1s)</option>
        <option value="3000">Normal (3s)</option>
        <option value="5000">Slow (5s)</option>
      </select>
    </div>
  );
};

export default SpeedSetting; 