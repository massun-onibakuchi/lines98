import { Board, Color, GameState, Hint, MoveResult, Position } from './types';

const GRID_SIZE = 9;
const MIN_LINE_LENGTH = 5;
const COLORS: Color[] = ['red', 'blue', 'green', 'yellow', 'purple', 'cyan', 'orange'];
const NEW_BALLS_PER_TURN = 3;

// Creates an empty board
export function createEmptyBoard(): Board {
  const board: Board = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    board[row] = [];
    for (let col = 0; col < GRID_SIZE; col++) {
      board[row][col] = { ball: null };
    }
  }
  return board;
}

// Initialize a new game state
export function initGameState(): GameState {
  const isServer = typeof window === 'undefined';
  
  if (isServer) {
    // Return an empty board for server rendering to avoid hydration mismatches
    return {
      board: createEmptyBoard(),
      score: 0,
      hints: [],
      gameOver: false,
      autoMode: false,
      autoModeSpeed: 3000,
      selectedBall: null,
    };
  }
  
  // Client-side initialization with actual game setup
  const board = createEmptyBoard();
  const hints = generateHints(board);
  
  // Place initial balls
  placeNewBalls(board, hints);
  
  // Generate new hints for next turn
  const newHints = generateHints(board);
  
  return {
    board,
    score: 0,
    hints: newHints,
    gameOver: false,
    autoMode: false,
    autoModeSpeed: 3000, // Default: 3 seconds
    selectedBall: null,
  };
}

// Get random empty positions on the board
function getRandomEmptyPositions(board: Board, count: number): Position[] {
  const emptyPositions: Position[] = [];
  
  // Find all empty positions
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (!board[row][col].ball) {
        emptyPositions.push({ row, col });
      }
    }
  }
  
  // If there are fewer empty positions than requested, return all of them
  if (emptyPositions.length <= count) {
    return emptyPositions;
  }
  
  // Shuffle and take the required number of positions
  for (let i = emptyPositions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [emptyPositions[i], emptyPositions[j]] = [emptyPositions[j], emptyPositions[i]];
  }
  
  return emptyPositions.slice(0, count);
}

// Generate hints for the next turn
export function generateHints(board: Board): Hint[] {
  // Get available empty positions
  const emptyPositions = getRandomEmptyPositions(board, NEW_BALLS_PER_TURN);
  
  // If we have fewer empty positions than NEW_BALLS_PER_TURN,
  // still generate hints for all available positions
  return emptyPositions.map(position => ({
    position,
    color: getRandomColor(),
  }));
}

// Get a random color
function getRandomColor(): Color {
  const index = Math.floor(Math.random() * COLORS.length);
  return COLORS[index];
}

// Place new balls on the board based on hints
export function placeNewBalls(board: Board, hints: Hint[]): void {
  // Check how many empty cells are remaining
  let emptyCellCount = 0;
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (!board[row][col].ball) {
        emptyCellCount++;
      }
    }
  }
  
  // Only place as many balls as there are empty cells
  const hintsToPlace = hints.slice(0, emptyCellCount);
  
  // Place balls according to hints
  for (const hint of hintsToPlace) {
    const { position, color } = hint;
    const { row, col } = position;
    
    // Check that the position is valid and empty
    if (row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE && !board[row][col].ball) {
      board[row][col].ball = {
        id: `ball-${Date.now()}-${Math.random()}`,
        color,
      };
    }
  }
}

// Check if game is over (board is full)
export function isGameOver(board: Board): boolean {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (!board[row][col].ball) {
        return false;
      }
    }
  }
  return true;
}

