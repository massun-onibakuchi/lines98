export type Color = 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'cyan' | 'orange';

export type Cell = {
  ball: Ball | null;
};

export type Ball = {
  id: string;
  color: Color;
  selected?: boolean;
};

export type Position = {
  row: number;
  col: number;
};

export type Board = Cell[][];

export type Hint = {
  position: Position;
  color: Color;
};

export type GameState = {
  board: Board;
  score: number;
  hints: Hint[];
  gameOver: boolean;
  autoMode: boolean;
  autoModeSpeed: number; // Speed in milliseconds
  selectedBall: Position | null;
};

export type MoveResult = {
  validMove: boolean;
  linesCleared: Position[][];
}; 