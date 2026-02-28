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
  const [colors] = useState<string[]>(['#FF0000', '#0000FF', '#00FF00', '#FFFF00', '#FF00FF', '#00FFFF']);

  // New state variables for purchase prompt logic
  const [isPhaseBuyProperty, setIsPhaseBuyProperty] = useState<boolean>(false);
  const [purchasePromptSpace, setPurchasePromptSpace] = useState<BoardSpace | undefined>();

  useEffect(() => {
    getStaticGameData().then(setStaticData).then(() => console.log("static data set up done"));
  }, []);

  const isDynamicDataChanged = (newDynamicData: typeof dynamicData) => {
    if (!dynamicData) return true;
    const players = newDynamicData?.players || [];
    return range(0, players.length).some(i => {
      const prevPlayer = dynamicData.players[i];
      const newPlayer = players[i];
      return prevPlayer.position !== newPlayer.position || prevPlayer.player_money !== newPlayer.player_money;
    }) || dynamicData.phase !== newDynamicData?.phase;
  }

  const setPurchaseSpace = useCallback(() => {
    if (isPhaseBuyProperty && isYourTurn) {
      const currentTile = dynamicData?.currentTile?.index;
      const boardSpace = staticData?.cells.find(cell => cell.index === currentTile);
      console.log("space: ", boardSpace?.name);
      setPurchasePromptSpace(boardSpace);
    } else {
      setPurchasePromptSpace(undefined);
    }
  }, [isPhaseBuyProperty, isYourTurn, dynamicData, staticData]);

  const updateGameState = async ()=>  {
    const dynamicGameData = await getDynamicGameData();
    if (isDynamicDataChanged(dynamicGameData)) {
      console.log("dynamic data changed: ", dynamicGameData);
      setDynamicData(dynamicGameData);
      setPlayers(dynamicGameData.players);
      setCurrentPlayer(dynamicGameData.turn.currentPlayerIndex);
      setIsYourTurn(dynamicGameData.players[dynamicGameData.turn.currentPlayerIndex].player_id === dynamicGameData.you);

      // Update phase state
      const isBuyPropertyPhase =
        dynamicGameData.phase === 'BUY_PROPERTY';
      setIsPhaseBuyProperty(isBuyPropertyPhase);

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
  });

  useEffect(() => {
    setPurchaseSpace();
  }, [setPurchaseSpace]);

  // Memoize callbacks to prevent unnecessary re-renders of child components
  const handlePropertyClick = useCallback((property: BoardSpace) => {
    setSelectedProperty(property);
  }, []);

  const handleDiceRoll = useCallback((total: number) => {}, []);

  const handleBuyProperty = useCallback(async () => {
    // Refresh game state after buying property
    await updateGameState();
  }, []);

  const handleSkipProperty = useCallback(async () => {
    // Refresh game state after skipping property
    await updateGameState();
  }, []);

  const handleClosePropertyCard = useCallback(() => {
    setSelectedProperty(null);
  }, []);

  // Render loading state until staticData is loaded
  if (!staticData) {
    return <div className="flex items-center justify-center min-h-screen text-white">Loading game data...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-1 xs:p-2 sm:p-3 lg:p-4">
      <div className="container mx-auto h-full max-w-[2560px]">
        {/* Responsive Layout - adapts from mobile to 4K screens */}
        <div className="flex flex-col xl:grid xl:grid-cols-[320px_1fr_320px] 2xl:grid-cols-[384px_1fr_384px] 3xl:grid-cols-[420px_1fr_420px] gap-2 sm:gap-3 lg:gap-4">

          {/* Board - Order 1 on mobile/tablet (shows first), Order 2 on xl+ (center) */}
          <div className="w-full flex items-center justify-center order-1 xl:order-2
                          min-h-[280px] xs:min-h-[320px] sm:min-h-[400px] md:min-h-[500px]
                          h-[45vh] xs:h-[50vh] sm:h-[55vh] md:h-[60vh] lg:h-[65vh]
                          xl:h-[calc(100vh-2rem)] 2xl:h-[calc(100vh-2.5rem)]">
            <MonopolyBoard
              onPropertyClick={handlePropertyClick}
              players={players}
              isYourTurn={isYourTurn}
              colors = {colors}
              terms={staticData.terms}
              currencySymbol={staticData.currency_symbol}
              onDiceRoll={handleDiceRoll}
              onEndTurn={() => {}}
              onBuyProperty={handleBuyProperty}
              onSkipProperty={handleSkipProperty}
              allowedActions={dynamicData?.allowedActions?? []}
              phase={dynamicData?.phase ?? ''}
              currentPlayer={currentPlayer}
              purchasePromptSpace={purchasePromptSpace}
              boardSpaces={staticData.cells}
              logos={staticData.logos}
              subTypeColors={staticData.subTypeColors}
              cornerColors={staticData.cornerColors}
              lastDice={dynamicData?.lastDice}
            />
          </div>

          {/* Side Panels Container - Responsive stacking based on screen size */}
          <div className="w-full order-2 xl:contents">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:contents gap-2 sm:gap-3 lg:gap-4">
              {/* Left Panel - Chat + Player Panel stacked */}
              <div className="w-full xl:order-1">
                <div className="h-auto xl:h-[calc(100vh-2rem)] 2xl:h-[calc(100vh-2.5rem)] flex flex-col gap-2 sm:gap-3 lg:gap-4">
                  <div className="flex-1 min-h-[200px] sm:min-h-[250px] xl:min-h-0">
                    <ChatPanel />
                  </div>
                  <div className="flex-shrink-0">
                    <PlayerPanel
                      players={players}
                      currentPlayer={currentPlayer}
                      colors={colors}
                      terms={staticData.terms}
                      yourOrder={yourOrder}
                    />
                  </div>
                </div>
              </div>

              {/* Right Panel - Trade + Properties in responsive ratio */}
              <div className="w-full xl:order-3">
                <div className="h-auto xl:h-[calc(100vh-2rem)] 2xl:h-[calc(100vh-2.5rem)]
                                grid grid-rows-1 xl:grid-rows-[1fr_2fr] gap-2 sm:gap-3 lg:gap-4">
                  <div className="overflow-y-auto min-h-[150px] xl:min-h-0">
                    <TradePanel />
                  </div>
                  <div className="overflow-y-auto min-h-[200px] xl:min-h-0">
                    <PropertiesPanel
                      players={players}
                      currentPlayer={players.findIndex(p => p.player_turn === yourOrder)}
                      boardSpaces={staticData.cells}
                      terms={staticData.terms}
                      currencySymbol={staticData.currency_symbol}
                      subTypeColors={staticData.subTypeColors}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Property Card Modal - Responsive sizing */}
      {selectedProperty && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-3 sm:p-4 lg:p-6" onClick={handleClosePropertyCard}>
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
