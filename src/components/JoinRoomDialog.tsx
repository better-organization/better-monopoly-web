"use client";

import { useState } from "react";

interface JoinRoomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJoinRoom: (roomCode: string) => void;
}

export function JoinRoomDialog({
  open,
  onOpenChange,
  onJoinRoom,
}: JoinRoomDialogProps) {
  const [roomCode, setRoomCode] = useState("");
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onOpenChange(false);
      setIsClosing(false);
      setRoomCode("");
    }, 200);
  };

  const handleJoin = () => {
    if (roomCode.trim()) {
      onJoinRoom(roomCode.trim().toUpperCase());
      setRoomCode("");
      handleClose();
    }
  };

  if (!open && !isClosing) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-200 ${
        isClosing ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black backdrop-blur-sm transition-all duration-200 ${
          isClosing ? "bg-opacity-0" : "bg-opacity-50"
        }`}
        onClick={handleClose}
      ></div>

      {/* Dialog */}
      <div
        className={`relative w-[90%] max-w-md bg-slate-800 rounded-lg shadow-2xl overflow-hidden border border-slate-600 transition-all duration-200 transform ${
          isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-2">
              Join Room
            </h2>
            <p className="text-slate-400 text-sm">
              Enter the room code provided by the host to join the session.
            </p>
          </div>

          {/* Form */}
          <div className="space-y-4 mb-6">
            <div>
              <label
                htmlFor="room-code"
                className="block text-sm font-medium text-white mb-2"
              >
                Room Code
              </label>
              <input
                id="room-code"
                type="text"
                placeholder="Enter room code"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleJoin();
                  } else if (e.key === "Escape") {
                    handleClose();
                  }
                }}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase tracking-wider font-mono text-lg"
                maxLength={6}
                autoFocus
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleJoin}
              disabled={!roomCode.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed"
            >
              Join Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

