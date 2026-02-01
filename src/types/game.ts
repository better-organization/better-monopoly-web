export interface Player {
  player_id: string;
  player_turn: number;
  position: number;
  player_money: number;
  property_owns: string[];
  utility_owns: string[];
  transport_owns: string[];
}

export interface BoardSpace {
  index: number;
  name: string;
  cell_type: 'property' | 'transport' | 'utility' | 'special';
  cell_sub_type: string;
  action_keyword?: string;
  action_details?: string;
  house_rent?: Record<string, number>;
  house_price?: number;
  property_price?: number;
  utility_price?: number;
  utility_rent_multiplier?: Record<string, number>;
  transport_price?: number;
  transport_rent?: Record<string, number>;
}

export interface GameTerms {
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

