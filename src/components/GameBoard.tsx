"use client";

import React, { useState, useEffect } from 'react';
import Ball from '@/components/Ball';
import { useGame } from '@/lib/game/GameContext';
import { useAudio } from '@/lib/audio/AudioContext';
import { Position } from '@/lib/game/types';

const GameBoard: React.FC = () => {
  const { state, dispatch } = useGame();
  const { board } = state;
  const [cellSize, setCellSize] = useState(50); // Default size
  const [ballSize, setBallSize] = useState(40); // Default size
  const [isClient, setIsClient] = useState(false);
  const audio = useAudio();

  // Set isClient to true after component mounts to ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Calculate sizes based on window width only on client side
  useEffect(() => {
    if (!isClient) return; // Skip if we're not on the client yet
    
    const handleResize = () => {
      const size = Math.min(window.innerWidth, 600) / 11;
      setCellSize(size);
      setBallSize(size * 0.8);
    };
    
    // Initial calculation
    handleResize();
    
    // Add resize listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, [isClient]);
  
  // Start background music when component mounts
  useEffect(() => {
    if (isClient) {
      // Play background music
      audio.play('background');
    }
    
    // Cleanup: stop background music when component unmounts
    return () => {
      audio.stop('background');
    };
  }, [isClient, audio]);
  
  // Play sound effects when board state changes
  useEffect(() => {
    if (!isClient) return;
    
    // Check if game is over
    if (state.gameOver) {
      audio.play('gameOver');
    }
  }, [state.gameOver, isClient, audio]);

  // Handle clicking on a cell
  const handleCellClick = (row: number, col: number) => {
    const position: Position = { row, col };
    const cell = board[row][col];

    if (cell.ball) {
      // If the cell has a ball, select it
      dispatch({ type: 'SELECT_BALL', position });
      // Play select sound
      audio.play('select');
    } else if (state.selectedBall) {
      // If a ball is already selected and this is an empty cell, try to move
      dispatch({ type: 'MOVE_BALL', position });
      // Play move sound
      audio.play('move');
      
      // Check if we need to play the clear sound (handled in reducer)
      const selectedRow = state.selectedBall.row;
      const selectedCol = state.selectedBall.col;
      
      // Only attempt to move if there's a valid path
      if (board[selectedRow][selectedCol].ball && !cell.ball) {
        setTimeout(() => {
          // Play clear sound if lines were cleared (check if ball is gone)
          if (!board[position.row][position.col].ball) {
            audio.play('clear');
          }
        }, 100);
      }
    }
  };
  
  // Grid styles with a light wooden background
  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(9, ${cellSize}px)`,
    gridTemplateRows: `repeat(9, ${cellSize}px)`,
    gap: '1px',
    padding: '8px',
    background: '#8B5A2B',
    borderRadius: '4px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
  };

  // Cell style for each grid position
  const cellStyle: React.CSSProperties = {
    width: `${cellSize}px`,
    height: `${cellSize}px`,
    background: '#D2B48C',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    borderRadius: '3px',
    position: 'relative',
    transition: 'background-color 0.2s',
  };

  // Hint indicator style
  const hintIndicatorStyle: React.CSSProperties = {
    position: 'absolute',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.5)',
    top: '4px',
    right: '4px',
  };

  // Check if a position is in the hints
  const isHintPosition = (row: number, col: number) => {
    return state.hints.some(
      hint => hint.position.row === row && hint.position.col === col
    );
  };

  // Get hint color if the position is a hint
  const getHintColor = (row: number, col: number) => {
    const hint = state.hints.find(
      h => h.position.row === row && h.position.col === col
    );
    return hint ? hint.color : undefined;
  };

  return (
    <div style={gridStyle}>
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            style={{
              ...cellStyle,
              backgroundColor: isHintPosition(rowIndex, colIndex) && !cell.ball
                ? '#E5D3B3'
                : '#D2B48C',
            }}
            onClick={() => handleCellClick(rowIndex, colIndex)}
          >
            {cell.ball && <Ball ball={cell.ball} size={ballSize} />}
            {isHintPosition(rowIndex, colIndex) && !cell.ball && (
              <div 
                style={{
                  ...hintIndicatorStyle,
                  backgroundColor: getHintColor(rowIndex, colIndex),
                }}
              />
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default GameBoard; 