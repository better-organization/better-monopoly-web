'use client';

import { useState, useCallback, useEffect } from 'react';
import { MonopolyBoard } from '@/components/game/MonopolyBoard';
import { DetailsCard } from '@/components/game/DetailsCard';
import { PlayerPanel } from '@/components/game/PlayerPanel';
import { ChatPanel } from '@/components/game/ChatPanel';
import { TradePanel } from '@/components/game/TradePanel';
import { PropertiesPanel } from '@/components/game/PropertiesPanel';
import { getStaticGameData, getDynamicGameData } from '@/utils/gameConfig';
import type { BoardSpace, Player } from '@/types/game';
import {range} from "d3-array";

export default function GamePage() {
  // Get static game configuration (doesn't change during gameplay)
  // Now using async fetch with useEffect
  const [staticData, setStaticData] = useState<Awaited<ReturnType<typeof getStaticGameData>> | null>(null);
  const [dynamicData, setDynamicData] = useState<Awaited<ReturnType<typeof getDynamicGameData>> | null>(null);

  // Initialize dynamic state (changes during gameplay)
  const [selectedProperty, setSelectedProperty] = useState<BoardSpace | null>();
  const [currentPlayer, setCurrentPlayer] = useState<number>(0);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isYourTurn, setIsYourTurn] = useState<boolean>(false);
  const [yourOrder, setYourOrder] = useState<number>(-1);

  useEffect(() => {
    getStaticGameData().then(setStaticData);
  }, []);

  const isDynamicDataChanged = (newDynamicData: typeof dynamicData) => {
    if (!dynamicData) return true;
    const players = newDynamicData?.players || [];
    return range(0, players.length).some(i => {
      const prevPlayer = dynamicData.players[i];
      const newPlayer = players[i];
      return prevPlayer.position !== newPlayer.position || prevPlayer.player_money !== newPlayer.player_money;
    });
  }

  const updateGameState = async ()=>  {
    const dynamicGameData = await getDynamicGameData();
    if (isDynamicDataChanged(dynamicGameData)) {
      setDynamicData(dynamicGameData);
      setPlayers(dynamicGameData.players);
      setCurrentPlayer(dynamicGameData.current_turn);
      setIsYourTurn(dynamicGameData.players[dynamicGameData.current_turn].player_id === dynamicGameData.you);
      if (yourOrder === -1) {
        const yourPlayer = dynamicGameData.players.find(p => p.player_id === dynamicGameData.you);
        if (yourPlayer) {
          setYourOrder(yourPlayer.player_turn);
        }
      }
    }
  }

  useEffect(() => {
    updateGameState()

    const intervalId = setInterval(() => {
      updateGameState();
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // Memoize callbacks to prevent unnecessary re-renders of child components
  const handlePropertyClick = useCallback((property: BoardSpace) => {
    setSelectedProperty(property);
  }, []);

  const handleDiceRoll = useCallback((total: number) => {}, []);

  const handleClosePropertyCard = useCallback(() => {
    setSelectedProperty(null);
  }, []);

  // Render loading state until staticData is loaded
  if (!staticData) {
    return <div className="flex items-center justify-center min-h-screen text-white">Loading game data...</div>;
  }

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
              isYourTurn={isYourTurn}
              colors = {dynamicData?.colors ?? ['#FF0000', '#0000FF', '#00FF00', '#FFFF00']}
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
                colors = {dynamicData?.colors ?? ['#FF0000', '#0000FF', '#00FF00', '#FFFF00']}
                terms={staticData.terms}
                yourOrder={yourOrder}
              />
              <TradePanel />
              <PropertiesPanel players={players} />
            </div>
          </div>

        </div>
      </div>

      {/* Property Card Modal */}
      {selectedProperty && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={handleClosePropertyCard}>
          <div onClick={(e) => e.stopPropagation()}>
            <DetailsCard
              property={selectedProperty}
              onClose={handleClosePropertyCard}
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
