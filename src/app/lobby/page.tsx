"use client";

import { removeAccessTokenCookie } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { roomService, IRoomStatus } from "@/services/roomService";

export default function LobbyPage() {
  const router = useRouter();

  const [copied, setCopied] = useState(false);
  const [roomStatus, setRoomStatus] = useState<IRoomStatus>({
    user: "",
    roomId: "",
    roomCode: "",
    players: []
  });
  const [isHost, setIsHost] = useState<boolean>(false);
  const loading = useRef<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Use ref to track if component is mounted to avoid state updates after unmount
  const count = useRef(1);

  const sameRoomStatus = (status: IRoomStatus) => {
    return (
      status.roomId === roomStatus.roomId &&
      status.roomCode === roomStatus.roomCode &&
      JSON.stringify(status.players) === JSON.stringify(roomStatus.players)
    );
  }

  const getRoomStatus = async () => {
    try {
      const responseBody = await roomService.getRoomStatus();
      const response = responseBody.data;
      count.current += 1;

      // Only update state if room status has changed
      const isSameRoomStatus = sameRoomStatus(response);
      console.log("Is same room status as before?", isSameRoomStatus);
      console.log({"timestamp": new Date().toISOString(), "count": count.current});
      if (!isSameRoomStatus) {
        setRoomStatus(response);
        setIsHost(response.user === response.players[0]);
        setError(null);
        loading.current = false;
        console.log("Called setLoading(false)");
      }
    } catch (err) {
      console.error("Error fetching room status:", err);
      loading.current = false;
      // Only show error if we have no data yet
      if (!roomStatus.roomCode) {
        setError("Failed to fetch room status. Please try again.");
      }
    }
  };

  // Fetch initial room status and set up polling
  useEffect(() => {
    // Fetch immediately on mount
    getRoomStatus()

    // Set up polling interval
    const intervalId = setInterval(() => {
      getRoomStatus();
    }, 5000);

    // Cleanup function - runs when component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }); // Empty dependency array = run once on mount

  const handleLogout = () => {
    removeAccessTokenCookie();
    router.push("/login");
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomStatus?.roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLeaveRoom = () => {
    router.push("/");
  };

  const handleStartRoom = () => {
    // No need to manually clear interval - useEffect cleanup handles it
    router.push("/game");
  };

  console.log("Render cycle - loading:", loading, "error:", error, "roomStatus:", roomStatus);

  // Show loading state
  if (loading.current) {
    console.log("Still loading... loading state:", loading);
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-xl">Loading room...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    console.log("Error state:", error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-4xl mb-4">❌</div>
          <p className="text-xl mb-4">{error}</p>
          <button
            onClick={getRoomStatus}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const nonHostParticipants = roomStatus.players.slice(1);
  console.log("Rendering lobby with room status:", roomStatus);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navbar */}
      <nav className="border-b border-white/10 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="text-3xl">🎩</div>
              <span className="text-xl font-semibold text-white">Better Monopoly</span>
            </div>

            {/* Profile Section */}
            <div className="flex items-center gap-4">
              <span className="text-white/80 text-sm">Welcome back!</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm flex items-center gap-2"
              >
                <span>🚪</span>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="p-6">
        <div className="max-w-4xl mx-auto space-y-6 pt-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleLeaveRoom}
              className="gap-2 text-white hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-colors flex items-center"
            >
              <span>←</span>
              <span>Leave Room</span>
            </button>
            <div className={`gap-1.5 px-3 py-1.5 border rounded-lg ${
              isHost 
                ? 'bg-blue-600/20 text-blue-300 border-blue-500/50' 
                : 'bg-slate-700/50 text-white border-slate-500/50'
            }`}>
              {isHost ? (
                <div className="flex items-center gap-2">
                  <span>👑</span>
                  <span>Host</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>👥</span>
                  <span>Participant</span>
                </div>
              )}
            </div>
          </div>

          {/* Room Info Card */}
          <div className="bg-blue-600/20 border border-blue-500/30 backdrop-blur-sm rounded-lg">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="space-y-1">
                  <h2 className="text-3xl text-white font-semibold">{roomStatus.roomId}</h2>
                  <p className="text-base text-white/70">
                    Share this code with participants
                  </p>
                </div>
              </div>

              {/* Room Code */}
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-slate-800/50 rounded-lg px-6 py-4 border border-blue-500/30">
                  <div className="text-sm text-white/60 mb-1">Room Code</div>
                  <div className="text-3xl font-mono tracking-wider text-white">{roomStatus.roomCode}</div>
                </div>
                <button
                  onClick={copyRoomCode}
                  className="gap-2 h-[88px] bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-white px-6 rounded-lg transition-colors flex items-center"
                >
                  {copied ? (
                    <>
                      <span>✓</span>
                    </>
                  ) : (
                    <>
                      <span>📋</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Participants Card */}
          <div className="bg-blue-600/20 border border-blue-500/30 backdrop-blur-sm rounded-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="flex items-center gap-2 text-white text-xl font-semibold">
                    <span>👥</span>
                    Participants ({roomStatus.players.length})
                  </h3>
                  <p className="mt-1 text-white/70 text-sm">
                    {isHost
                      ? nonHostParticipants.length === 0
                        ? "Waiting for participants to join..."
                        : "Ready to start when you are"
                      : "Waiting for the host to start the room"}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {roomStatus.players.map((participant, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      index === 0
                        ? 'bg-blue-700/30 border border-blue-500/30' 
                        : 'bg-slate-800/30 hover:bg-slate-800/50'
                    } transition-colors`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      index === 0
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-700 text-white'
                    }`}>
                      {participant.slice(0,1).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-white">
                        {participant}
                        { roomStatus.user === participant && (
                          <span className="text-white/50 ml-2">(You)</span>
                        )}
                      </div>
                      <div className="text-sm text-white/60">
                        {index === 0 ? 'Host' : 'Participant'}
                      </div>
                    </div>
                    {index === 0 && (
                      <span className="text-blue-400">👑</span>
                    )}
                  </div>
                ))}

                {/* Empty State */}
                {nonHostParticipants.length === 0 && (
                  <div className="text-center py-8 text-white/60">
                    <div className="text-4xl mb-3 opacity-40">👥</div>
                    <p>No participants yet</p>
                    <p className="text-sm mt-1">Share the room code to get started</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Button - Only shown for host */}
          {isHost && (
            <div className="flex justify-center pt-4">
              <button
                onClick={handleStartRoom}
                disabled={nonHostParticipants.length === 0}
                className="px-12 py-3 bg-green-600 hover:bg-green-700 text-white disabled:bg-slate-700 disabled:text-white/50 rounded-lg font-medium transition-colors text-lg"
              >
                Start Room
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

