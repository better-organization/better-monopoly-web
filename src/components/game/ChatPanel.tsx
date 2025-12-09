import { memo } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import { useState } from 'react';

export const ChatPanel = memo(function ChatPanel() {
  const [message, setMessage] = useState('');

  return (
    <div className="bg-slate-800 rounded-lg border-2 border-slate-700 h-[calc(100vh-2rem)] flex flex-col">
      <div className="p-3 border-b border-slate-700 flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-blue-400" />
        <h3 className="text-slate-200 text-sm">Chat</h3>
      </div>

      <div className="flex-1 p-3 overflow-y-auto">
        <div className="text-slate-500 text-xs text-center py-8">
          No messages yet
        </div>
      </div>

      <div className="p-3 border-t border-slate-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Say something..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <button className="bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded transition-colors">
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
});
