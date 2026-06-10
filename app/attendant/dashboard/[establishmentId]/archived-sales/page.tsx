// app/attendant/dashboard/[establishmentId]/archived-sales/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { PageLoader } from "@/components/ui/PageLoader";
import { useArchivedSales } from "@/hooks/attendant/useArchivedSales";
import { useSale } from "@/hooks/attendant/useSale";
import { useAssignSale } from "@/hooks/attendant/useAssignSale";
import { AssignModal } from "@/components/attendant/modals/AssignModal";
import { useEstablishment } from "@/hooks/admin/useEstablishment";

import {
  ArrowPathIcon,
  ArrowUturnLeftIcon,
  ArchiveBoxIcon,
  ExclamationTriangleIcon,
  InboxIcon,
  ReceiptPercentIcon,
  BanknotesIcon,
  TagIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  TableCellsIcon,
  PhoneIcon,
  MapPinIcon,
  SparklesIcon,
  ClockIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { UserRole } from "@/enum/enum";
import { useRoleGuard } from "@/hooks/auth/useRoleGuard";
import { useToast } from "@/ context/ToastContext";
import { useTables } from "@/hooks/admin/useTables";
import { useWaiters } from "@/hooks/admin/useWaiters";

interface ArchivedSale {
  saleId: string;
  subtotal: number;
  discount: number;
  total: number;
  saleDate: string;
  tableNumber?: string;
  tableLocation?: string;
  waiterName?: string;
  waiterPhone?: string;
}

export default function ArchivedSalesPage() {
  useRoleGuard([UserRole.ATENDENTE]);

  const { establishmentId, cashRegisterId } = useParams() as any;
  const router = useRouter();
  const toast = useToast();
  const { data: establishment } = useEstablishment(establishmentId);
  const { data, loading, error, restore: restoreSaleFromHook, restoringId, refresh } =
    useArchivedSales(establishmentId, cashRegisterId);
  const { sale } = useSale(establishmentId);
  const { tables } = useTables(establishmentId);
  const { waiters } = useWaiters(establishmentId);
  const { assign, assigning } = useAssignSale(establishmentId);

  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<any>(null);
  const [selectedTableId, setSelectedTableId] = useState<string>("");
  const [selectedWaiterId, setSelectedWaiterId] = useState<string>("");

  const handleRestore = async (saleId: string) => {
    try {
      await restoreSaleFromHook(saleId);
      router.push(
        `/attendant/dashboard/${establishmentId}/sales?saleId=${saleId}&cashRegisterId=${cashRegisterId}`
      );
    } catch (e: any) {
      toast.showToast(e.message || "Não foi possível recuperar a venda", "error");
    }
  };

  const handleOpenAssign = (sale: ArchivedSale) => {
    setSelectedSale(sale);
    setSelectedTableId(sale.tableNumber ? 
      tables.find(t => t.number === sale.tableNumber)?.id || "" : "");
    setSelectedWaiterId(sale.waiterName ? 
      waiters.find(w => w.name === sale.waiterName)?.id || "" : "");
    setAssignModalOpen(true);
  };

  const handleAssign = async (tableId?: string, waiterId?: string) => {
    if (selectedSale) {
      await assign(selectedSale.saleId, { tableId, waiterId });
      setAssignModalOpen(false);
      setSelectedSale(null);
      refresh();
    }
  };

  if (loading || !establishment) return <PageLoader />;

  const primaryColor = establishment.primaryColor;
  const secondaryColor = establishment.secondaryColor;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header com gradiente usando cores do estabelecimento */}
        <div 
          className="relative overflow-hidden rounded-2xl shadow-2xl"
          style={{ 
            background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`
          }}
        >
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative px-8 py-12">
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                    <ArchiveBoxIcon className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-white tracking-tight">
                    Vendas Arquivadas
                  </h1>
                </div>
                <p className="text-white/90 text-sm flex items-center gap-2">
                  <SparklesIcon className="w-4 h-4" />
                  Gerencie e recupere vendas arquivadas do sistema
                </p>
              </div>
              <div className="hidden md:block">
                <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <span className="text-white text-sm font-medium">
                    Total: {data.length} vendas
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div 
            className="absolute bottom-0 left-0 right-0 h-1"
            style={{ background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})` }}
          ></div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl shadow-lg backdrop-blur-sm animate-slideIn">
            <div className="flex items-center gap-3">
              <div className="p-1 bg-red-100 rounded-full">
                <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
              </div>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {data.length === 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
              <div className="p-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full">
                <InboxIcon className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700">Nenhuma venda arquivada</h3>
              <p className="text-gray-500 text-sm">
                As vendas arquivadas aparecerão aqui para você gerenciar e recuperar quando necessário.
              </p>
            </div>
          </div>
        )}

        {/* Grid de cards modernos */}
        <div className="grid grid-cols-1 gap-6">
          {data.map((sale: ArchivedSale, index: number) => (
            <div
              key={sale.saleId}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Barra de gradiente no topo */}
              <div 
                className="absolute top-0 left-0 right-0 h-1"
                style={{ background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})` }}
              ></div>
              
              <div className="p-6">
                <div className="flex justify-between items-start flex-wrap gap-4">
                  {/* Informações principais */}
                  <div className="space-y-4 flex-1">
                    {/* Header do card */}
                    <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                      <div 
                        className="p-2 rounded-xl shadow-md"
                        style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
                      >
                        <ReceiptPercentIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-mono text-sm font-semibold text-gray-700">
                          #{sale.saleId.slice(0, 8)}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                          <ClockIcon className="w-3 h-3" />
                          <span>Arquivada em {new Date(sale.saleDate).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Grid de informações financeiras */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 border border-green-100">
                        <div className="flex items-center gap-2 text-green-600 mb-1">
                          <BanknotesIcon className="w-4 h-4" />
                          <span className="text-xs font-medium">SUBTOTAL</span>
                        </div>
                        <p className="text-lg font-bold text-green-700">
                          {sale.subtotal.toLocaleString('pt-BR')} MZN
                        </p>
                      </div>

                      <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-3 border border-orange-100">
                        <div className="flex items-center gap-2 text-orange-600 mb-1">
                          <TagIcon className="w-4 h-4" />
                          <span className="text-xs font-medium">DESCONTO</span>
                        </div>
                        <p className="text-lg font-bold text-orange-700">
                          {sale.discount.toLocaleString('pt-BR')} MZN
                        </p>
                      </div>

                      <div 
                        className="rounded-xl p-3 border"
                        style={{ 
                          background: `linear-gradient(135deg, ${primaryColor}10, ${secondaryColor}10)`,
                          borderColor: `${primaryColor}20`
                        }}
                      >
                        <div className="flex items-center gap-2 mb-1" style={{ color: primaryColor }}>
                          <CurrencyDollarIcon className="w-4 h-4" />
                          <span className="text-xs font-medium">TOTAL</span>
                        </div>
                        <p className="text-lg font-bold" style={{ color: primaryColor }}>
                          {sale.total.toLocaleString('pt-BR')} MZN
                        </p>
                      </div>
                    </div>

                    {/* Informações de Mesa e Garçom com design moderno */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                      <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 hover:border-opacity-50 transition-colors" style={{ hover: { borderColor: primaryColor } }}>
                        <p className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-1">
                          <TableCellsIcon className="w-3 h-3" />
                          INFORMAÇÕES DA MESA
                        </p>
                        {sale.tableNumber ? (
                          <div className="space-y-1">
                            <p className="text-sm font-semibold flex items-center gap-2" style={{ color: primaryColor }}>
                              <CheckCircleIcon className="w-4 h-4" />
                              Mesa {sale.tableNumber}
                            </p>
                            {sale.tableLocation && (
                              <p className="text-xs text-gray-500 flex items-center gap-1">
                                <MapPinIcon className="w-3 h-3" />
                                {sale.tableLocation}
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-400 italic">Não atribuída</p>
                        )}
                      </div>

                      <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 hover:border-opacity-50 transition-colors" style={{ hover: { borderColor: secondaryColor } }}>
                        <p className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-1">
                          <UserGroupIcon className="w-3 h-3" />
                          INFORMAÇÕES DO GARÇOM
                        </p>
                        {sale.waiterName ? (
                          <div className="space-y-1">
                            <p className="text-sm font-semibold flex items-center gap-2" style={{ color: secondaryColor }}>
                              <CheckCircleIcon className="w-4 h-4" />
                              {sale.waiterName}
                            </p>
                            {sale.waiterPhone && (
                              <p className="text-xs text-gray-500 flex items-center gap-1">
                                <PhoneIcon className="w-3 h-3" />
                                {sale.waiterPhone}
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-400 italic">Não atribuído</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Botões de ação com design moderno */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleOpenAssign(sale)}
                      disabled={assigning === sale.saleId}
                      className="group/btn relative px-5 py-2.5 text-white rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 overflow-hidden"
                      style={{ background: `linear-gradient(135deg, ${secondaryColor}, ${primaryColor})` }}
                    >
                      <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}></div>
                      <span className="relative flex items-center gap-2 text-sm">
                        {assigning === sale.saleId ? (
                          <ArrowPathIcon className="w-4 h-4 animate-spin" />
                        ) : (
                          <UserGroupIcon className="w-4 h-4" />
                        )}
                        {sale.tableNumber || sale.waiterName ? "Editar" : "Atribuir"}
                      </span>
                    </button>

                    <button
                      disabled={restoringId === sale.saleId}
                      onClick={() => handleRestore(sale.saleId)}
                      className="group/btn relative px-5 py-2.5 text-white rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 overflow-hidden"
                      style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
                    >
                      <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity" style={{ background: `linear-gradient(135deg, ${secondaryColor}, ${primaryColor})` }}></div>
                      <span className="relative flex items-center gap-2 text-sm">
                        {restoringId === sale.saleId ? (
                          <>
                            <ArrowPathIcon className="w-4 h-4 animate-spin" />
                            Restaurando...
                          </>
                        ) : (
                          <>
                            <ArrowUturnLeftIcon className="w-4 h-4" />
                            Recuperar
                          </>
                        )}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Atribuição */}
      <AssignModal
        open={assignModalOpen}
        onClose={() => {
          setAssignModalOpen(false);
          setSelectedSale(null);
          setSelectedTableId("");
          setSelectedWaiterId("");
        }}
        onConfirm={handleAssign}
        tables={tables}
        waiters={waiters}
        saleNumber={selectedSale?.saleId?.slice(0, 8)}
        initialTableId={selectedTableId}
        initialWaiterId={selectedWaiterId}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
      />

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
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}