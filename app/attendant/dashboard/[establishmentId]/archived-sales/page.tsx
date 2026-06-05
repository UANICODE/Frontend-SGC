// app/attendant/dashboard/[establishmentId]/archived-sales/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { PageLoader } from "@/components/ui/PageLoader";
import { useArchivedSales } from "@/hooks/attendant/useArchivedSales";
import { useSale } from "@/hooks/attendant/useSale";
import { useAssignSale } from "@/hooks/attendant/useAssignSale";
import { AssignModal } from "@/components/attendant/modals/AssignModal";

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
} from "@heroicons/react/24/outline";
import { UserRole } from "@/enum/enum";
import { useRoleGuard } from "@/hooks/auth/useRoleGuard";
import { useToast } from "@/ context/ToastContext";
import { useTables } from "@/hooks/admin /useTables";
import { useWaiters } from "@/hooks/admin /useWaiters";


interface ArchivedSale {
  saleId: string;
  subtotal: number;
  discount: number;
  total: number;
  saleDate: string;  // ✅ Mudar de createdAt para saleDate
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
    // Preencher com os valores atuais se já existirem
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
      refresh(); // Recarregar a lista para mostrar os dados atualizados
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <ArchiveBoxIcon className="w-7 h-7" />
        Vendas Arquivadas
      </h1>

      {error && (
        <div className="bg-red-100 text-red-600 p-4 rounded-xl flex items-center gap-2">
          <ExclamationTriangleIcon className="w-5 h-5" />
          {error}
        </div>
      )}

      {data.length === 0 && (
        <div className="bg-gray-100 p-6 rounded-xl text-gray-500 text-center flex flex-col items-center gap-2">
          <InboxIcon className="w-8 h-8" />
          Não existem vendas arquivadas.
        </div>
      )}

      <div className="space-y-4">
        {data.map((sale: ArchivedSale) => (
          <div
            key={sale.saleId}
            className="bg-white p-6 rounded-xl shadow hover:shadow-md transition"
          >
            <div className="flex justify-between items-start flex-wrap gap-4">
              <div className="space-y-2 text-sm flex-1">
                <p className="font-medium flex items-center gap-2">
                  <ReceiptPercentIcon className="w-5 h-5 text-gray-500" />
                  Venda: #{sale.saleId.slice(0, 8)}
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="flex items-center gap-2">
                      <BanknotesIcon className="w-4 h-4 text-gray-500" />
                      Subtotal: {sale.subtotal} MZN
                    </p>
                    <p className="flex items-center gap-2">
                      <TagIcon className="w-4 h-4 text-gray-500" />
                      Desconto: {sale.discount} MZN
                    </p>
                    <p className="flex items-center gap-2 font-bold">
                      <CurrencyDollarIcon className="w-4 h-4 text-gray-500" />
                      Total: MZN {sale.total}
                    </p>
                  </div>

                  {/* 🆕 Informações de Mesa e Garçom */}
                  <div className="border-l pl-4">
                    {sale.tableNumber ? (
                      <p className="flex items-center gap-2 text-green-600">
                        <TableCellsIcon className="w-4 h-4" />
                        Mesa: {sale.tableNumber}
                        {sale.tableLocation && (
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <MapPinIcon className="w-3 h-3" />
                            {sale.tableLocation}
                          </span>
                        )}
                      </p>
                    ) : (
                      <p className="flex items-center gap-2 text-gray-400">
                        <TableCellsIcon className="w-4 h-4" />
                        Mesa: Não atribuída
                      </p>
                    )}

                    {sale.waiterName ? (
                      <p className="flex items-center gap-2 text-blue-600 mt-1">
                        <UserGroupIcon className="w-4 h-4" />
                        Garçom: {sale.waiterName}
                        {sale.waiterPhone && (
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <PhoneIcon className="w-3 h-3" />
                            {sale.waiterPhone}
                          </span>
                        )}
                      </p>
                    ) : (
                      <p className="flex items-center gap-2 text-gray-400 mt-1">
                        <UserGroupIcon className="w-4 h-4" />
                        Garçom: Não atribuído
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenAssign(sale)}
                  disabled={assigning === sale.saleId}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center gap-2 disabled:opacity-50 hover:bg-purple-700 transition"
                >
                  {assigning === sale.saleId ? (
                    <ArrowPathIcon className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <UserGroupIcon className="w-5 h-5" />
                      {sale.tableNumber || sale.waiterName ? "Editar" : "Atribuir"}
                    </>
                  )}
                </button>

                <button
                  disabled={restoringId === sale.saleId}
                  onClick={() => handleRestore(sale.saleId)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 disabled:opacity-50 hover:bg-blue-700 transition"
                >
                  {restoringId === sale.saleId ? (
                    <>
                      <ArrowPathIcon className="w-5 h-5 animate-spin" />
                      Restaurando...
                    </>
                  ) : (
                    <>
                      <ArrowUturnLeftIcon className="w-5 h-5" />
                      Recuperar
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Atribuição com valores atuais */}
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
      />
    </div>
  );
}