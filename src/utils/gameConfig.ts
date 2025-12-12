import { gameData } from '@/data/gameData';
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
 */
export function getStaticGameData(): StaticGameData {
  return gameData;
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
export function getGameConfig() {
  return getStaticGameData();
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
export function getInitialGameData(): { static: StaticGameData; dynamic: DynamicGameData } {
  return {
    static: getStaticGameData(),
    dynamic: getDynamicGameData(),
  };
}
