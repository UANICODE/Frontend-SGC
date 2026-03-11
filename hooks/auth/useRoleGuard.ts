"use client";

import { useAuth } from "./useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { UserRole } from "@/enum/enum";

// Aqui aceitamos uma role ou um array de roles
export function useRoleGuard(requiredRoles: UserRole | UserRole[]) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // espera carregar usuário

    if (!user) {
      router.replace("/auth"); // sem sessão, vai pro login
      return;
    }

    const rolesArray = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

    if (!rolesArray.some(role => user.roles.includes(role))) {
      router.replace("/"); // sem permissão
    }

  }, [user, loading, requiredRoles, router]);
}