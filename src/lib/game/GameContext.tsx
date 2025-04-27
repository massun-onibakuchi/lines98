"use client";

import React, { createContext, useContext, useReducer, useEffect, ReactNode, useState, useCallback, useRef } from 'react';
import { GameState, Position } from './types';
import { initGameState, processMove, isGameOver } from './gameLogic';
import { executeAutoTurn } from '../ai/autoMode';

// Define the actions for the reducer
type GameAction =
  | { type: 'SELECT_BALL'; position: Position }
  | { type: 'MOVE_BALL'; position: Position }
  | { type: 'TOGGLE_AUTO_MODE' }
  | { type: 'SET_AUTO_SPEED'; speed: number }
  | { type: 'RESET_GAME' };

// Create the context
type GameContextType = {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

// Reducer function to handle state updates
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SELECT_BALL': {
      const { position } = action;
      const { row, col } = position;
      const cell = state.board[row][col];
      
      // If there's no ball in the cell, do nothing
      if (!cell.ball) {
        return state;
      }
      
      // Deselect previously selected balls
      const newBoard = state.board.map(boardRow => 
        boardRow.map(boardCell => {
          if (boardCell.ball && boardCell.ball.selected) {
            return { 
              ...boardCell, 
              ball: { ...boardCell.ball, selected: false } 
            };
          }
          return boardCell;
        })
      );
      
      // Select the new ball
      newBoard[row][col].ball = {
        ...newBoard[row][col].ball!,
        selected: true,
      };
      
      return {
        ...state,
        board: newBoard,
        selectedBall: position,
      };
    }
    
    case 'MOVE_BALL': {
      const { position: endPosition } = action;
      const { selectedBall } = state;
      
      // If no ball is selected, do nothing
      if (!selectedBall) {
        return state;
      }
      
      // Create a deep copy of the current state to work with
      const newState = JSON.parse(JSON.stringify(state));
      
      // Process the move
      const result = processMove(newState, selectedBall, endPosition);
      
      // If the move was invalid, keep the state as is
      if (!result.validMove) {
        return state;
      }
      
      // Return the new state object created by processMove
      return {
        ...newState,
        selectedBall: null,
      };
    }
    
    case 'TOGGLE_AUTO_MODE': {
      // Create a new state object to ensure React detects the change
      const newState = {
        ...state,
        autoMode: !state.autoMode,
      };
      
      return newState;
    }
    
    case 'SET_AUTO_SPEED': {
      return {
        ...state,
        autoModeSpeed: action.speed,
      };
    }
    
    case 'RESET_GAME': {
      return initGameState();
    }
    
    default:
      return state;
  }
}

// Provider component
type GameProviderProps = {
  children: ReactNode;
};

export function GameProvider({ children }: GameProviderProps) {
  // Wrap in a function to avoid initializing the game state during server rendering
  const [state, dispatch] = useReducer(gameReducer, null, () => initGameState());
  // Add a counter for forcing re-renders
  const [renderKey, setRenderKey] = useState(0);
  // Add a counter for auto-mode moves
  const [autoMoveCount, setAutoMoveCount] = useState(0);
  // Ref to track if an auto-move is in progress
  const autoMoveInProgress = useRef(false);
  // Track if we're on the client side
  const [isClient, setIsClient] = useState(false);
  
  // Set isClient to true after component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Force a re-render after state changes
  const forceRender = useCallback(() => {
    setRenderKey(prevKey => prevKey + 1);
  }, []);
  
  // Auto-mode effect - runs once when auto-mode is toggled
  useEffect(() => {
    if (!isClient) return; // Skip if we're not on the client yet
    if (state.autoMode && !state.gameOver && !autoMoveInProgress.current) {
      const autoModeTimer = setTimeout(() => {
        if (state.autoMode && !state.gameOver) {
          autoMoveInProgress.current = true;
          // Execute auto turn
          executeAutoTurn(state);
          // Increment move counter to trigger the continuous effect
          setAutoMoveCount(prev => prev + 1);
          // Force re-render to reflect changes
          forceRender();
          autoMoveInProgress.current = false;
        }
      }, state.autoModeSpeed); // Use the configured speed
      
      return () => {
        clearTimeout(autoModeTimer);
      };
    }
  }, [state.autoMode, state.gameOver, state.autoModeSpeed, autoMoveCount, forceRender, isClient]);
  
  // Game over check
  useEffect(() => {
    if (!isClient) return; // Skip if we're not on the client yet
    if (isGameOver(state.board)) {
      // Apply game over state
      state.gameOver = true;
      forceRender();
    }
  }, [state.board, forceRender, isClient]);
  
  return (
    <GameContext.Provider value={{ state, dispatch }} key={renderKey}>
      {children}
    </GameContext.Provider>
  );
}

// Custom hook for using the context
export function useGame() {
  const context = useContext(GameContext);
  
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  
  return context;
} 