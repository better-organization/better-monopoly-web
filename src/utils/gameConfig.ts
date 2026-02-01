import { gameData } from '@/data/gameData';
import { gameService } from '@/services/gameService';
import type { Player, BoardSpace, GameTerms } from '@/types/game';

// ==================== INTERFACES ====================


/**
 * Interface for static game data
 * All data that doesn't change during gameplay
 */
export interface StaticGameData {
  id: string;
  version: string;
  edition: string;
  currency: string;
  currency_symbol: string;
  mortgage_percentage: number;
  sell_percentage: number;
  terms: GameTerms;
  cells: BoardSpace[];
  logos: { [key: string]: string };
  subTypeColors: { [key: string]: { primary: string; secondary: string; gradient: string; logo: string | null } };
  cornerColors: { [key: string]: { primary: string; secondary: string; gradient: string; logo: string | null; textColor: string } };
}

export interface StaticGameDataResponse {
  data: StaticGameData;
}

/**
 * Interface for dynamic game state
 * All data that changes during gameplay
 */
export interface DynamicGameData {
  colors: string[];
  players: Player[];
  you: string;
  current_turn: number;
}

export interface DynamicGameDataResponse{
  data: DynamicGameData;
}

// ==================== STATIC DATA ====================

/**
 * Get all static game configuration data
 * This includes terms, currency, logos, colors, and board spaces that don't change during gameplay
 * Fetches from backend API with fallback to local data
 */
export async function getStaticGameData(
  boardId: string = gameData.id,
  version: string = gameData.version
): Promise<StaticGameData> {
  try {
    const staticGameDataResponse = await gameService.getStaticGameData(boardId, version);
    const data: StaticGameData = staticGameDataResponse.data;
    data.subTypeColors = gameData.subTypeColors;
    data.cornerColors = gameData.cornerColors;
    data.logos = gameData.logos;
    return data;
  } catch (error) {
    // Fallback to local game data if API call fails
    console.warn('Failed to fetch static game data from backend, using local fallback:', error);
    return gameData;
  }
}

// ==================== DYNAMIC DATA ====================

/**
 * Get initial dynamic game state (mocked for development)
 * This includes all data that changes during gameplay
 */
export async function getDynamicGameData(): Promise<DynamicGameData> {
  try {
    const dynamicGameDataResponse = await gameService.getDynamicGameData();
    const dynamicGameData: DynamicGameData = dynamicGameDataResponse.data;
    dynamicGameData.colors = ['#FF0000', '#0000FF', '#00FF00', '#FFFF00'];
    return dynamicGameData;
  } catch {
    return {
      current_turn: 0,
      you: "Manager 1",
      colors: ['#FF0000', '#0000FF', '#00FF00', '#FFFF00'],
      players: getInitialPlayers()
    }
  }
}

export function getInitialPlayers(): Player[] {
  return [
    {
      player_turn: 1, player_id: 'Manager 1', position: 1, player_money: 1500,
      property_owns: [],
      utility_owns: [],
      transport_owns: []
    },
    {
      player_turn: 2, player_id: 'Manager 2', position: 1, player_money: 1500,
      property_owns: [],
      utility_owns: [],
      transport_owns: []
    },
    {
      player_turn: 3, player_id: 'Manager 3', position: 1, player_money: 1500,
      property_owns: [],
      utility_owns: [],
      transport_owns: []
    },
    {
      player_turn: 4, player_id: 'Manager 4', position: 1, player_money: 1500,
      property_owns: [],
      utility_owns: [],
      transport_owns: []
    },
  ];
}
