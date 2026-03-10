import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import * as SecureStore from "expo-secure-store";

import { apiClient, setAuthToken } from "@api/client";

const TOKEN_KEY = "mpala_access_token";
const REFRESH_TOKEN_KEY = "mpala_refresh_token";

type AuthContextValue = {
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticating: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Load stored token on mount
  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
        if (storedToken) {
          setAccessToken(storedToken);
          setAuthToken(storedToken);
        }
      } catch (error) {
        console.error("Failed to load auth token:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadToken();
  }, []);

  // Update API client when token changes
  useEffect(() => {
    setAuthToken(accessToken);
  }, [accessToken]);

  const login = useCallback(async (email: string, password: string) => {
    setIsAuthenticating(true);
    try {
      const formData = new FormData();
      formData.append("username", email);
      formData.append("password", password);

      const response = await apiClient.post("/auth/login", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const token = response.data.access_token;
      const refreshToken = response.data.refresh_token;

      // Store tokens securely
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      if (refreshToken) {
        await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
      }

      setAccessToken(token);
    } finally {
      setIsAuthenticating(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error("Failed to clear auth tokens:", error);
    }
    setAccessToken(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        isLoading,
        isAuthenticating,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}

