import { memo, useMemo, useEffect, useRef, useState } from 'react';
import { BoardSpace } from './BoardSpace';
import { DiceRoller } from './DiceRoller';
import { PropertyActions } from './PropertyActions';
import { FieldLines } from './FieldLines';
import type {Player, BoardSpace as BoardSpaceType, GameTerms, DiceRollResult} from '@/types/game';
import React from 'react';

// Base card dimensions in pixels (at 1.0 scale)
// Cards: 70px × 120px (width × height)
// Corners: 120px × 120px (square, same as card height)
// Left/Right cards are rotated 90°, so their width (70px) becomes the vertical dimension
const BASE_CORNER_SIZE = 120;  // Corner size in pixels (120×120 square)
const BASE_CARD_WIDTH = 70;   // Card width in pixels
const BASE_BORDER_WIDTH = 6;  // Border width in pixels
const BASE_PADDING = 6;       // Internal padding in pixels

// Board size calculation: CORNER + (9 × CARD_WIDTH) + CORNER + PADDING
// 120 + 630 + 120 + 25 = 895px
const BASE_BOARD_SIZE = BASE_CORNER_SIZE + (9 * BASE_CARD_WIDTH) + BASE_CORNER_SIZE + 25;

// Responsive breakpoints for board scaling
const BOARD_MIN_SIZE = 320;  // Minimum board size (mobile)
const BOARD_MAX_SIZE = 1200; // Maximum board size (large desktop)

export interface MonopolyBoardProps {
  onPropertyClick: (property: BoardSpaceType) => void;
  players: Player[];
  isYourTurn: boolean;
  colors: string[];
  terms: GameTerms;
  currencySymbol: string;
  onDiceRoll: (total: number, dice1: number, dice2: number) => void;
  onEndTurn: () => void;
  onBuyProperty: () => void;
  onSkipProperty: () => void;
  allowedActions: string[];
  phase: string;
  currentPlayer: number;
  purchasePromptSpace?: BoardSpaceType;
  boardSpaces: BoardSpaceType[];
  logos: { [key: string]: string };
  subTypeColors: { [key: string]: { primary: string; secondary: string; gradient: string; logo: string | null } };
  cornerColors: { [key: string]: { primary: string; secondary: string; gradient: string; logo: string | null; textColor: string } };
  lastDice?: DiceRollResult;
}

