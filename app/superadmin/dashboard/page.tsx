// app/superadmin/dashboard/page.tsx
"use client";

import { useSuperAdminDashboard } from "@/hooks/superadmin/useSuperAdminDashboard";
import { 
  Building2, 
  Users, 
  Store, 
  TrendingUp, 
  AlertTriangle, 
  Calendar,
  BarChart3,
  DollarSign,
  Sparkles,
  Activity,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";
import { UserRole } from "@/enum/enum";
import { useRoleGuard } from "@/hooks/auth/useRoleGuard";
import { KpiCard } from "@/components/admin/cards/KpiCard";
import { useMemo } from "react";

export default function SuperAdminDashboardPage() {
  useRoleGuard([UserRole.SUPERADMIN]);
  
  const {
    loading,
    activeEstablishments,
    inactiveEstablishments,
    usersByEstablishment,

  } = useSuperAdminDashboard();

  // Cálculos adicionais
  const totalUsers = usersByEstablishment?.reduce(
    (acc: number, item: any) => acc + item.totalUsers, 0
  ) || 0;

  const totalEstablishments = (activeEstablishments?.length || 0) + (inactiveEstablishments?.length || 0);
  
  const occupancyRate = totalEstablishments > 0
    ? Math.round(((activeEstablishments?.length || 0) / totalEstablishments) * 100)
    : 0;

  const avgUsersPerEstablishment = (activeEstablishments?.length || 0) > 0
    ? Math.round(totalUsers / (activeEstablishments?.length || 1))
    : 0;

 
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <BarChart3 className="w-8 h-8 text-primary/60 animate-pulse" />
          </div>
        </div>
        <p className="mt-4 text-gray-500 font-medium">Carregando dashboard global...</p>
      </div>
    );
  }


}