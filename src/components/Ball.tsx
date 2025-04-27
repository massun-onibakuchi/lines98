"use client";

import React from 'react';
import { Ball as BallType } from '@/lib/game/types';

interface BallProps {
  ball: BallType;
  size: number;
}

const Ball: React.FC<BallProps> = ({ ball, size }) => {
  const ballStyle: React.CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    backgroundColor: ball.color,
    boxShadow: `inset 0 -4px 4px rgba(0, 0, 0, 0.2), inset 0 4px 4px rgba(255, 255, 255, 0.2)`,
    border: ball.selected ? '2px solid white' : 'none',
    transform: ball.selected ? 'scale(1.1)' : 'scale(1)',
    transition: 'transform 0.2s ease',
    position: 'relative',
  };

  // Add a shine effect to the ball
  const shineStyle: React.CSSProperties = {
    position: 'absolute',
    top: '20%',
    left: '20%',
    width: '20%',
    height: '20%',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.5)',
    filter: 'blur(2px)',
  };

  return (
    <div style={ballStyle}>
      <div style={shineStyle} />
    </div>
  );
};

export default Ball; 