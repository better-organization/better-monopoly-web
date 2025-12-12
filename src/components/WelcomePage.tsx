import { useAuth, removeAccessTokenCookie } from "@/hooks/useAuth";
import Link from "next/link";

export default function WelcomePage() {
  const { accessToken } = useAuth();

  const handleLogout = () => {
    removeAccessTokenCookie();
    window.location.reload(); // Reload to trigger auth state change and redirect to landing page
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-800 via-blue-700 to-blue-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="text-4xl">🎩</div>
            <h1 className="text-2xl font-bold text-white">Better Monopoly</h1>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-white opacity-75">Welcome back!</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm flex items-center space-x-2"
            >
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-white mb-4">
            Welcome to the Game!
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Ready to play? Create a new game room or join an existing one to
            start your Monopoly adventure.
          </p>
        </div>

        {/* Game Options - Coming Soon */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Create Game Room */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 text-center">
              <div className="text-6xl mb-4">🏠</div>
              <h3 className="text-2xl font-semibold text-white mb-4">
                Create Game Room
              </h3>
              <p className="text-blue-100 mb-6">
                Start a new game and invite your friends to join your private
                room.
              </p>
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                disabled
              >
                Coming Soon
              </button>
            </div>

            {/* Join Game Room */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 text-center">
              <div className="text-6xl mb-4">🎮</div>
              <h3 className="text-2xl font-semibold text-white mb-4">
                Join Game Room
              </h3>
              <p className="text-blue-100 mb-6">
                Enter a room code to join an existing game with other players.
              </p>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                disabled
              >
                Coming Soon
              </button>
            </div>
          </div>

          {/* Quick Play */}
          <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 text-center">
            <div className="text-6xl mb-4">⚡</div>
            <h3 className="text-2xl font-semibold text-white mb-4">
              Quick Play
            </h3>
            <p className="text-blue-100 mb-6">
              Jump into a random game with other players looking for a quick
              match.
            </p>
            <Link
                href="/game"
                className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-lg font-semibold text-lg"
            >
              Play Football Monopoly ⚽
            </Link>
          </div>
        </div>

        {/* Debug Info (for development) */}
        <div className="mt-12 max-w-md mx-auto bg-black/20 rounded-lg p-4 text-center">
          <h4 className="text-white text-sm font-medium mb-2">Debug Info</h4>
          <p className="text-blue-200 text-xs">
            Access Token: {accessToken ? "✅ Valid" : "❌ Not found"}
          </p>
        </div>
      </div>
    </div>
  );
}
