import type { BoardSpace, Player, GameTerms } from '@/types/game';

/**
 * Mock board spaces covering all cell types for testing
 * Expanded to 40 spaces to match real board
 */
export const mockBoardSpaces: BoardSpace[] = Array.from({ length: 40 }, (_, i) => {
  const index = i + 1;
  const isCorner = index === 1 || index === 11 || index === 21 || index === 31;

  if (isCorner) {
    if (index === 1) {
      return {
        index: 1,
        name: 'SEASON KICK-OFF',
        cell_type: 'special',
        cell_sub_type: 'Corner',
        action_keyword: 'salary',
        action_details: 'Collect €200 salary',
      };
    } else if (index === 11) {
      return {
        index: 11,
        name: 'REHABILITATION CENTER',
        cell_type: 'special',
        cell_sub_type: 'Corner',
        action_keyword: 'jail',
        action_details: 'Just Visiting',
      };
    } else if (index === 21) {
      return {
        index: 21,
        name: 'RED CARD',
        cell_type: 'special',
        cell_sub_type: 'Corner',
        action_keyword: 'parking',
        action_details: 'Free Parking',
      };
    } else {
      return {
        index: 31,
        name: 'INJURY',
        cell_type: 'special',
        cell_sub_type: 'Corner',
        action_keyword: 'theft',
        action_details: 'Go to Rehabilitation',
      };
    }
  }

  // Specific test spaces
  if (index === 2) {
    return {
      index: 2,
      name: 'Fenerbahçe SK',
      cell_type: 'property',
      cell_sub_type: 'TURKIYE',
      house_rent: { '0': 2, '1': 10, '2': 30, '3': 90, '4': 160, '5': 250 },
      house_price: 50,
      property_price: 60,
    };
  }

  if (index === 3) {
    return {
      index: 3,
      name: 'CLUB FUNDS',
      cell_type: 'special',
      cell_sub_type: 'Community Chest',
    };
  }

  if (index === 4) {
    return {
      index: 4,
      name: 'Galatasaray SK',
      cell_type: 'property',
      cell_sub_type: 'TURKIYE',
      house_rent: { '0': 4, '1': 20, '2': 60, '3': 180, '4': 320, '5': 450 },
      house_price: 50,
      property_price: 60,
    };
  }

  if (index === 5) {
    return {
      index: 5,
      name: 'FOUL PLAY SANCTION',
      cell_type: 'special',
      cell_sub_type: 'Tax',
      action_keyword: 'tax',
      action_details: '200',
    };
  }

  if (index === 6) {
    return {
      index: 6,
      name: 'UEFA Champions League',
      cell_type: 'transport',
      cell_sub_type: 'Tournament',
      transport_price: 200,
      transport_rent: { '1': 25, '2': 50, '3': 100, '4': 200 },
    };
  }

  if (index === 9) {
    return {
      index: 9,
      name: 'Broadcasting Rights',
      cell_type: 'utility',
      cell_sub_type: 'Income Stream',
      utility_price: 150,
      utility_rent_multiplier: { '1': 4, '2': 10 },
    };
  }

  // Fill remaining spaces with generic properties
  const isTransport = index % 10 === 6;
  const isUtility = index % 13 === 9;
  const isCard = index % 7 === 3 || index % 9 === 8;

  if (isTransport) {
    return {
      index,
      name: `Tournament ${index}`,
      cell_type: 'transport',
      cell_sub_type: 'Tournament',
      transport_price: 200,
      transport_rent: { '1': 25, '2': 50, '3': 100, '4': 200 },
    };
  }

  if (isUtility) {
    return {
      index,
      name: `Utility ${index}`,
      cell_type: 'utility',
      cell_sub_type: 'Income Stream',
      utility_price: 150,
      utility_rent_multiplier: { '1': 4, '2': 10 },
    };
  }

  if (isCard) {
    return {
      index,
      name: index % 2 === 0 ? 'CLUB FUNDS' : 'CLUB TOURS',
      cell_type: 'special',
      cell_sub_type: index % 2 === 0 ? 'Community Chest' : 'Chance',
    };
  }

  // Default property
  return {
    index,
    name: `Property ${index}`,
    cell_type: 'property',
    cell_sub_type: index < 20 ? 'ENGLAND' : 'SPAIN',
    house_rent: { '0': 6, '1': 30, '2': 90, '3': 270, '4': 400, '5': 550 },
    house_price: 50,
    property_price: 100,
  };
});

/**
 * Mock players for testing
 */
