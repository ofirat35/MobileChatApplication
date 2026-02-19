import React, { createContext, useContext, useEffect, useState } from "react";
import { keycloakService, KeycloakTokens } from "../Auth/keycloak";

interface AuthContextType {
  tokens: KeycloakTokens | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  //   isAdmin: boolean;
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

        if (!stored) {
          setTokens(null);
          return;
        }

        const refreshed = await keycloakService.refreshAccessToken();

        if (!refreshed) {
          await keycloakService.logout(); // clears storage
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

    initAuth();
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

  // Logic for checking roles from your JWTUserInfo
  // Adapt this to where your roles are stored (e.g., realm_access)
  //   const isAdmin = tokens?.userInfo?.roles?.includes("admin") ?? false;

  return (
    // <AuthContext.Provider value={{ tokens, isLoading, login, logout, isAdmin }}>
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
