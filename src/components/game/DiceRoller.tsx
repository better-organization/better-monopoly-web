import { useState } from 'react';
import { Dices } from 'lucide-react';
import type { Player } from '@/types/game';

interface DiceRollerProps {
  onRoll: (total: number) => void;
  currentPlayer: Player;
  compact?: boolean;
}

export function DiceRoller({ onRoll, currentPlayer, compact }: DiceRollerProps) {
  const [dice1, setDice1] = useState(1);
  const [dice2, setDice2] = useState(1);
  const [rolling, setRolling] = useState(false);

  const rollDice = () => {
    if (rolling) return;

    setRolling(true);

    // Animate rolling
    let rolls = 0;
    const interval = setInterval(() => {
      setDice1(Math.floor(Math.random() * 6) + 1);
      setDice2(Math.floor(Math.random() * 6) + 1);
      rolls++;

      if (rolls >= 10) {
        clearInterval(interval);
        const final1 = Math.floor(Math.random() * 6) + 1;
        const final2 = Math.floor(Math.random() * 6) + 1;
        setDice1(final1);
        setDice2(final2);
        onRoll(final1 + final2);
        setRolling(false);
      }
    }, 100);
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

      <button
        onClick={rollDice}
        disabled={rolling}
        className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
      >
        {rolling ? 'Rolling...' : `Roll for ${currentPlayer.name}`}
      </button>
    </div>
  );
}

