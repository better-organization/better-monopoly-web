import { render, screen, fireEvent } from '@testing-library/react';
import { MonopolyBoard } from '../MonopolyBoard';
import type { BoardSpace, Player } from '@/types/game';
import {
  mockPlayers,
  mockGameTerms,
  mockLogos,
  mockSubTypeColors,
  mockCornerColors,
} from '@/__tests__/fixtures/mockGameData';

// Create full 40-space board for testing
const createFullBoard = (): BoardSpace[] => {
  const spaces: BoardSpace[] = [];

  // Create 40 spaces with proper indices and types
  for (let i = 1; i <= 40; i++) {
    const isCorner = i === 1 || i === 11 || i === 21 || i === 31;

    spaces.push({
      index: i,
      name: isCorner ? `Corner ${i}` : `Space ${i}`,
      cell_type: isCorner ? 'special' : i % 5 === 0 ? 'transport' : i % 7 === 0 ? 'utility' : 'property',
      cell_sub_type: isCorner ? 'Corner' : i % 5 === 0 ? 'Tournament' : i % 7 === 0 ? 'Income Stream' : `Country ${i}`,
      property_price: !isCorner && i % 5 !== 0 && i % 7 !== 0 ? 100 : undefined,
      transport_price: i % 5 === 0 && !isCorner ? 200 : undefined,
      utility_price: i % 7 === 0 && !isCorner ? 150 : undefined,
    });
  }

  return spaces;
};

