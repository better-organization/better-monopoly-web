import { useState, useEffect } from "react";

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
}

export const useAuth = (): AuthState => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    accessToken: null,
  });

  useEffect(() => {
    const checkAuth = () => {
      // Check for accessToken in cookies
      const cookies = document.cookie.split(";");
      const accessTokenCookie = cookies.find((cookie) =>
        cookie.trim().startsWith("accessToken=")
      );

      if (accessTokenCookie) {
        const token = accessTokenCookie.split("=")[1];
        if (token && token.trim() !== "") {
          setAuthState({
            isAuthenticated: true,
            isLoading: false,
            accessToken: token,
          });
        } else {
          setAuthState({
            isAuthenticated: false,
            isLoading: false,
            accessToken: null,
          });
        }
      } else {
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          accessToken: null,
        });
      }
    };

    checkAuth();
  }, []);

  return authState;
};

// Helper functions for cookie management
export const setAccessTokenCookie = (token: string, expirationDays = 7) => {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + expirationDays);

  document.cookie = `accessToken=${token}; expires=${expirationDate.toUTCString()}; path=/; SameSite=Lax`;
};

export const removeAccessTokenCookie = () => {
  document.cookie =
    "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};
