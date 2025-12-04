import {Player} from "@/services/gameService";

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

export type GameStatus = 'waiting' | 'in-progress' | 'finished';

export interface DiceRoll {
  dice1: number;
  dice2: number;
  total: number;
  isDouble: boolean;
}

export interface Game {
    id: string;
    name: string;
    status: GameStatus;
    players: Player[];
    currentPlayer?: string;
    createdAt: string;
}

export enum cell_type {
    SPECIAL = "special",
    PROPERTY = "property",
    UTILITY = "utility",
    TRANSPORT = "transport"
}

export interface Cell {
    index: number;
    name: string;
    cell_type: cell_type;
    cell_sub_type: string;
    cell_price?: number;
    utility_rent_multiplier?: Map<string, number>;
    transport_rent?: Map<string, number>;
    house_price?: number;
    house_rent?: Map<string, number>;
    action_keyword?: string;
    action_details?: string;
}

export interface EditionTerminology {
    player: string;
    property: string;
    transport: string;
    utility: string;
    house: string;
    hotel: string;
    property_rent: string;
    transport_rent: string;
    utility_rent: string;
    mortgage: string;
    passing_go: string;
    salary: string;
    jail: string;
    theft: string;
    parking: string;
    income_tax: string;
    luxury_tax: string;
    community_chest: string;
    chance: string;
}

export interface BoardDetails {
    edition: string;
    id: string;
    version: string;
    currency: string;
    currency_symbol: string;
    mortgage_percentage: number;
    sell_percentage: number;
    terms: EditionTerminology;
    cells: Cell[];
}
