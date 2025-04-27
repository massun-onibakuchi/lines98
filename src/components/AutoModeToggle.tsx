"use client";

import React from 'react';
import { useGame } from '@/lib/game/GameContext';

const AutoModeToggle: React.FC = () => {
  const { state, dispatch } = useGame();
  
  const handleToggleClick = () => {
    dispatch({ type: 'TOGGLE_AUTO_MODE' });
  };
  
  return (
    <div className="flex items-center justify-between p-1 bg-gray-100 rounded-lg">
      <span className="text-xs font-medium text-gray-700">Auto:</span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={state.autoMode}
          onChange={handleToggleClick}
          className="sr-only peer"
        />
        <div className="w-8 h-4 bg-gray-300 peer-focus:outline-none rounded-full peer 
                     peer-checked:after:translate-x-full peer-checked:after:border-white 
                     after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                     after:bg-white after:border-gray-300 after:border after:rounded-full 
                     after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-500"></div>
      </label>
    </div>
  );
};

export default AutoModeToggle; 