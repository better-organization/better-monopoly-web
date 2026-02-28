import { memo, useState, useEffect } from 'react';
import type { BoardSpace, Player, GameTerms } from '@/types/game';
import { gameService } from '@/services/gameService';

export interface PropertyActionsProps {
  boardSpace?: BoardSpace;
  phase: string;
  isYourTurn: boolean;
  currencySymbol: string;
  players: Player[];
  currentPlayerIndex: number;
  boardSpaces: BoardSpace[];
  terms: GameTerms;
  onBuy: () => void;
  onSkip: () => void;
}

export const PropertyActions = memo(function PropertyActions({
  boardSpace,
  phase,
  isYourTurn,
  currencySymbol,
  players,
  currentPlayerIndex,
  boardSpaces,
  terms,
  onBuy,
  onSkip,
}: PropertyActionsProps) {
  const [fetching, setFetching] = useState(false);
  const [showDelayed, setShowDelayed] = useState(false);

  // Show modal ONLY based on phase - ignore other conditions
  const shouldShowActions = phase === 'BUY_PROPERTY';

  // Add 3-second delay before showing the modal
  useEffect(() => {
    if (shouldShowActions && boardSpace && isYourTurn) {
      setShowDelayed(false);
      const timer = setTimeout(() => {
        setShowDelayed(true);
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      setShowDelayed(false);
    }
  }, [shouldShowActions, boardSpace, isYourTurn]);

  const handleBuyProperty = async () => {
    if (fetching) return;
    setFetching(true);

    try {
      await gameService.buyProperty();
      onBuy();
    } catch (err) {
      console.error('Failed to buy property:', err);
    } finally {
      setFetching(false);
    }
  };

  const handleSkipProperty = async () => {
    if (fetching) return;
    setFetching(true);

    try {
      await gameService.skipProperty();
      onSkip();
    } catch (err) {
      console.error('Failed to skip property:', err);
    } finally {
      setFetching(false);
    }
  };

  if (!showDelayed || !boardSpace || !isYourTurn) {
    return null;
  }

  // Safety check - if no boardSpace, show a minimal modal
  if (!boardSpace) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4 backdrop-blur-sm">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border-2 border-green-600 shadow-xl max-w-md w-full">
          <div className="bg-gradient-to-r from-green-600 to-green-700 p-3 border-b-2 border-green-500">
            <h2 className="text-white text-base font-bold">Purchase Property?</h2>
          </div>
          <div className="p-4">
            <p className="text-white text-center">Loading property information...</p>
          </div>
        </div>
      </div>
    );
  }

  const currentPlayer = players[currentPlayerIndex];
  const price =
    boardSpace.property_price ||
    boardSpace.transport_price ||
    boardSpace.utility_price || 0;

  const afterPurchase = currentPlayer.player_money - price;
  const canAfford = currentPlayer.player_money >= price;

  // Count owned properties in same collection
  const ownedInCollection = currentPlayer.property_owns?.filter(propName => {
    const prop = boardSpaces.find(s => s.index === propName);
    if (boardSpace.cell_type === 'property') {
      return prop?.cell_sub_type === boardSpace.cell_sub_type;
    } else if (boardSpace.cell_type === 'transport') {
      return prop?.cell_type === 'transport';
    } else if (boardSpace.cell_type === 'utility') {
      return prop?.cell_type === 'utility';
    }
    return false;
  }).length || 0;

  const totalInCollection = boardSpace.cell_type === 'property'
    ? boardSpaces.filter(s => s.cell_sub_type === boardSpace.cell_sub_type).length
    : boardSpace.cell_type === 'transport'
    ? 4
    : 2;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border-2 border-green-600 shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 p-3 border-b-2 border-green-500">
          <h2 className="text-white text-base font-bold">
            Purchase Property?
          </h2>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Property Name */}
          <div>
            <h3 className="text-white text-lg font-bold mb-1">
              {boardSpace.name}
            </h3>
            <div className="text-slate-400 text-xs">
              {boardSpace.cell_type === 'property' && `${boardSpace.cell_sub_type} Club`}
              {boardSpace.cell_type === 'transport' && terms.transport}
              {boardSpace.cell_type === 'utility' && terms.utility}
            </div>
          </div>

          {/* Property Collection Status */}
          <div className="bg-slate-950/50 rounded p-2 border border-slate-700">
            <div className="text-xs text-slate-400 mb-1">
              {boardSpace.cell_type === 'property' && `${boardSpace.cell_sub_type} Collection`}
              {boardSpace.cell_type === 'transport' && `${terms.transport} Collection`}
              {boardSpace.cell_type === 'utility' && `${terms.utility} Collection`}
            </div>
            <div className="text-sm text-white">
              You own {ownedInCollection} of {totalInCollection}{' '}
              {boardSpace.cell_type === 'property' && 'clubs'}
              {boardSpace.cell_type === 'transport' && 'tournaments'}
              {boardSpace.cell_type === 'utility' && 'income streams'}
            </div>
          </div>

          {/* Price and Balance */}
          <div className="bg-slate-950/50 rounded p-3 border border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">Price:</span>
              <span className="text-yellow-400 font-bold text-lg">
                {currencySymbol}{price}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">Your Balance:</span>
              <span className="text-white font-bold">
                {currencySymbol}{currentPlayer.player_money}
              </span>
            </div>
            <div className="border-t border-slate-700 pt-2 flex items-center justify-between">
              <span className="text-slate-400 text-sm">After Purchase:</span>
              <span className={`font-bold ${afterPurchase >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {currencySymbol}{afterPurchase}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={handleSkipProperty}
              disabled={fetching || !isYourTurn}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-medium py-2.5 px-4 rounded border border-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {!isYourTurn ? 'Not Your Turn' : 'Skip'}
            </button>

            <button
              onClick={handleBuyProperty}
              disabled={fetching || !canAfford || !isYourTurn}
              className="flex-1 bg-green-600 hover:bg-green-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold py-2.5 px-4 rounded border border-green-500 disabled:border-slate-600 transition-colors disabled:cursor-not-allowed"
            >
              {fetching ? 'Buying...' : !isYourTurn ? 'Not Your Turn' : 'Buy Property'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

