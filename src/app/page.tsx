"use client";

import { useAuth } from "@/hooks/useAuth";
import LandingPage from "@/components/LandingPage";
import WelcomePage from "@/components/WelcomePage";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Render appropriate page based on authentication status
  return isAuthenticated ? <WelcomePage /> : <LandingPage />;
}
