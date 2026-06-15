"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { useOpenCashRegisters } from "@/hooks/admin/cash-register/useOpenCashRegisters";
import { useCashRegisterSales } from "@/hooks/admin/cash-register/useCashRegisterSales";
import { CashRegisterCard } from "@/components/admin/cards/CashRegisterCard";
import { CashRegisterSalesModal } from "@/components/admin/modals/CashRegisterSalesModal";
import { useEstablishment } from "@/hooks/admin/useEstablishment";
import { ChevronLeft, ChevronRight, Package } from "lucide-react";

export default function CashRegistersPage() {
  const { establishmentId } = useParams<{ establishmentId: string }>();
  const { data: establishment } = useEstablishment(establishmentId);

  const { data, loading } = useOpenCashRegisters(establishmentId);
  const { data: sales, fetch, loading: loadingSales, error } =
    useCashRegisterSales();

  const [selectedCash, setSelectedCash] = useState<string | null>(null);
  const [selectedCashInfo, setSelectedCashInfo] = useState<any>(null);

  const [tab, setTab] = useState<"open" | "closed">("open");
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const openRegisters = useMemo(
    () => data.filter((c) => c.status === "ABERTO"),
    [data]
  );

  const closedRegisters = useMemo(() => {
    return data
      .filter((c) => c.status === "FECHADO")
      .filter((c) =>
        c.attendantName.toLowerCase().includes(search.toLowerCase())
      )
      .filter((c) =>
        date
          ? new Date(c.closedAt || "").toISOString().slice(0, 10) === date
          : true
      );
  }, [data, search, date]);

  const handleDetails = async (cash: any) => {
    setSelectedCash(cash.cashRegisterId);
    setSelectedCashInfo({
      openedAt: cash.openedAt,
      closedAt: cash.closedAt,
      totalSales: cash.totalSold,
    });
    await fetch(establishmentId, cash.cashRegisterId);
  };

  const list = tab === "open" ? openRegisters : closedRegisters;
  const totalItems = list.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedList = list.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Resetar página quando mudar de tab ou filtros
  const handleTabChange = (newTab: "open" | "closed") => {
    setTab(newTab);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleDateChange = (value: string) => {
    setDate(value);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden bg-gradient-to-r from-primary to-secondary rounded-2xl shadow-xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative px-8 py-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
              <Package className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                Gestão de Caixas
              </h1>
              <p className="text-white/80 text-sm mt-1">
                Controle de caixas abertos e fechados do estabelecimento
              </p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-white/30 via-white/50 to-white/30"></div>
      </div>

      {/* Tabs */}
      <div className="flex gap-3">
        <button
          onClick={() => handleTabChange("open")}
          className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-300 ${
            tab === "open"
              ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Caixas Abertos
          {openRegisters.length > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
              {openRegisters.length}
            </span>
          )}
        </button>

        <button
          onClick={() => handleTabChange("closed")}
          className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-300 ${
            tab === "closed"
              ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Caixas Fechados
          {closedRegisters.length > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
              {closedRegisters.length}
            </span>
          )}
        </button>
      </div>

      {/* Filtros para caixas fechados */}
      {tab === "closed" && (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-5 shadow-sm">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <input
                placeholder="Buscar por operador..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
              />
            </div>
            <div className="min-w-[200px]">
              <input
                type="date"
                value={date}
                onChange={(e) => handleDateChange(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
              />
            </div>
            {(search || date) && (
              <button
                onClick={() => {
                  handleSearchChange("");
                  handleDateChange("");
                }}
                className="px-4 py-2.5 text-red-500 hover:text-red-600 transition font-medium"
              >
                Limpar filtros
              </button>
            )}
          </div>
        </div>
      )}

      {/* LISTA COM PAGINAÇÃO */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-lg">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Package className="w-6 h-6 text-primary/60 animate-pulse" />
            </div>
          </div>
          <p className="mt-4 text-gray-500 font-medium">Carregando caixas...</p>
        </div>
      ) : (
        <>
          {paginatedList.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                <Package className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">
                {tab === "open" 
                  ? "Nenhum caixa aberto no momento" 
                  : "Nenhum caixa fechado encontrado"}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {tab === "closed" && (search || date) 
                  ? "Tente ajustar os filtros" 
                  : "Os caixas aparecerão aqui quando houver registros"}
              </p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginatedList.map((cash) => (
                  <CashRegisterCard
                    key={cash.cashRegisterId}
                    cash={cash}
                    onDetails={handleDetails}
                  />
                ))}
              </div>

              {/* Paginação */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8 pt-4">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white border border-gray-200 text-gray-700 hover:bg-primary hover:text-white hover:border-primary"
                    }`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                        if (i === 4) pageNum = totalPages;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      if (pageNum === undefined) return null;

                      if (i === 3 && totalPages > 5 && currentPage <= 3) {
                        return <span key="dots1" className="w-10 h-10 flex items-center justify-center text-gray-400">...</span>;
                      }
                      if (i === 1 && totalPages > 5 && currentPage >= totalPages - 2) {
                        return <span key="dots2" className="w-10 h-10 flex items-center justify-center text-gray-400">...</span>;
                      }
                      if (i === 2 && totalPages > 5 && currentPage > 3 && currentPage < totalPages - 2) {
                        return <span key="dots3" className="w-10 h-10 flex items-center justify-center text-gray-400">...</span>;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-10 h-10 rounded-lg font-medium transition-all duration-300 ${
                            currentPage === pageNum
                              ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md scale-105"
                              : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white border border-gray-200 text-gray-700 hover:bg-primary hover:text-white hover:border-primary"
                    }`}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Info de registros */}
              <div className="text-center text-sm text-gray-400 mt-4">
                Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems} caixas
              </div>
            </>
          )}
        </>
      )}

      {/* ERRO */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-1 bg-red-100 rounded-full">
              <Package className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* MODAL */}
      <CashRegisterSalesModal
        open={!!selectedCash}
        onClose={() => {
          setSelectedCash(null);
          setSelectedCashInfo(null);
        }}
        sales={sales}
        loading={loadingSales}
        primaryColor={establishment?.primaryColor}
        secondaryColor={establishment?.secondaryColor}
        establishmentLogo={establishment?.logoUrl}
        establishmentName={establishment?.tradeName}
        cashRegisterInfo={selectedCashInfo}
      />
    </div>
  );
}