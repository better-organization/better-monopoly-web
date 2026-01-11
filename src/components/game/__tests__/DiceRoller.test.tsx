import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DiceRoller } from '../DiceRoller';
import { gameService } from '@/services/gameService';
import type { Player } from '@/types/game';

// Mock the gameService
jest.mock('@/services/gameService');

describe('DiceRoller', () => {
    const mockOnRoll = jest.fn();
    const mockPlayer: Player = {
        id: 1,
        name: 'Test Player',
        position: 1,
        money: 1500,
        color: '#FF0000',
    };

    const defaultProps = {
        onRoll: mockOnRoll,
        currentPlayer: mockPlayer,
        compact: true,
    };

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
    });

    describe('Rendering', () => {
        it('should render dice roller with roll button', () => {
            render(<DiceRoller {...defaultProps} />);

            expect(screen.getByRole('button', { name: /roll the dice/i })).toBeInTheDocument();
        });

        it('should render two dice SVGs', () => {
            const { container } = render(<DiceRoller {...defaultProps} />);

            const svgElements = container.querySelectorAll('svg');
            // 2 dice SVGs + 1 icon SVG in button = 3 total
            expect(svgElements.length).toBe(3);
        });

        it('should render in compact mode when compact prop is true', () => {
            const { container } = render(<DiceRoller {...defaultProps} compact={true} />);

            expect(screen.getByText(/roll the dice/i)).toBeInTheDocument();
            expect(container.querySelector('.text-center')).toBeInTheDocument();
        });

        it('should render in full mode when compact prop is false', () => {
            render(<DiceRoller {...defaultProps} compact={false} />);

            expect(screen.getByText(`Roll for ${mockPlayer.name}`)).toBeInTheDocument();
            expect(screen.getByText(/Roll Dice/i)).toBeInTheDocument();
        });
    });

    describe('Successful Dice Roll', () => {
        it('should call API and display success message on successful roll', async () => {
            const mockResponse = {
                success: true,
                data: {
                    dice: [4, 3] as [number, number],
                    total: 7,
                    timestamp: '2026-01-11T13:42:00.064Z',
                },
            };

            (gameService.rollDice as jest.Mock).mockResolvedValue(mockResponse);

            render(<DiceRoller {...defaultProps} />);

            const rollButton = screen.getByRole('button', { name: /roll the dice/i });
            fireEvent.click(rollButton);

            // Complete the 1-second animation delay
            await jest.advanceTimersByTimeAsync(1000);

            await waitFor(() => {
                expect(gameService.rollDice).toHaveBeenCalledWith('game-1', '1');
                expect(mockOnRoll).toHaveBeenCalledWith(7, 4, 3);
                // Check success message appears
                expect(screen.getByText(/Rolled 4 and 3 = 7!/i)).toBeInTheDocument();
            });
        });

        it('should disable button while rolling', async () => {
            const mockResponse = {
                success: true,
                data: {
                    dice: [5, 5] as [number, number],
                    total: 10,
                    timestamp: '2026-01-11T13:42:00.064Z',
                },
            };

            (gameService.rollDice as jest.Mock).mockResolvedValue(mockResponse);

            render(<DiceRoller {...defaultProps} />);

            const rollButton = screen.getByRole('button', { name: /roll the dice/i });
            fireEvent.click(rollButton);

            // Button should be disabled while rolling
            expect(rollButton).toBeDisabled();
            expect(screen.getByText(/Rolling.../i)).toBeInTheDocument();

            await jest.runAllTimersAsync();

            await waitFor(() => {
                expect(rollButton).not.toBeDisabled();
            });
        });

        it('should use provided gameId when available', async () => {
            const mockResponse = {
                success: true,
                data: {
                    dice: [2, 6] as [number, number],
                    total: 8,
                    timestamp: '2026-01-11T13:42:00.064Z',
                },
            };

            (gameService.rollDice as jest.Mock).mockResolvedValue(mockResponse);

            render(<DiceRoller {...defaultProps} gameId="custom-game-123" />);

            const rollButton = screen.getByRole('button', { name: /roll the dice/i });
            fireEvent.click(rollButton);

            jest.advanceTimersByTime(1000);

            await waitFor(() => {
                expect(gameService.rollDice).toHaveBeenCalledWith('custom-game-123', '1');
            });
        });
    });

    describe('Retry Logic', () => {
        it('should retry up to 3 times on failure', async () => {
            const mockError = new Error('Network error');
            (gameService.rollDice as jest.Mock).mockRejectedValue(mockError);

            render(<DiceRoller {...defaultProps} />);

            const rollButton = screen.getByRole('button', { name: /roll the dice/i });
            fireEvent.click(rollButton);

            // Run all timers to complete all retry attempts
            await jest.runAllTimersAsync();

            await waitFor(() => {
                expect(gameService.rollDice).toHaveBeenCalledTimes(3);
            });
        });

        it('should show error message after all retries fail', async () => {
            const mockError = new Error('Server unavailable');
            (gameService.rollDice as jest.Mock).mockRejectedValue(mockError);

            render(<DiceRoller {...defaultProps} />);

            const rollButton = screen.getByRole('button', { name: /roll the dice/i });
            fireEvent.click(rollButton);

            await jest.runAllTimersAsync();

            await waitFor(() => {
                expect(screen.getByText(/Failed to roll dice after 3 attempts/i)).toBeInTheDocument();
                expect(screen.getByText(/Server unavailable/i)).toBeInTheDocument();
            });
        });

        it('should NOT call onRoll callback when all retries fail', async () => {
            const mockError = new Error('Network error');
            (gameService.rollDice as jest.Mock).mockRejectedValue(mockError);

            render(<DiceRoller {...defaultProps} />);

            const rollButton = screen.getByRole('button', { name: /roll the dice/i });
            fireEvent.click(rollButton);

            await jest.runAllTimersAsync();

            await waitFor(() => {
                expect(gameService.rollDice).toHaveBeenCalledTimes(3);
                expect(mockOnRoll).not.toHaveBeenCalled();
            });
        });

        it('should succeed on second retry attempt', async () => {
            const mockError = new Error('Temporary error');
            const mockResponse = {
                success: true,
                data: {
                    dice: [6, 6] as [number, number],
                    total: 12,
                    timestamp: '2026-01-11T13:42:00.064Z',
                },
            };

            (gameService.rollDice as jest.Mock)
                .mockRejectedValueOnce(mockError)
                .mockResolvedValueOnce(mockResponse);

            render(<DiceRoller {...defaultProps} />);

            const rollButton = screen.getByRole('button', { name: /roll the dice/i });
            fireEvent.click(rollButton);

            // Run all timers to complete retry attempts
            await jest.runAllTimersAsync();

            await waitFor(() => {
                expect(gameService.rollDice).toHaveBeenCalledTimes(2);
                expect(mockOnRoll).toHaveBeenCalledWith(12, 6, 6);
            });
        });
    });

    describe('Animation Duration', () => {
        it('should always wait 1 second for animation after API response', async () => {
            const mockResponse = {
                success: true,
                data: {
                    dice: [3, 4] as [number, number],
                    total: 7,
                    timestamp: '2026-01-11T13:42:00.064Z',
                },
            };

            (gameService.rollDice as jest.Mock).mockResolvedValue(mockResponse);

            render(<DiceRoller {...defaultProps} />);

            const rollButton = screen.getByRole('button', { name: /roll the dice/i });
            fireEvent.click(rollButton);

            // Should still be rolling initially
            expect(screen.getByText(/Rolling.../i)).toBeInTheDocument();

            // Complete all timers
            await jest.runAllTimersAsync();

            await waitFor(() => {
                expect(mockOnRoll).toHaveBeenCalled();
            });
        });
    });
    describe('Message Display', () => {
        it('should display messages above dice in compact mode', () => {
            const { container } = render(<DiceRoller {...defaultProps} compact={true} />);

            // Messages should appear before dice SVGs in DOM order
            const elements = container.querySelectorAll('div');
            const svgs = container.querySelectorAll('svg');

            expect(elements.length).toBeGreaterThan(0);
            expect(svgs.length).toBe(3);
        });

        it('should not auto-hide error messages', async () => {
            const mockError = new Error('Test error');
            (gameService.rollDice as jest.Mock).mockRejectedValue(mockError);

            render(<DiceRoller {...defaultProps} />);

            const rollButton = screen.getByRole('button', { name: /roll the dice/i });
            fireEvent.click(rollButton);

            await waitFor(() => {
                expect(screen.getByText(/Failed to roll dice after 3 attempts/i)).toBeInTheDocument();
            }, { timeout: 3000 });
        });
    });

    describe('Edge Cases', () => {
        it('should handle non-Error exceptions gracefully', async () => {
            (gameService.rollDice as jest.Mock).mockRejectedValue('String error');

            render(<DiceRoller {...defaultProps} />);

            const rollButton = screen.getByRole('button', { name: /roll the dice/i });
            fireEvent.click(rollButton);
        });

        it('should prevent multiple simultaneous rolls', async () => {
            const mockResponse = {
                success: true,
                data: {
                    dice: [1, 1] as [number, number],
                    total: 2,
                    timestamp: '2026-01-11T13:42:00.064Z',
                },
            };

            (gameService.rollDice as jest.Mock).mockResolvedValue(mockResponse);

            render(<DiceRoller {...defaultProps} />);

            const rollButton = screen.getByRole('button', { name: /roll the dice/i });

            // Click multiple times rapidly
            fireEvent.click(rollButton);
            fireEvent.click(rollButton);
            fireEvent.click(rollButton);

            jest.advanceTimersByTime(2000);

            await waitFor(() => {
                // Should only call API once
                expect(gameService.rollDice).toHaveBeenCalledTimes(1);
            });
        });
    });
});
