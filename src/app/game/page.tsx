'use client';

import { useState } from 'react';
import { MonopolyBoard } from '@/components/game/MonopolyBoard';
import { DetailsCard } from '@/components/game/DetailsCard';
import { PlayerPanel } from '@/components/game/PlayerPanel';
import { ChatPanel } from '@/components/game/ChatPanel';
import { TradePanel } from '@/components/game/TradePanel';
import { PropertiesPanel } from '@/components/game/PropertiesPanel';
import { getStaticGameData, getDynamicGameData } from '@/utils/gameConfig';
import type { BoardSpace } from '@/types/game';

export default function GamePage() {
  // Get static game configuration (doesn't change during gameplay)
  const staticData = getStaticGameData();

  // Initialize dynamic state (changes during gameplay)
  const initialState = getDynamicGameData();
  const [selectedProperty, setSelectedProperty] = useState<BoardSpace | null>(initialState.selectedProperty);
  const [currentPlayer, setCurrentPlayer] = useState(initialState.currentPlayer);
  const [players, setPlayers] = useState(initialState.players);

  const handlePropertyClick = (property: BoardSpace) => {
    setSelectedProperty(property);
  };

  const handleDiceRoll = (total: number) => {
    setPlayers(prev => {
      const newPlayers = [...prev];
      const currentPos = newPlayers[currentPlayer].position;
      let newPosition = currentPos + total;
      if (newPosition > 40) newPosition = newPosition - 40;
      newPlayers[currentPlayer].position = newPosition;
      return newPlayers;
    });

    // Move to next player
    setTimeout(() => {
      setCurrentPlayer((prev) => (prev + 1) % players.length);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="container mx-auto h-full max-w-[1920px]">
        {/* Responsive Layout */}
        <div className="flex flex-col 2xl:grid 2xl:grid-cols-[384px_1fr_384px] gap-4">

          {/* Left Panel - Order 2 on mobile, Order 1 on 2xl */}
          <div className="w-full order-2 2xl:order-1">
            <div className="max-h-[calc(100vh-2rem)] overflow-y-auto">
              <ChatPanel />
            </div>
          </div>

          {/* Board - Order 1 on mobile (shows first), Order 2 on 2xl (center) */}
          <div className="w-full flex items-center justify-center order-1 2xl:order-2">
            <MonopolyBoard
              onPropertyClick={handlePropertyClick}
              players={players}
              terms={staticData.terms}
              currencySymbol={staticData.currency_symbol}
              onDiceRoll={handleDiceRoll}
              currentPlayer={currentPlayer}
              boardSpaces={staticData.cells}
              logos={staticData.logos}
              subTypeColors={staticData.subTypeColors}
              cornerColors={staticData.cornerColors}
            />
          </div>

          {/* Right Panel - Order 3 on both mobile and 2xl */}
          <div className="w-full order-3 2xl:order-3">
            <div className="max-h-[calc(100vh-2rem)] overflow-y-auto space-y-4">
              <PlayerPanel
                players={players}
                currentPlayer={currentPlayer}
                terms={staticData.terms}
              />
              <TradePanel />
              <PropertiesPanel players={players} />
            </div>
          </div>

        </div>
      </div>

      {/* Property Card Modal */}
      {selectedProperty && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setSelectedProperty(null)}>
          <div onClick={(e) => e.stopPropagation()}>
            <DetailsCard
              property={selectedProperty}
              onClose={() => setSelectedProperty(null)}
              terms={staticData.terms}
              currencySymbol={staticData.currency_symbol}
              logos={staticData.logos}
              subTypeColors={staticData.subTypeColors}
              cornerColors={staticData.cornerColors}
            />
          </div>
        </div>
      )}
    </div>
  );
}
