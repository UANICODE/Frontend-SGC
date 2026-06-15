"use client";

import { CardEstablishment } from "@/components/admin/cards/CardEstablishment";
import { UserRole } from "@/enum/enum";
import { useAdminEstablishments } from "@/hooks/admin/useAdminEstablishments";
import { useRoleGuard } from "@/hooks/auth/useRoleGuard";
import { useRouter } from "next/navigation";
import { Sparkles, Store, Building2, TrendingUp, Crown } from "lucide-react";

export default function EstablishmentsPage() {
  useRoleGuard([UserRole.ADMIN]);

  const router = useRouter();
  const { data, loading } = useAdminEstablishments();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Building2 className="w-8 h-8 text-primary/60 animate-pulse" />
          </div>
        </div>
        <p className="mt-4 text-gray-500 font-medium">Carregando seus negócios...</p>
        <p className="text-sm text-gray-400">Aguarde, estamos preparando tudo para você</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
            <Store className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Nenhum estabelecimento cadastrado</h2>
          <p className="text-gray-500">
            Você ainda não possui estabelecimentos cadastrados. 
            Entre em contato com o suporte para adicionar seu primeiro negócio.
          </p>
        </div>
      </div>
    );
  }

  // Estatísticas rápidas
  const totalEstabelecimentos = data.length;
  const totalAtivos = data.filter(est => est.active).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100/50">
      
      {/* HEADER COM GRADIENTE */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary to-secondary shadow-xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative px-8 py-12 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                    Seus Estabelecimentos
                  </h1>
                  <p className="text-white/80 text-sm mt-1 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Gerencie todos os seus negócios de forma simples e eficiente
                  </p>
                </div>
              </div>
            </div>

            {/* Botão Super Gestão */}
            <button
              onClick={() => router.push("/admin/establishments/superdashboard")}
              className="group relative overflow-hidden bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center gap-2 font-medium"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
              <Crown className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Super Gestão</span>
              <TrendingUp className="w-4 h-4 relative z-10 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Cards de estatísticas rápidas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-4 border-t border-white/20">
            <div className="text-center md:text-left">
              <p className="text-white/60 text-xs uppercase tracking-wide">Total</p>
              <p className="text-white text-2xl font-bold">{totalEstabelecimentos}</p>
              <p className="text-white/50 text-xs">estabelecimentos</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-white/60 text-xs uppercase tracking-wide">Ativos</p>
              <p className="text-green-300 text-2xl font-bold">{totalAtivos}</p>
              <p className="text-white/50 text-xs">em operação</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-white/60 text-xs uppercase tracking-wide">Inativos</p>
              <p className="text-amber-300 text-2xl font-bold">{totalEstabelecimentos - totalAtivos}</p>
              <p className="text-white/50 text-xs">pendentes</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-white/60 text-xs uppercase tracking-wide">Gestão</p>
              <p className="text-white text-2xl font-bold">Unificada</p>
              <p className="text-white/50 text-xs">todos os negócios</p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-white/30 via-white/50 to-white/30"></div>
      </div>

      {/* GRID DE ESTABELECIMENTOS */}
      <div className="px-8 py-12">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Meus Negócios</h2>
            <p className="text-sm text-gray-500">Selecione um estabelecimento para gerenciar</p>
          </div>
          <div className="text-sm text-gray-400">
            {totalEstabelecimentos} estabelecimento{totalEstabelecimentos !== 1 ? 's' : ''} encontrado{totalEstabelecimentos !== 1 ? 's' : ''}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data.map((est) => (
            <CardEstablishment key={est.id} establishment={est} />
          ))}
        </div>
      </div>

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