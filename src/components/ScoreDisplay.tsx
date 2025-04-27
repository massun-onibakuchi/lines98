"use client";

import React from 'react';
import { useGame } from '@/lib/game/GameContext';

const ScoreDisplay: React.FC = () => {
  const { state } = useGame();
  
  const scoreStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
    padding: '8px 16px',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    display: 'inline-block',
    margin: '10px 0',
  };
  
  return (
    <div style={scoreStyle}>
      Score: {state.score}
    </div>
  );
};

export default ScoreDisplay; 