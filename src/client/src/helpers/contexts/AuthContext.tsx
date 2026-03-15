import React, { createContext, useContext, useEffect, useState } from "react";
import { keycloakService, KeycloakTokens } from "../Auth/keycloak";
import { authEvents } from "../events/authEvents";

interface AuthContextType {
  tokens: KeycloakTokens | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tokens, setTokens] = useState<KeycloakTokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const stored = await keycloakService.getStoredTokens();
        console.log(stored);
        if (!stored) {
          setTokens(null);
          return;
        }

        const refreshed = await keycloakService.refreshAccessToken();

        if (!refreshed) {
          await keycloakService.logout();
          setTokens(null);
          return;
        }

        setTokens(refreshed);
      } catch (e) {
        await keycloakService.logout();
        setTokens(null);
      } finally {
        setIsLoading(false);
      }
    };

    const handleUnauthorized = async () => {
      await keycloakService.logout();
      setTokens(null);
    };
    authEvents.on("unauthorized", handleUnauthorized);
    initAuth();

    return () => {
      authEvents.off("unauthorized", handleUnauthorized);
    };
  }, []);

  const login = async () => {
    try {
      const result = await keycloakService.login();
      if (result) {
        setTokens(result);
      }
    } catch (message) {
      console.log(message);
    }
  };

  const logout = async () => {
    await keycloakService.logout();
    setTokens(null);
  };

  const isAuthenticated = !!tokens?.accessToken;

  return (
    <AuthContext.Provider
      value={{ tokens, isLoading, isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
