import React from 'react';
import { BoardSpace } from './BoardSpace';
import { DiceRoller } from './DiceRoller';
import { FieldLines } from './FieldLines';
import type { Player, BoardSpace as BoardSpaceType, GameTerms } from '@/types/game';

// Card dimensions in pixels
// Cards: 70px × 120px (width × height)
// Corners: 120px × 120px (square, same as card height)
// Left/Right cards are rotated 90°, so their width (70px) becomes the vertical dimension
const CORNER_SIZE = 120;  // Corner size in pixels (120×120 square)
const CARD_WIDTH = 70;   // Card width in pixels

// Board size calculation: CORNER + (9 × CARD_WIDTH) + CORNER = 120 + 630 + 120 = 870px
const BOARD_SIZE = CORNER_SIZE + (9 * CARD_WIDTH) + CORNER_SIZE + 25;  // 870px

interface MonopolyBoardProps {
  onPropertyClick: (property: BoardSpaceType) => void;
  players: Player[];
  terms: GameTerms;
  currencySymbol: string;
  onDiceRoll: (total: number) => void;
  currentPlayer: number;
  boardSpaces: BoardSpaceType[];
  logos: { [key: string]: string };
  subTypeColors: { [key: string]: { primary: string; secondary: string; gradient: string; logo: string | null } };
  cornerColors: { [key: string]: { primary: string; secondary: string; gradient: string; logo: string | null; textColor: string } };
}

