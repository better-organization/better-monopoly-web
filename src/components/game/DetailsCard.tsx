import { X, Home, Building2 } from 'lucide-react';
import { ClubLogo } from './ClubLogo';
import { getSpaceIcon } from '@/utils/getSpaceIcon';
import type { BoardSpace, GameTerms } from '@/types/game';

interface PropertyCardProps {
  property: BoardSpace;
  onClose: () => void;
  terms: GameTerms;
  currencySymbol: string;
  logos?: { [key: string]: string };
  subTypeColors?: { [key: string]: { primary: string; secondary: string; gradient: string; logo: string | null } };
  cornerColors?: { [key: string]: { primary: string; secondary: string; gradient: string; logo: string | null; textColor: string } };
}

export function DetailsCard({
  property,
  onClose,
  terms,
  currencySymbol,
  logos = {},
  subTypeColors = {},
  cornerColors = {}
}: PropertyCardProps) {
  if (!property) return null;

  // Get theme for this property/space
  const theme = property.cell_sub_type ? subTypeColors[property.cell_sub_type] : null;

  // Get corner-specific theme if this is a corner
  const cornerTheme = property.cell_sub_type === 'Corner' ? cornerColors[property.name] : null;

  return (
    <div className="bg-white rounded-xl shadow-2xl border-4 border-amber-500 overflow-hidden" style={{ width: '300px' }}>
      <div className="relative">
        {property.cell_type === 'property' && (
          <div
            className="w-full flex flex-col items-center justify-center relative"
            style={{
              paddingTop: '16px',
              paddingBottom: '16px',
              minHeight: '140px',
              background: theme
                ? `linear-gradient(to bottom right, ${theme.primary}, ${theme.secondary})`
                : 'linear-gradient(to bottom right, rgb(31, 41, 55), rgb(55, 65, 81))'
            }}
          >
            {/* Logo Section - consistent 80x80 for all card types */}
            <div style={{ width: '80px', height: '80px', marginBottom: '12px' }}>
              <ClubLogo clubName={property.name} className="w-full h-full" logos={logos} />
            </div>
            {/* Country Name with Flag Logo */}
            <div className="flex items-center gap-2">
              <div className="text-white text-sm font-semibold">{property.cell_sub_type}</div>
            </div>
          </div>
        )}
        {property.cell_type === 'transport' && (
          <div
            className="w-full flex flex-col items-center justify-center relative"
            style={{
              paddingTop: '16px',
              paddingBottom: '16px',
              minHeight: '140px',
              background: theme
                ? `linear-gradient(to bottom right, ${theme.primary}, ${theme.secondary})`
                : 'linear-gradient(to bottom right, rgb(250, 204, 21), rgb(234, 179, 8))'
            }}
          >
            {/* Logo Section - consistent 80x80 for all card types */}
            <div style={{ width: '80px', height: '80px', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {getSpaceIcon({ space: property, logos, subTypeColors, size: 80})}
            </div>
          </div>
        )}
        {property.cell_type === 'utility' && (
          <div
            className="w-full flex flex-col items-center justify-center relative"
            style={{
              paddingTop: '16px',
              paddingBottom: '16px',
              minHeight: '140px',
              background: theme
                ? `linear-gradient(to bottom right, ${theme.primary}, ${theme.secondary})`
                : 'linear-gradient(to bottom right, rgb(59, 130, 246), rgb(29, 78, 216))'
            }}
          >
            {/* Logo Section - consistent 80x80 for all card types */}
            <div style={{ width: '80px', height: '80px', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {getSpaceIcon({ space: property, logos, subTypeColors, size: 80 })}
            </div>
          </div>
        )}
        {property.cell_type === 'special' && property.cell_sub_type === 'Corner' && (
          <div
            className="w-full flex flex-col items-center justify-center relative"
            style={{
              paddingTop: '16px',
              paddingBottom: '16px',
              minHeight: '140px',
              background: cornerTheme
                ? `linear-gradient(to bottom right, ${cornerTheme.primary}, ${cornerTheme.secondary})`
                : 'linear-gradient(to bottom right, rgb(245, 158, 11), rgb(217, 119, 6))'
            }}
          >
            {/* Logo Section - consistent 80x80 for all card types */}
            <div style={{ width: '80px', height: '80px', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {getSpaceIcon({ space: property, logos, subTypeColors, size: 80})}
            </div>
          </div>
        )}
        {property.cell_type === 'special' && property.cell_sub_type !== 'Corner' && (
          <div
            className="w-full flex flex-col items-center justify-center relative"
            style={{
              paddingTop: '16px',
              paddingBottom: '16px',
              minHeight: '140px',
              background: theme
                ? `linear-gradient(to bottom right, ${theme.primary}, ${theme.secondary})`
                : 'linear-gradient(to bottom right, rgb(239, 68, 68), rgb(220, 38, 38))'
            }}
          >
            {/* Logo Section - consistent 80x80 for all card types */}
            <div style={{ width: '80px', height: '80px', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {getSpaceIcon({ space: property, logos, subTypeColors, size: 80})}
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors border-2 border-amber-600"
        >
          <X className="w-4 h-4 text-amber-700" />
        </button>
      </div>

      <div className="p-6">
        <h3 className="text-center mb-4 text-gray-900">{property.name}</h3>

        {property.cell_type === 'property' && property.property_price && (
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-700">Purchase Price</span>
              <span className="text-green-900">{currencySymbol}{property.property_price}</span>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
              <p className="text-green-900 mb-2">Rent Structure:</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-700">{terms.property_rent}</span>
                  <span className="text-green-900">{currencySymbol}{property.house_rent?.['0']}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 flex items-center gap-1">
                    <Home className="w-3 h-3" /> 1 {terms.house}
                  </span>
                  <span className="text-green-900">{currencySymbol}{property.house_rent?.['1']}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 flex items-center gap-1">
                    <Home className="w-3 h-3" /> 2 {terms.house}s
                  </span>
                  <span className="text-green-900">{currencySymbol}{property.house_rent?.['2']}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 flex items-center gap-1">
                    <Home className="w-3 h-3" /> 3 {terms.house}s
                  </span>
                  <span className="text-green-900">{currencySymbol}{property.house_rent?.['3']}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 flex items-center gap-1">
                    <Home className="w-3 h-3" /> 4 {terms.house}s
                  </span>
                  <span className="text-green-900">{currencySymbol}{property.house_rent?.['4']}</span>
                </div>
                <div className="flex justify-between border-t border-green-300 pt-1 mt-1">
                  <span className="text-green-900 flex items-center gap-1">
                    <Building2 className="w-3 h-3" /> {terms.hotel}
                  </span>
                  <span className="text-green-900">{currencySymbol}{property.house_rent?.['5']}</span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-3 rounded-lg border-2 border-yellow-300">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">{terms.house} Cost</span>
                <span className="text-gray-900">{currencySymbol}{property.house_price}</span>
              </div>
            </div>

            <div className="flex justify-between py-2">
              <span className="text-gray-700">{terms.mortgage} Value </span>
              <span className="text-green-900">{currencySymbol}{Math.floor(property.property_price * 0.5)}</span>
            </div>
          </div>
        )}

        {property.cell_type === 'transport' && property.transport_price && (
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-700">Purchase Price</span>
              <span className="text-green-900">{currencySymbol}{property.transport_price}</span>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-300">
              <p className="text-green-900 mb-2">{terms.transport_rent}:</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-700">1 {terms.transport}</span>
                  <span className="text-green-900">{currencySymbol}{property.transport_rent?.['1']}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">2 {terms.transport}s</span>
                  <span className="text-green-900">{currencySymbol}{property.transport_rent?.['2']}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">3 {terms.transport}s</span>
                  <span className="text-green-900">{currencySymbol}{property.transport_rent?.['3']}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">4 {terms.transport}s</span>
                  <span className="text-green-900">{currencySymbol}{property.transport_rent?.['4']}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {property.cell_type === 'utility' && property.utility_price && (
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-700">Purchase Price</span>
              <span className="text-green-900">{currencySymbol}{property.utility_price}</span>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg text-sm text-gray-700 border-2 border-blue-300">
              <p className="mb-2">If one {terms.utility} is owned, rent is {property.utility_rent_multiplier?.['1']} times the dice roll.</p>
              <p>If both {terms.utility}s are owned, rent is {property.utility_rent_multiplier?.['2']} times the dice roll.</p>
            </div>
          </div>
        )}

        {property.cell_type === 'special' && (
          <div className="space-y-3">
            {property.property_price && (
              <>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-700">Tax Amount</span>
                  <span className="text-red-600">{currencySymbol}{property.property_price}</span>
                </div>
                <div className="text-sm text-gray-700 text-center bg-red-50 p-3 rounded-lg border-2 border-red-300">
                  Pay {currencySymbol}{property.property_price} to the bank
                </div>
              </>
            )}
            {property.action_details && !property.property_price && (
              <div className="text-sm text-gray-700 text-center py-4 bg-amber-50 rounded-lg border-2 border-amber-200">
                {property.action_details}
              </div>
            )}
          </div>
        )}

        {property.cell_type === 'special' && ["Chance", "Community Chest"].includes(property.cell_sub_type) && (
          <div className="text-sm text-gray-700 text-center py-4 bg-yellow-50 rounded-lg border-2 border-yellow-300">
            Draw a card and follow the instructions
          </div>
        )}
      </div>
    </div>
  );
}
