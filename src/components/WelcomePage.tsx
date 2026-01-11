import { useAuth, removeAccessTokenCookie } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function WelcomePage() {
  const { accessToken } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    removeAccessTokenCookie();
    router.push("/login");
  };

  const handleCreateRoom = () => {
    // TODO: Implement create room functionality
    alert("Create room feature coming soon!");
  };

  const handleJoinRoom = () => {
    // TODO: Implement join room functionality
    alert("Join room feature coming soon!");
  };

  const handleQuickPlay = () => {
    router.push("/game");
  };

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

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-6xl mx-auto space-y-8 pt-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <h1 className="text-5xl tracking-tight text-white">
              Welcome to the Game!
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Ready to play? Create a new game room or join an existing one to start your Monopoly adventure.
            </p>
          </div>

          {/* Action Cards Grid */}
          <div className="grid md:grid-cols-2 gap-6 mt-12">
            {/* Create Room Card */}
            <div
              className="bg-blue-600/20 hover:bg-blue-600/30 transition-colors border border-blue-500/30 rounded-lg cursor-pointer group backdrop-blur-sm min-h-[280px]"
              onClick={handleCreateRoom}
            >
              <div className="p-6 space-y-6 pb-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors mx-auto">
                  <div className="text-5xl">🏠</div>
                </div>
                <h3 className="text-3xl text-white text-center font-semibold">Create Game Room</h3>
                <p className="text-base text-white/70 text-center leading-relaxed">
                  Start a new game and invite your friends to join your private room.
                </p>
              </div>
              <div className="pt-2 p-6">
                <button
                  className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCreateRoom();
                  }}
                >
                  Coming Soon
                </button>
              </div>
            </div>

            {/* Join Room Card */}
            <div
              className="bg-blue-600/20 hover:bg-blue-600/30 transition-colors border border-blue-500/30 rounded-lg cursor-pointer group backdrop-blur-sm min-h-[280px]"
              onClick={handleJoinRoom}
            >
              <div className="p-6 space-y-6 pb-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors mx-auto">
                  <div className="text-5xl">🎮</div>
                </div>
                <h3 className="text-3xl text-white text-center font-semibold">Join Game Room</h3>
                <p className="text-base text-white/70 text-center leading-relaxed">
                  Enter a room code to join an existing game with other players.
                </p>
              </div>
              <div className="pt-2 p-6">
                <button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors border border-blue-500/50"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleJoinRoom();
                  }}
                >
                  Coming Soon
                </button>
              </div>
            </div>
          </div>

          {/* Quick Play Card - Full Width */}
          <div
            className="bg-blue-600/20 hover:bg-blue-600/30 transition-colors border border-blue-500/30 rounded-lg cursor-pointer group backdrop-blur-sm min-h-[280px]"
            onClick={handleQuickPlay}
          >
            <div className="p-6 space-y-6 pb-4">
              <div className="w-16 h-16 rounded-2xl bg-yellow-500/20 flex items-center justify-center group-hover:bg-yellow-500/30 transition-colors mx-auto">
                <div className="text-5xl">⚡</div>
              </div>
              <h3 className="text-3xl text-white text-center font-semibold">Quick Play</h3>
              <p className="text-base text-white/70 text-center leading-relaxed">
                Jump into a random game with other players looking for a quick match.
              </p>
            </div>
            <div className="pt-2 p-6 max-w-md mx-auto">
              <Link
                href="/game"
                className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors gap-2 flex items-center justify-center"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                Play Football Monopoly ⚽
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
