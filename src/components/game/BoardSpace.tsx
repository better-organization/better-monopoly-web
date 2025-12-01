import { memo } from 'react';
import { ClubLogo } from './ClubLogo';
import { getSpaceIcon } from '@/utils/getSpaceIcon';
import type { BoardSpace as BoardSpaceType, GameTerms } from '@/types/game';

interface Player {
  id: number;
  color: string;
}

interface BoardSpaceProps {
  space: BoardSpaceType;
  players: Player[];
  onClick: () => void;
  isCorner?: boolean;
  position?: 'top' | 'right' | 'bottom' | 'left';
  terms: GameTerms;
  currencySymbol: string;
  logos?: { [key: string]: string };
  subTypeColors?: { [key: string]: { primary: string; secondary: string; gradient: string; logo: string | null } };
  cornerColors?: { [key: string]: { primary: string; secondary: string; gradient: string; logo: string | null; textColor: string } };
}

// Static card component - only renders the space itself, not players
// Memoized to prevent re-renders when only player positions change
export const BoardSpaceCard = memo(function BoardSpaceCard({
  space,
  onClick,
  isCorner = false,
  position = 'top',
  currencySymbol,
  logos = {},
  subTypeColors = {},
  cornerColors = {}
}: {
  space: BoardSpaceType;
  onClick: () => void;
  isCorner?: boolean;
  position?: 'top' | 'right' | 'bottom' | 'left';
  currencySymbol: string;
  logos?: { [key: string]: string };
  subTypeColors?: { [key: string]: { primary: string; secondary: string; gradient: string; logo: string | null } };
  cornerColors?: { [key: string]: { primary: string; secondary: string; gradient: string; logo: string | null; textColor: string } };
}) {
  const getIcon = () => {
    return getSpaceIcon({
      space,
      logos,
      subTypeColors,
      size: 32,
      invertColor: !isCorner && space.cell_type !== 'property'
    });
  };

  // Get price for display
  const getPrice = () => {
    // Property price
    if (space.property_price) return space.property_price;
    // Transport price
    if (space.transport_price) return space.transport_price;
    // Utility price
    if (space.utility_price) return space.utility_price;
    // Special/tax cost (stored in property_price for special cells)
    if (space.cell_type === 'special' && space.action_details) return space.action_details;
    return null;
  };

  const price = getPrice();
  const isProperty = space.cell_type === 'property';
  const countryTheme = isProperty && space.cell_sub_type ? subTypeColors[space.cell_sub_type] : null;

  // Corner spaces
  if (isCorner) {
    // Get individual corner configuration
    const cornerTheme = cornerColors[space.name];

    return (
      <div
        onClick={onClick}
        className="border-2 cursor-pointer hover:shadow-xl transition-all duration-150 flex items-center justify-center relative overflow-hidden rounded-sm"
        style={{
          width: '120px',
          height: '120px',
          padding: '8px',
          background: cornerTheme
            ? `linear-gradient(to bottom right, ${cornerTheme.primary}, ${cornerTheme.secondary})`
            : 'linear-gradient(to bottom right, rgb(251, 191, 36), rgb(217, 119, 6))',
          borderColor: cornerTheme?.secondary || '#D97706'
        }}
      >
        {/* Decorative corner accent */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>

        <div className="relative z-10 text-center w-full">
          <div className="flex justify-center" style={{ marginBottom: '8px', color: cornerTheme?.textColor || '#78350F' }}>
            {getIcon()}
          </div>
          <div
            className="uppercase tracking-tight leading-tight text-[11px]"
            style={{
              paddingLeft: '4px',
              paddingRight: '4px',
              color: cornerTheme?.textColor || '#78350F',
              fontWeight: '700'
            }}
          >
            {space.name}
          </div>
          {space.action_details && (
            <div className="text-[8px] leading-tight" style={{ marginTop: '4px', color: cornerTheme?.textColor || '#78350F', opacity: 0.9 }}>
              {space.action_details}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Rotation for all cards to face their respective side of the board
  // Top: 180° (card faces downward), Bottom: 0° (card faces upward)
  // Left: 90° (sideways for players on left), Right: -90° (sideways for players on right)
  const rotationClass =
    position === 'top' ? 'rotate-180' :
    position === 'left' ? 'rotate-90' :
    position === 'right' ? '-rotate-90' :
    ''; // bottom has no rotation

  // Counter-rotation for individual items inside the card so they face upright
  const contentRotationClass =
    position === 'top' ? 'rotate-180' :
    ''; // bottom has no counter-rotation

  // For left/right cards, swap width and height so after rotation they fit correctly
  // Normal cards (top/bottom): 70px wide × 120px tall
  // Left/right cards before rotation: 120px wide × 70px tall → after rotation: 70px wide × 120px tall
  const dimensionStyle = { width: '70px', height: '120px' };

  // Property tiles with club logos and team colors
  if (isProperty && countryTheme) {
    return (
      <div className={rotationClass} style={dimensionStyle}>
        <div
          onClick={onClick}
          className="w-full h-full bg-gradient-to-b from-white to-gray-50 border-2 cursor-pointer hover:shadow-xl transition-all duration-200 flex flex-col relative overflow-hidden rounded-sm"
          style={{
            borderColor: countryTheme.secondary
          }}
        >
          {/* Team color header with subtle gradient - increased height for larger logo */}
          <div
            className={`w-full h-[35%] flex items-center justify-center relative overflow-hidden`}
            style={{
              background: countryTheme
                ? `linear-gradient(to bottom right, ${countryTheme.primary}, ${countryTheme.secondary})`
                : 'linear-gradient(to bottom right, rgb(31, 41, 55), rgb(55, 65, 81))',
              borderBottom: `2px solid ${countryTheme.secondary}`
            }}
          >
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.8),transparent)]"></div>

            {/* Club Logo - height-priority with auto width and vertical padding */}
            <div className={`relative z-10 flex items-center justify-center ${contentRotationClass}`} style={{ height: '48px', paddingTop: '4px', paddingBottom: '4px' }}>
              <ClubLogo clubName={space.name} position={position} style={{ height: '100%', width: 'auto' }} logos={logos} />
            </div>
          </div>

          {/* Content area with high contrast */}
          <div className={`flex-1 flex flex-col items-center justify-between bg-white ${contentRotationClass}`} style={{ padding: '8px', paddingTop: '6px' }}>
            {position === 'top' ? (
              <>
                {/* Price at top for top row */}
                {price && (
                  <div
                    style={{
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                      fontWeight: '700',
                      fontSize: '11px',
                      color: countryTheme.primary,
                      marginBottom: '4px'
                    }}
                  >
                    {currencySymbol}{price}
                  </div>
                )}

                {/* Club name in middle */}
                <div className="flex-1 flex items-center justify-center w-full">
                  <div
                    className="text-center uppercase tracking-tight leading-tight"
                    style={{
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                      fontWeight: '700',
                      fontSize: '9px',
                      color: '#111827',
                      paddingLeft: '4px',
                      paddingRight: '4px'
                    }}
                  >
                    {space.name}
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Normal order for other positions: name, price, players */}
                <div className="flex-1 flex items-center justify-center w-full">
                  <div
                    className="text-center uppercase tracking-tight leading-tight"
                    style={{
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                      fontWeight: '700',
                      fontSize: '9px',
                      color: '#111827',
                      paddingLeft: '4px',
                      paddingRight: '4px'
                    }}
                  >
                    {space.name}
                  </div>
                </div>

                {price && (
                  <div
                    style={{
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                      fontWeight: '700',
                      fontSize: '11px',
                      color: countryTheme.primary,
                      marginTop: '4px'
                    }}
                  >
                    {currencySymbol}{price}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Non-property tiles (Transport, Utility, Special, Card)
  // Get theme for non-property spaces
  const nonPropertyTheme = space.cell_sub_type ? subTypeColors[space.cell_sub_type] : null;

  return (
    <div className={rotationClass} style={dimensionStyle}>
      <div
        onClick={onClick}
        className="w-full h-full bg-gradient-to-b from-gray-50 to-white border-2 cursor-pointer hover:shadow-lg transition-all duration-150 flex flex-col relative overflow-hidden rounded-sm"
        style={{
          borderColor: nonPropertyTheme ? nonPropertyTheme.secondary : 'rgb(156, 163, 175)'
        }}
      >
        {/* Icon header section - uses subTypeColors if available */}
        <div
          className={`w-full h-[35%] flex-shrink-0 flex items-center justify-center border-b-2 ${contentRotationClass}`}
          style={{
            background: nonPropertyTheme
              ? `linear-gradient(to bottom right, ${nonPropertyTheme.primary}, ${nonPropertyTheme.secondary})`
              : 'linear-gradient(to bottom right, rgb(51, 65, 85), rgb(71, 85, 105))',
            borderColor: nonPropertyTheme ? nonPropertyTheme.secondary : 'rgb(156, 163, 175)'
          }}
        >
          <div className="text-white">
            {getIcon()}
          </div>
        </div>

        {/* Content area */}
        <div className={`flex-1 flex flex-col items-center justify-between ${contentRotationClass}`} style={{ padding: '6px', paddingTop: '4px' }}>
          {position === 'top' ? (
            <>
              {/* Price at top for top row */}
              {price && (
                <div
                  style={{
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    fontWeight: '700',
                    fontSize: '11px',
                    color: space.action_keyword === 'tax' ? '#B91C1C' : '#166534',
                    marginBottom: '4px'
                  }}
                >
                  {currencySymbol}{price}
                </div>
              )}

              {/* Space name in middle */}
              <div className="flex-1 flex flex-col items-center justify-center w-full">
                <div className="text-center uppercase tracking-tighter leading-tight text-[9px] text-gray-900" style={{ paddingLeft: '2px', paddingRight: '2px' }}>
                  {space.name}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Normal order for other positions: name, price, players */}
              <div className="flex-1 flex flex-col items-center justify-center w-full">
                <div className="text-center uppercase tracking-tighter leading-tight text-[9px] text-gray-900" style={{ paddingLeft: '2px', paddingRight: '2px' }}>
                  {space.name}
                </div>
              </div>

              {price && (
                <div
                  style={{
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    fontWeight: '700',
                    fontSize: '11px',
                    color: space.action_keyword === 'tax' ? '#B91C1C' : '#166534',
                    marginTop: '4px'
                  }}
                >
                  {currencySymbol}{price}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
});

// Dynamic player overlay component - only re-renders when players change
export function PlayerOverlay({
  players,
  position = 'top',
  isCorner = false
}: {
  players: Player[];
  position?: 'top' | 'right' | 'bottom' | 'left';
  isCorner?: boolean;
}) {
  if (players.length === 0) return null;

  // Counter-rotation for players to keep them upright
  const contentRotationClass =
    position === 'top' ? 'rotate-180' :
    position === 'left' ? '-rotate-90' :
    position === 'right' ? 'rotate-90' :
    '';

  // Bigger player tokens - increased for better visibility
  const playerSize = isCorner ? { width: '28px', height: '28px' } : { width: '22px', height: '22px' };
  const gap = isCorner ? '8px' : '6px';

  return (
    <div
      className={`absolute inset-0 pointer-events-none flex items-center justify-center ${contentRotationClass}`}
    >
      <div className="flex justify-center flex-wrap" style={{ gap }}>
        {players.map((player) => (
          <div
            key={player.id}
            className="rounded-full border-2 border-white shadow-lg"
            style={{ ...playerSize, backgroundColor: player.color }}
          />
        ))}
      </div>
    </div>
  );
}

// Main BoardSpace component - wrapper that combines static card and dynamic players
export function BoardSpace({
  space,
  players,
  onClick,
  isCorner = false,
  position = 'top',
  terms: _terms,
  currencySymbol,
  logos = {},
  subTypeColors = {},
  cornerColors = {}
}: BoardSpaceProps) {
  return (
    <div className="relative" id={`board-space-${space.index}`}>
      {/* Static layer - board space card */}
      <BoardSpaceCard
        space={space}
        onClick={onClick}
        isCorner={isCorner}
        position={position}
        currencySymbol={currencySymbol}
        logos={logos}
        subTypeColors={subTypeColors}
        cornerColors={cornerColors}
      />

      {/* Dynamic layer - player positions */}
      <PlayerOverlay
        players={players}
        position={position}
        isCorner={isCorner}
      />
    </div>
  );
}
