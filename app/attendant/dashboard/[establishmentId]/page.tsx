"use client";

import { CashRegisterCard } from "@/components/attendant/cards/CashRegisterCard";
import { CashClosingReceiptPreview } from "@/components/attendant/CashClosingReceiptPreview";
import { CashRegisterFilters } from "@/components/attendant/CashRegisterFilters";
import { CashRegisterSalesModal } from "@/components/attendant/modals/CashRegisterSalesModal";
import { PageLoader } from "@/components/ui/PageLoader";
import { useEstablishment } from "@/hooks/admin/useEstablishment";
import { useCashRegisters } from "@/hooks/attendant/useCashRegisters";
import { useOpenCashRegister } from "@/hooks/attendant/useOpenCashRegister";
import { useCashRegisterSales } from "@/hooks/attendant/useCashRegisterSales";
import { closeCashRegister } from "@/service/attendant/closeCash";
import { createSale } from "@/service/attendant/sale";
import { useParams, useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { CashClosingReceipt } from "@/types/attendant/CashRegister";
import { useToast } from "@/ context/ToastContext";
import { 
  ArrowPathIcon, 
  PlusIcon, 
  SparklesIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BanknotesIcon,
  UserIcon
} from "@heroicons/react/24/outline";
import { UserRole } from "@/enum/enum";
import { useRoleGuard } from "@/hooks/auth/useRoleGuard";
import { useAuth } from "@/hooks/auth/useAuth";

export default function AttendantHome() {
  useRoleGuard([UserRole.ATENDENTE]);

  const { establishmentId } = useParams() as any;
  const router = useRouter();
  const { user } = useAuth(); // ✅ Obter dados do usuário logado
  const [sellingCashId, setSellingCashId] = useState<string | null>(null);
  const { data: establishment } = useEstablishment(establishmentId);
  const toast = useToast();
  const [closingReceipt, setClosingReceipt] = useState<CashClosingReceipt | null>(null);
  const [closingId, setClosingId] = useState<string | null>(null);
  
  const [selectedCashForSales, setSelectedCashForSales] = useState<string | null>(null);
  const [selectedCashInfo, setSelectedCashInfo] = useState<any>(null);
  const { data: sales, fetch: fetchSales, loading: loadingSales } = useCashRegisterSales();

  const { execute: executeOpenCash, loading: opening } = useOpenCashRegister();

  const [today, setToday] = useState(false);
  const [status, setStatus] = useState<"ABERTO" | "FECHADO" | null>(null);

  const { data, loading, error, openCash, refresh } = useCashRegisters({
    establishmentId,
    today,
    status,
  });

  const [page, setPage] = useState(1);
  const pageSize = 6;

  const uniqueCashRegisters = useMemo(() => {
    return Array.from(new Map(data.map(item => [item.id, item])).values());
  }, [data]);

  const paginated = useMemo(() => {
    return uniqueCashRegisters.slice((page - 1) * pageSize, page * pageSize);
  }, [uniqueCashRegisters, page]);

  const totalPages = Math.ceil(uniqueCashRegisters.length / pageSize);

  async function handleOpenCash() {
    try {
      await executeOpenCash(establishmentId);
      toast.showToast("Caixa aberto com sucesso!", "success");
      await refresh();
    } catch (error: any) {
      toast.showToast(error.message || "Erro ao abrir caixa", "error");
    }
  }

  async function handleCloseCash(cashId: string) {
    try {
      setClosingId(cashId);
      const receipt = await closeCashRegister(cashId);
      setClosingReceipt(receipt);
      toast.showToast("Caixa fechado com sucesso!", "success");
      await refresh();
    } catch (error: any) {
      toast.showToast(error.message || "Erro ao fechar caixa", "error");
    } finally {
      setClosingId(null);
    }
  }

  async function handleSell(cashId: string) {
    try {
      setSellingCashId(cashId);
      const sale = await createSale({ establishmentId, cashRegisterId: cashId });
      toast.showToast("Venda iniciada!", "success");
      router.push(
        `/attendant/dashboard/${establishmentId}/sales?saleId=${sale.saleId}&cashRegisterId=${cashId}`
      );
    } catch (error: any) {
      toast.showToast(error.message || "Erro ao iniciar venda", "error");
    } finally {
      setSellingCashId(null);
    }
  }

  async function handleViewSales(cashId: string) {
    const cash = uniqueCashRegisters.find(c => c.id === cashId);
    setSelectedCashInfo({
      openedAt: cash?.openedAt,
      closedAt: cash?.closedAt,
      totalSales: cash?.totalSalesCalculated,
    });
    setSelectedCashForSales(cashId);
    await fetchSales(establishmentId, cashId);
  }

  const handlePageChange = (page: number) => {
    setPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading || !establishment) return <PageLoader />;

  const primaryColor = establishment.primaryColor;
  const secondaryColor = establishment.secondaryColor;
  const attendantName = user?.nome

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* HEADER COM GRADIENTE */}
        <div 
          className="relative overflow-hidden rounded-2xl shadow-2xl"
          style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
        >
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative px-8 py-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
                    <BanknotesIcon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Bem-vindo de volta,{" "}
                  <span className="bg-gradient-to-r from-yellow-200 via-white to-yellow-200 bg-clip-text text-transparent animate-shimmer">
                    {attendantName}
                  </span>
                  <span className="inline-block ml-2 animate-wave">👋</span>
                </h1>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-white/80 text-sm flex items-center gap-2">
                        <SparklesIcon className="w-4 h-4" />
                      Realize suas vendas em tempo real
                      </p>
                    
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={refresh}
                className="group relative overflow-hidden bg-white/20 backdrop-blur-sm text-white px-5 py-2.5 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-2 text-sm font-medium"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
                <ArrowPathIcon className="w-5 h-5 relative z-10" />
                <span className="relative z-10">Atualizar</span>
              </button>
            </div>

            {/* Estatísticas rápidas */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-4 border-t border-white/20">
              <div className="text-center sm:text-left">
                <p className="text-white/60 text-xs uppercase tracking-wide">Total Caixas</p>
                <p className="text-white text-xl font-bold">{uniqueCashRegisters.length}</p>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-white/60 text-xs uppercase tracking-wide">Abertos</p>
                <p className="text-green-300 text-xl font-bold">
                  {uniqueCashRegisters.filter(c => c.status === "ABERTO").length}
                </p>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-white/60 text-xs uppercase tracking-wide">Fechados</p>
                <p className="text-amber-300 text-xl font-bold">
                  {uniqueCashRegisters.filter(c => c.status === "FECHADO").length}
                </p>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-white/60 text-xs uppercase tracking-wide">Status</p>
                <p className="text-white text-xl font-bold flex items-center justify-center sm:justify-start gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  {openCash ? "Ativo" : "Inativo"}
                </p>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-white/30 via-white/50 to-white/30"></div>
        </div>

        {/* FILTROS */}
        <CashRegisterFilters
          today={today}
          status={status}
          onTodayChange={() => {
            setToday(prev => !prev);
            setPage(1);
          }}
          onStatusChange={(value) => {
            setStatus(value);
            setPage(1);
          }}
        />

        {/* BOTÃO ABRIR CAIXA */}
        {!openCash && (
          <button
            onClick={handleOpenCash}
            disabled={opening}
            className="group relative overflow-hidden px-8 py-4 rounded-xl text-white font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-3 w-full sm:w-auto"
            style={{ 
              background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` 
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <PlusIcon className="w-6 h-6 relative z-10" />
            <span className="relative z-10">
              {opening ? "Abrindo..." : "Abrir Novo Caixa"}
            </span>
          </button>
        )}

        {/* ERRO */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-1 bg-red-100 rounded-full">
                <ArrowPathIcon className="w-5 h-5 text-red-600" />
              </div>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* LISTA DE CAIXAS */}
        {paginated.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
              <div className="p-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full">
                <BanknotesIcon className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700">Nenhum caixa encontrado</h3>
              <p className="text-gray-500 text-sm">
                {today || status 
                  ? "Tente ajustar os filtros aplicados" 
                  : "Clique em 'Abrir Novo Caixa' para começar"}
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginated.map((cash, idx) => (
                <CashRegisterCard
                  key={`${cash.id}-${idx}`}
                  cash={cash}
                  primaryColor={primaryColor}
                  secondaryColor={secondaryColor}
                  onSell={handleSell}
                  onClose={handleCloseCash}
                  closing={closingId === cash.id}
                  sellingCashId={sellingCashId}
                  onViewSales={handleViewSales}
                />
              ))}
            </div>

            {/* PAGINAÇÃO MODERNA */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className={`p-2 rounded-xl transition-all duration-300 ${
                    page === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white border border-gray-200 text-gray-700 hover:text-white hover:border-primary"
                  }`}
                  style={
                    page !== 1
                      ? { backgroundImage: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }
                      : undefined
                  }
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                      if (i === 4) pageNum = totalPages;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }

                    if (pageNum === undefined) return null;

                    if (i === 3 && totalPages > 5 && page <= 3) {
                      return <span key="dots1" className="w-10 h-10 flex items-center justify-center text-gray-400">...</span>;
                    }
                    if (i === 1 && totalPages > 5 && page >= totalPages - 2) {
                      return <span key="dots2" className="w-10 h-10 flex items-center justify-center text-gray-400">...</span>;
                    }
                    if (i === 2 && totalPages > 5 && page > 3 && page < totalPages - 2) {
                      return <span key="dots3" className="w-10 h-10 flex items-center justify-center text-gray-400">...</span>;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-10 h-10 rounded-xl font-medium transition-all duration-300 ${
                          page === pageNum
                            ? "text-white shadow-md scale-105"
                            : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                        style={page === pageNum ? {
                          background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`
                        } : {}}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className={`p-2 rounded-xl transition-all duration-300 ${
                    page === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white border border-gray-200 text-gray-700 hover:text-white hover:border-primary"
                  }`}
                >
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Info de registros */}
            {uniqueCashRegisters.length > 0 && (
              <div className="text-center text-sm text-gray-400">
                Mostrando {((page - 1) * pageSize) + 1} a {Math.min(page * pageSize, uniqueCashRegisters.length)} de {uniqueCashRegisters.length} caixas
              </div>
            )}
          </>
        )}

        {/* MODAL DE FECHAMENTO */}
        {closingReceipt && (
          <CashClosingReceiptPreview
            receipt={closingReceipt}
            onClose={() => setClosingReceipt(null)}
          />
        )}

        {/* MODAL DE VENDAS */}
        <CashRegisterSalesModal
          open={!!selectedCashForSales}
          onClose={() => {
            setSelectedCashForSales(null);
            setSelectedCashInfo(null);
          }}
          sales={sales}
          loading={loadingSales}
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          cashRegisterInfo={selectedCashInfo}
          establishmentLogo={establishment.logoUrl}
          establishmentName={establishment.tradeName}
        />
      </div>
    </div>
  );
}