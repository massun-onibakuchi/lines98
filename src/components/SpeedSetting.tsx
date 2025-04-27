"use client";

import React from 'react';
import { useGame } from '@/lib/game/GameContext';

const SpeedSetting: React.FC = () => {
  const { state, dispatch } = useGame();
  
  const handleSpeedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSpeed = parseInt(e.target.value, 10);
    dispatch({ type: 'SET_AUTO_SPEED', speed: newSpeed });
  };
  
  return (
    <div className="flex items-center justify-between p-1 bg-gray-100 rounded-lg">
      <span className="text-xs font-medium text-gray-700">Speed:</span>
      <select 
        className="p-0.5 text-xs rounded border border-gray-300 bg-white focus:outline-none"
        value={state.autoModeSpeed} 
        onChange={handleSpeedChange}
      >
        <option value="1000">Fast</option>
        <option value="3000">Normal</option>
        <option value="5000">Slow</option>
      </select>
    </div>
  );
};

export default SpeedSetting; 