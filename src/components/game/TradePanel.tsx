import { memo } from 'react';
import { Repeat } from 'lucide-react';

export const TradePanel = memo(function TradePanel() {
  return (
    <div className="bg-slate-800 rounded-lg border-2 border-slate-700 p-3">
      <div className="flex items-center gap-2 mb-3">
        <Repeat className="w-5 h-5 text-purple-400" />
        <h3 className="text-slate-200 text-sm">Trades</h3>
      </div>

      <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded text-sm transition-colors">
        Create Trade
      </button>

      <div className="mt-3 text-slate-500 text-xs text-center py-4">
        No active trades
      </div>
    </div>
  );
});
