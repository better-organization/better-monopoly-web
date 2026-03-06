import { memo, useState, useEffect } from 'react';
import { Dices } from 'lucide-react';
import type { Player, DiceRollResult, RentEvent } from '@/types/game';
import { gameService } from '@/services/gameService';

export interface DiceRollerProps {
  onRoll: (total: number, dice1: number, dice2: number) => void;
  onEndTurn: () => void;
  currentPlayer: Player;
  compact?: boolean;
  isYourTurn: boolean;
  isEndTurn: boolean;
  lastDice?: DiceRollResult;
  scale?: number;
  currencySymbol?: string;
}

export const DiceRoller = memo(function DiceRoller({ onRoll, onEndTurn, currentPlayer, compact, isYourTurn, isEndTurn, lastDice, scale = 1, currencySymbol = '€' }: DiceRollerProps) {
  const [dice1, setDice1] = useState(lastDice?.dice[0] || 1);
  const [dice2, setDice2] = useState(lastDice?.dice[1] || 1);
  const [fetching, setFetching] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rentToast, setRentToast] = useState<RentEvent | null>(null);

  // Update dice display when lastDice changes (from game state polling)
  useEffect(() => {
    if (lastDice && !fetching) {
      setDice1(lastDice.dice[0]);
      setDice2(lastDice.dice[1]);
    }
  }, [lastDice, fetching]);

  const rollDice = async () => {
    if (fetching) return;

    setFetching(true);
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
        const response = await gameService.rollDice();

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

        // Show rent toast if rent was collected
        if (response.data.rentEvent) {
          setRentToast(response.data.rentEvent);
          setTimeout(() => setRentToast(null), 4000);
        }

        // Show success message
        const successMessage = `Rolled ${dice1Value} and ${dice2Value} = ${totalValue}!`;
        setMessage(successMessage);
        // Auto-hide message after 3 seconds
        setTimeout(() => setMessage(null), 3000);

        // Call parent callback with the result
        onRoll(totalValue, dice1Value, dice2Value);

        // Success - exit retry loop
        setFetching(false);
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
    setFetching(false);

    // Show persistent error message
    const errorMessage = `Failed to roll dice after ${maxRetries} attempts. ${lastError?.message || 'Server error'}`;
    setError(errorMessage);

    // Don't auto-hide error - user needs to see this
    // They can try rolling again manually

    console.error('All dice roll attempts failed:', lastError);
  };

  const endTurn = async () => {
    if (fetching) return;

    setFetching(true);
    setMessage(null);
    setError(null);

    try {
      await gameService.endTurn();
      setMessage('Turn ended successfully!');
      onEndTurn();
      // Auto-hide message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Failed to end turn. ${errorMessage}`);
    } finally {
      setFetching(false);
    }
  }

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
    // Calculate responsive sizes based on scale
    const diceSize = Math.max(40, Math.round(60 * scale));
    const gap = Math.max(8, Math.round(12 * scale));
    const messageFontSize = Math.max(10, Math.round(12 * scale));
    const buttonPaddingX = Math.max(16, Math.round(24 * scale));
    const buttonPaddingY = Math.max(8, Math.round(10 * scale));
    const buttonFontSize = Math.max(11, Math.round(14 * scale));

    return (
      <div className="text-center bg-transparent">
        {/* Rent Toast — above dice result, same style */}
        {rentToast && (
          <div
            className="mb-3 px-3 py-2 bg-amber-600 text-white rounded-md shadow-lg animate-pulse"
            style={{ fontSize: `${messageFontSize}px` }}
          >
            🏠 <span className="font-bold">{rentToast.payerId}</span>
            {' paid '}
            <span className="font-bold">{currencySymbol}{rentToast.amount}</span>
            {' to '}
            <span className="font-bold">{rentToast.ownerId}</span>
            {rentToast.tileName && ` · ${rentToast.tileName}`}
          </div>
        )}

        {/* Dice result / turn-ended message */}
        {message && (
          <div
            className="mb-3 px-3 py-1.5 bg-green-600 text-white rounded-md shadow-lg animate-pulse"
            style={{ fontSize: `${messageFontSize}px` }}
          >
            {message}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div
            className="mb-3 px-3 py-1.5 bg-red-600 text-white rounded-md shadow-lg"
            style={{ fontSize: `${messageFontSize}px` }}
          >
            {error}
          </div>
        )}

        <div className="flex justify-center mb-3" style={{ gap: `${gap}px` }}>
          <svg
            width={diceSize}
            height={diceSize}
            viewBox="0 0 100 100"
            className={`${fetching ? 'animate-spin' : ''} drop-shadow-2xl`}
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
            width={diceSize}
            height={diceSize}
            viewBox="0 0 100 100"
            className={`${fetching ? 'animate-spin' : ''} drop-shadow-2xl`}
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

        {(isYourTurn && isEndTurn) ? (<button
          onClick={endTurn}
          disabled={fetching || !isYourTurn}
          className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center gap-2 mx-auto"
          style={{
            paddingLeft: `${buttonPaddingX}px`,
            paddingRight: `${buttonPaddingX}px`,
            paddingTop: `${buttonPaddingY}px`,
            paddingBottom: `${buttonPaddingY}px`,
            fontSize: `${buttonFontSize}px`
          }}
        >
          {fetching ? 'Ending Turn...' : `End Turn`}
        </button>) : (<button
          onClick={rollDice}
          disabled={fetching || !isYourTurn}
          className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center gap-2 mx-auto"
          style={{
            paddingLeft: `${buttonPaddingX}px`,
            paddingRight: `${buttonPaddingX}px`,
            paddingTop: `${buttonPaddingY}px`,
            paddingBottom: `${buttonPaddingY}px`,
            fontSize: `${buttonFontSize}px`
          }}
        >
          <Dices className="w-4 h-4" />
          {fetching ? 'Rolling...' : `${isYourTurn ? 'Your turn' : 'Opponents turn'}`}
        </button>)}
      </div>
    );
  }

  return (
    <div className="bg-transparent rounded-lg shadow-xl p-6 border-4 border-green-600">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Dices className="w-6 h-6 text-green-700" />
        <h3 className="text-green-900">Roll Dice</h3>
      </div>

      <div className="flex gap-4 justify-center mb-6">
        <svg
          width="60"
          height="60"
          viewBox="0 0 100 100"
          className={`${fetching ? 'animate-spin' : ''}`}
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
          className={`${fetching ? 'animate-spin' : ''}`}
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
        disabled={fetching || !isYourTurn}
        className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
      >
        {fetching ? 'Rolling...' : `Roll for ${currentPlayer.player_id}`}
      </button>
    </div>
  );
});