export const MonopolyBoard = memo(function MonopolyBoard({
  onPropertyClick,
  players,
  colors,
  isYourTurn,
  terms,
  currencySymbol,
  onDiceRoll,
  onEndTurn,
  onBuyProperty,
  onSkipProperty,
  allowedActions,
  phase,
  currentPlayer,
  purchasePromptSpace,
  boardSpaces,
  logos,
  subTypeColors,
  cornerColors,
  lastDice
}: MonopolyBoardProps) {
  // Responsive scaling state
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // Calculate responsive scale based on container size
  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;

      // Use the smaller dimension to ensure board fits
      const availableSize = Math.min(containerWidth, containerHeight);

      // Calculate scale factor
      let newScale = availableSize / BASE_BOARD_SIZE;

      // Apply min/max constraints
      const minScale = BOARD_MIN_SIZE / BASE_BOARD_SIZE;
      const maxScale = BOARD_MAX_SIZE / BASE_BOARD_SIZE;
      newScale = Math.max(minScale, Math.min(maxScale, newScale));

      setScale(newScale);
    };

    // Initial scale calculation
    updateScale();

    // Update on window resize
    const resizeObserver = new ResizeObserver(updateScale);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Calculate scaled dimensions
  const scaledBoardSize = BASE_BOARD_SIZE * scale;
  const scaledCornerSize = BASE_CORNER_SIZE * scale;
  const scaledCardWidth = BASE_CARD_WIDTH * scale;
  const scaledBorderWidth = Math.max(2, BASE_BORDER_WIDTH * scale);
  const scaledPadding = BASE_PADDING * scale;

  // Memoize getPlayersAtPosition function to avoid recreating on every render
  const getPlayersAtPosition = useMemo(() => {
    return (positionIndex: number) => {
      return players.filter(p => p.position + 1 === positionIndex);
    };
  }, [players]);

  // Memoize board layout slices to avoid recalculating on every render
  const boardLayout = useMemo(() => {
    return {
      topRow: boardSpaces.slice(1, 10), // indices 2-10
      rightColumn: boardSpaces.slice(11, 20), // indices 12-20
      bottomRow: boardSpaces.slice(21, 30).reverse(), // indices 30-22
      leftColumn: boardSpaces.slice(31, 40).reverse() // indices 40-32
    };
  }, [boardSpaces]);

  const { topRow, rightColumn, bottomRow, leftColumn } = boardLayout;

  // Early return must come after all hooks
  if (boardSpaces.length !== 40) {
    return <div>empty board</div>
  }

  // Board dimensions calculation:
  // Width: CORNER + (9 × CARD_WIDTH) + CORNER = 120 + 630 + 120 = 870
  // Height: CORNER + (9 × CARD_WIDTH [rotated left/right cards]) + CORNER = 120 + 630 + 120 = 870
  // Board is SQUARE because left/right cards are rotated 90°

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center w-full h-full aspect-square"
      style={{
        // CSS custom properties for responsive scaling
        ['--board-scale' as string]: scale,
        ['--corner-size' as string]: `${scaledCornerSize}px`,
        ['--card-width' as string]: `${scaledCardWidth}px`,
        ['--border-width' as string]: `${scaledBorderWidth}px`,
        ['--board-padding' as string]: `${scaledPadding}px`,
      }}
    >
      {/* Responsive Square Board - scales based on container */}
      <div
        className="bg-gradient-to-br from-green-700 via-green-800 to-green-900 border-amber-500 shadow-2xl rounded-lg"
        style={{
          width: `${scaledBoardSize}px`,
          height: `${scaledBoardSize}px`,
          borderWidth: `${scaledBorderWidth}px`,
          transformOrigin: 'center center',
        }}
      >
        <div className="grid gap-0 w-full h-full relative" style={{
          padding: `${scaledPadding}px`,
          gridTemplateColumns: `${scaledCornerSize}px ${Array(9).fill(`${scaledCardWidth}px`).join(' ')} ${scaledCornerSize}px`,
          gridTemplateRows: `${scaledCornerSize}px ${Array(9).fill(`${scaledCardWidth}px`).join(' ')} ${scaledCornerSize}px`
        }}>
          {/* Top Row */}
          <div className="flex items-center justify-center">
            <BoardSpace
              space={boardSpaces[0]}
              colors={colors}
              players={getPlayersAtPosition(1)}
              onClick={() => onPropertyClick(boardSpaces[0])}
              isCorner={true}
              position="top"
              terms={terms}
              currencySymbol={currencySymbol}
              logos={logos}
              subTypeColors={subTypeColors}
              cornerColors={cornerColors}
              scale={scale}
            />
          </div>
          {topRow.map((space) => (
            <div key={space.index}>
              <BoardSpace
                space={space}
                colors={colors}
                players={getPlayersAtPosition(space.index)}
                onClick={() => onPropertyClick(space)}
                position="top"
                terms={terms}
                currencySymbol={currencySymbol}
                logos={logos}
                subTypeColors={subTypeColors}
                cornerColors={cornerColors}
                scale={scale}
              />
            </div>
          ))}
          <div className="flex items-center justify-center">
            <BoardSpace
              space={boardSpaces[10]}
              colors={colors}
              players={getPlayersAtPosition(11)}
              onClick={() => onPropertyClick(boardSpaces[10])}
              isCorner={true}
              position="top"
              terms={terms}
              currencySymbol={currencySymbol}
              logos={logos}
              subTypeColors={subTypeColors}
              cornerColors={cornerColors}
              scale={scale}
            />
          </div>

          {/* Middle 9 Rows */}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((rowIndex) => (
            <React.Fragment key={`row-${rowIndex}`}>
              {/* Left tile */}
              <div key={`left-${rowIndex}`} className="flex items-center justify-center">
                <BoardSpace
                  space={leftColumn[rowIndex]}
                  colors={colors}
                  players={getPlayersAtPosition(leftColumn[rowIndex].index)}
                  onClick={() => onPropertyClick(leftColumn[rowIndex])}
                  position="left"
                  terms={terms}
                  currencySymbol={currencySymbol}
                  logos={logos}
                  subTypeColors={subTypeColors}
                  cornerColors={cornerColors}
                  scale={scale}
                />
              </div>

              {/* Center 9 columns - Empty spaces for football field */}
              {Array(9).fill(null).map((_, idx) => (
                <div key={`center-${rowIndex}-${idx}`} />
              ))}

              {/* Right tile */}
              <div key={`right-${rowIndex}`} className="flex items-center justify-center">
                <BoardSpace
                  space={rightColumn[rowIndex]}
                  colors={colors}
                  players={getPlayersAtPosition(rightColumn[rowIndex].index)}
                  onClick={() => onPropertyClick(rightColumn[rowIndex])}
                  position="right"
                  terms={terms}
                  currencySymbol={currencySymbol}
                  logos={logos}
                  subTypeColors={subTypeColors}
                  cornerColors={cornerColors}
                  scale={scale}
                />
              </div>
            </React.Fragment>
          ))}

          {/* Unified Center Field - Absolute positioned to cover the 9x9 grid */}
          <div className="absolute pointer-events-none" style={{
            top: `calc(${scaledPadding}px + ${scaledCornerSize}px)`,
            left: `calc(${scaledPadding}px + ${scaledCornerSize}px)`,
            width: `${9 * scaledCardWidth}px`,
            height: `${9 * scaledCardWidth}px`
          }}>
            <div className="relative w-full h-full bg-emerald-700 overflow-hidden rounded-sm shadow-inner">
              {/* High-quality grass texture overlay - vertically oriented */}
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />

              {/* Subtle gradient for depth and realism */}
              <div className="absolute inset-0 bg-gradient-to-b from-emerald-600/30 via-emerald-700/20 to-emerald-800/30"></div>

              {/* Field Lines Component */}
              <FieldLines />

              {/* Dice Roller - positioned in lower center, hidden when purchase prompt is active */}
              {(
                <div
                  className="absolute left-1/2 -translate-x-1/2 pointer-events-auto z-20"
                  style={{
                    bottom: `${Math.max(8, 32 * scale)}px`
                  }}
                >
                  <DiceRoller
                    onRoll={onDiceRoll}
                    onEndTurn={onEndTurn}
                    currentPlayer={players[currentPlayer]}
                    compact={true}
                    isYourTurn={isYourTurn}
                    isEndTurn={isYourTurn ? allowedActions.includes("END_TURN"): false}
                    lastDice={lastDice}
                    scale={scale}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Property Actions Modal - Rendered outside the board */}
          <PropertyActions
            boardSpace={purchasePromptSpace}
            phase={phase}
            isYourTurn={isYourTurn}
            currencySymbol={currencySymbol}
            players={players}
            currentPlayerIndex={currentPlayer}
            boardSpaces={boardSpaces}
            terms={terms}
            onBuy={onBuyProperty}
            onSkip={onSkipProperty}
          />

          {/* Bottom Row */}
          <div className="flex items-center justify-center">
            <BoardSpace
              space={boardSpaces[30]}
              colors={colors}
              players={getPlayersAtPosition(31)}
              onClick={() => onPropertyClick(boardSpaces[30])}
              isCorner={true}
              position="bottom"
              terms={terms}
              currencySymbol={currencySymbol}
              logos={logos}
              subTypeColors={subTypeColors}
              cornerColors={cornerColors}
              scale={scale}
            />
          </div>
          {bottomRow.map((space) => (
            <div key={space.index}>
              <BoardSpace
                space={space}
                colors={colors}
                players={getPlayersAtPosition(space.index)}
                onClick={() => onPropertyClick(space)}
                position="bottom"
                terms={terms}
                currencySymbol={currencySymbol}
                logos={logos}
                subTypeColors={subTypeColors}
                cornerColors={cornerColors}
                scale={scale}
              />
            </div>
          ))}
          <div className="flex items-center justify-center">
            <BoardSpace
              space={boardSpaces[20]}
              colors={colors}
              players={getPlayersAtPosition(21)}
              onClick={() => onPropertyClick(boardSpaces[20])}
              isCorner={true}
              position="bottom"
              terms={terms}
              currencySymbol={currencySymbol}
              logos={logos}
              subTypeColors={subTypeColors}
              cornerColors={cornerColors}
              scale={scale}
            />
          </div>
        </div>
      </div>
    </div>
  );
});
