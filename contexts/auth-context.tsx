"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "../types/prisma.types";
import { auth } from "@/lib/auth/auth";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  updateSession: () => Promise<void>;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check initial auth state
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (token: string) => {
    // Store token in cookie (will be handled by the API)
    await checkAuth();
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  };

  const updateSession = async () => {
    // Trigger a refresh of the session
    await checkAuth();
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading: loading, updateSession, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
