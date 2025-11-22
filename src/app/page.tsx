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
        <div className="text-center text-gray-600">
          Frontend is running on port 8081
        </div>
      </div>
    </main>
  );
}