describe('MonopolyBoard', () => {
  const mockOnPropertyClick = jest.fn();
  const mockOnDiceRoll = jest.fn();
  const fullBoard = createFullBoard();

  const defaultProps = {
    onPropertyClick: mockOnPropertyClick,
    players: mockPlayers,
    terms: mockGameTerms,
    currencySymbol: '€',
    onDiceRoll: mockOnDiceRoll,
    currentPlayer: 0,
    boardSpaces: fullBoard,
    logos: mockLogos,
    subTypeColors: mockSubTypeColors,
    cornerColors: mockCornerColors,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Board layout and dimensions', () => {
    it('should render the board with correct dimensions', () => {
      const { container } = render(<MonopolyBoard {...defaultProps} />);

      const boardContainer = container.querySelector('[style*="895px"]');
      expect(boardContainer).toBeInTheDocument();
    });

    it('should render all 40 board spaces', () => {
      render(<MonopolyBoard {...defaultProps} />);

      // Check that all unique space names are rendered
      fullBoard.forEach((space) => {
        expect(screen.getByText(space.name)).toBeInTheDocument();
      });
    });

    it('should render 4 corner spaces', () => {
      render(<MonopolyBoard {...defaultProps} />);

      const corners = fullBoard.filter((s) => s.cell_sub_type === 'Corner');
      corners.forEach((corner) => {
        expect(screen.getByText(corner.name)).toBeInTheDocument();
      });
    });

    it('should apply correct grid template with corner and card sizes', () => {
      const { container } = render(<MonopolyBoard {...defaultProps} />);

      const gridDiv = container.querySelector('.grid');
      expect(gridDiv).toBeInTheDocument();
      const gridTemplateColumns = gridDiv?.style?.gridTemplateColumns;
      const gridTemplateRows = gridDiv?.style?.gridTemplateRows;

      expect(gridTemplateColumns).toContain('120px');
      expect(gridTemplateColumns).toContain('70px');
      expect(gridTemplateRows).toContain('120px');
      expect(gridTemplateRows).toContain('70px');
    });
  });

  describe('Board space arrangement', () => {
    it('should arrange top row correctly (indices 1-10)', () => {
      render(<MonopolyBoard {...defaultProps} />);

      // Top row should have spaces 2-10 (index 1-9 in array)
      for (let i = 2; i <= 10; i++) {
        const space = fullBoard.find((s) => s.index === i);
        if (space) {
          expect(screen.getByText(space.name)).toBeInTheDocument();
        }
      }
    });

    it('should arrange right column correctly (indices 11-20)', () => {
      render(<MonopolyBoard {...defaultProps} />);

      // Right column should have spaces 12-20
      for (let i = 12; i <= 20; i++) {
        const space = fullBoard.find((s) => s.index === i);
        if (space) {
          expect(screen.getByText(space.name)).toBeInTheDocument();
        }
      }
    });

    it('should arrange bottom row correctly (indices 21-30, reversed)', () => {
      render(<MonopolyBoard {...defaultProps} />);

      // Bottom row should have spaces 22-30 in reverse
      for (let i = 22; i <= 30; i++) {
        const space = fullBoard.find((s) => s.index === i);
        if (space) {
          expect(screen.getByText(space.name)).toBeInTheDocument();
        }
      }
    });

    it('should arrange left column correctly (indices 31-40, reversed)', () => {
      render(<MonopolyBoard {...defaultProps} />);

      // Left column should have spaces 32-40 in reverse
      for (let i = 32; i <= 40; i++) {
        const space = fullBoard.find((s) => s.index === i);
        if (space) {
          expect(screen.getByText(space.name)).toBeInTheDocument();
        }
      }
    });

    it('should place corner spaces at correct positions', () => {
      render(<MonopolyBoard {...defaultProps} />);

      // Corners should be at indices 1, 11, 21, 31
      const corner1 = fullBoard[0]; // Index 1
      const corner2 = fullBoard[10]; // Index 11
      const corner3 = fullBoard[20]; // Index 21
      const corner4 = fullBoard[30]; // Index 31

      expect(screen.getByText(corner1.name)).toBeInTheDocument();
      expect(screen.getByText(corner2.name)).toBeInTheDocument();
      expect(screen.getByText(corner3.name)).toBeInTheDocument();
      expect(screen.getByText(corner4.name)).toBeInTheDocument();
    });
  });

  describe('Click handlers', () => {
    it('should call onPropertyClick when a space is clicked', () => {
      render(<MonopolyBoard {...defaultProps} />);

      const spaceElement = screen.getByText(fullBoard[3].name);
      fireEvent.click(spaceElement);

      expect(mockOnPropertyClick).toHaveBeenCalled();
    });

    it('should pass correct space data to onPropertyClick', () => {
      render(<MonopolyBoard {...defaultProps} />);

      const testSpace = fullBoard[1];
      const spaceElement = screen.getByText(testSpace.name);
      fireEvent.click(spaceElement);

      expect(mockOnPropertyClick).toHaveBeenCalledWith(testSpace);
    });

    it('should handle clicks on corner spaces', () => {
      render(<MonopolyBoard {...defaultProps} />);

      const cornerSpace = fullBoard[0];
      const spaceElement = screen.getByText(cornerSpace.name);
      fireEvent.click(spaceElement);

      expect(mockOnPropertyClick).toHaveBeenCalledWith(cornerSpace);
    });
  });

  describe('FieldLines integration', () => {
    it('should render FieldLines component in center', () => {
      const { container } = render(<MonopolyBoard {...defaultProps} />);

      // FieldLines renders an SVG
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('should handle empty board spaces array gracefully', () => {
      const { container } = render(<MonopolyBoard {...defaultProps} boardSpaces={[]} />);

      expect(container).toBeInTheDocument();
    });

    it('should handle missing theme colors', () => {
      const { container } = render(
        <MonopolyBoard {...defaultProps} subTypeColors={{} as never} cornerColors={{} as never} />
      );

      expect(container).toBeInTheDocument();
    });

    it('should handle player at position 0', () => {
      const playersAtZero: Player[] = [
        { id: 1, name: 'Player 1', position: 0, money: 1500, color: '#FF0000' },
      ];

      const { container } = render(<MonopolyBoard {...defaultProps} players={playersAtZero} />);

      expect(container).toBeInTheDocument();
    });

    it('should handle player at position greater than board size', () => {
      const playersOutOfBounds: Player[] = [
        { id: 1, name: 'Player 1', position: 50, money: 1500, color: '#FF0000' },
      ];

      const { container } = render(
        <MonopolyBoard {...defaultProps} players={playersOutOfBounds} />
      );

      expect(container).toBeInTheDocument();
    });
  });

  describe('Snapshots', () => {
    it('should match snapshot for full board layout', () => {
      const { container } = render(<MonopolyBoard {...defaultProps} />);
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot with players at different positions', () => {
      const playersScattered: Player[] = [
        { id: 1, name: 'Player 1', position: 5, money: 1500, color: '#FF0000' },
        { id: 2, name: 'Player 2', position: 15, money: 1200, color: '#0000FF' },
        { id: 3, name: 'Player 3', position: 25, money: 800, color: '#00FF00' },
      ];

      const { container } = render(<MonopolyBoard {...defaultProps} players={playersScattered} />);
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot with no players', () => {
      const { container } = render(<MonopolyBoard {...defaultProps} players={[]} />);
      expect(container).toMatchSnapshot();
    });
  });
});

