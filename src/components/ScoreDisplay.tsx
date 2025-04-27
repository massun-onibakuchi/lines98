"use client";

import React from 'react';
import { useGame } from '@/lib/game/GameContext';

const ScoreDisplay: React.FC = () => {
  const { state } = useGame();
  
  return (
    <div className="text-center p-1 bg-gray-100 rounded-lg">
      <span className="text-lg font-bold text-gray-800">
        Score: {state.score}
      </span>
    </div>
  );
};

export default ScoreDisplay; 