// Find a path between two positions using BFS
export function findPath(
  board: Board,
  start: Position,
  end: Position
): Position[] | null {
  // If start or end have a ball, this isn't a valid path
  // (except for the start position which should have a ball)
  if (board[end.row][end.col].ball) {
    return null;
  }
  
  const queue: { pos: Position; path: Position[] }[] = [
    { pos: start, path: [start] },
  ];
  const visited: boolean[][] = Array(GRID_SIZE)
    .fill(false)
    .map(() => Array(GRID_SIZE).fill(false));
  
  visited[start.row][start.col] = true;
  
  // Directions: up, right, down, left
  const directions = [
    { row: -1, col: 0 },
    { row: 0, col: 1 },
    { row: 1, col: 0 },
    { row: 0, col: -1 },
  ];
  
  while (queue.length > 0) {
    const { pos, path } = queue.shift()!;
    
    if (pos.row === end.row && pos.col === end.col) {
      return path;
    }
    
    for (const dir of directions) {
      const newRow = pos.row + dir.row;
      const newCol = pos.col + dir.col;
      
      // Check if new position is valid and not visited
      if (
        newRow >= 0 && newRow < GRID_SIZE &&
        newCol >= 0 && newCol < GRID_SIZE &&
        !visited[newRow][newCol] &&
        !board[newRow][newCol].ball
      ) {
        const newPos = { row: newRow, col: newCol };
        const newPath = [...path, newPos];
        
        visited[newRow][newCol] = true;
        queue.push({ pos: newPos, path: newPath });
      }
    }
  }
  
  // No path found
  return null;
}

// Move a ball from start to end position
export function moveBall(
  board: Board,
  start: Position,
  end: Position
): boolean {
  const path = findPath(board, start, end);
  
  if (!path) {
    return false;
  }
  
  const ball = board[start.row][start.col].ball;
  
  if (!ball) {
    return false;
  }
  
  // Move the ball
  board[end.row][end.col].ball = { ...ball, selected: false };
  board[start.row][start.col].ball = null;
  
  return true;
}

// Check for lines of 5 or more same-colored balls
export function checkLines(board: Board, position: Position): Position[][] {
  const { row, col } = position;
  const ball = board[row][col].ball;
  
  if (!ball) {
    return [];
  }
  
  const color = ball.color;
  const lines: Position[][] = [];
  
  // Check horizontal line
  const horizontalLine: Position[] = [];
  for (let c = 0; c < GRID_SIZE; c++) {
    if (board[row][c].ball?.color === color) {
      horizontalLine.push({ row, col: c });
    } else if (horizontalLine.length < MIN_LINE_LENGTH) {
      horizontalLine.length = 0;
    } else {
      break;
    }
  }
  
  if (horizontalLine.length >= MIN_LINE_LENGTH) {
    lines.push(horizontalLine);
  }
  
  // Check vertical line
  const verticalLine: Position[] = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    if (board[r][col].ball?.color === color) {
      verticalLine.push({ row: r, col });
    } else if (verticalLine.length < MIN_LINE_LENGTH) {
      verticalLine.length = 0;
    } else {
      break;
    }
  }
  
  if (verticalLine.length >= MIN_LINE_LENGTH) {
    lines.push(verticalLine);
  }
  
  // Check diagonal (top-left to bottom-right)
  const diag1Line: Position[] = [];
  const startDiag1Row = row - Math.min(row, col);
  const startDiag1Col = col - Math.min(row, col);
  for (
    let r = startDiag1Row, c = startDiag1Col;
    r < GRID_SIZE && c < GRID_SIZE;
    r++, c++
  ) {
    if (board[r][c].ball?.color === color) {
      diag1Line.push({ row: r, col: c });
    } else if (diag1Line.length < MIN_LINE_LENGTH) {
      diag1Line.length = 0;
    } else {
      break;
    }
  }
  
  if (diag1Line.length >= MIN_LINE_LENGTH) {
    lines.push(diag1Line);
  }
  
  // Check diagonal (top-right to bottom-left)
  const diag2Line: Position[] = [];
  const startDiag2Row = row - Math.min(row, GRID_SIZE - 1 - col);
  const startDiag2Col = col + Math.min(row, GRID_SIZE - 1 - col);
  for (
    let r = startDiag2Row, c = startDiag2Col;
    r < GRID_SIZE && c >= 0;
    r++, c--
  ) {
    if (board[r][c].ball?.color === color) {
      diag2Line.push({ row: r, col: c });
    } else if (diag2Line.length < MIN_LINE_LENGTH) {
      diag2Line.length = 0;
    } else {
      break;
    }
  }
  
  if (diag2Line.length >= MIN_LINE_LENGTH) {
    lines.push(diag2Line);
  }
  
  return lines;
}

