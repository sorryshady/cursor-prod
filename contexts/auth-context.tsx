"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User as CompleteUser } from "@prisma/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  membershipId: string;
  photoUrl: string;
  userRole: string;
}

interface AuthContextType {
  user: User | null;
  completeUser: CompleteUser | null;
  isLoading: boolean;
  updateSession: () => Promise<void>;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [completeUser, setCompleteUser] = useState<CompleteUser | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
        const newRes = await fetch("/api/mobile");
        const completeUserData = await newRes.json();
        setCompleteUser(completeUserData);
      } else {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const updateSession = async () => {
    await checkAuth();
  };

  const login = async () => {
    await checkAuth();
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    toast.success("Logged out successfully");
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        completeUser,
        isLoading: loading,
        updateSession,
        login,
        logout,
      }}
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
