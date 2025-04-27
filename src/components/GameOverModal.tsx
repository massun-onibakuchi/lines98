"use client";

import React from 'react';
import { useGame } from '@/lib/game/GameContext';

const GameOverModal: React.FC = () => {
  const { state, dispatch } = useGame();
  
  if (!state.gameOver) {
    return null;
  }
  
  const modalOverlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  };
  
  const modalContentStyle: React.CSSProperties = {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    textAlign: 'center',
    maxWidth: '400px',
    width: '90%',
  };
  
  const headingStyle: React.CSSProperties = {
    fontSize: '28px',
    marginBottom: '16px',
    color: '#333',
  };
  
  const scoreStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#e74c3c',
    margin: '16px 0',
  };
  
  const buttonStyle: React.CSSProperties = {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '16px',
    transition: 'background-color 0.2s',
  };
  
  const handleRestartClick = () => {
    dispatch({ type: 'RESET_GAME' });
  };
  
  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <h2 style={headingStyle}>Game Over!</h2>
        <p>No more moves possible. The board is full.</p>
        <div style={scoreStyle}>Your Score: {state.score}</div>
        <button 
          style={buttonStyle} 
          onClick={handleRestartClick}
        >
          Play Again
        </button>
      </div>
    </div>
  );
};

export default GameOverModal; 