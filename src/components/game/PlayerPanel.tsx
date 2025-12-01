import { User, Coins } from 'lucide-react';
import type { Player, GameTerms } from '@/types/game';

interface PlayerPanelProps {
  players: Player[];
  currentPlayer: number;
  terms: GameTerms;
}

export function PlayerPanel({ players, currentPlayer, terms }: PlayerPanelProps) {
  return (
    <div className="bg-slate-800 rounded-lg border-2 border-slate-700 p-3">
      <div className="flex items-center gap-2 mb-3">
        <User className="w-5 h-5 text-blue-400" />
        <h3 className="text-slate-200 text-sm">{terms.player}s</h3>
      </div>

      <div className="space-y-2">
        {players.map((player, index) => (
          <div
            key={player.id}
            className={`p-2.5 rounded border transition-all ${
              index === currentPlayer
                ? 'border-blue-500 bg-blue-950/30 shadow-lg shadow-blue-500/20'
                : 'border-slate-700 bg-slate-900/50'
            }`}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full border-2 border-white shadow-lg flex-shrink-0"
                style={{ backgroundColor: player.color }}
              />
              <div className="flex-1 min-w-0">
                <p className={`truncate text-sm ${
                  index === currentPlayer ? 'text-blue-200' : 'text-slate-300'
                }`}>
                  {player.name}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Coins className="w-3.5 h-3.5 text-yellow-500" />
                  <p className={`text-xs ${
                    index === currentPlayer ? 'text-yellow-400' : 'text-slate-400'
                  }`}>
                    €{player.money}
                  </p>
                </div>
              </div>
              {index === currentPlayer && (
                <div className="flex-shrink-0">
                  <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse shadow-lg shadow-blue-500/50" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

