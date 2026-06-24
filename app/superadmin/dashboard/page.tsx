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
    totalRevenue,
    pendingPayments,
    establishmentsExpiringSoon,
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

  // Dados para os cards de estabelecimentos (top 3 por usuários)
  const topEstablishments = useMemo(() => {
    if (!usersByEstablishment) return [];
    return [...usersByEstablishment]
      .sort((a, b) => b.totalUsers - a.totalUsers)
      .slice(0, 3);
  }, [usersByEstablishment]);

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

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary to-secondary rounded-2xl shadow-xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative px-8 py-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                Dashboard Global
              </h1>
              <p className="text-white/80 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Visão geral de todos os estabelecimentos e métricas do sistema
              </p>
            </div>
          </div>
          
          {/* Resumo rápido */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-4 border-t border-white/20">
            <div className="text-center md:text-left">
              <p className="text-white/60 text-xs uppercase tracking-wide">Total Estabelecimentos</p>
              <p className="text-white text-2xl font-bold">{totalEstablishments}</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-white/60 text-xs uppercase tracking-wide">Taxa de Ocupação</p>
              <p className="text-green-300 text-2xl font-bold">{occupancyRate}%</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-white/60 text-xs uppercase tracking-wide">Usuários Totais</p>
              <p className="text-white text-2xl font-bold">{totalUsers}</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-white/60 text-xs uppercase tracking-wide">Receita Total</p>
              <p className="text-yellow-300 text-2xl font-bold">
                MZN {totalRevenue?.toLocaleString() || "0"}
              </p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-white/30 via-white/50 to-white/30"></div>
      </div>

      {/* KPIs Principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KpiCard 
          title="Estabelecimentos Ativos" 
          value={activeEstablishments?.length || 0} 
          icon={Store}
          subtitle="em operação"
          trend={occupancyRate > 50 ? "+12%" : "-5%"}
          trendPositive={occupancyRate > 50}
        />
        <KpiCard 
          title="Estabelecimentos Inativos" 
          value={inactiveEstablishments?.length || 0} 
          icon={AlertTriangle}
          subtitle="pendentes"
        />
        <KpiCard 
          title="Total de Usuários" 
          value={totalUsers} 
          icon={Users}
          subtitle="em todos os estabelecimentos"
        />
        <KpiCard 
          title="Receita Total" 
          value={`MZN ${totalRevenue?.toLocaleString() || "0"}`} 
          icon={DollarSign}
          subtitle="faturamento global"
        />
      </div>

      {/* Top Estabelecimentos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top 3 Estabelecimentos com mais usuários */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-gray-800">Top Estabelecimentos</h3>
            <span className="text-xs text-gray-400 ml-auto">por número de usuários</span>
          </div>
          
          {topEstablishments.length > 0 ? (
            <div className="space-y-3">
              {topEstablishments.map((est, index) => {
                const colors = ["border-l-blue-500", "border-l-green-500", "border-l-purple-500"];
                const badges = ["🥇", "🥈", "🥉"];
                
                return (
                  <div 
                    key={est.establishmentId} 
                    className={`flex justify-between items-center p-4 bg-gray-50 rounded-xl border-l-4 ${colors[index] || "border-l-gray-400"}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{badges[index] || "🏅"}</span>
                      <div>
                        <p className="font-medium text-gray-800">{est.establishmentName}</p>
                        <p className="text-xs text-gray-400">ID: {est.establishmentId?.slice(0, 8) || "N/A"}...</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-semibold text-primary">{est.totalUsers}</p>
                        <p className="text-xs text-gray-400">usuários</p>
                      </div>
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                          style={{ width: `${(est.totalUsers / (topEstablishments[0]?.totalUsers || 1)) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">Nenhum estabelecimento com usuários</p>
          )}
        </div>

        {/* Estatísticas Rápidas */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="font-semibold text-gray-800">Resumo Rápido</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-600">Ativos</span>
              </div>
              <span className="font-bold text-green-600">{activeEstablishments?.length || 0}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-500" />
                <span className="text-sm text-gray-600">Inativos</span>
              </div>
              <span className="font-bold text-red-600">{inactiveEstablishments?.length || 0}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-sm text-gray-600">Média usuários/estab.</span>
              </div>
              <span className="font-bold text-primary">{avgUsersPerEstablishment}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-amber-500" />
                <span className="text-sm text-gray-600">Pagamentos pendentes</span>
              </div>
              <span className="font-bold text-amber-600">{pendingPayments || 0}</span>
            </div>
            
            {establishmentsExpiringSoon?.length > 0 && (
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-600 font-medium">
                    {establishmentsExpiringSoon.length} estabelecimento(s) com vencimento próximo
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cards de Vencimentos Próximos (detalhado) */}
      {establishmentsExpiringSoon?.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Calendar className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="font-semibold text-gray-800">Estabelecimentos com Vencimento Próximo</h3>
            <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full ml-auto">
              {establishmentsExpiringSoon.length} alertas
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {establishmentsExpiringSoon.map((est: any) => (
              <div key={est.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div>
                  <p className="font-medium text-gray-800">{est.tradeName}</p>
                  <p className="text-xs text-gray-400">Expira em {est.expiresIn} dias</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  est.expiresIn <= 7 
                    ? "bg-red-100 text-red-700" 
                    : est.expiresIn <= 15 
                    ? "bg-amber-100 text-amber-700" 
                    : "bg-blue-100 text-blue-700"
                }`}>
                  {est.expiresIn <= 7 ? "Urgente" : est.expiresIn <= 15 ? "Atenção" : "Em breve"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}