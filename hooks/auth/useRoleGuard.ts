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
    if (loading) return;

    if (!user) {
      router.replace("/auth");
      return;
    }

    // transforma em array caso seja uma role única
    const rolesArray = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

    if (!rolesArray.some(role => user.roles.includes(role))) {
      router.replace("/"); // ou "/"
    }

  }, [user, loading, requiredRoles, router]);
}