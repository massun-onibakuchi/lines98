"use client";

import React from 'react';
import { useGame } from '@/lib/game/GameContext';
import Ball from './Ball';

const HintDisplay: React.FC = () => {
  const { state } = useGame();
  
  return (
    <div className="flex items-center p-1 bg-gray-100 rounded-lg">
      <span className="text-xs font-medium text-gray-700 mr-2">Next:</span>
      <div className="flex gap-1 flex-1 justify-center">
        {state.hints.map((hint, index) => (
          <Ball 
            key={index} 
            ball={{ id: `hint-${index}`, color: hint.color }} 
            size={20} 
          />
        ))}
      </div>
    </div>
  );
};

export default HintDisplay; 