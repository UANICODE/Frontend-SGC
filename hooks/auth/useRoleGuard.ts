"use client";

import { useAuth } from "./useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { UserRole } from "@/types/auth/types";

export function useRoleGuard(requiredRole: UserRole) {

  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {

    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (!user.roles.includes(requiredRole)) {
      router.replace("/");
    }

  }, [user, loading, requiredRole, router]);
}