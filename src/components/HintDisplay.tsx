"use client";

import React from 'react';
import { useGame } from '@/lib/game/GameContext';
import Ball from './Ball';

const HintDisplay: React.FC = () => {
  const { state } = useGame();
  
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
  
  const ballsContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '8px',
  };
  
  return (
    <div style={containerStyle}>
      <div style={labelStyle}>Next Balls:</div>
      <div style={ballsContainerStyle}>
        {state.hints.map((hint, index) => (
          <Ball 
            key={index} 
            ball={{ id: `hint-${index}`, color: hint.color }} 
            size={24} 
          />
        ))}
      </div>
    </div>
  );
};

export default HintDisplay; 