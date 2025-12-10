import { useState } from "react";
import Button from "@/components/Button";
import AuthModal from "@/components/AuthModal";
import { setAccessTokenCookie } from "@/hooks/useAuth";

export default function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAuthenticate = (token: string) => {
    setAccessTokenCookie(token);
    window.location.reload();
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `url(/images/fbbg.png)`,
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-70"></div>

      <div className="relative flex flex-col items-center justify-center min-h-screen px-4">
        {/* Logo/Title Section */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <div className="inline-block p-4 bg-white rounded-full shadow-2xl mb-4">
              <div className="text-6xl">🎩</div>
            </div>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold text-white mb-4 tracking-tight">
            Better Monopoly
          </h1>

          <p className="text-xl md:text-2xl text-green-100 mb-2">
            The Classic Board Game, Reimagined
          </p>

          <p className="text-lg text-green-200 max-w-2xl mx-auto">
            Experience the timeless strategy game with modern features,
            real-time multiplayer, and enhanced gameplay mechanics.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Button
            onClick={() => setIsModalOpen(true)}
            variant="primary"
            size="large"
            className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-green-800 min-w-[160px]"
          >
            Getting Started
          </Button>
        </div>

        {/* Footer */}
        <div className="absolute bottom-6 text-center text-green-200">
          <p>&copy; 2025 Better Organization. All rights reserved.</p>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAuthenticate={handleAuthenticate}
      />
    </div>
  );
}