export function MonopolyBoard({
  onPropertyClick,
  players,
  terms,
  currencySymbol,
  onDiceRoll,
  currentPlayer,
  boardSpaces,
  logos,
  subTypeColors,
  cornerColors
}: MonopolyBoardProps) {
  if (boardSpaces.length !== 40) {
    return <div>empty board</div>
  }
  const getPlayersAtPosition = (positionIndex: number) => {
    return players.filter(p => p.position === positionIndex);
  };

  // Arrange spaces in board layout (clockwise from top left)
  // Index 1 = top-left corner, indices 2-10 = top row, index 11 = top-right corner
  const topRow = boardSpaces.slice(1, 10); // indices 2-10
  const rightColumn = boardSpaces.slice(11, 20); // indices 12-20
  const bottomRow = boardSpaces.slice(21, 30).reverse(); // indices 30-22
  const leftColumn = boardSpaces.slice(31, 40).reverse(); // indices 40-32

  // Board dimensions calculation:
  // Width: CORNER + (9 × CARD_WIDTH) + CORNER = 120 + 630 + 120 = 870
  // Height: CORNER + (9 × CARD_WIDTH [rotated left/right cards]) + CORNER = 120 + 630 + 120 = 870
  // Board is SQUARE because left/right cards are rotated 90°

  return (
    <div
      className="flex items-center justify-center"
      style={{
        width: `${BOARD_SIZE}px`,
        height: `${BOARD_SIZE}px`
      }}
    >
      {/* Fixed Square Board - 870px × 870px */}
      <div className="w-full h-full bg-gradient-to-br from-green-700 via-green-800 to-green-900 border-[6px] border-amber-500 shadow-2xl rounded-lg">
        <div className="grid gap-0 w-full h-full p-1.5 relative" style={{
          gridTemplateColumns: `${CORNER_SIZE}px ${Array(9).fill(`${CARD_WIDTH}px`).join(' ')} ${CORNER_SIZE}px`,
          gridTemplateRows: `${CORNER_SIZE}px ${Array(9).fill(`${CARD_WIDTH}px`).join(' ')} ${CORNER_SIZE}px`
        }}>
          {/* Top Row */}
          <div className="flex items-center justify-center">
            <BoardSpace
              space={boardSpaces[0]}
              players={getPlayersAtPosition(1)}
              onClick={() => onPropertyClick(boardSpaces[0])}
              isCorner={true}
              position="top"
              terms={terms}
              currencySymbol={currencySymbol}
              logos={logos}
              subTypeColors={subTypeColors}
              cornerColors={cornerColors}
            />
          </div>
          {topRow.map((space) => (
            <div key={space.index}>
              <BoardSpace
                space={space}
                players={getPlayersAtPosition(space.index)}
                onClick={() => onPropertyClick(space)}
                position="top"
                terms={terms}
                currencySymbol={currencySymbol}
                logos={logos}
                subTypeColors={subTypeColors}
                cornerColors={cornerColors}
              />
            </div>
          ))}
          <div className="flex items-center justify-center">
            <BoardSpace
              space={boardSpaces[10]}
              players={getPlayersAtPosition(11)}
              onClick={() => onPropertyClick(boardSpaces[10])}
              isCorner={true}
              position="top"
              terms={terms}
              currencySymbol={currencySymbol}
              logos={logos}
              subTypeColors={subTypeColors}
              cornerColors={cornerColors}
            />
          </div>

          {/* Middle 9 Rows */}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((rowIndex) => (
            <React.Fragment key={`row-${rowIndex}`}>
              {/* Left tile */}
              <div key={`left-${rowIndex}`} className="flex items-center justify-center">
                <BoardSpace
                  space={leftColumn[rowIndex]}
                  players={getPlayersAtPosition(leftColumn[rowIndex].index)}
                  onClick={() => onPropertyClick(leftColumn[rowIndex])}
                  position="left"
                  terms={terms}
                  currencySymbol={currencySymbol}
                  logos={logos}
                  subTypeColors={subTypeColors}
                  cornerColors={cornerColors}
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
                  players={getPlayersAtPosition(rightColumn[rowIndex].index)}
                  onClick={() => onPropertyClick(rightColumn[rowIndex])}
                  position="right"
                  terms={terms}
                  currencySymbol={currencySymbol}
                  logos={logos}
                  subTypeColors={subTypeColors}
                  cornerColors={cornerColors}
                />
              </div>
            </React.Fragment>
          ))}

          {/* Unified Center Field - Absolute positioned to cover the 9x9 grid */}
          <div className="absolute pointer-events-none" style={{
            top: `calc(6px + ${CORNER_SIZE}px)`,
            left: `calc(6px + ${CORNER_SIZE}px)`,
            width: `${9 * CARD_WIDTH}px`,
            height: `${9 * CARD_WIDTH}px`
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

              {/* Dice Roller - positioned in lower center */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-auto z-20">
                <div className="shadow-[0_12px_24px_rgba(0,0,0,0.6)]">
                  <DiceRoller
                    onRoll={onDiceRoll}
                    currentPlayer={players[currentPlayer]}
                    compact={true}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="flex items-center justify-center">
            <BoardSpace
              space={boardSpaces[30]}
              players={getPlayersAtPosition(31)}
              onClick={() => onPropertyClick(boardSpaces[30])}
              isCorner={true}
              position="bottom"
              terms={terms}
              currencySymbol={currencySymbol}
              logos={logos}
              subTypeColors={subTypeColors}
              cornerColors={cornerColors}
            />
          </div>
          {bottomRow.map((space) => (
            <div key={space.index}>
              <BoardSpace
                space={space}
                players={getPlayersAtPosition(space.index)}
                onClick={() => onPropertyClick(space)}
                position="bottom"
                terms={terms}
                currencySymbol={currencySymbol}
                logos={logos}
                subTypeColors={subTypeColors}
                cornerColors={cornerColors}
              />
            </div>
          ))}
          <div className="flex items-center justify-center">
            <BoardSpace
              space={boardSpaces[20]}
              players={getPlayersAtPosition(21)}
              onClick={() => onPropertyClick(boardSpaces[20])}
              isCorner={true}
              position="bottom"
              terms={terms}
              currencySymbol={currencySymbol}
              logos={logos}
              subTypeColors={subTypeColors}
              cornerColors={cornerColors}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
