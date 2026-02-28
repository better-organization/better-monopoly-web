import { memo } from 'react';
import { Building2, Home, Building, Plus, Minus } from 'lucide-react';
import type { Player, BoardSpace, GameTerms } from '@/types/game';

interface PropertiesPanelProps {
  players: Player[];
  currentPlayer?: number;
  ownedProperties?: number[]; // Array of board space indices
  logos?: { [key: string]: string };
  subTypeColors?: { [key: string]: { primary: string; secondary: string; gradient: string; logo: string | null } };
  boardSpaces?: BoardSpace[];
  terms?: GameTerms;
  currencySymbol?: string;
}

interface PropertyItemProps {
  property: BoardSpace;
  onClick: () => void;
  type: 'property' | 'transport' | 'utility';
  countryColor?: string;
  currencySymbol: string;
  developmentLevel?: number;
  onUpgrade?: () => void;
  onDowngrade?: () => void;
  terms: GameTerms;
  playerMoney?: number;
  collectionCount?: number;
  totalInCollection?: number;
}

function PropertyItem({
  property,
  onClick,
  type,
  countryColor,
  currencySymbol,
  developmentLevel = 0,
  onUpgrade,
  onDowngrade,
  terms,
  playerMoney = 0,
  collectionCount = 0,
  totalInCollection = 0
}: PropertyItemProps) {
  const getBaseRent = () => {
    if (type === 'property' && property.house_rent) {
      return property.house_rent[developmentLevel?.toString() || '0'] || 0;
    }
    if (type === 'transport' && property.transport_rent) {
      return property.transport_rent[collectionCount?.toString() || '1'] || 0;
    }
    if (type === 'utility' && property.utility_rent_multiplier) {
      return `${property.utility_rent_multiplier[collectionCount?.toString() || '1'] || 0}x`;
    }
    return 0;
  };

  const getBuildingCost = () => {
    return property.house_price || 0;
  };

  const canUpgrade = () => {
    return false; // Disabled for now
  };

  const canDowngrade = () => {
    return false; // Disabled for now
  };

  const getTypeConfig = () => {
    switch (type) {
      case 'property':
        return {
          bgColor: 'bg-gradient-to-br from-green-900/70 to-green-950/70',
          borderColor: 'border-green-700/60',
          hoverBg: 'hover:from-green-800/80 hover:to-green-900/80',
          accentGradient: countryColor
            ? `linear-gradient(135deg, ${countryColor}ee, ${countryColor}99)`
            : 'linear-gradient(135deg, #059669, #047857)'
        };
      case 'transport':
        return {
          bgColor: 'bg-gradient-to-br from-yellow-900/70 to-yellow-950/70',
          borderColor: 'border-yellow-700/60',
          hoverBg: 'hover:from-yellow-800/80 hover:to-yellow-900/80',
          accentGradient: 'linear-gradient(135deg, #facc15, #eab308)'
        };
      case 'utility':
        return {
          bgColor: 'bg-gradient-to-br from-blue-900/70 to-blue-950/70',
          borderColor: 'border-blue-700/60',
          hoverBg: 'hover:from-blue-800/80 hover:to-blue-900/80',
          accentGradient: 'linear-gradient(135deg, #3b82f6, #2563eb)'
        };
    }
  };

  const config = getTypeConfig();

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className={`w-full ${config.bgColor} ${config.borderColor} border-l-4 rounded-lg overflow-hidden relative shadow-md hover:shadow-lg transition-all ${config.hoverBg} group backdrop-blur-sm px-2 py-1.5 text-left cursor-pointer`}
    >
      {/* Gradient accent overlay */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 z-10 opacity-90"
        style={{ background: config.accentGradient }}
      />

      {/* Line 1: Property name and Rent */}
      <div className="flex items-center justify-between gap-2 mb-1">
        <h5 className="text-white text-[10px] truncate group-hover:text-green-300 transition-colors font-medium flex-1">
          {property.name}
        </h5>
        <div className="bg-black/30 px-1.5 py-0.5 rounded backdrop-blur-sm">
          <span className="text-yellow-300 font-semibold text-[9px] whitespace-nowrap">
            {currencySymbol}{typeof getBaseRent() === 'number' ? getBaseRent() : getBaseRent()}
          </span>
        </div>
      </div>

      {/* Line 2: Build cost, Development indicators, and +/- buttons */}
      <div className="flex items-center justify-between gap-2">
        {/* Left side: Build cost or collection status */}
        {type === 'property' ? (
          <div className="flex items-center gap-1">
            <span className="text-[8px] text-slate-400">Build:</span>
            <span className="text-[9px] text-yellow-300 font-bold">{currencySymbol}{getBuildingCost()}</span>
          </div>
        ) : (
          <span className="text-[8px] text-slate-400">
            {collectionCount}/{totalInCollection} owned
          </span>
        )}

        {/* Middle: Development/Collection indicator */}
        {type === 'property' && (
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => {
              const isBuilt = i < developmentLevel;
              const isAcademy = developmentLevel === 5 && i === 4;

              if (isAcademy) {
                return <Building key={i} className="w-2.5 h-2.5 text-yellow-400 drop-shadow-md" fill="currentColor" />;
              }

              return (
                <Home
                  key={i}
                  className={`w-2 h-2 ${isBuilt ? 'text-green-400 drop-shadow-md' : 'text-slate-700'}`}
                  fill="currentColor"
                />
              );
            })}
          </div>
        )}

        {(type === 'transport' || type === 'utility') && (
          <div className="flex items-center gap-0.5">
            {[...Array(totalInCollection)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full shadow-sm ${
                  i < collectionCount 
                    ? type === 'transport' ? 'bg-yellow-400 ring-1 ring-yellow-300' : 'bg-blue-400 ring-1 ring-blue-300'
                    : 'bg-slate-700'
                }`}
              />
            ))}
          </div>
        )}

        {/* Right side: +/- buttons for properties only */}
        {type === 'property' ? (
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDowngrade?.();
              }}
              disabled={!canDowngrade()}
              className={`w-5 h-5 rounded flex items-center justify-center transition-all shadow-sm ${
                canDowngrade()
                  ? 'bg-gradient-to-br from-red-900/80 to-red-950/80 hover:from-red-800 hover:to-red-900 text-red-300 border border-red-700/60 hover:shadow-md'
                  : 'bg-slate-800/50 text-slate-600 cursor-not-allowed border border-slate-700/30'
              }`}
            >
              <Minus className="w-2.5 h-2.5" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onUpgrade?.();
              }}
              disabled={!canUpgrade()}
              className={`w-5 h-5 rounded flex items-center justify-center transition-all shadow-sm ${
                canUpgrade()
                  ? 'bg-gradient-to-br from-green-900/80 to-green-950/80 hover:from-green-800 hover:to-green-900 text-green-300 border border-green-700/60 hover:shadow-md'
                  : 'bg-slate-800/50 text-slate-600 cursor-not-allowed border border-slate-700/30'
              }`}
            >
              <Plus className="w-2.5 h-2.5" />
            </button>
          </div>
        ) : (
          <div className="w-[46px]" /> // Spacer to maintain alignment
        )}
      </div>
    </div>
  );
}

export const PropertiesPanel = memo(function PropertiesPanel({
  players,
  currentPlayer,
  boardSpaces = [],
  terms,
  currencySymbol = '€',
  subTypeColors = {}
}: PropertiesPanelProps) {
  // Get current player's owned properties
  const player = currentPlayer !== undefined ? players[currentPlayer] : null;

  if (!player || !terms) {
    return (
      <div className="bg-slate-800 rounded-lg border-2 border-slate-700 p-3 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <Building2 className="w-5 h-5 text-green-400" />
          <h3 className="text-slate-200 text-sm">My Properties (0)</h3>
        </div>

        <div className="flex-1 text-slate-500 text-xs text-center py-4">
          No properties owned yet
        </div>
      </div>
    );
  }

  // Find all owned properties, transports, and utilities
  const ownedProperties = boardSpaces.filter(space =>
    player.property_owns.includes(space.index)
  );
  const ownedTransports = boardSpaces.filter(space =>
    player.transport_owns.includes(space.index)
  );
  const ownedUtilities = boardSpaces.filter(space =>
    player.utility_owns.includes(space.index)
  );

  const totalOwned = ownedProperties.length + ownedTransports.length + ownedUtilities.length;

  // Calculate collection counts for transports and utilities
  const totalTransports = boardSpaces.filter(space => space.cell_type === 'transport').length;
  const totalUtilities = boardSpaces.filter(space => space.cell_type === 'utility').length;

  const handlePropertyClick = (property: BoardSpace) => {
    // TODO: Show property details modal
    console.log('Property clicked:', property);
  };

  return (
    <div className="bg-slate-800 rounded-lg border-2 border-slate-700 p-3 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <Building2 className="w-5 h-5 text-green-400" />
        <h3 className="text-slate-200 text-sm">My Properties ({totalOwned})</h3>
      </div>

      {totalOwned === 0 ? (
        <div className="flex-1 text-slate-500 text-xs text-center py-4">
          No properties owned yet
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-2">
          {/* Properties */}
          {ownedProperties.length > 0 && (
            <div className="space-y-1.5">
              <h4 className="text-slate-400 text-[10px] font-semibold uppercase tracking-wide px-1">
                {terms.property}s ({ownedProperties.length})
              </h4>
              {ownedProperties.map((property) => {
                const countryColor = subTypeColors[property.cell_sub_type]?.primary;
                return (
                  <PropertyItem
                    key={property.index}
                    property={property}
                    onClick={() => handlePropertyClick(property)}
                    type="property"
                    countryColor={countryColor}
                    currencySymbol={currencySymbol}
                    developmentLevel={0} // TODO: Track development levels
                    terms={terms}
                    playerMoney={player.player_money}
                  />
                );
              })}
            </div>
          )}

          {/* Transports */}
          {ownedTransports.length > 0 && (
            <div className="space-y-1.5">
              <h4 className="text-slate-400 text-[10px] font-semibold uppercase tracking-wide px-1">
                {terms.transport}s ({ownedTransports.length})
              </h4>
              {ownedTransports.map((transport) => (
                <PropertyItem
                  key={transport.index}
                  property={transport}
                  onClick={() => handlePropertyClick(transport)}
                  type="transport"
                  currencySymbol={currencySymbol}
                  terms={terms}
                  playerMoney={player.player_money}
                  collectionCount={ownedTransports.length}
                  totalInCollection={totalTransports}
                />
              ))}
            </div>
          )}

          {/* Utilities */}
          {ownedUtilities.length > 0 && (
            <div className="space-y-1.5">
              <h4 className="text-slate-400 text-[10px] font-semibold uppercase tracking-wide px-1">
                {terms.utility}s ({ownedUtilities.length})
              </h4>
              {ownedUtilities.map((utility) => (
                <PropertyItem
                  key={utility.index}
                  property={utility}
                  onClick={() => handlePropertyClick(utility)}
                  type="utility"
                  currencySymbol={currencySymbol}
                  terms={terms}
                  playerMoney={player.player_money}
                  collectionCount={ownedUtilities.length}
                  totalInCollection={totalUtilities}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
});
