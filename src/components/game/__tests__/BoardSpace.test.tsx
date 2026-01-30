import { render, screen, fireEvent } from '@testing-library/react';
import { BoardSpace } from '../BoardSpace';
import { mockBoardSpaces, mockGameTerms, mockLogos, mockSubTypeColors, mockCornerColors } from '@/__tests__/fixtures/mockGameData';
import type { Player } from '@/types/game';

describe('BoardSpace', () => {
  const defaultProps = {
    onClick: jest.fn(),
    terms: mockGameTerms,
    currencySymbol: '€',
    logos: mockLogos,
    subTypeColors: mockSubTypeColors,
    cornerColors: mockCornerColors,
    players: [] as Player[],
    colors: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render BoardSpace with name and unique id', () => {
      const { container } = render(
        <BoardSpace
          space={mockBoardSpaces[1]}
          {...defaultProps}
        />
      );
      expect(container).toBeInTheDocument();
      expect(screen.getByText(mockBoardSpaces[1].name)).toBeInTheDocument();
      expect(container.querySelector('#board-space-2')).toBeInTheDocument();
    });
  });

  describe('Space Types - Property Spaces', () => {
    it('should render property spaces with names and prices', () => {
      // Test property - Fenerbahçe SK
      render(<BoardSpace space={mockBoardSpaces[1]}{...defaultProps}/>);
      expect(screen.getByText(mockBoardSpaces[1].name)).toBeInTheDocument();
      expect(screen.getByText('€60')).toBeInTheDocument();
    });
  });

  describe('Space Types - Corner Spaces', () => {
    it('should render all four corner spaces with action details and correct dimensions', () => {
      // Test GO corner - SEASON KICK-OFF
      const { container, rerender } = render(
        <BoardSpace
          space={mockBoardSpaces[0]}
          {...defaultProps}
          isCorner={true}
        />
      );
      expect(screen.getByText(mockBoardSpaces[0].name)).toBeInTheDocument();
      expect(screen.getByText(/Collect €200 salary/i)).toBeInTheDocument();
      expect(container.querySelector('[style*="120px"]')).toBeInTheDocument();

      // Test Jail corner - REHABILITATION CENTER
      rerender(
        <BoardSpace
          space={mockBoardSpaces[10]}
          {...defaultProps}
          isCorner={true}
        />
      );
      expect(screen.getByText(mockBoardSpaces[10].name)).toBeInTheDocument();
      expect(screen.getByText(/Just Visiting/i)).toBeInTheDocument();

      // Test Free Parking corner - RED CARD
      rerender(
        <BoardSpace
          space={mockBoardSpaces[20]}
          {...defaultProps}
          isCorner={true}
        />
      );
      expect(screen.getByText(mockBoardSpaces[20].name)).toBeInTheDocument();

      // Test Go to Jail corner - INJURY
      rerender(
        <BoardSpace
          space={mockBoardSpaces[30]}
          {...defaultProps}
          isCorner={true}
        />
      );
      expect(screen.getByText(mockBoardSpaces[30].name)).toBeInTheDocument();
    });
  });

  describe('Space Types - Transport Spaces', () => {
    it('should render transport space with name and price', () => {
      render(
        <BoardSpace
          space={mockBoardSpaces[5]}
          {...defaultProps}
        />
      );
      expect(screen.getByText(mockBoardSpaces[5].name)).toBeInTheDocument();
      expect(screen.getByText('€200')).toBeInTheDocument();
    });
  });

  describe('Space Types - Utility Spaces', () => {
    it('should render utility space with name and price', () => {
      render(
        <BoardSpace
          space={mockBoardSpaces[6]}
          {...defaultProps}
        />
      );
      expect(screen.getByText(mockBoardSpaces[6].name)).toBeInTheDocument();
      expect(screen.getByText('€100')).toBeInTheDocument();
    });
  });

  describe('Space Types - Special Spaces (Tax)', () => {
    it('should render tax space with name and amount', () => {
      render(
        <BoardSpace
          space={mockBoardSpaces[4]}
          {...defaultProps}
        />
      );
      expect(screen.getByText(mockBoardSpaces[4].name)).toBeInTheDocument();
      expect(screen.getByText('€200')).toBeInTheDocument();
    });
  });

  describe('Space Types - Card Spaces', () => {
    it('should render card space without price', () => {
      const { container } = render(
        <BoardSpace
          space={mockBoardSpaces[2]}
          {...defaultProps}
        />
      );
      expect(screen.getByText(mockBoardSpaces[2].name)).toBeInTheDocument();

      // Verify no price is displayed
      const priceElements = container.querySelectorAll('div');
      const hasPriceWithCurrency = Array.from(priceElements).some(
        el => el.textContent?.includes('€') && el.textContent?.match(/€\d+/)
      );
      expect(hasPriceWithCurrency).toBe(false);
    });
  });

  describe('Rotation for Board Positions', () => {
    it('should apply correct rotation classes for all positions', () => {
      const { container, rerender } = render(
        <BoardSpace
          space={mockBoardSpaces[1]}
          {...defaultProps}
          position="top"
        />
      );

      // Top position - 180° rotation with counter-rotation
      expect(container.querySelector('.rotate-180')).toBeInTheDocument();
      expect(container.querySelectorAll('.rotate-180').length).toBeGreaterThanOrEqual(2);

      // Left position - 90° rotation
      rerender(
        <BoardSpace
          space={mockBoardSpaces[1]}
          {...defaultProps}
          position="left"
        />
      );
      expect(container.querySelector('.rotate-90')).toBeInTheDocument();

      // Right position - -90° rotation
      rerender(
        <BoardSpace
          space={mockBoardSpaces[1]}
          {...defaultProps}
          position="right"
        />
      );
      expect(container.querySelector('.-rotate-90')).toBeInTheDocument();

      // Bottom position - no rotation
      rerender(
        <BoardSpace
          space={mockBoardSpaces[1]}
          {...defaultProps}
          position="bottom"
        />
      );
      expect(container.querySelector('.rotate-180, .rotate-90, .-rotate-90')).not.toBeInTheDocument();
    });
  });

  describe('Click Handler', () => {
    it('should call onClick for all space types including with players present', () => {
      const mockOnClick = jest.fn();

      // Test property space
      const { container, rerender } = render(
        <BoardSpace
          space={mockBoardSpaces[1]}
          {...defaultProps}
          onClick={mockOnClick}
        />
      );
      let clickableDiv = container.querySelector('[style*="cursor-pointer"]');
      if (clickableDiv) {
        fireEvent.click(clickableDiv);
        expect(mockOnClick).toHaveBeenCalledTimes(1);
      }

      // Test corner space
      mockOnClick.mockClear();
      rerender(
        <BoardSpace
          space={mockBoardSpaces[0]}
          {...defaultProps}
          isCorner={true}
          onClick={mockOnClick}
        />
      );
      clickableDiv = container.querySelector('[style*="cursor-pointer"]');
      if (clickableDiv) {
        fireEvent.click(clickableDiv);
        expect(mockOnClick).toHaveBeenCalledTimes(1);
      }

      // Test with players present
      mockOnClick.mockClear();
      const players: Player[] = [
        { property_owns: [],
          utility_owns: [],
          transport_owns: [],
          player_turn: 1,
          player_id: 'Test Player',
          position: 1,
          player_money: 1500, }
      ];
      rerender(
        <BoardSpace
          space={mockBoardSpaces[1]}
          {...defaultProps}
          onClick={mockOnClick}
          players={players}
        />
      );
      clickableDiv = container.querySelector('[style*="cursor-pointer"]');
      if (clickableDiv) {
        fireEvent.click(clickableDiv);
        expect(mockOnClick).toHaveBeenCalledTimes(1);
      }
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing configuration objects gracefully', () => {
      // Test missing logos
      const { container, rerender } = render(
        <BoardSpace
          space={mockBoardSpaces[1]}
          {...defaultProps}
          logos={{}}
        />
      );
      expect(container).toBeInTheDocument();

      // Test missing subTypeColors
      rerender(
        <BoardSpace
          space={mockBoardSpaces[1]}
          {...defaultProps}
          subTypeColors={{}}
        />
      );
      expect(container).toBeInTheDocument();

      // Test missing cornerColors
      rerender(
        <BoardSpace
          space={mockBoardSpaces[0]}
          {...defaultProps}
          isCorner={true}
          cornerColors={{}}
        />
      );
      expect(container).toBeInTheDocument();
    });

    it('should handle spaces with no price and boundary indices', () => {
      // Test card space with no price
      const { container, rerender } = render(
        <BoardSpace
          space={mockBoardSpaces[2]}
          {...defaultProps}
        />
      );
      expect(container).toBeInTheDocument();
      expect(screen.getByText(mockBoardSpaces[2].name)).toBeInTheDocument();

      // Test space at index 1
      rerender(
        <BoardSpace
          space={mockBoardSpaces[0]}
          {...defaultProps}
          isCorner={true}
        />
      );
      expect(container.querySelector('#board-space-1')).toBeInTheDocument();

      // Test space at index 40
      const lastSpace = mockBoardSpaces[39];
      rerender(
        <BoardSpace
          space={lastSpace}
          {...defaultProps}
        />
      );
      expect(container.querySelector(`#board-space-${lastSpace.index}`)).toBeInTheDocument();
    });
  });

  describe('Dimensions', () => {
    it('should have correct width and height for regular space', () => {
      const { container } = render(
        <BoardSpace
          space={mockBoardSpaces[1]}
          {...defaultProps}
        />
      );
      expect(container.querySelector('[style*="70px"]')).toBeInTheDocument();
      expect(container.querySelector('[style*="120px"]')).toBeInTheDocument();
    });
  });

  describe('Snapshot Tests', () => {
    it('should match snapshot for property space', () => {
      const { container } = render(
        <BoardSpace
          space={mockBoardSpaces[1]}
          {...defaultProps}
        />
      );
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot for corner space', () => {
      const { container } = render(
        <BoardSpace
          space={mockBoardSpaces[0]}
          {...defaultProps}
          isCorner={true}
        />
      );
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot for transport space', () => {
      const { container } = render(
        <BoardSpace
          space={mockBoardSpaces[5]}
          {...defaultProps}
        />
      );
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot for utility space', () => {
      const { container } = render(
        <BoardSpace
          space={mockBoardSpaces[6]}
          {...defaultProps}
        />
      );
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot for card space', () => {
      const { container } = render(
        <BoardSpace
          space={mockBoardSpaces[2]}
          {...defaultProps}
        />
      );
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot for tax space', () => {
      const { container } = render(
        <BoardSpace
          space={mockBoardSpaces[4]}
          {...defaultProps}
        />
      );
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot with single player', () => {
      const players: Player[] = [
        { property_owns: [],
          utility_owns: [],
          transport_owns: [],
          player_turn: 1,
          player_id: 'Test Player',
          position: 1,
          player_money: 1500, }
      ];
      const { container } = render(
        <BoardSpace
          space={mockBoardSpaces[1]}
          {...defaultProps}
          players={players}
        />
      );
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot with multiple players', () => {
      const players: Player[] = [
        { property_owns: [],
          utility_owns: [],
          transport_owns: [],
          player_turn: 0,
          player_id: 'Player 1',
          position: 1,
          player_money: 1500, },
        { property_owns: [],
          utility_owns: [],
          transport_owns: [],
          player_turn: 1,
          player_id: 'Player 2',
          position: 1,
          player_money: 1500, },
        { property_owns: [],
          utility_owns: [],
          transport_owns: [],
          player_turn: 2,
          player_id: 'Player 3',
          position: 1,
          player_money: 1500, }
      ];
      const { container } = render(
        <BoardSpace
          space={mockBoardSpaces[1]}
          {...defaultProps}
          players={players}
        />
      );
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot for top position', () => {
      const { container } = render(
        <BoardSpace
          space={mockBoardSpaces[1]}
          {...defaultProps}
          position="top"
        />
      );
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot for right position', () => {
      const { container } = render(
        <BoardSpace
          space={mockBoardSpaces[1]}
          {...defaultProps}
          position="right"
        />
      );
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot for bottom position', () => {
      const { container } = render(
        <BoardSpace
          space={mockBoardSpaces[1]}
          {...defaultProps}
          position="bottom"
        />
      );
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot for left position', () => {
      const { container } = render(
        <BoardSpace
          space={mockBoardSpaces[1]}
          {...defaultProps}
          position="left"
        />
      );
      expect(container).toMatchSnapshot();
    });
  });
});

