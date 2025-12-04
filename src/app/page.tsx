import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          Better Monopoly
        </h1>
        <p className="text-center text-lg mb-4">
          Welcome to Better Monopoly - A modern take on the classic board game
        </p>
        <div className="text-center text-gray-600 mb-8">
          Frontend is running on port 8081
        </div>
        <div className="flex justify-center gap-4">
          <Link
            href="/game"
            className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-lg font-semibold text-lg"
          >
            Play Football Monopoly ⚽
          </Link>
        </div>
      </div>
    </main>
  );
}
