"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

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

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {

  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUserService()
      .then((data) => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

 // useAuth.tsx
const login = async (email: string, password: string) => {
  try {
    // chama o login e espera tokens
    const authResponse = await loginService({ email, password });

    // 🔐 Se login OK, chama getCurrentUserService
    const userData = await getCurrentUserService();
    setUser(userData);
    return userData;

  } catch (error: any) {
    // ⚠️ pega a mensagem do backend ou default
    throw new Error(error?.message || "Erro ao fazer login");
  }
};

  const logout = async () => {
    await logoutService();
    setUser(null);
    window.location.href = "/auth";
  };

  const hasRole = (role: UserRole) =>
    user?.roles.includes(role) ?? false;

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, hasRole }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve estar dentro do AuthProvider");
  }

  return context;
}