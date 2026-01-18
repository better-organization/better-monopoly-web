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
  selectedProperty: BoardSpace | null;
  currentPlayer: number;
  players: Player[];
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
export function getDynamicGameData(): DynamicGameData {
  return {
    selectedProperty: null,
    currentPlayer: 0,
    players: getInitialPlayers(),
  };
}

/**
 * Get initial players state (mocked for development)
 */
export function getInitialPlayers(): Player[] {
  return [
    { id: 1, name: 'Manager 1', position: 1, money: 1500, color: '#FF0000' },
    { id: 2, name: 'Manager 2', position: 1, money: 1500, color: '#0000FF' },
    { id: 3, name: 'Manager 3', position: 1, money: 1500, color: '#00FF00' },
    { id: 4, name: 'Manager 4', position: 1, money: 1500, color: '#FFFF00' },
  ];
}

// ==================== LEGACY / CONVENIENCE ====================

/**
 * @deprecated Use getStaticGameData() instead
 */
export async function getGameConfig(): Promise<StaticGameData> {
  return await getStaticGameData();
}

/**
 * @deprecated Use getInitialPlayers() instead
 */
export function getMockPlayers(): Player[] {
  return getInitialPlayers();
}

/**
 * @deprecated Use getDynamicGameData() instead
 */
export function getMockGameState() {
  return getDynamicGameData();
}

/**
 * Get all game data (static config + dynamic state)
 * Useful for initializing the complete game
 */
export async function getInitialGameData(): Promise<{ static: StaticGameData; dynamic: DynamicGameData }> {
  return {
    static: await getStaticGameData(),
    dynamic: getDynamicGameData(),
  };
}
