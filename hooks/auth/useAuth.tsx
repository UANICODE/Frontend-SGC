"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { AuthUser, UserRole } from "@/types/auth/types";
import { loginService } from "@/service/auth/login";
import { logoutService } from "@/service/auth/logout";
import { getCurrentUserService } from "@/service/auth/me";

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUserService()
      .then((data) => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await loginService({ email, password });

      const userData = await getCurrentUserService();
      setUser(userData);
      return userData;
    } catch (error: any) {
      throw new Error(error?.message || "Erro ao fazer login");
    }
  };

  const logout = async () => {
    try {
      await logoutService();

      // limpa estado do usuário
      setUser(null);

      // redireciona para login
      window.location.href = "/auth";
    } catch (error) {
      console.error("Erro no logout", error);
    }
  };

  const hasRole = (role: UserRole) => user?.roles.includes(role) ?? false;

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve estar dentro do AuthProvider");
  return context;
}