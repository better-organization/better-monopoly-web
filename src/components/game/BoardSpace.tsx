import { memo } from 'react';
import { ClubLogo } from './ClubLogo';
import { getSpaceIcon } from '@/utils/getSpaceIcon';
import type {BoardSpace as BoardSpaceType, GameTerms, Player} from '@/types/game';

interface BoardSpaceProps {
  space: BoardSpaceType;
  players: Player[];
  colors: string[];
  onClick: () => void;
  isCorner?: boolean;
  position?: 'top' | 'right' | 'bottom' | 'left';
  terms: GameTerms;
  currencySymbol: string;
  logos?: { [key: string]: string };
  subTypeColors?: { [key: string]: { primary: string; secondary: string; gradient: string; logo: string | null } };
  cornerColors?: { [key: string]: { primary: string; secondary: string; gradient: string; logo: string | null; textColor: string } };
  scale?: number;
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
  cornerColors = {},
  scale = 1
}: {
  space: BoardSpaceType;
  onClick: () => void;
  isCorner?: boolean;
  position?: 'top' | 'right' | 'bottom' | 'left';
  currencySymbol: string;
  logos?: { [key: string]: string };
  subTypeColors?: { [key: string]: { primary: string; secondary: string; gradient: string; logo: string | null } };
  cornerColors?: { [key: string]: { primary: string; secondary: string; gradient: string; logo: string | null; textColor: string } };
  scale?: number;
}) {
  // Get appropriate icon for the space
  const getIcon = () => {
    // Calculate icon size based on scale - allow scaling down to 12px minimum
    // At scale 1.0: iconSize=32px
    // At scale 0.5: iconSize=16px
    // At scale 0.3: iconSize=9.6px -> min 12px
    const iconSize = Math.max(12, Math.round(32 * scale));

    return getSpaceIcon({
      space,
      logos,
      subTypeColors,
      size: iconSize,
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

    // Calculate scaled dimensions
    const cornerSize = 120 * scale;
    const borderWidth = Math.max(1, 2 * scale);
    const padding = 8 * scale;

    // Allow corner text to scale down proportionally
    // At scale 1.0: fontSize=11px, smallFontSize=8px
    // At scale 0.5: fontSize=5.5px, smallFontSize=4px
    const fontSize = Math.max(5, 11 * scale);
    const smallFontSize = Math.max(4, 8 * scale);

    const marginBottom = 8 * scale;
    const marginTop = 4 * scale;

    return (
      <div
        onClick={onClick}
        className="border-2 cursor-pointer hover:shadow-xl transition-all duration-150 flex items-center justify-center relative overflow-hidden rounded-sm"
        style={{
          width: `${cornerSize}px`,
          height: `${cornerSize}px`,
          padding: `${padding}px`,
          borderWidth: `${borderWidth}px`,
          background: cornerTheme
            ? `linear-gradient(to bottom right, ${cornerTheme.primary}, ${cornerTheme.secondary})`
            : 'linear-gradient(to bottom right, rgb(251, 191, 36), rgb(217, 119, 6))',
          borderColor: cornerTheme?.secondary || '#D97706'
        }}
      >
        {/* Decorative corner accent */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>

        <div className="relative z-10 text-center w-full">
          <div className="flex justify-center" style={{ marginBottom: `${marginBottom}px`, color: cornerTheme?.textColor || '#78350F' }}>
            {getIcon()}
          </div>
          <div
            className="uppercase tracking-tight leading-tight"
            style={{
              paddingLeft: `${4 * scale}px`,
              paddingRight: `${4 * scale}px`,
              color: cornerTheme?.textColor || '#78350F',
              fontWeight: '700',
              fontSize: `${fontSize}px`
            }}
          >
            {space.name}
          </div>
          {space.action_details && (
            <div className="leading-tight" style={{ marginTop: `${marginTop}px`, color: cornerTheme?.textColor || '#78350F', opacity: 0.9, fontSize: `${smallFontSize}px` }}>
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

  // Calculate scaled dimensions
  const cardWidth = 70 * scale;
  const cardHeight = 120 * scale;
  const borderWidth = Math.max(1, 2 * scale);
  const headerHeight = `${35}%`; // Keep percentage-based
  const padding = 8 * scale;
  const paddingSmall = 6 * scale;
  const paddingVerySmall = 4 * scale;

  // Font sizes - allow scaling down but with reasonable minimums for very small scales
  // At scale 1.0: price=11px, name=9px
  // At scale 0.5: price=5.5px, name=4.5px (readable on small screens)
  // At scale 0.3: price=3.3px -> min 5px, name=2.7px -> min 4px
  const priceFontSize = Math.max(5, 11 * scale);
  const nameFontSize = Math.max(4, 9 * scale);

  const logoHeight = 48 * scale;
  const marginBottom = 4 * scale;
  const marginTop = 4 * scale;

  // For left/right cards, swap width and height so after rotation they fit correctly
  // Normal cards (top/bottom): 70px wide × 120px tall
  // Left/right cards before rotation: 120px wide × 70px tall → after rotation: 70px wide × 120px tall
  const dimensionStyle = { width: `${cardWidth}px`, height: `${cardHeight}px` };

  // Property tiles with club logos and team colors
  if (isProperty && countryTheme) {
    return (
      <div className={rotationClass} style={dimensionStyle}>
        <div
          onClick={onClick}
          className="w-full h-full bg-gradient-to-b from-white to-gray-50 cursor-pointer hover:shadow-xl transition-all duration-200 flex flex-col relative overflow-hidden rounded-sm"
          style={{
            borderWidth: `${borderWidth}px`,
            borderStyle: 'solid',
            borderColor: countryTheme.secondary
          }}
        >
          {/* Team color header with subtle gradient - increased height for larger logo */}
          <div
            className={`w-full flex items-center justify-center relative overflow-hidden`}
            style={{
              height: headerHeight,
              background: countryTheme
                ? `linear-gradient(to bottom right, ${countryTheme.primary}, ${countryTheme.secondary})`
                : 'linear-gradient(to bottom right, rgb(31, 41, 55), rgb(55, 65, 81))',
              borderBottom: `${borderWidth}px solid ${countryTheme.secondary}`
            }}
          >
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.8),transparent)]"></div>

            {/* Club Logo - height-priority with auto width and vertical padding */}
            <div
              className={`relative z-10 flex items-center justify-center ${contentRotationClass}`}
              style={{
                height: `${logoHeight}px`,
                paddingTop: `${paddingVerySmall}px`,
                paddingBottom: `${paddingVerySmall}px`
              }}
            >
              <ClubLogo clubName={space.name} position={position} style={{ height: '100%', width: 'auto' }} logos={logos} />
            </div>
          </div>

          {/* Content area with high contrast */}
          <div
            className={`flex-1 flex flex-col items-center justify-between bg-white ${contentRotationClass}`}
            style={{
              padding: `${padding}px`,
              paddingTop: `${paddingSmall}px`
            }}
          >
            {position === 'top' ? (
              <>
                {/* Price at top for top row */}
                {price && (
                  <div
                    style={{
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                      fontWeight: '700',
                      fontSize: `${priceFontSize}px`,
                      color: '#000000',
                      marginBottom: `${marginBottom}px`
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
                      fontSize: `${nameFontSize}px`,
                      color: '#111827',
                      paddingLeft: `${paddingVerySmall}px`,
                      paddingRight: `${paddingVerySmall}px`
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
                      fontSize: `${nameFontSize}px`,
                      color: '#111827',
                      paddingLeft: `${paddingVerySmall}px`,
                      paddingRight: `${paddingVerySmall}px`
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
                      fontSize: `${priceFontSize}px`,
                      color: '#000000',
                      marginTop: `${marginTop}px`
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
        className="w-full h-full bg-gradient-to-b from-gray-50 to-white cursor-pointer hover:shadow-lg transition-all duration-150 flex flex-col relative overflow-hidden rounded-sm"
        style={{
          borderWidth: `${borderWidth}px`,
          borderStyle: 'solid',
          borderColor: nonPropertyTheme ? nonPropertyTheme.secondary : 'rgb(156, 163, 175)'
        }}
      >
        {/* Icon header section - uses subTypeColors if available */}
        <div
          className={`w-full flex-shrink-0 flex items-center justify-center ${contentRotationClass}`}
          style={{
            height: headerHeight,
            background: nonPropertyTheme
              ? `linear-gradient(to bottom right, ${nonPropertyTheme.primary}, ${nonPropertyTheme.secondary})`
              : 'linear-gradient(to bottom right, rgb(51, 65, 85), rgb(71, 85, 105))',
            borderBottom: `${borderWidth}px solid ${nonPropertyTheme ? nonPropertyTheme.secondary : 'rgb(156, 163, 175)'}`
          }}
        >
          <div className="text-white">
            {getIcon()}
          </div>
        </div>

        {/* Content area */}
        <div
          className={`flex-1 flex flex-col items-center justify-between ${contentRotationClass}`}
          style={{
            padding: `${paddingSmall}px`,
            paddingTop: `${paddingVerySmall}px`
          }}
        >
          {position === 'top' ? (
            <>
              {/* Price at top for top row */}
              {price && (
                <div
                  style={{
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    fontWeight: '700',
                    fontSize: `${priceFontSize}px`,
                    color: '#000000',
                    marginBottom: `${marginBottom}px`
                  }}
                >
                  {currencySymbol}{price}
                </div>
              )}

              {/* Space name in middle */}
              <div className="flex-1 flex flex-col items-center justify-center w-full">
                <div
                  className="text-center uppercase tracking-tighter leading-tight text-gray-900"
                  style={{
                    paddingLeft: `${2 * scale}px`,
                    paddingRight: `${2 * scale}px`,
                    fontSize: `${nameFontSize}px`
                  }}
                >
                  {space.name}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Normal order for other positions: name, price, players */}
              <div className="flex-1 flex flex-col items-center justify-center w-full">
                <div
                  className="text-center uppercase tracking-tighter leading-tight text-gray-900"
                  style={{
                    paddingLeft: `${2 * scale}px`,
                    paddingRight: `${2 * scale}px`,
                    fontSize: `${nameFontSize}px`
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
                    fontSize: `${priceFontSize}px`,
                    color: '#000000',
                    marginTop: `${marginTop}px`
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
  colors,
  position = 'top',
  isCorner = false,
  scale = 1
}: {
  players: Player[];
  colors: string[]
  position?: 'top' | 'right' | 'bottom' | 'left';
  isCorner?: boolean;
  scale?: number;
}) {
  if (players.length === 0) return null;

  // Counter-rotation for players to keep them upright
  const contentRotationClass =
    position === 'top' ? 'rotate-180' :
    position === 'left' ? '-rotate-90' :
    position === 'right' ? 'rotate-90' :
    '';

  // Responsive player tokens - scale based on board size
  const baseSize = isCorner ? 28 : 22;
  const tokenSize = Math.max(16, baseSize * scale); // Min 16px for touch targets
  const playerSize = { width: `${tokenSize}px`, height: `${tokenSize}px` };
  const gap = `${Math.max(4, (isCorner ? 8 : 6) * scale)}px`;
  const borderWidth = Math.max(1, 2 * scale);

  return (
    <div
      className={`absolute inset-0 pointer-events-none flex items-center justify-center ${contentRotationClass}`}
    >
      <div className="flex justify-center flex-wrap" style={{ gap }}>
        {players.map((player) => (
          <div
            key={player.player_id}
            className="rounded-full border-white shadow-lg"
            style={{
              ...playerSize,
              backgroundColor: colors[player.player_turn],
              borderWidth: `${borderWidth}px`,
              borderStyle: 'solid'
            }}
          />
        ))}
      </div>
    </div>
  );
}

// Main BoardSpace component - wrapper that combines static card and dynamic players
export function BoardSpace({
  space,
  colors,
  players,
  onClick,
  isCorner = false,
  position = 'top',
  terms: _terms,
  currencySymbol,
  logos = {},
  subTypeColors = {},
  cornerColors = {},
  scale = 1
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
        scale={scale}
      />

      {/* Dynamic layer - player positions */}
      <PlayerOverlay
        players={players}
        colors={colors}
        position={position}
        isCorner={isCorner}
        scale={scale}
      />
    </div>
  );
}
