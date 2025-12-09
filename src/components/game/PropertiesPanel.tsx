import { memo } from 'react';
import { Building2 } from 'lucide-react';
import type { Player } from '@/types/game';

interface PropertiesPanelProps {
  players: Player[];
  currentPlayer?: number;
  ownedProperties?: number[]; // Array of board space indices
  logos?: { [key: string]: string };
  subTypeColors?: { [key: string]: { primary: string; secondary: string; gradient: string; logo: string | null } };
}

export const PropertiesPanel = memo(function PropertiesPanel({}: PropertiesPanelProps) {
  return (
    <div className="bg-slate-800 rounded-lg border-2 border-slate-700 p-3">
      <div className="flex items-center gap-2 mb-3">
        <Building2 className="w-5 h-5 text-green-400" />
        <h3 className="text-slate-200 text-sm">My Properties (0)</h3>
      </div>

      <div className="text-slate-500 text-xs text-center py-4">
        No properties owned yet
      </div>
    </div>
  );
});
