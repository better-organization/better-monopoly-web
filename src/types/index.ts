// Common types for the application
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

// Game types
export type GameStatus = 'waiting' | 'in-progress' | 'finished';

export interface Position {
  x: number;
  y: number;
}

export interface Property {
  id: string;
  name: string;
  price: number;
  rent: number;
  owner?: string;
  color: string;
}

export interface DiceRoll {
  dice1: number;
  dice2: number;
  total: number;
  isDouble: boolean;
}