// Remove balls that form lines
export function removeBalls(board: Board, lines: Position[][]): number {
  let removedCount = 0;
  
  for (const line of lines) {
    for (const pos of line) {
      board[pos.row][pos.col].ball = null;
      removedCount++;
    }
  }
  
  return removedCount;
}

// Calculate score based on removed balls
export function calculateScore(removedCount: number): number {
  // Simple scoring: 10 points per ball removed
  return removedCount * 10;
}

// Process a move from start to end position
export function processMove(
  gameState: GameState,
  start: Position,
  end: Position
): MoveResult {
  // Create a deep copy of the board to ensure we're not mutating the original
  const boardCopy = JSON.parse(JSON.stringify(gameState.board));
  const newGameState = { ...gameState, board: boardCopy };
  
  // Try to move the ball
  const moveSuccessful = moveBall(boardCopy, start, end);
  
  if (!moveSuccessful) {
    return { validMove: false, linesCleared: [] };
  }
  
  // Check for lines formed by the move
  const lines = checkLines(boardCopy, end);
  
  // If lines were formed, remove balls and update score
  if (lines.length > 0) {
    const removedCount = removeBalls(boardCopy, lines);
    newGameState.score += calculateScore(removedCount);
    // Update the original game state with new board and score
    gameState.board = boardCopy;
    gameState.score = newGameState.score;
    return { validMove: true, linesCleared: lines };
  }
  
  // If no lines were formed, place new balls from hints
  placeNewBalls(boardCopy, gameState.hints);
  
  // Check if new lines were formed by the new balls
  let additionalLines: Position[][] = [];
  for (const hint of gameState.hints) {
    const pos = hint.position;
    if (boardCopy[pos.row][pos.col].ball) {
      const newLines = checkLines(boardCopy, pos);
      additionalLines = [...additionalLines, ...newLines];
    }
  }
  
  // If additional lines were formed, remove balls and update score
  if (additionalLines.length > 0) {
    const removedCount = removeBalls(boardCopy, additionalLines);
    newGameState.score += calculateScore(removedCount);
  }
  
  // Generate new hints for the next turn
  const newHints = generateHints(boardCopy);
  newGameState.hints = newHints;
  
  // CRITICAL CHECK: Before finalizing, count empty cells
  let emptyCount = 0;
  let lastEmptyPosition: Position | null = null;
  
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (!boardCopy[row][col].ball) {
        emptyCount++;
        lastEmptyPosition = { row, col };
        
        // If we've already found more than one empty cell, we don't need to track the position
        if (emptyCount > 1) {
          lastEmptyPosition = null;
          break;
        }
      }
    }
    if (emptyCount > 1) break;
  }
  
  // If exactly one cell remains empty, fill it
  if (emptyCount === 1 && lastEmptyPosition) {
    boardCopy[lastEmptyPosition.row][lastEmptyPosition.col].ball = {
      id: `final-ball-${Date.now()}`,
      color: getRandomColor()
    };
    
    // There are no more empty cells, so the game is over
    newGameState.gameOver = true;
  } else {
    // Check if game is over normally
    newGameState.gameOver = isGameOver(boardCopy);
  }
  
  // Update the original game state
  gameState.board = boardCopy;
  gameState.score = newGameState.score;
  gameState.hints = newHints;
  gameState.gameOver = newGameState.gameOver;
  
  return { 
    validMove: true, 
    linesCleared: [...lines, ...additionalLines] 
  };
} 