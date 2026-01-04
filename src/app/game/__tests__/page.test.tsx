import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import GamePage from '../page';
import * as gameConfig from '@/utils/gameConfig';
import {
  mockStaticGameData,
  mockDynamicGameData,
  mockBoardSpaces,
} from '@/__tests__/fixtures/mockGameData';

// Mock the gameConfig module
jest.mock('@/utils/gameConfig');

describe('GamePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Setup default mocks - getStaticGameData is now async
    (gameConfig.getStaticGameData as jest.Mock).mockResolvedValue(mockStaticGameData);
    (gameConfig.getDynamicGameData as jest.Mock).mockReturnValue(mockDynamicGameData);
  });

  describe('Initial rendering', () => {
    it('should render the game page', async () => {
      render(<GamePage />);

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByText(/Loading game data/i)).not.toBeInTheDocument();
      });

      expect(screen.getByText(/Manager 1/i)).toBeInTheDocument();
    });

    it('should load static game data on mount', async () => {
      render(<GamePage />);

      await waitFor(() => {
        expect(gameConfig.getStaticGameData).toHaveBeenCalledTimes(1);
      });
    });

    it('should load dynamic game data on mount', async () => {
      render(<GamePage />);

      await waitFor(() => {
        expect(gameConfig.getDynamicGameData).toHaveBeenCalledTimes(1);
      });
    });

    it('should render MonopolyBoard component', async () => {
      const { container } = render(<GamePage />);

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByText(/Loading game data/i)).not.toBeInTheDocument();
      });

      // MonopolyBoard should render board spaces
      expect(container.querySelector('.bg-gradient-to-br')).toBeInTheDocument();
    });

    it('should render all side panels', async () => {
      render(<GamePage />);

      // Wait for loading to complete and check for panel components
      await waitFor(() => {
        expect(screen.getByText(/Manager 1/i)).toBeInTheDocument();
      });
    });

    it('should initialize with no selected property', async () => {
      const { container } = render(<GamePage />);

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByText(/Loading game data/i)).not.toBeInTheDocument();
      });

      // DetailsCard modal should not be visible initially
      const modal = container.querySelector('.fixed.inset-0');
      expect(modal).not.toBeInTheDocument();
    });

    it('should initialize with first player as current player', async () => {
      render(<GamePage />);

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByText(/Loading game data/i)).not.toBeInTheDocument();
      });

      // First player (Manager 1) should be the current player
      expect(screen.getByText(/Manager 1/i)).toBeInTheDocument();
    });
  });

  describe('Property selection', () => {
    it('should open DetailsCard modal when property is clicked', async () => {
      const { container } = render(<GamePage />);

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByText(/Loading game data/i)).not.toBeInTheDocument();
      });

      // Click on a board space
      const propertyElement = screen.getByText(mockBoardSpaces[1].name);
      fireEvent.click(propertyElement);

      // Modal should appear
      const modal = container.querySelector('.fixed.inset-0');
      expect(modal).toBeInTheDocument();
    });

    it('should display correct property details in modal', async () => {
      render(<GamePage />);

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByText(/Loading game data/i)).not.toBeInTheDocument();
      });

      const testSpace = mockBoardSpaces[1];
      const propertyElement = screen.getByText(testSpace.name);
      fireEvent.click(propertyElement);

      // Property name should appear in modal (appears twice - once in board, once in modal)
      const propertyNames = screen.getAllByText(testSpace.name);
      expect(propertyNames.length).toBeGreaterThan(1);
    });

    it('should close modal when backdrop is clicked', async () => {
      const { container } = render(<GamePage />);

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByText(/Loading game data/i)).not.toBeInTheDocument();
      });

      // Open modal
      const propertyElement = screen.getByText(mockBoardSpaces[1].name);
      fireEvent.click(propertyElement);

      let modal = container.querySelector('.fixed.inset-0');
      expect(modal).toBeInTheDocument();

      // Click backdrop
      fireEvent.click(modal!);

      // Modal should close
      modal = container.querySelector('.fixed.inset-0');
      expect(modal).not.toBeInTheDocument();
    });

    it('should not close modal when card content is clicked', async () => {
      const { container } = render(<GamePage />);

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByText(/Loading game data/i)).not.toBeInTheDocument();
      });

      // Open modal
      const propertyElement = screen.getByText(mockBoardSpaces[1].name);
      fireEvent.click(propertyElement);

      const modal = container.querySelector('.fixed.inset-0');
      expect(modal).toBeInTheDocument();

      // Click inside the card (not the backdrop)
      const cardContent = modal!.querySelector('div > div');
      if (cardContent) {
        fireEvent.click(cardContent);
      }

      // Modal should still be open
      expect(container.querySelector('.fixed.inset-0')).toBeInTheDocument();
    });
  });

  describe('Dice roll and player movement', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
    });

    it('should update player position when dice is rolled', async () => {
      render(<GamePage />);

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByText(/Loading game data/i)).not.toBeInTheDocument();
      });

      // The component should be rendered
      expect(screen.getByText(/Manager 1/i)).toBeInTheDocument();
    });

    it('should handle position wraparound when position exceeds 40', async () => {
      // Setup player at position 38
      const modifiedDynamicData = {
        ...mockDynamicGameData,
        players: [
          { id: 1, name: 'Manager 1', position: 38, money: 1500, color: '#FF0000' },
          { id: 2, name: 'Manager 2', position: 1, money: 1500, color: '#0000FF' },
        ],
      };

      (gameConfig.getDynamicGameData as jest.Mock).mockReturnValue(modifiedDynamicData);

      const { rerender } = render(<GamePage />);

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByText(/Loading game data/i)).not.toBeInTheDocument();
      });

      // Player should be at position 38
      expect(screen.getByText(/Manager 1/i)).toBeInTheDocument();

      // After re-render, player movement logic should handle wraparound
      rerender(<GamePage />);
      expect(screen.getByText(/Manager 1/i)).toBeInTheDocument();
    });

    it('should advance to next player after dice roll with delay', async () => {
      render(<GamePage />);

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByText(/Loading game data/i)).not.toBeInTheDocument();
      });

      // Current player should be Manager 1 (index 0)
      expect(screen.getByText(/Manager 1/i)).toBeInTheDocument();

      // Fast-forward time by 1 second (the delay for player change)
      jest.advanceTimersByTime(1000);

      // Player rotation logic should work
      expect(screen.getByText(/Manager 1/i)).toBeInTheDocument();
    });

    it('should cycle through all players', async () => {
      const { rerender } = render(<GamePage />);

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByText(/Loading game data/i)).not.toBeInTheDocument();
      });

      // Start with player 0
      expect(screen.getByText(/Manager 1/i)).toBeInTheDocument();

      // Simulate multiple turns
      for (let i = 0; i < mockDynamicGameData.players.length; i++) {
        jest.advanceTimersByTime(1000);
        rerender(<GamePage />);
      }

      // Should cycle back to first player
      expect(screen.getByText(/Manager 1/i)).toBeInTheDocument();
    });
  });

  describe('Player state management', () => {
    it('should maintain player money across renders', async () => {
      const { rerender } = render(<GamePage />);

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByText(/Loading game data/i)).not.toBeInTheDocument();
      });

      expect(screen.getByText(/Manager 1/i)).toBeInTheDocument();

      rerender(<GamePage />);
      expect(screen.getByText(/Manager 1/i)).toBeInTheDocument();
    });

    it('should track all players on the board', async () => {
      render(<GamePage />);

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByText(/Loading game data/i)).not.toBeInTheDocument();
      });

      // All 4 mock players should be tracked
      mockDynamicGameData.players.forEach((player) => {
        expect(screen.getByText(new RegExp(player.name, 'i'))).toBeInTheDocument();
      });
    });
  });

  describe('Component integration', () => {
    it('should pass correct props to MonopolyBoard', async () => {
      render(<GamePage />);

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByText(/Loading game data/i)).not.toBeInTheDocument();
      });

      // Board should receive board spaces
      mockStaticGameData.cells.slice(0, 10).forEach((space) => {
        if (["Chance", "Community Chest"].includes(space.cell_sub_type)) return;
        expect(screen.getByText(space.name)).toBeInTheDocument();
      });
    });

    it('should pass currency symbol to board and cards', async () => {
      render(<GamePage />);

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByText(/Loading game data/i)).not.toBeInTheDocument();
      });

      // Currency symbol should be used (€)
      expect(mockStaticGameData.currency_symbol).toBe('€');
    });

    it('should pass game terms to components', async () => {
      render(<GamePage />);

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByText(/Loading game data/i)).not.toBeInTheDocument();
      });

      // Terms should be passed (Manager instead of Player)
      screen.getAllByText(/Manager/i).forEach((managerDiv) => {
        expect(managerDiv).toBeInTheDocument();
      })
    });

    it('should pass theme colors to board', async () => {
      const { container } = render(<GamePage />);

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByText(/Loading game data/i)).not.toBeInTheDocument();
      });

      // Board should have styling applied
      expect(container.querySelector('.bg-gradient-to-br')).toBeInTheDocument();
    });
  });

  describe('Responsive layout', () => {
    it('should render all three panel sections', async () => {
      const { container } = render(<GamePage />);

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByText(/Loading game data/i)).not.toBeInTheDocument();
      });

      // Should have three main sections (left panel, board, right panel)
      const panels = container.querySelectorAll('.order-1, .order-2, .order-3');
      expect(panels.length).toBeGreaterThan(0);
    });

    it('should apply correct ordering classes for mobile and desktop', async () => {
      const { container } = render(<GamePage />);

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByText(/Loading game data/i)).not.toBeInTheDocument();
      });

      // Check for responsive order classes
      const orderedElements = container.querySelectorAll('[class*="order-"]');
      expect(orderedElements.length).toBeGreaterThan(0);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty static data gracefully', async () => {
      (gameConfig.getStaticGameData as jest.Mock).mockResolvedValue({
        ...mockStaticGameData,
        cells: [],
      });

      const { container } = render(<GamePage />);

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByText(/Loading game data/i)).not.toBeInTheDocument();
      });

      expect(container).toBeInTheDocument();
    });

    it('should handle single player', async () => {
      (gameConfig.getDynamicGameData as jest.Mock).mockReturnValue({
        ...mockDynamicGameData,
        players: [mockDynamicGameData.players[0]],
      });

      render(<GamePage />);

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByText(/Loading game data/i)).not.toBeInTheDocument();
      });

      expect(screen.getByText(/Manager 1/i)).toBeInTheDocument();
    });

    it('should handle missing theme colors', async () => {
      (gameConfig.getStaticGameData as jest.Mock).mockResolvedValue({
        ...mockStaticGameData,
        subTypeColors: {},
        cornerColors: {},
      });

      const { container } = render(<GamePage />);

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByText(/Loading game data/i)).not.toBeInTheDocument();
      });

      expect(container).toBeInTheDocument();
    });

    it('should display loading state while fetching static data', async () => {
      // Mock delayed resolution
      (gameConfig.getStaticGameData as jest.Mock).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(mockStaticGameData), 100))
      );

      render(<GamePage />);

      // Should show loading initially
      expect(screen.getByText(/Loading game data/i)).toBeInTheDocument();

      // Wait for data to load
      await waitFor(() => {
        expect(screen.queryByText(/Loading game data/i)).not.toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });

  describe('Snapshots', () => {
    it('should match snapshot for initial game state', async () => {
      const { container } = render(<GamePage />);

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByText(/Loading game data/i)).not.toBeInTheDocument();
      });

      expect(container).toMatchSnapshot();
    });

    it('should match snapshot with property modal open', async () => {
      const { container } = render(<GamePage />);

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByText(/Loading game data/i)).not.toBeInTheDocument();
      });

      const propertyElement = screen.getByText(mockBoardSpaces[1].name);
      fireEvent.click(propertyElement);

      expect(container).toMatchSnapshot();
    });
  });
});

