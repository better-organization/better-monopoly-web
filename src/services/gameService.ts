import { apiClient } from './api';
import type {DynamicGameData, DynamicGameDataResponse, StaticGameDataResponse} from '@/utils/gameConfig';

// Game related types
export interface Game {
  id: string;
  name: string;
  status: 'waiting' | 'in-progress' | 'finished';
  players: Player[];
  currentPlayer?: string;
  createdAt: string;
}

export interface Player {
  id: string;
  name: string;
  balance: number;
  position: number;
  properties: string[];
}

// Game service
export const gameService = {
  // Get all games
  getAllGames: async (): Promise<Game[]> => {
    return apiClient.get<Game[]>('/games');
  },

  // Get game by ID
  getGameById: async (gameId: string): Promise<Game> => {
    return apiClient.get<Game>(`/games/${gameId}`);
  },

  // Create a new game
  createGame: async (gameName: string): Promise<Game> => {
    return apiClient.post<Game>('/games', { name: gameName });
  },

  // Join a game
  joinGame: async (gameId: string, playerName: string): Promise<Player> => {
    return apiClient.post<Player>(`/games/${gameId}/join`, { playerName });
  },

  // Start a game
  startGame: async (gameId: string): Promise<Game> => {
    return apiClient.post<Game>(`/games/${gameId}/start`);
  },

  // Make a move
  makeMove: async (gameId: string, playerId: string, action: string): Promise<Game> => {
    return apiClient.post<Game>(`/games/${gameId}/move`, { playerId, action });
  },

  // End turn
  endTurn: async (gameId: string, playerId: string): Promise<Game> => {
    return apiClient.post<Game>(`/games/${gameId}/end-turn`, { playerId });
  },

  // Get static game data (board configuration)
  getStaticGameData: async (boardId: string, version: string): Promise<StaticGameDataResponse> => {
    return apiClient.get<StaticGameDataResponse>(`/api/game/board/${boardId}/version/${version}`);
  },

  // Get static game data (board configuration)
  getDynamicGameData: async (): Promise<DynamicGameDataResponse> => {
    return apiClient.get<DynamicGameDataResponse>(`/api/game/state`);
  },

  // Roll dice
  rollDice: async (): Promise<{
    success: boolean;
    data: {
      dice: [number, number];
      total: number;
      timestamp: string;
      double: boolean;
    };
  }> => {
    return apiClient.post(`/api/game/roll-dice`);
  },
};
