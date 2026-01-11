import { memo, useState } from 'react';
import { Dices } from 'lucide-react';
import type { Player } from '@/types/game';
import { gameService } from '@/services/gameService';

interface DiceRollerProps {
  onRoll: (total: number, dice1: number, dice2: number) => void;
  currentPlayer: Player;
  compact?: boolean;
  gameId?: string; // Optional for now, can be made required when game management is implemented
}

export const DiceRoller = memo(function DiceRoller({ onRoll, currentPlayer, compact, gameId }: DiceRollerProps) {
  const [dice1, setDice1] = useState(1);
  const [dice2, setDice2] = useState(1);
  const [rolling, setRolling] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const rollDice = async () => {
    if (rolling) return;

    setRolling(true);
    setMessage(null);
    setError(null);

    // Animate rolling
    let rolls = 0;
    const interval = setInterval(() => {
      setDice1(Math.floor(Math.random() * 6) + 1);
      setDice2(Math.floor(Math.random() * 6) + 1);
      rolls++;

      if (rolls >= 10) {
        clearInterval(interval);
      }
    }, 100);

    const maxRetries = 3;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Call backend API to roll dice
        const mockGameId = gameId || 'game-1';
        const mockPlayerId = currentPlayer.id.toString();

        const response = await gameService.rollDice(mockGameId, mockPlayerId);

        // Always wait 1 second for animation to complete
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Clear animation interval
        clearInterval(interval);

        // Extract dice values from response.data.dice array
        const [dice1Value, dice2Value] = response.data.dice;
        const totalValue = response.data.total;

        // Set the actual dice values from backend
        setDice1(dice1Value);
        setDice2(dice2Value);

        // Show success message
        const successMessage = `Rolled ${dice1Value} and ${dice2Value} = ${totalValue}!`;
        setMessage(successMessage);
        // Auto-hide message after 3 seconds
        setTimeout(() => setMessage(null), 3000);

        // Call parent callback with the result
        onRoll(totalValue, dice1Value, dice2Value);

        // Success - exit retry loop
        setRolling(false);
        return;

      } catch (err) {
        lastError = err instanceof Error ? err : new Error('Unknown error occurred');
        console.error(`Dice roll attempt ${attempt} failed:`, err);

        // If not the last attempt, wait before retrying (exponential backoff)
        if (attempt < maxRetries) {
          const delayMs = Math.pow(2, attempt - 1) * 500; // 500ms, 1000ms, 2000ms
          await new Promise(resolve => setTimeout(resolve, delayMs));
        }
      }
    }

    // All retries failed - clear animation and show error
    clearInterval(interval);
    setRolling(false);

    // Show persistent error message
    const errorMessage = `Failed to roll dice after ${maxRetries} attempts. ${lastError?.message || 'Server error'}`;
    setError(errorMessage);

    // Don't auto-hide error - user needs to see this
    // They can try rolling again manually

    console.error('All dice roll attempts failed:', lastError);
  };

  const renderDie = (value: number) => {
    const dots: JSX.Element[] = [];
    const positions: { [key: number]: number[][] } = {
      1: [[50, 50]],
      2: [[25, 25], [75, 75]],
      3: [[25, 25], [50, 50], [75, 75]],
      4: [[25, 25], [75, 25], [25, 75], [75, 75]],
      5: [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]],
      6: [[25, 25], [75, 25], [25, 50], [75, 50], [25, 75], [75, 75]],
    };

    positions[value].forEach((pos, idx) => {
      dots.push(
        <circle
          key={idx}
          cx={`${pos[0]}%`}
          cy={`${pos[1]}%`}
          r="10%"
          fill="#15803d"
        />
      );
    });

    return dots;
  };

  if (compact) {
    return (
      <div className="text-center">
        {/* Success Message */}
        {message && (
          <div className="mb-3 px-3 py-1.5 bg-green-600 text-white text-xs rounded-md shadow-lg animate-pulse">
            {message}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-3 px-3 py-1.5 bg-red-600 text-white text-xs rounded-md shadow-lg">
            {error}
          </div>
        )}

        <div className="flex gap-3 justify-center mb-3">
          <svg
            width="60"
            height="60"
            viewBox="0 0 100 100"
            className={`${rolling ? 'animate-spin' : ''} drop-shadow-2xl`}
          >
            <rect
              x="5"
              y="5"
              width="90"
              height="90"
              rx="15"
              fill="#ffffff"
              stroke="#fbbf24"
              strokeWidth="4"
            />
            {renderDie(dice1)}
          </svg>

          <svg
            width="60"
            height="60"
            viewBox="0 0 100 100"
            className={`${rolling ? 'animate-spin' : ''} drop-shadow-2xl`}
          >
            <rect
              x="5"
              y="5"
              width="90"
              height="90"
              rx="15"
              fill="#ffffff"
              stroke="#fbbf24"
              strokeWidth="4"
            />
            {renderDie(dice2)}
          </svg>
        </div>

        <button
          onClick={rollDice}
          disabled={rolling}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center gap-2 mx-auto text-sm"
        >
          <Dices className="w-4 h-4" />
          {rolling ? 'Rolling...' : 'Roll the dice'}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 border-4 border-green-600">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Dices className="w-6 h-6 text-green-700" />
        <h3 className="text-green-900">Roll Dice</h3>
      </div>

      <div className="flex gap-4 justify-center mb-6">
        <svg
          width="60"
          height="60"
          viewBox="0 0 100 100"
          className={`${rolling ? 'animate-spin' : ''}`}
        >
          <rect
            x="5"
            y="5"
            width="90"
            height="90"
            rx="10"
            fill="#ffffff"
            stroke="#22c55e"
            strokeWidth="3"
          />
          {renderDie(dice1)}
        </svg>

        <svg
          width="60"
          height="60"
          viewBox="0 0 100 100"
          className={`${rolling ? 'animate-spin' : ''}`}
        >
          <rect
            x="5"
            y="5"
            width="90"
            height="90"
            rx="10"
            fill="#ffffff"
            stroke="#22c55e"
            strokeWidth="3"
          />
          {renderDie(dice2)}
        </svg>
      </div>

      <div className="text-center mb-4">
        <p className="text-gray-700">Total: <span className="text-green-700">{dice1 + dice2}</span></p>
      </div>

      {/* Success Message */}
      {message && (
        <div className="mb-4 px-4 py-2 bg-green-100 border border-green-400 text-green-700 text-sm rounded-md">
          {message}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 px-4 py-2 bg-red-100 border border-red-400 text-red-700 text-sm rounded-md">
          {error}
        </div>
      )}

      <button
        onClick={rollDice}
        disabled={rolling}
        className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
      >
        {rolling ? 'Rolling...' : `Roll for ${currentPlayer.name}`}
      </button>
    </div>
  );
});
