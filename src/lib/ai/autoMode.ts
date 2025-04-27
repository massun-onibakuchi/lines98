import { Board, Position, GameState } from '../game/types';
import { findPath, checkLines, processMove } from '../game/gameLogic';

// Evaluate a move based on potential line formations
function evaluateMove(
  board: Board,
  start: Position,
  end: Position
): number {
  // Clone the board to simulate the move
  const boardCopy: Board = JSON.parse(JSON.stringify(board));
  
  // Simulate moving the ball
  const ball = boardCopy[start.row][start.col].ball;
  if (!ball) return -1;
  
  boardCopy[end.row][end.col].ball = ball;
  boardCopy[start.row][start.col].ball = null;
  
  // Check for lines formed by the move
  const lines = checkLines(boardCopy, end);
  
  // If lines are formed, this is a high-value move
  if (lines.length > 0) {
    // Calculate total balls that would be removed
    let totalBalls = 0;
    for (const line of lines) {
      totalBalls += line.length;
    }
    return totalBalls * 10; // Higher score for more balls
  }
  
  // No immediate lines formed, evaluate strategic value
  // (this could be enhanced with more sophisticated heuristics)
  
  // Basic strategy: prefer moves that place balls close to same-colored balls
  const color = ball.color;
  let sameColorNeighbors = 0;
  
  // Check all eight directions around the destination
  const directions = [
    { row: -1, col: 0 },  // up
    { row: -1, col: 1 },  // up-right
    { row: 0, col: 1 },   // right
    { row: 1, col: 1 },   // down-right
    { row: 1, col: 0 },   // down
    { row: 1, col: -1 },  // down-left
    { row: 0, col: -1 },  // left
    { row: -1, col: -1 }, // up-left
  ];
  
  for (const dir of directions) {
    const newRow = end.row + dir.row;
    const newCol = end.col + dir.col;
    
    if (
      newRow >= 0 && newRow < board.length &&
      newCol >= 0 && newCol < board[0].length &&
      boardCopy[newRow][newCol].ball?.color === color
    ) {
      sameColorNeighbors++;
    }
  }
  
  return sameColorNeighbors;
}

// Find the best move for the current game state
export function findBestMove(gameState: GameState): { start: Position; end: Position } | null {
  const { board } = gameState;
  const ballPositions: Position[] = [];
  
  // Find all balls on the board
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (board[row][col].ball) {
        ballPositions.push({ row, col });
      }
    }
  }
  
  // Store all possible moves with their evaluations
  const possibleMoves: {
    start: Position;
    end: Position;
    score: number;
  }[] = [];
  
  // For each ball, find all possible destination cells
  for (const start of ballPositions) {
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        const end = { row, col };
        
        // Skip if destination has a ball
        if (board[end.row][end.col].ball) continue;
        
        // Check if there's a valid path to this destination
        const path = findPath(board, start, end);
        
        if (path) {
          // Evaluate this move
          const score = evaluateMove(board, start, end);
          possibleMoves.push({ start, end, score });
        }
      }
    }
  }
  
  // Sort moves by score (descending)
  possibleMoves.sort((a, b) => b.score - a.score);
  
  // Return the highest-scoring move, or null if no moves are possible
  return possibleMoves.length > 0
    ? { start: possibleMoves[0].start, end: possibleMoves[0].end }
    : null;
}

// Execute the auto-mode turn
export function executeAutoTurn(gameState: GameState): boolean {
  // Find the best move
  const bestMove = findBestMove(gameState);
  
  // If no valid moves are possible, return false
  if (!bestMove) {
    return false;
  }
  
  // Execute the move
  processMove(gameState, bestMove.start, bestMove.end);
  
  return true;
} 