export const mockPlayers: Player[] = [
  {
    player_turn: 1,
    player_id: 'Manager 1',
    position: 1,
    player_money: 1500,
    property_owns: [],
    utility_owns: [],
    transport_owns: []
  },
  {
    player_turn: 2,
    player_id: 'Manager 2',
    position: 1,
    player_money: 1500,
    property_owns: [],
    utility_owns: [],
    transport_owns: []
  },
  {
    player_turn: 3,
    player_id: 'Manager 3',
    position: 5,
    player_money: 1200,
    property_owns: [],
    utility_owns: [],
    transport_owns: []
  },
  {
    player_turn: 4,
    player_id: 'Manager 4',
    position: 11,
    player_money: 1800,
    property_owns: [],
    utility_owns: [],
    transport_owns: []
  },
];

/**
 * Mock game terms for testing
 */
export const mockGameTerms: GameTerms = {
  player: 'Manager',
  property: 'Football Club',
  transport: 'Tournament',
  utility: 'Income Stream',
  house: 'Training Pitch',
  hotel: 'Youth Academy',
  property_rent: 'Bare Site Rent',
  transport_rent: 'Tournament Fee',
  utility_rent: 'Broadcasting/Merchandise Fee',
  mortgage: 'Financial Restructuring',
  passing_go: 'SEASON KICK-OFF',
  salary: 'Salary',
  jail: 'REHABILITATION CENTER',
  theft: 'INJURY',
  parking: 'RED CARD',
  income_tax: 'FOUL PLAY SANCTION',
  luxury_tax: "AGENT'S FEE",
  community_chest: 'CLUB FUNDS',
  chance: 'CLUB TOURS',
};

/**
 * Mock logos for testing
 */
export const mockLogos: { [key: string]: string } = {
  'Fenerbahçe SK': 'https://example.com/fenerbahce.png',
  'Galatasaray SK': 'https://example.com/galatasaray.png',
  'Manchester City': 'https://example.com/mancity.png',
  'Liverpool FC': 'https://example.com/liverpool.png',
  'UEFA Champions League': 'https://example.com/ucl.png',
  'Broadcasting Rights': 'https://example.com/broadcast.png',
};

/**
 * Mock subtype colors for testing
 */
export const mockSubTypeColors: {
  [key: string]: { primary: string; secondary: string; gradient: string; logo: string | null };
} = {
  TURKIYE: {
    primary: '#E30A17',
    secondary: '#FDB913',
    gradient: 'linear-gradient(to bottom right, #E30A17, #FDB913)',
    logo: null,
  },
  ENGLAND: {
    primary: '#012169',
    secondary: '#C8102E',
    gradient: 'linear-gradient(to bottom right, #012169, #C8102E)',
    logo: null,
  },
  Tournament: {
    primary: '#003366',
    secondary: '#0066CC',
    gradient: 'linear-gradient(to bottom right, #003366, #0066CC)',
    logo: null,
  },
  'Income Stream': {
    primary: '#2C5F2D',
    secondary: '#97BC62',
    gradient: 'linear-gradient(to bottom right, #2C5F2D, #97BC62)',
    logo: null,
  },
  'Community Chest': {
    primary: '#F97316',
    secondary: '#FB923C',
    gradient: 'linear-gradient(to bottom right, #F97316, #FB923C)',
    logo: null,
  },
  Chance: {
    primary: '#EC4899',
    secondary: '#F472B6',
    gradient: 'linear-gradient(to bottom right, #EC4899, #F472B6)',
    logo: null,
  },
};

/**
 * Mock corner colors for testing
 */
export const mockCornerColors: {
  [key: string]: {
    primary: string;
    secondary: string;
    gradient: string;
    logo: string | null;
    textColor: string;
  };
} = {
  'SEASON KICK-OFF': {
    primary: '#16A34A',
    secondary: '#22C55E',
    gradient: 'linear-gradient(to bottom right, #16A34A, #22C55E)',
    logo: null,
    textColor: '#FFFFFF',
  },
  'REHABILITATION CENTER': {
    primary: '#DC2626',
    secondary: '#EF4444',
    gradient: 'linear-gradient(to bottom right, #DC2626, #EF4444)',
    logo: null,
    textColor: '#FFFFFF',
  },
};

/**
 * Mock static game data for testing
 */
export const mockStaticGameData = {
  id: 'test_game',
  version: '1.0',
  edition: 'Test Edition',
  currency: 'EURO',
  currency_symbol: '€',
  mortgage_percentage: 25,
  sell_percentage: 50,
  terms: mockGameTerms,
  cells: mockBoardSpaces,
  logos: mockLogos,
  subTypeColors: mockSubTypeColors,
  cornerColors: mockCornerColors,
};

/**
 * Mock dynamic game data for testing
 */
export const mockDynamicGameData = {
  selectedProperty: null,
  current_turn: 0,
  players: mockPlayers,
  you: 'Manager 1',
};

